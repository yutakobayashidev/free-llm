import { useState } from "react";
import { toast } from "sonner";

export const useCopyToClipboard = (): [boolean, (text: string) => void] => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000); // 3秒後に状態をリセット
      })
      .catch((err) => {
        toast.error("コピーに失敗しました", err);
      });
  };

  return [copied, copyToClipboard];
};
