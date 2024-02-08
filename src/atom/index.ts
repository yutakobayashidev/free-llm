import { atomWithStorage } from "jotai/utils";

export const apiKeyAtom = atomWithStorage("apiKey", "");

export const systemPromptAtom = atomWithStorage("systemPrompt", "null");
export const modelAtom = atomWithStorage("model", "gpt-3.5-turbo");
