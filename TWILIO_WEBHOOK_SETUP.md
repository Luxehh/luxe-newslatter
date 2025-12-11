# Twilio Webhook Setup for Newsletter SMS Replies

## Overview
This guide explains how to configure Twilio to handle SMS replies (YES/NO) for newsletter subscription renewals.

---

## 🔧 Webhook Configuration

### Step 1: Log in to Twilio Console
1. Go to https://console.twilio.com/
2. Navigate to **Phone Numbers** → **Manage** → **Active numbers**
3. Click on your Twilio phone number

### Step 2: Configure Messaging Webhook
Under the **Messaging** section, configure:

**A Message Comes In:**
- **Webhook URL**: `https://yourdomain.com/api/newsletter/sms-webhook`
- **HTTP Method**: `POST`
- **Content Type**: `application/x-www-form-urlencoded`

Click **Save** to apply changes.

---

## 📱 SMS Reply Flow

### User Receives Re-subscription Message
```
Hello John! 👋

You've completed all 12 newsletters from Luxe Home Health. 

📰 Would you like to continue receiving our monthly newsletters?

Reply to this message:
✅ YES - To renew and receive 12 more newsletters
❌ NO - To cancel your subscription

OR click the links below:
Renew: https://yourdomain.com/api/newsletter/renew-subscription?phone=%2B1234567890
Cancel: https://yourdomain.com/api/newsletter/cancel-subscription?phone=%2B1234567890

Your subscription will be automatically cancelled if we don't hear from you.

Thank you for being with us! 💙
```

### User Replies with SMS

#### Reply: "YES" or "Y"
**Action**: Subscription renewed
- `status` set to `true`
- `createdAt` reset to current date (new 12-month cycle begins)
- Response message:
```
Thank you, John! ✅

Your newsletter subscription has been renewed successfully!

You will receive 12 monthly newsletters starting from next month.

Welcome back to Luxe Home Health! 💙
```

#### Reply: "NO" or "N"
**Action**: Subscription cancelled
- `status` set to `false`
- Response message:
```
We're sorry to see you go, John. ❌

Your newsletter subscription has been cancelled.

You can re-subscribe anytime by contacting us.

Thank you for being with Luxe Home Health! 💙
```

#### Reply: "STOP"
**Action**: Unsubscribe (Twilio required keyword)
- `status` set to `false`
- Response message:
```
Your newsletter subscription has been stopped. You will not receive any more messages.
```

#### Reply: "START"
**Action**: Resubscribe (Twilio required keyword)
- `status` set to `true`
- `createdAt` reset to current date
- Response message:
```
Welcome back, John! ✅

Your newsletter subscription has been reactivated.

You will receive 12 monthly newsletters starting from next month.

Thank you for rejoining Luxe Home Health! 💙
```

#### Reply: Anything else
**Action**: Send help message
- Response message:
```
Hi John! 👋

To manage your newsletter subscription, please reply with:

✅ YES - To renew and receive 12 more newsletters
❌ NO - To cancel your subscription

Thank you! 💙
```

---

## 🔍 How It Works

### 1. User Replies via SMS
When a user replies to the re-subscription message, Twilio sends a POST request to your webhook:

```
POST /api/newsletter/sms-webhook
Content-Type: application/x-www-form-urlencoded

From=+1234567890
Body=YES
MessageSid=SM123456789abcdef
...other Twilio parameters
```

### 2. Server Processes Reply
The webhook handler (`/api/newsletter/sms-webhook`):
1. Extracts phone number (`From`) and message (`Body`)
2. Looks up subscriber in database
3. Checks message content (yes/no/stop/start/unknown)
4. Updates subscriber status accordingly
5. Generates TwiML response

### 3. Server Returns TwiML Response
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thank you, John! ✅ Your newsletter subscription has been renewed successfully!</Message>
</Response>
```

### 4. Twilio Sends Response to User
Twilio automatically sends the response message back to the user.

---

## 🎯 Database Updates

### Renewal (YES)
```javascript
subscriber.status = true;
subscriber.createdAt = new Date(); // Reset to today
await subscriber.save();
```
**Effect**: New 12-month cycle begins from today

### Cancellation (NO/STOP)
```javascript
subscriber.status = false;
await subscriber.save();
```
**Effect**: No more newsletters sent

### Reactivation (START)
```javascript
subscriber.status = true;
subscriber.createdAt = new Date(); // Reset to today
await subscriber.save();
```
**Effect**: New 12-month cycle begins from today

---

## 🧪 Testing the Webhook

### Local Testing with ngrok
1. Install ngrok: https://ngrok.com/download
2. Start your server: `npm start`
3. Expose local server:
   ```bash
   ngrok http 3000
   ```
4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Update Twilio webhook URL:
   ```
   https://abc123.ngrok.io/api/newsletter/sms-webhook
   ```
6. Send SMS to your Twilio number with "YES" or "NO"
7. Check server logs for webhook activity

### Manual Testing via API
```bash
# Test webhook directly with curl
curl -X POST http://localhost:3000/api/newsletter/sms-webhook \
  -d "From=+1234567890" \
  -d "Body=YES"
```

---

## 📊 Logging & Monitoring

### Console Logs
The webhook logs all activity:
```
📩 Newsletter SMS webhook triggered
📱 Message from +1234567890: "yes"
✅ Subscription renewed for +1234567890 - John Doe
```

### Error Handling
All errors are caught and logged:
```
❌ Error in newsletter SMS webhook: [error message]
```

Users receive error message:
```
Sorry, there was an error processing your request. Please try again later.
```

---

## 🔒 Security Considerations

1. **Validate Twilio Requests**: Consider adding Twilio signature validation
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Phone Number Validation**: Ensure phone numbers are properly formatted
4. **Error Handling**: All errors return 200 to prevent Twilio retries

---

## 🚀 Production Deployment

### Requirements
- Public HTTPS URL (required by Twilio)
- SSL certificate
- Server running on port 80 or 443 (or reverse proxy like Nginx)

### Environment Variables
```env
TWILIO_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
APP_URL=https://yourdomain.com
```

### Update Twilio Webhook
Change webhook URL from ngrok to production:
```
https://yourdomain.com/api/newsletter/sms-webhook
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue**: Webhook not receiving messages
- **Solution**: Check Twilio webhook URL is correct and accessible
- **Solution**: Verify server is running and publicly accessible
- **Solution**: Check Twilio debugger for error logs

**Issue**: User replies but nothing happens
- **Solution**: Check server logs for webhook activity
- **Solution**: Verify subscriber exists in database
- **Solution**: Test with exact keywords: "YES" or "NO"

**Issue**: Response messages not sending
- **Solution**: Check Twilio credentials are correct
- **Solution**: Verify Twilio account has credits
- **Solution**: Check TwiML response is properly formatted

### Twilio Debugger
Monitor webhook activity in Twilio Console:
1. Go to **Monitor** → **Logs** → **Messaging**
2. Filter by your phone number
3. Click on message to see webhook details

---

## 📝 Summary

✅ Users can reply with **YES** or **NO** via SMS
✅ Subscription status updated automatically
✅ Immediate confirmation message sent
✅ Works alongside clickable links (both options available)
✅ Handles STOP/START for Twilio compliance
✅ Robust error handling and logging
✅ Similar to existing patient reply system

**Last Updated**: December 11, 2025
