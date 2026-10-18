import { afterEach, describe, expect, it, vi } from "vitest";
import { createLocalStore } from "@/lib/store/localStore";

describe("createLocalStore", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("is empty until written, then reads the stored value", () => {
    const store = createLocalStore<string[]>("test:a");
    expect(store.read()).toBeNull();
    store.write(["x"]);
    expect(store.read()).toEqual(["x"]);
    expect(JSON.parse(localStorage.getItem("test:a")!)).toEqual(["x"]);
  });

  it("returns the same object while the stored value is unchanged", () => {
    const store = createLocalStore<string[]>("test:b");
    store.write(["x"]);
    expect(store.read()).toBe(store.read());
  });

  it("notifies subscribers on write and stops after unsubscribing", () => {
    const store = createLocalStore<number>("test:c");
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.write(1);
    unsubscribe();
    store.write(2);
    expect(listener).toHaveBeenCalledOnce();
  });

  it("keeps working in memory when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const store = createLocalStore<string>("test:d");
    store.write("kept");
    expect(store.read()).toBe("kept");
  });

  it("ignores corrupt stored data", () => {
    localStorage.setItem("test:e", "{not json");
    expect(createLocalStore("test:e").read()).toBeNull();
  });
});
