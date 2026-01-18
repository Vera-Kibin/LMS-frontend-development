export function reOrder(items, from, to) {
  const arr = [...items];
  const odId = arr.findIndex((el) => el.id === from);
  const doId = arr.findIndex((el) => el.id === to);

  if (odId === -1 || doId === -1) return arr;
  const [removed] = arr.splice(odId, 1);
  arr.splice(doId, 0, removed);
  return arr;
}
