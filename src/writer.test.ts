import fs from "node:fs";
import { MonoEffect } from "@bebrasmell/mono-logger";
import { genHash } from "./__hash";
import { WriterEffect } from "./writer";

jest.mock("./utils");
jest.mock("node:fs", () => ({
  existsSync: jest.fn(() => false),
  mkdirSync: jest.fn(),
  accessSync: jest.fn(),
  constants: { W_OK: 0 },
  createWriteStream: jest.fn(() => ({
    write: jest.fn(),
    close: jest.fn(),
  })),
  statSync: jest.fn(() => 0),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test("Should create a MonoEffect", () => {
  const effect = new WriterEffect();

  expect(effect).toBeInstanceOf(MonoEffect);
});

test("Should check if folder exists", () => {
  const hash = genHash();
  new WriterEffect({ path: hash });

  expect(fs.existsSync).toHaveBeenCalledWith(hash);
});

test("Should create folder if doesn't exist", () => {
  const hash = genHash();
  new WriterEffect({ path: hash });

  expect(fs.mkdirSync).toHaveBeenCalledWith(
    hash,
    expect.objectContaining({
      recursive: true,
    }),
  );
});

test("Should try to access folder with write permission", () => {
  fs.existsSync = jest.fn(() => true);

  const hash = genHash();
  new WriterEffect({ path: hash });

  expect(fs.accessSync).toHaveBeenCalled();
});

test("Should create WriteStream once when effect first executed", () => {
  const hash = genHash();
  const writer = new WriterEffect({ path: hash });

  writer.apply(new Date(), "debug", []);
  writer.apply(new Date(), "info", []);
  writer.apply(new Date(), "warn", []);

  expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
});

test("Should create new file when file is over max_file_size", () => {
  const hash = genHash();
  const writer = new WriterEffect({ path: hash, max_file_size: 1 });

  (fs.statSync as jest.Mock).mockImplementationOnce(() => 100);

  writer.apply(new Date(), "debug", []);
  writer.apply(new Date(), "info", []);
  writer.apply(new Date(), "warn", []);

  expect(fs.createWriteStream).toHaveBeenCalledTimes(1);
});
