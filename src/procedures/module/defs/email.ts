import type { ProcedureFunction } from "../index.d";
import { sendEmail } from "utils/email";
import { config } from "dotenv";

config();

const handle_business_message_inquiry: ProcedureFunction = async ({
  name,
  email,
  message,
  confirmation_message,
  notification_message,
  email_to_notify,
  recieved_from,
  channel,
}) => {
  try {
    if (!name || !email || !message) {
      return {
        procedure_performed: "handle_business_message_inquiry",
        procedure_response: "error",
        success: false,
        error: "Missing required fields. Required fields: name, email, message",
      };
    }

    const defaultConfirmationMessage = `
        Hey ${name},
        <br />
        <br />
        I'm Onyx, an automated digital assistant over at VVibrant. I just wanted to let you know that I've received your message
        and have relayed it to the team. We will get back to you as soon as possible.
        <br />
        <br />
        Thanks,
        <br />
        Onyx
    `;

    const messageToSend = confirmation_message || defaultConfirmationMessage;

    const defaultNotificationMessage = `
        Hey there,
        <br />
        <br />
        ${name} has sent you a message through ${
      channel || recieved_from
    }. Here's what they said:
        <br />
        <br />
        "${message}"
        <br />
        <br />
        You can reply to them at ${email}
        <br />
        <br />
        Thanks,
        <br />
        Onyx
    `;

    const notificationMessageToSend =
      notification_message || defaultNotificationMessage;

    const emailToNotify = email_to_notify || process.env.MAIL_TO;

    if (!emailToNotify) {
      return {
        procedure_performed: "handle_business_message_inquiry",
        procedure_response: "error",
        success: false,
        error: "No email to notify",
      };
    }

    const notification_email_sent = await sendEmail({
      to: emailToNotify,
      subject: `New message from ${name}`,
      html: notificationMessageToSend,
    });

    if (!notification_email_sent) {
      return {
        procedure_performed: "handle_business_message_inquiry",
        procedure_response: "error",
        success: false,
        error: "Could not send notification email",
      };
    }

    const confirmation_email_sent = await sendEmail({
      to: email,
      subject: "(noreply) Message received",
      html: messageToSend,
    });

    if (!confirmation_email_sent) {
      return {
        procedure_performed: "handle_business_message_inquiry",
        procedure_response: "error",
        success: false,
        error: "Could not send confirmation email",
      };
    }

    return {
      procedure_performed: "handle_business_message_inquiry",
      procedure_response: "success",
      success: true,
      data: {
        confirmation_email_sent,
        notification_email_sent,
      },
    };
  } catch (err) {
    return {
      procedure_performed: "handle_business_message_inquiry",
      procedure_response: "error",
      success: false,
      error: err,
    };
  }
};

export default {
  handle_business_message_inquiry,
};
