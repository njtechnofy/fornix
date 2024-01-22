export const likeSearch = (word: string, text: string) => {
  const pattern = new RegExp(`.*${word}.*`, "i"); // 'i' flag for case-insensitive search
  return pattern.test(text);
};

export const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "PHP",
});
