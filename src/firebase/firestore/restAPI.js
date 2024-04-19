// How to convert firestore rest API respnose to a normal JSON object
// Copied from https://stackoverflow.com/questions/62246410/how-to-convert-a-firestore-document-to-plain-json-and-vice-versa

function toValue(field) {
  return "integerValue" in field
    ? Number(field.integerValue)
    : "doubleValue" in field
    ? Number(field.doubleValue)
    : "arrayValue" in field
    ? field.arrayValue.values.map(toValue)
    : "mapValue" in field
    ? toJSON(field.mapValue)
    : Object.entries(field)[0][1];
}

export function toJSON(doc) {
  return Object.fromEntries(
    Object.entries(doc.fields ?? {}).map(([key, field]) => [key, toValue(field)])
  );
}