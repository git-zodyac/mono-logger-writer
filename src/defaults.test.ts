import { genHash } from "./__hash";
import { DEFAULT_FILENAME, DEFAULT_TRANSFORMER } from "./defaults";

test("Should create a string filename", () => {
  const res = DEFAULT_FILENAME(new Date(), 0);
  expect(typeof res).toBe("string");
});

test("Should create a string record", () => {
  const res = DEFAULT_TRANSFORMER(new Date(), "debug", []);
  expect(typeof res).toBe("string");
});

test("Should create a record using all contents", () => {
  const contents = new Array(Math.floor(Math.random() * 10)).fill("").map(genHash);
  const res = DEFAULT_TRANSFORMER(new Date(), "debug", [], ...contents);
  for (const c of contents) {
    expect(res).toContain(c);
  }
});

test("Should create a record using stringified objects", () => {
  const contents: any[] = new Array(Math.floor(Math.random() * 10)).fill("").map(genHash);
  JSON.stringify = jest.fn();

  contents.push({ oi: "mate" });
  const res = DEFAULT_TRANSFORMER(new Date(), "debug", [], ...contents);

  expect(JSON.stringify).toHaveBeenCalled();
});
