/*  REGEX  */
export const SizeRegex = /(?: *\,* *((?: *[^\n\r\,\ ]+ *)+) *\,* *)/g;

/*  ENUMS  */
export const OrderStatus = {
  pending: "ausstehend",
  accepted: "bestätigt",
  recorded: "exportiert",
  received: "erhalten",
  done: "erledigt"
};
