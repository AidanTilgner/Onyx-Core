import { readFileSync } from "fs";
import { useOpenAIApi } from "libs/openai";
import { format } from "prettier";

const getExamplePost = () => {
  return readFileSync(
    "src/apps/blogger/application/data/example_post.md",
    "utf-8"
  );
};

class InitialArticlePrompt {
  private title: string;
  private description: string;
  private importantPoints: string[];
  private exampleReader: {
    description: string;
    occupation: string;
  };
  private initialPrompt: string;

  constructor({
    title,
    description,
    importantPoints,
    exampleReader,
    initialPrompt,
  }: {
    title: string;
    description: string;
    importantPoints: string[];
    exampleReader: {
      description: string;
      occupation: string;
    };
    initialPrompt: string;
  }) {
    this.title = title;
    this.description = description;
    this.importantPoints = importantPoints;
    this.exampleReader = exampleReader;
    this.initialPrompt = initialPrompt;
  }

  public getInitialPrompt() {
    return this.initialPrompt;
  }

  public getArticlePrompt() {
    return `
    Hello there! Can you please generate an article for me? I'm looking for something that will help my readers learn about ${
      this.title
    }. I've included some information below that might help you get started. Thanks!
    
    The title should be "${
      this.title
    }". Here's a short description of what I'm looking for:
    ${this.description}

    ${
      this.importantPoints.length > 0
        ? "Here are some important points that I'd like to see in the article:"
        : ""
    }
    ${this.importantPoints
      .map((p) => {
        return `* ${p}`;
      })
      .join("\n")}

    Here's some info about an example reader that I'm trying to reach:
    description: ${this.exampleReader.description}
    occupation: ${this.exampleReader.occupation}


    Now that you have a good idea of what I'm looking for, here's the format that the article should follow:
    _________________________________________________________________
    ${format(getExamplePost())}
    _________________________________________________________________
    Thank you in advance for your help! I'm looking forward to seeing what you come up with!
    `;
  }

  public getInitialMessages() {
    return [
      {
        content: this.getInitialPrompt(),
        role: "system",
      },
      {
        content: this.getArticlePrompt(),
        role: "user",
      },
    ];
  }
}

export const generateIntialArticle = async (info: {
  title: string;
  description: string;
  importantPoints: string[];
  exampleReader: {
    description: string;
    occupation: string;
  };
  initialPrompt: string;
}) => {
  try {
    const prompt = new InitialArticlePrompt(info);
  } catch (err) {
    console.error(err);
    return null;
  }
};
