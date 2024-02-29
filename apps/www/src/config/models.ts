export type Provider = "openai" | "huggingface";

export interface Model {
  id: number;
  name: string;
  provider: Provider;
  description: string;
}

export const models: Model[] = [
  {
    id: 1,
    provider: "openai",
    name: "gpt-3.5-turbo",
    description: "A set of models that improve on GPT-3.5 and can understand as well as generate natural language or code",
  },
  {
    id: 2,
    provider: "openai",
    name: "gpt-4-0125-preview",
    description:
      "The latest GPT-4 model intended to reduce cases of “laziness” where the model doesn’t complete a task. Returns a maximum of 4,096 output tokens.",
  },
  {
    id: 3,
    provider: "huggingface",
    name: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    description:
      "This is the 4th iteration English supervised-fine-tuning (SFT) model of the Open-Assistant project. It is based on a Pythia 12B that was fine-tuned on human demonstrations of assistant conversations collected through the https://open-assistant.io/ human feedback web app before March 25, 2023.",
  },
];

export function findProviderByName(modelName: string): Provider | null {
  const model = models.find((model) => model.name === modelName);
  if (model) {
    return model.provider;
  }
  return null;
}
