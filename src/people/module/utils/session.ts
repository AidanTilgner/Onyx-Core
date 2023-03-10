import { v4 } from "uuid";
import { getUser } from "../database/queries/users";

export class Session {
  private id: string;
  private user_id: number;
  private username: string | undefined;
  private email: string | undefined;

  constructor({
    id,
    user_id,
    username,
    email,
  }: {
    id: string;
    user_id: number;
    username: string | undefined;
    email: string | undefined;
  }) {
    this.id = id;
    this.user_id = user_id;
    this.username = username;
    this.email = email;
  }

  public getId() {
    return this.id;
  }

  public getUserId() {
    return this.user_id;
  }

  public getUsername() {
    return this.username;
  }
}

export class SessionManager {
  private sessions: Map<string, Session> = new Map();

  public createSession({
    user_id,
    username,
    email,
  }: {
    user_id: number;
    username: string | undefined;
    email: string | undefined;
  }): Session {
    const id = v4();
    const session = new Session({ id, user_id, username, email });
    this.sessions.set(id, session);
    return session;
  }

  public getSession(id: string): Session | undefined {
    return this.sessions.get(id);
  }

  public getSessionFromUsername(username: string) {
    return Array.from(this.sessions.values()).find(
      (session) => session.getUsername() === username
    );
  }

  public async getOrCreateSessionFromUsername(username: string) {
    const session = this.getSession(username);
    if (session) {
      return session;
    }
    const user = await getUser(username);
    if (!user || !user.id) {
      return undefined;
    }
    return this.createSession({
      user_id: user?.id,
      username: user.username,
      email: user.email || undefined,
    });
  }
}

export const manager = new SessionManager();
