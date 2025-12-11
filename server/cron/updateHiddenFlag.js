// scheduler.js
const cron = require("node-cron");
const Patient = require("../models/patient");
const twilio = require("twilio");
require("dotenv").config();
const schedule = require("node-schedule");
const { DateTime } = require("luxon");

const TIMEZONE = "America/Chicago";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const dailyMessages = {
    1: {
        morning: "Welcome to luxe ! Weigh yourself before eating and after using the bathroom. Record your Weight to track any changes. Call your Luxe Home Health nurse if you gain 2-3 lbs. in 24   hours or 5 lbs. in a week. Take your medications on time, set a daily alarm if needed. Reply Weigh to see how to weigh yourself daily.",
        midday: "Take your medications on time! 💊 Consistent medication management keeps your heart strong. Set a daily alarm if needed!",
        evening: "Check your Heart Failure Action Plan. Are you in the Green Zone (stable), Yellow Zone (Warning signs), or Red Zone (emergency)? Know when to seek help. Reply Zones to see how to check your zone."
    },
    2: {
        morning: "Step on the scale!  Daily weighing helps identify fluid retention early. Record and monitor your weight. Eat smart! Focus on a low-sodium, heart-healthy diet today. Cut back on processed food and maintain a healthy diet. Call your Luxe Home Health nurse if you gain 2-3 lbs. in 24 hours or 5 lbs. in a week. Reply Weigh to see how to weigh yourself daily.",
        midday: "Eat smart! 🥗 Focus on a low-sodium, heart-healthy diet today. Cut back on processed foods and drink plenty of water.",
        evening: "Zone check time!  Review your symptoms. Early action can prevent complications.” Know when to seek help. Reply Zones to see  how to check your zone."
    },
    3: {
        morning: "Time to weigh yourself! Keep an eye out for sudden changes and report any concerns to the Luxe Home Health team. . Call your Luxe Home Health nurse if you gain 2-3 lbs. in 24 hours or 5 lbs. in a week. Reply Weigh to see how to weigh yourself daily.",
        midday: "Blood pressure check! 🩸 Monitor your BP today and log the readings. Consistent tracking can prevent complications.",
        evening: "Reflect on your day! Did you stay in the Green Zone? Recognizing early signs of trouble can help prevent hospital visits."
    },
    4: {
        morning: "Weigh-in time! Sudden weight gain can signal fluid buildup. Record your numbers and alert Luxe Home Health team if needed. Consistent medication management keeps your heart strong. Reply Medications to see the medication management video.",
        midday: "Medication reminder! ⏰ Consistency is key to managing heart failure effectively.",
        evening: "Last Message of the day. Check your Heart Failure Action Plan! Identifying changes early keeps you on the right track."
    },
    5: {
        morning: "Good morning! Don’t forget to weigh yourself. A sudden 2-3 lb gain may require a medication adjustment. From today it is exercise time!  Aim for 10 minutes of light movement today. Regular activity improves heart health. Reply Easy to see the video of Easy exercises.",
        midday: "Exercise time! 🚶 Aim for 20-30 minutes of light movement today. Regular activity improves heart health.",
        evening: "End-of-day check! Review your zone and maintain a healthy diet. Know when to seek help. Reply Zones to see  how to check your zone."
    },
    6: {
        morning: "Daily weigh-in! Consistency helps track fluid retention. Record your numbers and notify your Luxe Home Health team if necessary. Plan a heart-healthy meal! Choose fresh vegetables, lean protein, and avoid high-sodium foods. Reply Diet to see the video of what kind of meal you can take.Daily weigh-in! ⚖ Consistency helps track fluid retention. Record your numbers and notify your provider if necessary.",
        midday: "Plan a heart-healthy meal! 🍲 Choose fresh vegetables, lean protein, and avoid high-sodium foods.",
        evening: "Green, Yellow, or Red? Zone check keeps you ahead of the game. Track and Report any concerns to Luxe Home Health team. Know when to seek help. Reply Zones to see how to check your zone."
    },
    7: {
        morning: "Weigh yourself today! Sudden changes in weight could signal fluid buildup. Have a good rest of your day. Call your Luxe Home Health nurse if you gain 2-3 lbs. in 24 hours or 5 lbs. in a week. Reply Weigh to see how to weigh yourself daily.",
        midday: "Take your meds on time! 💊 Consistent medication adherence can prevent complications.",
        evening: "Take your Medications on time! Consistent medication adherence can prevent complications. Time to assess your zone. Are you noticing any new symptoms? Call the Luxe Home Health team if notice any changes. If not keep up the good work."
    },
    8: {
        morning: "Step on the scale! Daily monitoring of your weight keeps you in control of your health. Reply Weigh to see how to weigh daily correctly.",
        midday: "Check your BP today! 🩸 High blood pressure can make your heart work harder. Log it and share with your care team.",
        evening: "Stay in the Green Zone! Recognize early signs of trouble to prevent hospital visits. Have a good evening. Know when to seek help. Reply Zones to see how to check your zone."
    },
    9: {
        morning: "Weigh yourself now! Consistency keeps fluid retention in check. Don’t forget to log it. Hydrate smart! Limit fluids to your care team’s recommendations. Too much can cause fluid buildup.",
        midday: "Hydrate smart! 💧 Limit fluids to your care team's recommendations. Too much can cause fluid buildup.",
        evening: "Review your day and check your zone! Early intervention makes a difference. Know when to seek help. Reply Zones to see how to check your zone."
    },
    10: {
        morning: "Weigh-in reminder! Early detection of weight gain helps avoid complications. Have a great day. Call your Luxe Home Health nurse if you gain 2-3 lbs. in 24 hours or 5 lbs. in a week. Reply Weigh to see how to weigh yourself daily.",
        midday: "Time for light movement! 🚶 Even 20 minutes of walking can improve your heart health.",
        evening: "Time for light movement! Even 20 minutes of walking can improve your heart health, and Check your zones too. Reply Easy or Moderate to see the videos of Exercise."
    },
    11: {
        morning: "Scale check! Watch for sudden weight changes and record your numbers. Stick to a Heart-healthy diet today!  Limit salt and stay hydrated. Reply Diet to see the video of what kind of meal you can take.",
        midday: "Stick to a heart-healthy diet today! 🥗 Limit salt and stay hydrated.",
        evening: "Zone check-in time! Recognize symptoms early and stay proactive. Know when to seek help. Reply Zones to see how to check your zone."
    },
    12: {
        morning: "Daily weigh-in! Log it and track your progress. Medication time! ⏰ Consistent adherence prevents complications. Reply Medications to see the medication management video.",
        midday: "Medication time! ⏰ Consistent adherence prevents complications.",
        evening: "Check your action plan. Early intervention keeps you out of the hospital. Have a good evening. Know when to seek help. Reply Zones to see how to check your zone."
    },
    13: {
        morning: "Good morning! Weigh yourself and log your progress. Have a good rest of your day. Call your Luxe Home Health nurse if you gain 2-3 lbs. in 24 hours or 5 lbs. in a week. Reply Weigh to see how to weigh yourself daily.",
        midday: "Hydration check! 💧 Follow your fluid restrictions to prevent fluid buildup.",
        evening: "Zone check! Recognize signs early to stay safe. If things are good keep up the good work. Know when to seek help. Reply Zones to see how to check your zone."
    },
    14: {
        morning: "Step on the scale! Keep an eye out for sudden changes. Time to get your daily exercises in too! Movement keeps your heart strong. Call your Luxe Home Health nurse if you gain 2-3 lbs. in 24 hours or 5 lbs. in a week. Reply Weigh to see how to weigh yourself daily.",
        midday: "Time for a short walk! 🚶 Movement keeps your heart strong.",
        evening: "Last message of the second week, Stay ahead by tracking daily. If any sudden changes, please contact the Luxe Home Health team. Know when to seek help. Reply Zones to see how to check your zone."
    },
    15: {
        morning: "Good morning! Weigh yourself and log your progress. Consistent medication management keeps your heart strong. Reply Medications to see the medication management video.",
        midday: "Considering quitting smoking? 🚭 It's one of the best things you can do for your heart health.",
        evening: "Zone check! Recognize signs early to stay safe. Have a great evening."
    },
    16: {
        morning: "Weigh-in reminder! Early detection of weight gain helps avoid complications.",
        midday: "Sodium check! 🥗 Choose fresh foods over processed to reduce salt intake.",
        evening: "Review your day and check your zone! Early intervention makes a difference. Reply Zones to see how to check what zone you are in."
    },
    17: {
        morning: "Good morning! Weigh yourself and log your progress. Time for Exercise! Reply Easy or Moderate to see videos to follow.",
        midday: "Don't miss your next appointment! 📅 Regular check-ups help manage your heart failure effectively.",
        evening: "Zone check-in time! Recognize symptoms early and stay proactive. Have a good evening."
    },
    18: {
        morning: "Weigh yourself now! Consistency keeps fluid retention in check. Don’t forget to log it. Hydrate smart! Limit fluids to your care team’s recommendations. Too much can cause fluid buildup.",
        midday: "Medication reminder! 💊 Take your heart medications exactly as prescribed.",
        evening: "Stay in the Green Zone! Recognize early signs of trouble to prevent hospital visits. We are here to assist you if you need more information."
    },
    19: {
        morning: "Weigh yourself today! Sudden changes in weight could signal fluid buildup. Track and report any concerns. Limit salt and stay hydrated. Reply Diet to see the video of what kind of meal you can take.",
        midday: "Smoking cessation tip: 🚭 Finding a support group can double your chances of quitting successfully.",
        evening: "Review your day and check your zone! Early intervention makes a difference."
    },
    20: {
        morning: "Time to weigh yourself! Keep an eye out for sudden changes and report any concerns to The Luxe Home Health team.",
        midday: "Low-sodium tip: 🥗 Herbs and spices are great alternatives to salt for flavoring food.",
        evening: "Green, Yellow, or Red? Zone check keeps you ahead of the game. Importance of follow-up appointments with your provider are paramount to your health."
    },
    21: {
        morning: "Step on the scale! Daily monitoring of your weight keeps you in control of your health. Sodium awareness and diet improvements. Have a great rest of your day.",
        midday: "Remember your follow-up! 📅 Regular provider visits help manage your condition effectively.",
        evening: "End-of-day check! Review your zone and log today’s weight and BP readings."
    },
    22: {
        morning: "Weigh yourself now! Consistency keeps fluid retention in check. Don’t forget to log it. How to weigh please reply Weigh to see the video.",
        midday: "Take your medications consistently! ⏰ Set reminders if needed.",
        evening: "Review your day and check your zone! Early intervention makes a difference. Consistent Medication management keeps your heart strong."
    },
    23: {
        morning: "Good morning! Weigh yourself and log your progress. You’re doing great!  Time for Exercise! Reply Easy, Moderate or Hard for see a videos to follow along for exercises.",
        midday: "Heart-healthy meal planning! 🍲 Focus on fresh vegetables and lean proteins today.",
        evening: "Green, Yellow, or Red? Zone check keeps you ahead of the game. Stay consistent Your Heart thanks you!"
    },
    24: {
        morning: "Step on the scale! Keep an eye out for sudden changes.  We encourage physical activity for cardiovascular health.",
        midday: "Time for some movement! 🚶 Regular activity strengthens your cardiovascular system.",
        evening: "Zone check-in time! Recognize symptoms early and stay proactive. Understand your zone with replying Zones."
    },
    25: {
        morning: "You’re doing great! Every step you take brings you closer to better health, Daily weighing helps identify fluid retention early.",
        midday: "Blood pressure monitoring day! 🩸 Log your readings to share with your care team.",
        evening: "Zone check! Recognize signs early to stay safe. Have a great evening and stick to the routine."
    },
    26: {
        morning: "Weigh-in reminder! Early detection of weight gain helps avoid complications. Stick to a heart-healthy diet today! Limit salt and stay hydrated. See the Diet video by replying Diet.",
        midday: "Medication adherence matters! 💊 Consistency improves outcomes.",
        evening: "Green, Yellow, or Red? Zone check keeps you ahead of the game. Importance of follow-up appointments with your provider are paramount to your health."
    },
    27: {
        morning: "Time to weigh yourself! Keep an eye out for sudden changes and report any concerns to Luxe Home Health team. Don’t forget to log your weight.",
        midday: "Sodium awareness day! 🥗 Check food labels for hidden salt.",
        evening: "You’re doing great! Review your day and check your zone! Early intervention makes a difference."
    },
    28: {
        morning: "Weigh yourself today! Sudden changes in weight could signal fluid buildup. Sticking to a heart-healthy diet and tracking progress is important for Heart health.",
        midday: "Get moving today! 🚶 Even small amounts of exercise benefit your heart.",
        evening: "End-of-day check! Review your zone and log today’s weight and BP readings. Have a good evening."
    },
    29: {
        morning: "Good Morning! Weigh yourself and log your progress. Consistent medication management keeps your heart strong. Reply Medications to see the medication management video.",
        midday: "Hydration check! 💧 Follow your recommended fluid limits to prevent overload.",
        evening: "Stay ahead by tracking daily. If any sudden changes please contact Luxe home health team."
    },
    30: {
        morning: "Good morning! Don’t forget to weigh yourself. A sudden 2-3 lb gain may require a medication adjustment.",
        midday: "Medication check! ⏰ Consistent adherence prevents complications.",
        evening: "Last message of month journey! Review your zone and log today’s weight. We are proud of you and your Heart thanks you."
    }
};

