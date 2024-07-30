import fs from "node:fs";
import { genHash } from "./__hash";
import { readMetaFile, writeMetaFile } from "./utils";

jest.mock("node:fs", () => ({
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("Should create a meta file using fs, sync", () => {
  const dir = genHash();
  writeMetaFile(dir);

  expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
});

test("Should use dir path when creating meta file", () => {
  const dir = genHash();
  writeMetaFile(dir);

  const call = (fs.writeFileSync as jest.Mock).mock.calls[0];
  expect(call[0]).toMatch(new RegExp(dir, "g"));
});

test("Should use hidden files name resolution", () => {
  writeMetaFile("folder");

  const call = (fs.writeFileSync as jest.Mock).mock.calls[0];
  expect(call[0]).toMatch(new RegExp(/folder\/.*$/g));
});

test("Should use current file iterator when writing meta", () => {
  const hash = genHash();
  const rand = Math.floor(Math.random() * 10_000);

  writeMetaFile(hash, rand);

  const call = (fs.writeFileSync as jest.Mock).mock.calls[0];
  expect(typeof call[1]).toBe("string");

  expect(call[1]).toContain(rand.toString());
});

test("Should use new line as param separator", () => {
  const hash = genHash();
  const rand = Math.floor(Math.random() * 10_000);

  writeMetaFile(hash, rand);

  const call = (fs.writeFileSync as jest.Mock).mock.calls[0];
  expect(typeof call[1]).toBe("string");
  expect(call[1]).toContain("\n");
});

test("Should return default metadata if could not access meta file", () => {
  fs.readFileSync = jest.fn(() => {
    throw new Error();
  });

  const hash = genHash();
  const res = readMetaFile(hash);
  expect(res[1]).toBe(0);
});

test("Should return default value if meta file is empty", () => {
  fs.readFileSync = jest.fn(() => "") as unknown as typeof fs.readFileSync;

  const hash = genHash();
  const res = readMetaFile(hash);
  expect(res[1]).toBe(0);
});

test("Should return default value if meta file invalid", () => {
  fs.readFileSync = jest.fn(() => "oi") as unknown as typeof fs.readFileSync;

  const hash = genHash();
  const res = readMetaFile(hash);
  expect(res[1]).toBe(0);
});

test("Should return default value if date empty", () => {
  fs.readFileSync = jest.fn(() => "\nmate") as unknown as typeof fs.readFileSync;

  const hash = genHash();
  const res = readMetaFile(hash);
  expect(res[1]).toBe(0);
});

test("Should return default value if date invalid", () => {
  fs.readFileSync = jest.fn(() => "oi\nmate") as unknown as typeof fs.readFileSync;

  const hash = genHash();
  const res = readMetaFile(hash);
  expect(res[1]).toBe(0);
});

test("Should return correct values", () => {
  const date = new Date().toISOString();
  const rand = Math.floor(Math.random() * 10_000);
  fs.readFileSync = jest.fn(
    () => `${date}\n${rand}`,
  ) as unknown as typeof fs.readFileSync;

  const hash = genHash();
  const res = readMetaFile(hash);

  expect(res[0].toISOString()).toBe(date);
  expect(res[1]).toBe(rand);
});
