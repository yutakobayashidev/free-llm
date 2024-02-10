import { differenceInMonths, format as formatfns, formatDistanceToNow, parseISO } from "date-fns";
import { ja } from "date-fns/locale";

export function formatDate(date: Date, format = "yyyy/MM/dd") {
  const isRecent = Math.abs(differenceInMonths(new Date(), date)) < 6;

  return isRecent ? formatDistanceToNow(date, { addSuffix: true, locale: ja }) : formatfns(date, format, { locale: ja });
}
