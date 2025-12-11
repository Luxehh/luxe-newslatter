// sendNewsletterCron.js
const cron = require("node-cron");
const Newsletter = require("../models/newsletter");
const NewsletterTemplate = require("../models/newsletterTemplate");
const twilio = require("twilio");
require("dotenv").config();
const schedule = require("node-schedule");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Fetch newsletter templates from database and convert to object format
 */
const getTemplatesFromDatabase = async () => {
    try {
        const templates = await NewsletterTemplate.find({ isActive: true }).sort({ orderNumber: 1 });
        const templatesObject = {};
        templates.forEach(template => {
            templatesObject[template.orderNumber] = template.templateLink;
        });
        return templatesObject;
    } catch (error) {
        console.error('❌ Error fetching templates from database:', error.message);
        return {};
    }
};

// Fallback: 12 Monthly Newsletter PDF Template Links (used if database is empty)
const fallbackNewsletterTemplates = {
    1: "https://example.com/newsletter-month-1.pdf",
    2: "https://example.com/newsletter-month-2.pdf",
    3: "https://example.com/newsletter-month-3.pdf",
    4: "https://example.com/newsletter-month-4.pdf",
    5: "https://example.com/newsletter-month-5.pdf",
    6: "https://example.com/newsletter-month-6.pdf",
    7: "https://example.com/newsletter-month-7.pdf",
    8: "https://example.com/newsletter-month-8.pdf",
    9: "https://example.com/newsletter-month-9.pdf",
    10: "https://example.com/newsletter-month-10.pdf",
    11: "https://example.com/newsletter-month-11.pdf",
    12: "https://example.com/newsletter-month-12.pdf"
};

/**
 * Calculate which order number (1-12) the subscriber is currently on
 * based on months since their creation date
 * Special handling: If user registered today, they get Order 1 tomorrow
 */
const getOrderNumber = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    
    // Normalize dates to compare only year, month, and day (ignore time)
    const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Check if user registered today
    const isRegisteredToday = createdDate.getTime() === todayDate.getTime();
    
    // If registered today, skip sending (will send tomorrow as Order 1)
    if (isRegisteredToday) {
        return 0; // Return 0 to skip sending today
    }
    
    // Calculate the difference in months
    const yearDiff = now.getFullYear() - created.getFullYear();
    const monthDiff = now.getMonth() - created.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff + 1; // +1 because order 1 is the creation month
    
    // Return between 1-12, or stop after 12 orders
    return Math.min(totalMonths, 12);
};

/**
 * Check if it's time to send the newsletter for this subscriber
 * Special case: Users registered yesterday get their first newsletter today (day after registration)
 * Regular case: Send on the same day of the month they subscribed
 */
const shouldSendToday = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    
    // Normalize dates to compare only year, month, and day (ignore time)
    const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    
    // Special case: If user registered yesterday, send their first newsletter today
    const isRegisteredYesterday = createdDate.getTime() === yesterdayDate.getTime();
    if (isRegisteredYesterday) {
        console.log(`🎯 User registered yesterday - sending first newsletter today (day after registration)`);
        return true;
    }
    
    // Get the day of month when they subscribed
    const subscriptionDay = created.getDate();
    const today = now.getDate();
    
    // Send on the same day of month (or last day if month is shorter)
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(subscriptionDay, lastDayOfMonth);
    
    return today === targetDay;
};

/**
 * Send newsletter message via Twilio
 */
const sendNewsletterMessage = async (subscriber, orderNumber, templateLink) => {
    try {
        const messageBody = `Hello ${subscriber.firstName}! 📰\n\nHere's your Newsletter #${orderNumber} from Luxe Home Health.\n\n${templateLink}\n\nStay healthy and informed! 💙`;
        
        const message = await client.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: subscriber.phoneNumber
        });
        
        console.log(`✅ Newsletter sent to ${subscriber.firstName} ${subscriber.lastName} (${subscriber.phoneNumber}) - Order ${orderNumber} - SID: ${message.sid}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to send newsletter to ${subscriber.phoneNumber}: ${error.message}`);
        return false;
    }
};

/**
 * Main function to send monthly newsletters
 */
const sendMonthlyNewsletters = async () => {
    console.log(`📰 Running monthly newsletter job at ${new Date().toISOString()}`);
    
    try {
        // Fetch templates from database
        const monthlyNewsletterTemplates = await getTemplatesFromDatabase();
        
        // Use fallback if database is empty
        const templatesCount = Object.keys(monthlyNewsletterTemplates).length;
        if (templatesCount === 0) {
            console.log('⚠️ No templates found in database, using fallback templates');
            Object.assign(monthlyNewsletterTemplates, fallbackNewsletterTemplates);
        } else {
            console.log(`✅ Loaded ${templatesCount} templates from database`);
        }
        
        // Find all active subscribers (status: true)
        const subscribers = await Newsletter.find({ status: true });
        console.log(`Found ${subscribers.length} active subscribers`);
        
        let sentCount = 0;
        let skippedCount = 0;
        
        for (const subscriber of subscribers) {
            // Calculate which order number they're on
            const orderNumber = getOrderNumber(subscriber.createdAt);
            
            // Skip if registered today (orderNumber = 0)
            if (orderNumber === 0) {
                console.log(`⏭️ Subscriber ${subscriber.phoneNumber} registered today - will send first newsletter tomorrow`);
                skippedCount++;
                continue;
            }
            
            // Skip if they've completed all 12 orders
            if (orderNumber > 12) {
                console.log(`⏭️ Subscriber ${subscriber.phoneNumber} has completed all 12 newsletters - skipping`);
                skippedCount++;
                continue;
            }
            
            // Check if today is their monthly newsletter day
            if (!shouldSendToday(subscriber.createdAt)) {
                console.log(`⏭️ Not the right day for ${subscriber.phoneNumber} - skipping`);
                skippedCount++;
                continue;
            }
            
            // Get the appropriate newsletter template by order
            const templateLink = monthlyNewsletterTemplates[orderNumber];
            
            if (!templateLink) {
                console.error(`❌ No template found for order ${orderNumber}`);
                continue;
            }
            
            // Send the newsletter
            const sent = await sendNewsletterMessage(subscriber, orderNumber, templateLink);
            if (sent) {
                sentCount++;
            }
            
            // Add a small delay between messages to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log(`✅ Newsletter job completed: ${sentCount} sent, ${skippedCount} skipped`);
    } catch (error) {
        console.error(`❌ Error in newsletter cron job: ${error.message}`);
    }
};

/**
 * Schedule the newsletter job to run daily at 8:30 PM IST
 * It will check each subscriber and send if it's their monthly day
 */
const startNewsletterCron = () => {
    // Run daily at 8:30 PM India Standard Time
    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Asia/Kolkata';
    rule.hour = 20;
    rule.minute = 30;
    
    schedule.scheduleJob(rule, sendMonthlyNewsletters);
    console.log("📰 Monthly newsletter cron job scheduled - Daily at 8:30 PM IST");
    
    // Alternative: Use node-cron syntax (runs daily at 8:30 PM IST)
    // cron.schedule('30 20 * * *', sendMonthlyNewsletters, {
    //     timezone: "Asia/Kolkata"
    // });
};

// Start the cron job when this module is loaded
startNewsletterCron();

// Export for testing purposes
module.exports = {
    sendMonthlyNewsletters,
    getOrderNumber,
    shouldSendToday,
    getTemplatesFromDatabase,
    fallbackNewsletterTemplates
};
