/*  REGEX  */
export const SizeRegex = /(?: *\,* *((?: *[^\n\r\,\ ]+ *)+) *\,* *)/g;

/*  ENUMS  */
export const OrderStatus = {
  "-1": "storniert",
  "0": "unbestätigt",
  "1": "offen",
  "2": "bestellt",
  "3": "erledigt"
};
export const ItemStatus = {
  "-1": "",
  "0": "bestellt",
  "1": "verspätet",
  "2": "erhalten",
  "3": "erledigt"
};
