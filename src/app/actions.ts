"use server";

import { signIn } from "@/auth";

export async function authenticate() {
  try {
    await signIn("discord");
    return true;
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return false;
    }
    throw error;
  }
}
