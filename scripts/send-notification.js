import sgMail from '@sendgrid/mail';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_PATH = path.join(__dirname, '../src/data/content.json');

async function sendNotification() {
  const apiKey = process.env.SENDGRID_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL;
  const recipientEmail = process.env.RECIPIENT_EMAIL;

  if (!apiKey || !senderEmail || !recipientEmail) {
    console.error('Missing required environment variables for SendGrid (SENDGRID_API_KEY, SENDER_EMAIL, RECIPIENT_EMAIL).');
    process.exit(1);
  }

  sgMail.setApiKey(apiKey);

  try {
    const rawData = await fs.readFile(CONTENT_PATH, 'utf-8');
    const content = JSON.parse(rawData);

    const msg = {
      to: recipientEmail,
      from: senderEmail,
      subject: `[SYSTEM UPDATE] AI Blog: ${content.title}`,
      text: `Your AI Blog was successfully updated for ${content.date}.\n\nTitle: ${content.title}\nIntro: ${content.intro}\n\nView your live site to see the full intelligence report!`,
      html: `
        <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; background-color: #030305; color: #fff; padding: 30px; border: 1px solid #333;">
          <h2 style="color: #00f2ff; border-bottom: 1px solid #00f2ff; padding-bottom: 10px;">INTELLIGENCE REPORT UPDATED</h2>
          <p style="color: #aaa;">Date: <strong>${content.date}</strong></p>
          <h3 style="color: #fff; font-size: 1.5em; margin-top: 30px;">${content.title}</h3>
          <p style="line-height: 1.6; color: #ddd;">${content.intro}</p>
          <hr style="border: 0; border-top: 1px solid #333; margin: 40px 0;" />
          <p style="color: #7000ff; font-size: 0.9em; font-weight: bold;">[END OF TRANSMISSION]</p>
          <p style="color: #666; font-size: 0.8em;">Visit your live Vercel site to read the full brief.</p>
        </div>
      `,
    };

    await sgMail.send(msg);
    console.log('Update notification email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    process.exit(1);
  }
}

sendNotification();