import { v4 as uuid4 } from "uuid";

class Session {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}

class SessionManager {
  readonly sessions: Map<string, Session> = new Map();
}

const manager = new SessionManager();

export const createSession = () => {
  const id = uuid4();
  const session = new Session(id, new Date(), new Date());
  manager.sessions.set(id, session);
  return session;
};
