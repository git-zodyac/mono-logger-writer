export function genHash() {
  const ts = Math.floor(new Date().getTime() * Math.random() * 100000);
  return ts.toString(16).substring(8);
}