function scheduleJobAtHour(hour, job, minute = 0) {
    const rule = new schedule.RecurrenceRule();
    rule.tz = 'America/Chicago';
    rule.hour = hour;
    rule.minute = minute;

    schedule.scheduleJob(rule, job);
}

function scheduleISTJob(hourIST, minuteIST = 0, job) {
    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Asia/Kolkata'; // IST timezone
    rule.hour = hourIST;
    rule.minute = minuteIST;

    schedule.scheduleJob(rule, job);
}

const getDayNumber = (startDate) => {
    if (!startDate) return 1;
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = now - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(diffDays, 30);
};

// Track when the follow-up message was sent to each patient
const followUpSentTimestamps = new Map();

const sendScheduledMessage = async (timeOfDay) => {
    console.log(`Running task for ${timeOfDay} reminders...`);
    const patients = await Patient.find({ continueProgram: true });

    for (const patient of patients) {
        // const startDate = DateTime.fromISO(patient.startDate, { zone: 'utc' }).setZone(TIMEZONE);
        patient.startDate = DateTime.fromISO(new Date(patient.startDate).toISOString())
        .setZone(TIMEZONE)
        .toISO();
        console.log("startDate", patient.startDate);

        const dayNum = getDayNumber(patient.startDate);
        console.log("dayNum", dayNum);
        
        if (dayNum > 30) continue;

        const message = dailyMessages[dayNum]?.[timeOfDay];
        if (!message) continue;

        try {
            await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: patient.contactNo
            });
            console.log(`Day ${dayNum} ${timeOfDay} message sent to ${patient.contactNo}`);

            // Send "continue?" message after Day 30 evening
            if (dayNum === 30 && timeOfDay === "evening") {
                const followUpMsg = `🎉 Congratulations on completing your 30-day journey with Luxe Home Health!\nWould you like to continue? Please reply YES or NO.`;

                await client.messages.create({
                    body: followUpMsg,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: patient.contactNo
                });

                console.log(`Follow-up message sent to ${patient.contactNo}`);

                // Record the time when follow-up was sent
                followUpSentTimestamps.set(patient.contactNo, new Date());
            }

        } catch (err) {
            console.error(`Failed to send message to ${patient.contactNo}: ${err.message}`);
        }
    }
};

