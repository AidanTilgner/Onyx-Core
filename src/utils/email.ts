import nodemailer from "nodemailer";
import { config } from "dotenv";
import Logger from "./logger";

config();

const mailLogger = new Logger("email");

const { MAIL_USER, MAIL_PASS, MAIL_FROM, MAIL_TO } = process.env;

// create transporter with mailgun credentials
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

const mailOpts = {
  from: MAIL_FROM,
};

export async function sendEmail({
  subject,
  text,
  html,
  to = MAIL_TO as string,
}: {
  subject: string;
  text?: string;
  html: string;
  to?: string;
}) {
  try {
    if (!to) {
      mailLogger.error("No email address provided");
      return null;
    }
    const info = await transporter.sendMail({
      ...mailOpts,
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (err) {
    mailLogger.error("Error sending mail: ", err);
    return null;
  }
}

const warningLogger = new Logger("warning");

export const sendWarningEmail = async (message: string, other: any) => {
  try {
    const { NODE_ENV } = process.env;
    if (!MAIL_TO) {
      mailLogger.error("Trying to send email without MAIL_TO set");
      return;
    }
    if (NODE_ENV === "development") {
      console.log("Warning email not sent in development mode");
      return;
    }
    const info = await sendEmail({
      to: MAIL_TO,
      subject: "Warning from Onyx",
      html: `
        <h2 style="color:red">Warning From Onyx:</h2>
        <p>${message}</p>
        <hr />
        <h4>Other Info:</h4>
        <p>${JSON.stringify(other)}</p>
      `,
    });
    if (info) {
      warningLogger.info("Warning email dispatched");
    }
    return info;
  } catch (err) {
    mailLogger.error("Error sending warning email: ", err);
    return;
  }
};
