import { customAlphabet } from "nanoid";
export const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
export const generateOrderNumber = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const nanoId = customAlphabet(alphabet);
  return nanoId(10);
};
export const isAvailableForTransfer = () => {
  const now = new Date();
  const ubTime = new Intl.DateTimeFormat("en-us", {
    timeZone: "Asia/Ulaanbaatar",
    hour: "numeric",
    hourCycle: "h23",
  }).format(now);
  const hourUb = parseInt(ubTime, 10);
  console.log(hourUb);
  return hourUb >= 8 && hourUb <= 22;
};