const sendNoonReminder = async () => {
    console.log("Running 12 PM medication/exercise reminder task...");
    const patients = await Patient.find();

    for (const patient of patients) {
        patient.startDate = DateTime.fromISO(new Date(patient.startDate).toISOString())
        .setZone(timeZone)
        .toISO();
        const dayNum = getDayNumber(patient.startDate);
        if (dayNum > 30) continue;

        const customMessage = `Hi ${patient.firstName},\nJust a gentle reminder to take your prescribed medicine and complete your daily exercise. Staying consistent makes a big difference! 💪\nTake care!`;

        try {
            const accountSid = process.env.TWILIO_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const client = require('twilio')(accountSid, authToken);
            await client.messages.create({
                body: customMessage,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: patient.contactNo
            });
            console.log(`Custom 12PM message sent to ${patient.contactNo}`);
        } catch (err) {
            console.error(`Failed to send custom 12PM message to ${patient.contactNo}: ${err.message}`);
        }
    }
};

// Check for non-responders to the follow-up message
const checkFollowUpResponses = async () => {
    console.log("Checking for non-responses to follow-up messages...");

    // Get current time
    const now = new Date();

    // Get all patients who have completed the 30-day program
    const patientsWithFollowUp = Array.from(followUpSentTimestamps.entries());

    for (const [contactNo, sentTime] of patientsWithFollowUp) {
        // Calculate hours since follow-up was sent
        const hoursSinceSent = (now - sentTime) / (1000 * 60 * 60);

        // If it's been more than 8 hours with no response, treat as "NO"
        if (hoursSinceSent >= 8) {
            try {
                // Find the patient by contact number
                const patient = await Patient.findOne({ contactNo });

                if (patient) {
                    // Update patient status - treat non-response as "NO"
                    patient.continueProgram = false;
                    await patient.save();

                    console.log(`No response from ${contactNo} after 8 hours. Updated continueProgram to false.`);

                    // Optional: Send a final message
                    await client.messages.create({
                        body: `Thank you for participating in our 30-day heart health program. We've concluded your program as we haven't heard back from you. If you'd like to restart at any time, please contact Luxe Home Health. Take care! ❤️`,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: contactNo
                    });

                    // Remove from the tracking map
                    followUpSentTimestamps.delete(contactNo);
                }
            } catch (err) {
                console.error(`Error processing non-response for ${contactNo}: ${err.message}`);
            }
        }
    }
};

// Schedule the main message tasks
scheduleJobAtHour(9, () => sendScheduledMessage("morning"));  // 9 AM CDT
// scheduleJobAtHour(12, () => sendNoonReminder()); // 12:00 PM CDT
// scheduleJobAtHour(14, () => sendScheduledMessage("midday"));  // 2 PM CDT
scheduleJobAtHour(17, () => sendScheduledMessage("evening")); // 5 PM CDT

// Schedule the check for non-responders - run every 4 hours
scheduleJobAtHour(0, () => checkFollowUpResponses()); // 12 AM CDT
scheduleJobAtHour(4, () => checkFollowUpResponses()); // 4 AM CDT
scheduleJobAtHour(8, () => checkFollowUpResponses()); // 8 AM CDT
scheduleJobAtHour(12, () => checkFollowUpResponses()); // 12 PM CDT
scheduleJobAtHour(16, () => checkFollowUpResponses()); // 4 PM CDT
scheduleJobAtHour(20, () => checkFollowUpResponses()); // 8 PM CDT

module.exports = {
    sendScheduledMessage,
    dailyMessages,
    checkFollowUpResponses // Export for potential manual triggering or testing
};