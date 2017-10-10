/*  REGEX  */
export const SizeRegex = /(?: *\,* *((?: *[^\n\r\,\ ]+ *)+) *\,* *)/g;

/*  ENUMS  */
export const FlockingTypes = {
  "0": "benutzerdefiniert",
  "1": "vorgegeben"
};
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
  "flockingName": "Beflockung Name",
  "flockingLogo": "Beflockung Logo",
  "size": "Größe"
};
export const ClubDisplayMode = {
  "0": "Versteckt",
  "1": "Bestellungen deaktiviert",
  "2": "Bestellungen aktiviert"
};

export const asObjects = function(scope) {
  var objects = [];
  for(var i in scope) {
    objects.push({
      key: i,
      value: scope[i]
    });
  }
  return objects;
};
