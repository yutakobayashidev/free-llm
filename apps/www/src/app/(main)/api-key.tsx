"use client";

import { apiKeyAtom } from "@/atom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAtom } from "jotai";
import { ExternalLink, Key } from "lucide-react";
import { useState } from "react";

export default function APIDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setAPIKey] = useAtom(apiKeyAtom);
  const [accepted, setAccepted] = useState<boolean | "indeterminate">(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-[25px] right-[30px] h-fit rounded-full p-3.5 font-bold tracking-widest shadow-lg md:bottom-[130px]"
        >
          <Key />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">OpenAI APIキーを登録</DialogTitle>
          <DialogDescription>
            APIキーを登録すると、自身の負担でLLMを利用することができます。キーはローカルストレージに保存されます。
            <a className="text-blue-500" href="https://platform.openai.com/account/api-keys">
              APIキーの取得ページ
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <Input value={apiKey} onChange={(e) => setAPIKey(e.target.value)} placeholder="sk___" />
          <div className="flex w-full justify-between py-1">
            <div className="flex items-center space-x-2">
              <Checkbox
                onCheckedChange={(checked: boolean) => {
                  setAccepted(checked);
                }}
                id="terms"
              />
              <Label
                onClick={() => {
                  window.open("https://openai.com/policies/usage-policies", "_blank");
                }}
                htmlFor="terms"
                className="cursor-pointer"
              >
                OpenAIの利用ポリシーに同意する
              </Label>
              <ExternalLink className="ml-3 h-4 w-4" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!accepted}
            onClick={() => {
              setIsOpen(false);
              setAccepted(false);
            }}
          >
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
