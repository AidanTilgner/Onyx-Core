import Interfacer from "procedures/interfacer";
import Logger from "utils/logger";
import { sendEmail } from "utils/email";

const interfacer = new Interfacer();

const actions = interfacer.actionsInterface;

const triggerLogger = new Logger("triggers");

export const triggerActionFromTriggerString = async (
  actionString: string,
  ...args: any
) => {
  const actionResponse = await actions.performAction(actionString, args);
  if (!actionResponse) {
    triggerLogger.error(
      `Action '${actionString}' failed when called by trigger. See args:`,
      JSON.stringify(args)
    );
    return false;
  }
  triggerLogger.info(
    `Action '${actionString}' called by trigger. See args:`,
    JSON.stringify(args)
  );
  sendEmail({
    subject: `Action '${actionString}' called by trigger`,
    html: `Action '${actionString}' called by trigger. See args: ${JSON.stringify(
      args
    )}`,
  });

  return true;
};

export default {
  trigger_action_from_trigger_string: triggerActionFromTriggerString,
};
