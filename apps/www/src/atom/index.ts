import { type Model, models } from "@/config/models";
import { atomWithStorage } from "jotai/utils";

export const apiKeyAtom = atomWithStorage("apiKey", "");

export const systemPromptAtom = atomWithStorage("systemPrompt", "");
export const modelAtom = atomWithStorage<Model>("model", models[0]);
