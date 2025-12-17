const express = require("express");
const Newsletter = require("../models/newsletter");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();

// ✅ Add Newsletter Subscription
router.post("/add", async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, status } = req.body;

        // Check for existing subscriber with the same phone number
        const existingSubscriber = await Newsletter.findOne({ phoneNumber });
        if (existingSubscriber) {
            return res.status(200).json({ 
                message: "Subscriber with this phone number already exists.",
                subscriber: existingSubscriber
            });
        }

        const newsletter = new Newsletter({
            firstName,
            lastName,
            phoneNumber,
            status: status || true
        });

        await newsletter.save();

        // Send Twilio SMS after successful registration
        try {
            const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
            
            const message = `Congratulations, ${firstName}! You've successfully subscribed to the Luxe Hospice Care newsletter. 🎉`;

            await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });

            console.log(`✅ Welcome SMS sent to ${phoneNumber}`);
        } catch (smsError) {
            // Log SMS error but don't fail the registration
            console.error("❌ Failed to send welcome SMS:", smsError.message);
        }

        res.status(201).json({
            message: "Newsletter subscription created successfully",
            subscriber: newsletter
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Update Newsletter Subscription
router.post("/update", async (req, res) => {
    try {
        const { id, firstName, lastName, phoneNumber, status } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Subscriber ID is required" });
        }

        // Check if another subscriber already has this phone number
        if (phoneNumber) {
            const existingSubscriber = await Newsletter.findOne({
                phoneNumber,
                _id: { $ne: id }
            });

            if (existingSubscriber) {
                return res.status(200).json({
                    message: "Another subscriber with this phone number already exists."
                });
            }
        }

        const updateData = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
        if (status !== undefined) updateData.status = status;

        const updatedSubscriber = await Newsletter.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSubscriber) {
            return res.status(404).json({ message: "Subscriber not found" });
        }

        res.json({
            message: "Newsletter subscription updated successfully",
            subscriber: updatedSubscriber
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Fetch All Newsletter Subscriptions (POST method)
router.post("/fetch", async (req, res) => {
    try {
        const { status, phoneNumber } = req.body;

        // Build query object based on filters
        const query = {};
        if (status !== undefined) {
            query.status = status;
        }
        if (phoneNumber) {
            query.phoneNumber = phoneNumber;
        }

        const subscribers = await Newsletter.find(query).sort({ createdAt: -1 });

        res.json({
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Fetch Single Newsletter Subscription by ID (POST method)
router.post("/fetch-one", async (req, res) => {
    try {
        const { id, phoneNumber } = req.body;

        let subscriber;
        
        if (id) {
            subscriber = await Newsletter.findById(id);
        } else if (phoneNumber) {
            subscriber = await Newsletter.findOne({ phoneNumber });
        } else {
            return res.status(400).json({ message: "Please provide either id or phoneNumber" });
        }

        if (!subscriber) {
            return res.status(404).json({ message: "Subscriber not found" });
        }

        res.json({ subscriber });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Delete Newsletter Subscription
router.post("/delete", async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "Subscriber ID is required" });
        }

        const deletedSubscriber = await Newsletter.findByIdAndDelete(id);

        if (!deletedSubscriber) {
            return res.status(404).json({ message: "Subscriber not found" });
        }

        res.json({ 
            message: "Newsletter subscription deleted successfully",
            subscriber: deletedSubscriber
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Renew Subscription - Handles both GET (clickable link) and POST (API)
const handleRenewSubscription = async (req, res) => {
    try {
        // Accept phone number from query (GET) or body (POST)
        const phoneNumber = req.query.phone || req.body.phoneNumber;

        if (!phoneNumber) {
            // Return JSON for API calls, HTML for browser clicks
            if (req.method === 'GET') {
                return res.status(400).send(`
                    <html>
                        <head><title>Error - Phone Number Required</title></head>
                        <body style="font-family: Arial; text-align: center; padding: 50px;">
                            <h2>❌ Error</h2>
                            <p>Phone number is required</p>
                        </body>
                    </html>
                `);
            }
            return res.status(400).json({ message: "Phone number is required" });
        }

        const subscriber = await Newsletter.findOne({ phoneNumber });

        if (!subscriber) {
            if (req.method === 'GET') {
                return res.status(404).send(`
                    <html>
                        <head><title>Subscriber Not Found</title></head>
                        <body style="font-family: Arial; text-align: center; padding: 50px;">
                            <h2>❌ Subscriber Not Found</h2>
                            <p>No subscription found for this phone number.</p>
                        </body>
                    </html>
                `);
            }
            return res.status(404).json({ message: "Subscriber not found" });
        }

        // Update status to true and reset createdAt to current date (restart 12-month cycle)
        subscriber.status = true;
        subscriber.createdAt = new Date();
        await subscriber.save();

        // Return HTML for GET requests (browser clicks), JSON for POST (API)
        if (req.method === 'GET') {
            return res.send(`
                <html>
                    <head>
                        <title>Subscription Renewed</title>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                text-align: center;
                                padding: 50px;
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                            }
                            .container {
                                background: white;
                                color: #333;
                                padding: 40px;
                                border-radius: 15px;
                                max-width: 500px;
                                margin: 0 auto;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                            }
                            h1 { color: #4CAF50; margin-bottom: 20px; }
                            p { font-size: 18px; line-height: 1.6; }
                            .success-icon { font-size: 60px; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="success-icon">✅</div>
                            <h1>Subscription Renewed!</h1>
                            <p>Hello <strong>${subscriber.firstName} ${subscriber.lastName}</strong>!</p>
                            <p>Your newsletter subscription has been successfully renewed.</p>
                            <p>You will receive 12 monthly newsletters starting from your next anniversary date.</p>
                            <p style="color: #666; margin-top: 30px;">Thank you for staying with Luxe Home Health! 💙</p>
                        </div>
                    </body>
                </html>
            `);
        }

        // JSON response for POST requests
        res.json({
            success: true,
            message: "Subscription renewed successfully! You will receive newsletters for the next 12 months.",
            subscriber
        });
    } catch (error) {
        if (req.method === 'GET') {
            return res.status(500).send(`
                <html>
                    <head><title>Error</title></head>
                    <body style="font-family: Arial; text-align: center; padding: 50px;">
                        <h2>❌ Error</h2>
                        <p>${error.message}</p>
                    </body>
                </html>
            `);
        }
        res.status(500).json({ error: error.message });
    }
};

// Register both GET and POST routes with the same handler
router.get("/renew-subscription", handleRenewSubscription);
router.post("/renew-subscription", handleRenewSubscription);

// ✅ Cancel Subscription - Handles both GET (clickable link) and POST (API)
const handleCancelSubscription = async (req, res) => {
    try {
        // Accept phone number from query (GET) or body (POST)
        const phoneNumber = req.query.phone || req.body.phoneNumber;

        if (!phoneNumber) {
            // Return JSON for API calls, HTML for browser clicks
            if (req.method === 'GET') {
                return res.status(400).send(`
                    <html>
                        <head><title>Error - Phone Number Required</title></head>
                        <body style="font-family: Arial; text-align: center; padding: 50px;">
                            <h2>❌ Error</h2>
                            <p>Phone number is required</p>
                        </body>
                    </html>
                `);
            }
            return res.status(400).json({ message: "Phone number is required" });
        }

        const subscriber = await Newsletter.findOne({ phoneNumber });

        if (!subscriber) {
            if (req.method === 'GET') {
                return res.status(404).send(`
                    <html>
                        <head><title>Subscriber Not Found</title></head>
                        <body style="font-family: Arial; text-align: center; padding: 50px;">
                            <h2>❌ Subscriber Not Found</h2>
                            <p>No subscription found for this phone number.</p>
                        </body>
                    </html>
                `);
            }
            return res.status(404).json({ message: "Subscriber not found" });
        }

        // Update status to false
        subscriber.status = false;
        await subscriber.save();

        // Return HTML for GET requests (browser clicks), JSON for POST (API)
        if (req.method === 'GET') {
            return res.send(`
                <html>
                    <head>
                        <title>Subscription Cancelled</title>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                text-align: center;
                                padding: 50px;
                                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                                color: white;
                            }
                            .container {
                                background: white;
                                color: #333;
                                padding: 40px;
                                border-radius: 15px;
                                max-width: 500px;
                                margin: 0 auto;
                                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                            }
                            h1 { color: #f5576c; margin-bottom: 20px; }
                            p { font-size: 18px; line-height: 1.6; }
                            .cancel-icon { font-size: 60px; margin-bottom: 20px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="cancel-icon">❌</div>
                            <h1>Subscription Cancelled</h1>
                            <p>Hello <strong>${subscriber.firstName} ${subscriber.lastName}</strong>,</p>
                            <p>Your newsletter subscription has been cancelled as requested.</p>
                            <p>You will not receive any more newsletters from us.</p>
                            <p style="color: #666; margin-top: 30px;">We're sorry to see you go. You can re-subscribe anytime!</p>
                            <p style="color: #666;">Thank you for being with Luxe Home Health! 💙</p>
                        </div>
                    </body>
                </html>
            `);
        }

        // JSON response for POST requests
        res.json({
            success: true,
            message: "Subscription cancelled successfully. You will not receive any more newsletters.",
            subscriber
        });
    } catch (error) {
        if (req.method === 'GET') {
            return res.status(500).send(`
                <html>
                    <head><title>Error</title></head>
                    <body style="font-family: Arial; text-align: center; padding: 50px;">
                        <h2>❌ Error</h2>
                        <p>${error.message}</p>
                    </body>
                </html>
            `);
        }
        res.status(500).json({ error: error.message });
    }
};

// Register both GET and POST routes with the same handler
router.get("/cancel-subscription", handleCancelSubscription);
router.post("/cancel-subscription", handleCancelSubscription);

// ✅ Webhook to handle Twilio SMS replies (for Yes/No responses to newsletter renewal)
router.post("/sms-webhook", async (req, res) => {
    console.log("📩 Newsletter SMS webhook triggered");

    const incomingMsg = req.body.Body?.trim().toLowerCase() || "";
    const from = req.body.From;
    
    console.log(`📱 Message from ${from}: "${incomingMsg}"`);

    const { MessagingResponse } = require('twilio').twiml;
    const twiml = new MessagingResponse();

    try {
        // Find subscriber by phone number
        const subscriber = await Newsletter.findOne({ phoneNumber: from });

        if (!subscriber) {
            console.log(`⚠️ No subscriber found for ${from}`);
            twiml.message("Sorry, you're not recognized in our newsletter system.");
            return res.type("text/xml").send(twiml.toString());
        }

        // Check for YES response - Renew subscription
        if (incomingMsg === "yes" || incomingMsg === "y") {
            // Update status to true and reset createdAt (restart 12-month cycle)
            subscriber.status = true;
            subscriber.createdAt = new Date();
            await subscriber.save();
            
            twiml.message(`Thank you, ${subscriber.firstName}! ✅\n\nYour newsletter subscription has been renewed successfully!\n\nYou will receive 12 monthly newsletters starting from next month.\n\nWelcome back to Luxe Home Health! 💙`);
            console.log(`✅ Subscription renewed for ${from} - ${subscriber.firstName} ${subscriber.lastName}`);
        }
        // Check for NO response - Cancel subscription
        else if (incomingMsg === "no" || incomingMsg === "n") {
            // Update status to false
            subscriber.status = false;
            await subscriber.save();
            
            twiml.message(`We're sorry to see you go, ${subscriber.firstName}. ❌\n\nYour newsletter subscription has been cancelled.\n\nYou can re-subscribe anytime by contacting us.\n\nThank you for being with Luxe Home Health! 💙`);
            console.log(`❌ Subscription cancelled for ${from} - ${subscriber.firstName} ${subscriber.lastName}`);
        }
        // Check for STOP - Unsubscribe
        else if (incomingMsg === "stop") {
            subscriber.status = false;
            await subscriber.save();
            
            twiml.message(`Your newsletter subscription has been stopped. You will not receive any more messages.`);
            console.log(`🛑 Subscription stopped for ${from} - ${subscriber.firstName} ${subscriber.lastName}`);
        }
        // Check for START - Resubscribe
        else if (incomingMsg === "start") {
            subscriber.status = true;
            subscriber.createdAt = new Date();
            await subscriber.save();
            
            twiml.message(`Welcome back, ${subscriber.firstName}! ✅\n\nYour newsletter subscription has been reactivated.\n\nYou will receive 12 monthly newsletters starting from next month.\n\nThank you for rejoining Luxe Home Health! 💙`);
            console.log(`🔄 Subscription restarted for ${from} - ${subscriber.firstName} ${subscriber.lastName}`);
        }
        // Unknown response
        else {
            twiml.message(`Hi ${subscriber.firstName}! 👋\n\nTo manage your newsletter subscription, please reply with:\n\n✅ YES - To renew and receive 12 more newsletters\n❌ NO - To cancel your subscription\n\nThank you! 💙`);
            console.log(`⚠️ Unknown response from ${from}: "${incomingMsg}"`);
        }

        // Return TwiML response to Twilio
        res.type("text/xml").send(twiml.toString());
        
    } catch (error) {
        console.error("❌ Error in newsletter SMS webhook:", error.message);
        
        // Send error message to user
        twiml.message("Sorry, there was an error processing your request. Please try again later.");
        res.type("text/xml").send(twiml.toString());
    }
});

// ✅ Test Twilio Message Sending
router.post("/test-twilio", async (req, res) => {
    try {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
        
        // Test phone number
        const testPhoneNumber = "+919723393003";
        const testMessage = "Hello! This is a test message from Luxe Home Health. Your Twilio integration is working successfully! 📰";

        const message = await client.messages.create({
            body: testMessage,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: testPhoneNumber
        });

        res.status(200).json({
            success: true,
            message: "Test message sent successfully!",
            details: {
                messageSid: message.sid,
                to: testPhoneNumber,
                from: process.env.TWILIO_PHONE_NUMBER,
                status: message.status,
                body: testMessage
            }
        });

    } catch (error) {
        console.error("❌ Twilio test message failed:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send test message",
            error: error.message,
            errorCode: error.code || "UNKNOWN"
        });
    }
});

module.exports = router;
