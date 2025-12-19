// disableCompletedSubscriptions.js
const cron = require("node-cron");
const Newsletter = require("../models/newsletter");
const { DateTime } = require("luxon");

/**
 * Calculate if a subscriber has completed all 12 newsletters (reached 13th month)
 */
const hasCompleted12Newsletters = (createdAt) => {
    const created = new Date(createdAt);
    const now = new Date();
    
    // Calculate the difference in months
    const yearDiff = now.getFullYear() - created.getFullYear();
    const monthDiff = now.getMonth() - created.getMonth();
    const totalMonths = yearDiff * 12 + monthDiff;
    
    // Check if same day of month (or close to it for end-of-month subscribers)
    const subscriptionDay = created.getDate();
    const today = now.getDate();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const targetDay = Math.min(subscriptionDay, lastDayOfMonth);
    
    // If it's the 13th month (12 months passed) and it's their subscription anniversary day
    return totalMonths >= 12 && today === targetDay;
};

/**
 * Auto-disable subscriptions that have completed 12 newsletters
 */
const disableCompletedSubscriptions = async () => {
    console.log(`🔄 Running auto-disable completed subscriptions job at ${new Date().toISOString()}`);
    
    try {
        // Find all active subscribers
        const subscribers = await Newsletter.find({ status: true });
        console.log(`Found ${subscribers.length} active subscribers to check`);
        
        let disabledCount = 0;
        
        for (const subscriber of subscribers) {
            // Check if they've completed 12 newsletters
            if (hasCompleted12Newsletters(subscriber.createdAt)) {
                // Disable subscription
                subscriber.status = false;
                await subscriber.save();
                
                console.log(`✅ Disabled subscription for ${subscriber.firstName} ${subscriber.lastName} (${subscriber.phoneNumber}) - completed 12 newsletters`);
                disabledCount++;
            }
        }
        
        console.log(`📊 Summary: ${disabledCount} subscriptions auto-disabled`);
    } catch (error) {
        console.error(`❌ Error in auto-disable cron job: ${error.message}`);
    }
};

const TIMEZONE = "America/Chicago";

/**
 * Schedule cron job to run daily at 9:45 AM CST (America/Chicago timezone)
 * This runs 15 minutes before the newsletter sending cron
 */
const scheduleAutoDisable = () => {
    // Run daily at 9:45 AM CST
    cron.schedule("45 9 * * *", async () => {
        const cstTime = DateTime.now().setZone(TIMEZONE);
        console.log(`⏰ Auto-disable cron triggered at ${cstTime.toISO()}`);
        await disableCompletedSubscriptions();
    }, {
        timezone: TIMEZONE
    });
    
    console.log("✅ Auto-disable completed subscriptions cron job scheduled (Daily at 9:45 AM CST)");
};

// Start the cron job
scheduleAutoDisable();

module.exports = { disableCompletedSubscriptions, hasCompleted12Newsletters };
