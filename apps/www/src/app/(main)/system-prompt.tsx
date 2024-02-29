"use client";

import { systemPromptAtom } from "@/atom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAtom } from "jotai";

export default function SystemPrompt({
  openSystemModal,
  setOpenSystemModal,
}: { openSystemModal: boolean; setOpenSystemModal: (open: boolean) => void }) {
  const [system, SetSystem] = useAtom(systemPromptAtom);

  return (
    <Dialog open={openSystemModal} onOpenChange={setOpenSystemModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-3">システムプロンプトを登録</DialogTitle>
          <DialogDescription>
            システムプロンプトは、対話相手の役割を指定する時に使います。例えば、プロのエンジニアや、登山愛好家などです。
          </DialogDescription>
        </DialogHeader>
        <div>
          <Textarea
            rows={8}
            value={system}
            onChange={(e) => SetSystem(e.target.value)}
            placeholder="あなたはプロのJavaScriptエンジニアで、最新のWeb開発技術、フレームワーク、およびライブラリに精通しています。"
          />
        </div>
        <DialogFooter>
          <Button onClick={() => setOpenSystemModal(false)}>閉じる</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
