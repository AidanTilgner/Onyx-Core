import { ActionResponse, ActionArgs } from "../index";
import { config } from "dotenv";
import { sendEmail } from "libs/email";
import ActionsInterfacer from "utilities/actions/interfacer";

config();

const interfacer = new ActionsInterfacer();
const { peopleInterface, datasourceInterface } = interfacer;

export const specific_user = async (
  props: ActionArgs
): Promise<ActionResponse> => {
  const {
    message = "Onyx would like your attention, check logs for more information.",
    user = process.env.DEFAULT_USERNAME,
    attachments,
    user_message, // this is probably bad code >:( <-- why did I comment this???
  } = props;

  const username =
    (await datasourceInterface
      .useQueries()
      .user.getUserWithMostSimilarUsername(user)
      .then((user) => user?.username)) || user;

  const html = `
    <div>
        <h1 style="color:#2256f2;">Onyx Notification</h1>
        <p>Intended for: ${username} | referenced as "${user}"</p>
        <hr />
        <br />
        <p>${user_message ? user_message : message}</p>
        <br />
        <hr />
        <p>Attached: </p>
        <ul>
            ${attachments
              ?.map((attachment: { [key: string]: any }) => {
                return `<li>${JSON.stringify(attachment)}</li>`;
              })
              .join("")}
        </ul>
    </div>
  `;

  const mailTo = process.env.MAIL_TO;

  const email = await sendEmail({
    to: mailTo,
    subject: "Onyx Notification",
    text: message,
    html,
  });

  return {
    success: true,
    action_response: `Sent notification to ${user}`,
    action_performed: "notifications.specific_user",
    data: email,
  };
};

const handle_business_message_inquiry = async ({
  name,
  email,
  message,
  confirmation_message,
  notification_message,
  email_to_notify,
  recieved_from,
  channel,
}: ActionArgs): Promise<ActionResponse> => {
  try {
    if (!name || !email || !message) {
      return {
        action_performed: "handle_business_message_inquiry",
        action_response: "error",
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
        action_performed: "handle_business_message_inquiry",
        action_response: "error",
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
        action_performed: "handle_business_message_inquiry",
        action_response: "error",
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
        action_performed: "handle_business_message_inquiry",
        action_response: "error",
        success: false,
        error: "Could not send confirmation email",
      };
    }

    return {
      action_performed: "handle_business_message_inquiry",
      action_response: "success",
      success: true,
      data: {
        confirmation_email_sent,
        notification_email_sent,
      },
    };
  } catch (err) {
    return {
      action_performed: "handle_business_message_inquiry",
      action_response: "error",
      success: false,
      error: err,
    };
  }
};

export default {
  specific_user,
  handle_business_message_inquiry,
};
