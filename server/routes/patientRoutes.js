const express = require("express");
const Patient = require("../models/patient");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "JSK_LUXE";
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);
const { MessagingResponse } = require('twilio').twiml;
const { dailyMessages } = require('../cron/updateHiddenFlag');
const { DateTime } = require('luxon');
const timeZone = 'America/Chicago';
// ✅ LOGIN - Generate JWT Token
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials
    if (username === "administrator@luxehh.com" && password === "Luxehh2025") {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// ✅ Create Patient and Send Welcome SMS
router.post("/add", async (req, res) => {
    try {
        const { contactNo, firstName } = req.body;

        // Check for existing patient with the same contactNo
        const existingPatient = await Patient.findOne({ contactNo });
        if (existingPatient) {
            return res.status(201).json({ message: "Patient with this contact number already exists." });
        }
        // const formattedDate = dateFormat(req.body.startDate);
        // req.body.startDate = formattedDate;

        // let localDate = `${req.body.startDate}T00:00:00`;
        // localDate = new Date(localDate);
        // req.body.startDate = localDate.toISOString();
        let localDate = DateTime.fromISO(req.body.startDate, { zone: 'local' }).startOf('day');
        req.body.startDate = localDate.toISO();

        const patient = new Patient(req.body);
        await patient.save();

        const messages = [
            `Welcome to Luxe Home Health’s Heart Health Messaging Program! Your dedication to your health is inspiring! We look forward to assisting you with managing your Heart Health.`,
            // `Please review our Terms & Conditions: https://hfmessages.luxehh.com/terms\nReply YES to accept or STOP to opt out.`,
            `Agree and continue message - Please review our terms and conditions: https://hfmessages.luxehh.com/terms Reply YES to Accept and Agree to our terms and conditions or STOP to opt out.`
        ];

        try {
            const accountSid = process.env.TWILIO_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const client = require("twilio")(accountSid, authToken);

            for (let i = 0; i < messages.length; i++) {
                const position = `${i + 1}/${messages.length}`;
                const body = `${messages[i]}`;
                try {
                    const message = await client.messages.create({
                        body,
                        from: process.env.TWILIO_PHONE_NUMBER,
                        to: contactNo
                    });
                    console.log(`✅ Message sent (${position}): SID ${message.sid}`);
                } catch (err) {
                    console.error(`❌ Failed to send message (${position}): ${err.message}`);
                }
            }
        } catch (smsErr) {
            console.error(`❌ Failed to send one or more SMS to ${contactNo}: ${smsErr.message}`);
        }

        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

function dateFormat(startDate) {
    const today = new Date(startDate);
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    return `${month}/${day}/${year}`;
}


// ✅ Get All Patients
/* router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        const patientsWithLocalDates = patients.map((patient) => {
            const localStartDate = DateTime
                .fromISO(patient.startDate.toISOString())
                .setZone(timeZone)
                .toISO();

            return {
                ...patient.toObject(),
                startDate: localStartDate
            };
        });

        res.json(patientsWithLocalDates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Single Patient
/* router.get("/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}); */

router.get("/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        const patientObj = patient.toObject();

        if (patientObj.startDate) {
            patientObj.startDate = DateTime
                .fromISO(new Date(patientObj.startDate).toISOString())
                .setZone(timeZone)
                .toISO();
        }

        res.json(patientObj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update Patient
router.put("/:id", async (req, res) => {
    try {
        const { contactNo } = req.body;

        // Check if another patient already has this contact number
        const existingPatient = await Patient.findOne({
            contactNo,
            _id: { $ne: req.params.id }, // Exclude the current patient being updated
        });

        if (existingPatient) {
            return res.status(200).json({
                message: "Patient with this contact number already exists.",
            });
        }

        // const formattedDate = dateFormat(req.body.startDate);
        // req.body.startDate = formattedDate;

        let localDate = DateTime.fromISO(req.body.startDate, { zone: 'local' }).startOf('day');
        req.body.startDate = localDate.toISO();

        const updatedPatient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedPatient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Delete Patient
router.delete("/:id", async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getDayNumber = (startDate) => {
    if (!startDate) return 1;
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = now - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(diffDays, 30);
};

router.post("/reply", async (req, res) => {
    console.log("Twilio webhook hit");

    const incomingMsg = req.body.Body?.toLowerCase().trim();
    const from = req.body.From;
    console.log(`Message from ${from}: ${incomingMsg}`);

    const twiml = new MessagingResponse();
    const patient = await Patient.findOne({ contactNo: from });

    if (!patient) {
        twiml.message("Sorry, you're not recognized in our system.");
        return res.type("text/xml").send(twiml.toString());
    }

    patient.startDate = DateTime.fromISO(new Date(patient.startDate).toISOString())
        .setZone(timeZone)
        .toISO();

    const keywordLinks = {
        weigh: "https://player.vimeo.com/video/1089266849?h=7446194ba0",
        zones: "https://player.vimeo.com/video/1089266852?h=0c16902790",
        medications: "https://player.vimeo.com/video/1089266845?h=448e530dc7",
        diet: "https://player.vimeo.com/video/1089266841?h=e4970fec34",
        easy: "https://player.vimeo.com/video/1085926835?h=512000206a",
        moderate: "https://player.vimeo.com/video/1085926902?h=3933a7db91",
        hard: "https://player.vimeo.com/video/1085926858?h=a644fe78de",

        dailycheckup: "https://vimeo.com/1085788283/cb810c1e89?ts=0&share=copy",
        symptomtracker: "https://vimeo.com/1085787644/a6a0850eba?ts=0&share=copy",
    };

    const dayNum = getDayNumber(patient.startDate);
    if (incomingMsg === "yes" && dayNum > 30) {
        // Reset the patient's startDate to today to restart the sequence from Day 1
        patient.startDate = new Date();
        patient.continueProgram = true;
        patient.messageCount = 0;
        await patient.save();

        // Send confirmation and the first day's morning message immediately
        const day1MorningMessage = dailyMessages[1].morning;
        twiml.message("Great! Your 30-day program has been restarted from Day 1. You'll receive your first message shortly.");

        // Send the first message through Twilio after responding to the webhook
        setTimeout(async () => {
            try {
                await client.messages.create({
                    body: day1MorningMessage,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: patient.contactNo
                });
                console.log(`Day 1 morning message sent to ${patient.contactNo} after program restart`);
            } catch (err) {
                console.error(`Failed to send Day 1 message to ${patient.contactNo}: ${err.message}`);
            }
        }, 5000); // Wait 5 seconds before sending the follow-up message

    } else if (incomingMsg === "yes" && patient?.continueProgram === false) {
        const TIMEZONE = "America/Chicago";
        patient.continueProgram = true;
        patient.messageCount = 0;
        // patient.startDate = new Date();
        await patient.save();
        const startDateInZone = DateTime.fromISO(patient.startDate, { zone: "utc" }).setZone(TIMEZONE);
        // 1. Send confirmation message
        // const formattedDate = dateInZone.toFormat('MM/dd/yyyy');
        const date = new Date(patient.startDate);
        const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        // twiml.message(`Great your 30 day Messaging program has been started. You will receive your messages from ${formattedDate}. You can opt out at anytime by texting the word STOP.`);
        // const confirmationMessage = `Great your 30 day Messaging program has been started. You will receive your messages from ${formattedDate}. You can opt out at anytime by texting the word STOP.`;
        // await sendMessage(confirmationMessage, "Confirmation");


        const remainMessages = [
            `Great your 30 day Messaging program has been started. You will receive your messages from ${formattedDate}. You can opt out at anytime by texting the word STOP.`,
            "Watch this short introduction video: https://player.vimeo.com/video/1089266834?h=b766e29cbb",
            `Luxe Home Health Teams – Contact Us:\n\nIllinois:\n📞 (847) 588-2111\n📧 info@luxehh.com\n\nIndiana:\n📞 (219) 837-0401\n📧 info.in@luxehh.com\n\nMissouri/Kansas:\n📞 (816) 653-5003\n📧 info.mo@luxehh.com`,
            `This program is designed to provide you with education and information on how to manage heart health.\n\nThese are the keywords you can use anytime to learn a bit more about managing your Heart Health. It will give you easy-to-follow videos on topics important for a Healthy Heart:\n- Weigh\n- Zones\n- Medications\n- Diet\n For Exercise:\n  • Easy\n  • Moderate\n  • Hard`
        ];

        const sendMessage = async (body, messageType) => {
            try {
                const message = await client.messages.create({
                    body,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: patient.contactNo
                });
                console.log(`✅ ${messageType} message sent: SID ${message.sid} to ${patient.contactNo}`);
                return message;
            } catch (err) {
                console.error(`❌ Failed to send ${messageType} message: ${err.message}`);
                throw err;
            }
        };

        const MESSAGE_DELAY_MS = 1000;
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 0; i < remainMessages.length; i++) {
            await sendMessage(remainMessages[i], `Intro message ${i + 1}`);
            if (i < remainMessages.length - 1) {
                await delay(MESSAGE_DELAY_MS);
            }
        }

        // 3. Wait before sending Day 1 morning message
        // const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        // await delay(MESSAGE_DELAY_MS);

        // 4. Send Day 1 morning message
        // if (!dailyMessages?.[1]?.morning) {
        //     console.error("❌ Day 1 morning message is undefined");
        //     throw new Error("Invalid daily message configuration");
        // }

        // const nowInZone = DateTime.now().setZone(TIMEZONE);
        // const isSameDate = startDateInZone.toISODate() === nowInZone.toISODate();
        // if (isSameDate) {
        //     await sendMessage(dailyMessages[1].morning, "Day 1 morning");
        // }
    } else if (incomingMsg === "no" && dayNum > 30) {
        patient.continueProgram = false;
        await patient.save();
        twiml.message("No problem! You've been unsubscribed from further messages.");
    } else if (incomingMsg === "STOP") {
        patient.continueProgram = false;
        await patient.save();
        twiml.message("No problem! You've been unsubscribed from further messages.");
    } else if (incomingMsg === "START" || incomingMsg === "yes") {
        // do nothing
    } else if (keywordLinks[incomingMsg]) {
        twiml.message(keywordLinks[incomingMsg]);
    } else {
        twiml.message(`You’ve entered a keyword that isn’t recognized.\n\nPlease use one of the following valid keywords to access easy-to-follow videos on important Heart Health topics:\n- Weigh\n- Zones\n- Medications\n- Exercise\n  1. Easy\n  2. Moderate\n  3. Hard\n- Diet\n\nTry sending one of these keywords to begin!`);
    }

    res.type("text/xml").send(twiml.toString());
});

module.exports = router;
