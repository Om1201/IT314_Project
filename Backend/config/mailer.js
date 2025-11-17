import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = {
    sendMail: async (mailOptions) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        try {
            await sgMail.send(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    },
};

export const verifyEmailTransporter = async () => {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      console.log("SendGrid transporter verified successfully.✅");
    } catch (error) {
      console.error('Error verifying email transporter:', error);
  }
};
