"use server";

import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { PublishStatus } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const updatePublishStatus = async (id: string, status: PublishStatus) => {
  await db.update(schema.chats).set({ publishStatus: status }).where(eq(schema.chats.id, id));

  revalidatePath("/hub");
};
