import { ActionResponse, ActionArgs } from "../index";
import { config } from "dotenv";
import { sendEmail } from "utils/email";
import ActionsInterfacer from "actions/interfacer";

config();

const people = new ActionsInterfacer().peopleInterface;

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
    (await people.dbQueries.userQueries
      .getUserWithMostSimilarUsername(user)
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

export default {
  specific_user,
};
