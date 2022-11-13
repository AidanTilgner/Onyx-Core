import { writeFile } from "fs";

class Logger {
  public type: string;
  constructor(type: string = "web") {
    this.type = type;
  }

  public log(message: string, ...args: any[]) {
    console.log(`[${this.type}] ${message}`, ...args);
    const messageString = `[${this.type}] ${message} ${args.join(" ")}`;
    writeFile(`storage/logs/${this.type}.txt`, messageString, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  public error(message: string, ...args: any[]) {
    console.error(`[${this.type}] ${message}`, ...args);
    const messageString = `[${this.type}] ${message} ${args.join(" ")}`;
    writeFile(`storage/logs/${this.type}.txt`, messageString, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

export default Logger;
