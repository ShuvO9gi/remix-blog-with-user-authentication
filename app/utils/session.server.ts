import bcrypt from "bcrypt";
import { db } from "./db.server";
import { createCookieSessionStorage, redirect } from "@remix-run/node";

interface RegisterProps {
  username: string;
  password: string;
}

//Login user
export async function Login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  //Check password
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

//Register new user
export async function register({ username, password }: RegisterProps) {
  const passwordHash = await bcrypt.hash(password, 10);

  return db.user.create({
    data: {
      username,
      passwordHash,
    },
  });
}

// Create session secret
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("No Secret Session");
}

// Create session storage
const storage = createCookieSessionStorage({
  cookie: {
    name: "remixblog_session",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 60,
    httpOnly: true,
  },
});

//Create user session
export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

//Get user session
export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

//Get logged in user
export async function getUser(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    return null;
  }
}

//Logout user and destroy session
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));

  return redirect("/auth/logout", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
