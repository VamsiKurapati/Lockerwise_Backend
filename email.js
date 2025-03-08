const express = require("express");
const nodemailer = require("nodemailer");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.post("/submitForm", async (req, res) => {
    const { name, phone, email, organization, lockerCount, message, recaptcha } = req.body;

    if (!name || !phone || !email || !organization || !lockerCount || !message || !recaptcha) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
    const RECAPTCHA_URL = `https://www.google.com/recaptcha/api/siteverify`;
    
    try {
        const response = await axios.post(RECAPTCHA_URL, null, {
            params: {
                secret: RECAPTCHA_SECRET,
                response: recaptcha,
            },
        });
        console.log("Recaptcha response:", response.data);
        if (!response.data.success) {
            return res.status(400).json({ error: "Failed captcha verification" });
        }
    } catch (error) {
        console.error("Error verifying captcha:", error);
        return res.status(500).json({ error: "Failed captcha verification" });
    }

    try {
        htmlBody = `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Organization:</strong> ${organization}</p>
        <p><strong>Locker Count:</strong> ${lockerCount}</p>
        <p><strong>Message:</strong> ${message}</p>
        `;

        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: "support@lockerwise.com",
            subject: "Lockerwise Contact Form Submission",
            html: htmlBody,
        });

        if (!info.messageId) {
            throw new Error("Failed to send email");
        }
        console.log("Message sent: %s", info.messageId);
        res.status(200).json({ data: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
});

module.exports = router;
