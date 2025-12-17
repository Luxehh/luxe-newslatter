// sendResubscriptionReminder.js
const cron = require("node-cron");
const Newsletter = require("../models/newsletter");
const twilio = require("twilio");
require("dotenv").config();
const { DateTime } = require("luxon");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Calculate if subscriber is in their 13th month (just completed 12 newsletters)
 */
const isIn13thMonth = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();

  // Calculate the difference in months
  const yearDiff = now.getFullYear() - created.getFullYear();
  const monthDiff = now.getMonth() - created.getMonth();
  const totalMonths = yearDiff * 12 + monthDiff;

  // Check if same day of month (or close to it for end-of-month subscribers)
  const subscriptionDay = created.getDate();
  const today = now.getDate();
  const lastDayOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate();
  const targetDay = Math.min(subscriptionDay, lastDayOfMonth);

  // If it's exactly the 13th month and it's their subscription anniversary day
  return totalMonths === 12 && today === targetDay;
};

/**
 * Send re-subscription reminder message via Twilio
 */
const sendResubscriptionMessage = async (subscriber) => {
  try {
    // Get your app's base URL from environment or use a default
    const baseUrl = process.env.APP_URL || "http://localhost:3000";
    
    // Encode phone number for URL (e.g., +1234567890 -> %2B1234567890)
    const encodedPhone = encodeURIComponent(subscriber.phoneNumber);
    
    // Create unique links with phone number embedded
    const renewUrl = `${baseUrl}/api/newsletter/renew-subscription?phone=${encodedPhone}`;
    const cancelUrl = `${baseUrl}/api/newsletter/cancel-subscription?phone=${encodedPhone}`;

    const messageBody = `Hello ${subscriber.firstName}!

You've completed all 12 newsletters from Luxe Home Health. 

Would you like to continue receiving our monthly newsletters?

Reply to this message:
YES - To renew and receive 12 more newsletters.
NO - To cancel your subscription.

Your subscription will be automatically cancelled if we don't hear from you.

Thank you for being with us!`;

    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: subscriber.phoneNumber,
    });

    console.log(
      `✅ Re-subscription reminder sent to ${subscriber.firstName} ${subscriber.lastName} (${subscriber.phoneNumber}) - SID: ${message.sid}`
    );
    return true;
  } catch (error) {
    console.error(
      `❌ Failed to send re-subscription reminder to ${subscriber.phoneNumber}: ${error.message}`
    );
    return false;
  }
};

/**
 * Main function to send re-subscription reminders
 */
const sendResubscriptionReminders = async () => {
  console.log(
    `📧 Running re-subscription reminder job at ${new Date().toISOString()}`
  );

  try {
    // Find all subscribers (both active and inactive)
    // We want to remind even those who were auto-disabled
    const allSubscribers = await Newsletter.find({});
    console.log(`Found ${allSubscribers.length} total subscribers to check`);

    let sentCount = 0;

    for (const subscriber of allSubscribers) {
      // Check if they're in their 13th month
      if (isIn13thMonth(subscriber.createdAt)) {
        // Send re-subscription reminder
        const sent = await sendResubscriptionMessage(subscriber);
        if (sent) {
          sentCount++;
        }

        // Add a small delay between messages to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`📊 Summary: ${sentCount} re-subscription reminders sent`);
  } catch (error) {
    console.error(
      `❌ Error in re-subscription reminder cron job: ${error.message}`
    );
  }
};

/**
 * Schedule cron job to run daily at 8:45 PM IST (Asia/Kolkata timezone)
 * This runs 15 minutes after newsletter sending and 30 minutes after auto-disable
 */
const scheduleResubscriptionReminder = () => {
  cron.schedule(
    "45 20 * * *",
    async () => {
      const istTime = DateTime.now().setZone("Asia/Kolkata");
      console.log(
        `⏰ Re-subscription reminder cron triggered at ${istTime.toISO()}`
      );
      await sendResubscriptionReminders();
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log(
    "✅ Re-subscription reminder cron job scheduled (Daily at 8:45 PM IST)"
  );
};

// Start the cron job
scheduleResubscriptionReminder();

module.exports = { sendResubscriptionReminders, isIn13thMonth };
