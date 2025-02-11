import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

const config = {
    imap: {
        user: 'hello@umersaleem.com',  // Replace with your email
        password: '@Umer2024', // Replace with your email password
        host: 'imap.hostinger.com',
        port: 993,
        tls: true,
        authTimeout: 3000
    }
};
async function checkEmails() {
    try {
        const connection = await imaps.connect(config);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

        const messages = await connection.search(searchCriteria, fetchOptions);

        if (messages.length === 0) {
            console.log("📭 No new emails.");
        }

        for (let message of messages) {
            const all = message.parts.find(part => part.which === 'TEXT');
            if (!all) {
                console.warn("⚠️ Email has no text content.");
                continue;
            }

            const parsed = await simpleParser(all.body);

            // Extract plain text or clean HTML content
            const emailBody = parsed.text?.trim() || parsed.html?.replace(/<[^>]+>/g, '').trim() || "No Message Content";

            console.log("\n📧 New Email Received:");
            console.log(`From: ${parsed.from?.text || "Unknown Sender"}`);
            console.log(`Subject: ${parsed.subject || "No Subject"}`);
            console.log(`Message: ${emailBody}`);
            console.log("----------------------");
        }

        await connection.end();
    } catch (error) {
        console.error("❌ Error fetching emails:", error.message);
    }
}

// Check for emails every 30 seconds
setInterval(checkEmails, 30000);

console.log("📩 Email listener started... Waiting for new emails...");