import { appendFile } from "fs";

class Logger {
  public type: string;
  constructor(type: string = "logs") {
    this.type = type;
  }

  private logLog = () => {
    const messageString = `[Logged] new log from type: ${this.type}`;
    appendFile(
      `storage/logs/log_recordings.txt`,
      messageString + "\n",
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  };

  private getDefaultLogString(message: string, ...args: any[]) {
    const datetimeString = new Date().toLocaleString();
    return `${datetimeString} | [${this.type}] ${message} ${args.join(" ")}`;
  }

  public log(message: string, ...args: any[]) {
    console.log(`[${this.type}] ${message}`, ...args);
    const messageString = this.getDefaultLogString(message, ...args);
    appendFile(`storage/logs/${this.type}.txt`, messageString + "\n", (err) => {
      if (err) {
        console.error(err);
      }
    });
    this.logLog();
  }

  public error(message: string, ...args: any[]) {
    console.error(`[${this.type}] ${message}`, ...args);
    const messageString = this.getDefaultLogString(message, ...args);
    appendFile(`storage/logs/${this.type}.txt`, messageString + "\n", (err) => {
      if (err) {
        console.error(err);
      }
    });
    this.logLog();
  }

  public info(message: string, ...args: any[]) {
    console.info(`[${this.type}] ${message}`, ...args);
    const messageString = this.getDefaultLogString(message, ...args);
    appendFile(`storage/logs/${this.type}.txt`, messageString + "\n", (err) => {
      if (err) {
        console.error(err);
      }
    });
    this.logLog();
  }
}

export default Logger;
