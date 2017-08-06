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
export const ExportColumns = {
  "clubname": "Verein",
  "id": "Bestellung",
  "customer": "Kunde",
  "internalid": "Artikelnummer",
  "name": "Artikel",
  "colour": "Farbe",
  "flocking": "Beflockung",
  "size": "Größe"
};
export const ClubDisplayMode = {
  "0": "Versteckt",
  "1": "Bestellungen deaktiviert",
  "2": "Bestellungen aktiviert"
};
