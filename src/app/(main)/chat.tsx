"use client";

import HF from "@/assets/logos/hf-logo.svg";
import OpenAI from "@/assets/logos/openai.svg";
import { apiKeyAtom, modelAtom, systemPromptAtom } from "@/atom";
import ChatMessage from "@/components/message";
import Onboarding from "@/components/onboarding";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { type Model, models } from "@/config/models";
import { useKuromoji } from "@/hooks/useKuromoji";
import { cn } from "@/lib/utils";
import { isKanji, kanaToHira } from "@/lib/utils";
import { type Message, useChat } from "ai/react";
import { useAtom, useAtomValue } from "jotai";
import { Check, ChevronUp } from "lucide-react";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ModelItemProps {
  model: Model;
  isSelected: boolean;
  onSelect: () => void;
  onPeek: (model: Model) => void;
}

export const useMutationObserver = (
  ref: React.MutableRefObject<HTMLElement | null>,
  callback: MutationCallback,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  },
) => {
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback);
      observer.observe(ref.current, options);
      return () => observer.disconnect();
    }
  }, [ref, callback, options]);
};

function ModelItem({ model, isSelected, onSelect, onPeek }: ModelItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "aria-selected") {
          onPeek(model);
        }
      }
    }
  });

  return (
    <CommandItem
      key={model.id}
      onSelect={onSelect}
      ref={ref}
      className="aria-selected:bg-primary flex items-center aria-selected:text-primary-foreground"
    >
      {model.provider === "openai" ? <OpenAI className="h-4 w-4 mr-1" /> : <HF className="h-4 w-4 mr-1" />}
      <p className="line-clamp-1 text-sm">{model.name}</p>
      <Check className={cn("ml-auto h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
    </CommandItem>
  );
}

export function ModelSelector({ models }: { models: Model[] }) {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useAtom(modelAtom);
  const [peekedModel, setPeekedModel] = useState<Model>(models[0]);

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <Label htmlFor="model">Model</Label>
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          The model which will generate the completion. Some models are suitable for natural language tasks, others specialize in code.
          Learn more.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} aria-label="Select a model" className="w-full justify-between">
            <div className="flex items-center">
              {selectedModel.provider === "openai" ? (
                <OpenAI className="h-4 w-4 mr-1" />
              ) : selectedModel.provider === "huggingface" ? (
                <HF className="h-4 w-4 mr-1" />
              ) : (
                ""
              )}
              {selectedModel ? selectedModel.name : "モデルを検索..."}
            </div>
            <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <HoverCard>
            <HoverCardContent side="left" align="start" forceMount className="min-h-[280px]">
              <div className="grid gap-2">
                <h4 className="font-medium flex items-center leading-none">
                  {peekedModel.provider === "openai" ? <OpenAI className="h-4 w-4 mr-1" /> : <HF className="h-4 w-4 mr-1" />}
                  {peekedModel.name}
                </h4>
                <div className="text-sm text-muted-foreground">{peekedModel.description}</div>
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder="Search Models..." />
                <CommandEmpty>モデルが見つかりません</CommandEmpty>
                <HoverCardTrigger />
                <CommandGroup>
                  {models.map((model) => (
                    <ModelItem
                      key={model.id}
                      model={model}
                      isSelected={selectedModel.name === model.name}
                      onPeek={(model) => setPeekedModel(model)}
                      onSelect={() => {
                        setSelectedModel(model);
                        setOpen(false);
                      }}
                    />
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function Chat({ session, id, initialMessages }: { session: Session; id: string; initialMessages?: Message[] }) {
  const apiKey = useAtomValue(apiKeyAtom);
  const system = useAtomValue(systemPromptAtom);
  const model = useAtomValue(modelAtom);

  const { isTokenizerReady, tokenizer } = useKuromoji();
  const path = usePathname();

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id,
    initialMessages,
    body: {
      model,
      api_key: apiKey,
      system,
      id,
    },
    onError: (err) => {
      toast.error(err.message);
    },
    onFinish() {
      if (!path.includes("chat")) {
        window.history.pushState({}, "", `/chat/${id}`);
      }
    },
  });

  const [lastReadPosition, setLastReadPosition] = useState(0);

  const [isRuby, setIsRuby] = useState(false);
  const [ruby, setRuby] = useState<{ content: string }[]>([]);

  useEffect(() => {
    const generateRuby = async () => {
      if (tokenizer) {
        const newRubyKids = [];
        for (const message of messages) {
          const text = message.role === "user" ? message.content : message.content || "";

          let rubyText = "";
          text.split("`").forEach((segment, index) => {
            if (index % 2 === 0) {
              // Outside a code block
              const tokens = tokenizer.tokenize(segment);
              rubyText += tokens
                // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
                .map((token) => {
                  const surface = token.surface_form;
                  const reading = token.reading;
                  if (!reading || message.role === "user") {
                    return surface;
                  }
                  const hiraReading = kanaToHira(reading);
                  if (surface.split("").some(isKanji)) {
                    return `<ruby>${surface}<rt>${hiraReading}</rt></ruby>`;
                  }
                  return surface;
                })
                .join("");
            } else {
              // Inside a code block
              rubyText += `\`${segment}\``;
            }
          });

          newRubyKids.push({ content: rubyText });
          setRuby(newRubyKids);
        }
      }
    };
    generateRuby();
  }, [tokenizer, messages]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant") {
        const newContent = lastMessage.content.substring(lastReadPosition);
        speakText(newContent);
        setLastReadPosition(lastMessage.content.length);
      }
    }
  }, [messages, lastReadPosition]);

  const speakText = (text: string) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className="main-content w-full overflow-y-auto py-5 px-10">
        <ModelSelector models={models} />
        <div className="mt-6">
          {messages.length === 0 ? (
            <Onboarding user={session.user} />
          ) : (
            <div className="space-y-4">
              {messages.map((message, i) => (
                <ChatMessage isRuby={isRuby} ruby={ruby[i]?.content} session={session} key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>
        <form className="w-full py-5" onSubmit={handleSubmit}>
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Answer to the Ultimate Question of Life, the Universe, and Everything"
          />
          <div className="flex items-center mt-5 gap-x-3">
            <Button type="submit">送信</Button>
            <div className="flex items-center space-x-2">
              <Switch disabled={!isTokenizerReady} onCheckedChange={() => setIsRuby(!isRuby)} id="ruby" />
              <Label htmlFor="ruby"> {isRuby ? "ふりがなを非表示" : "ふりがなを表示"}</Label>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
