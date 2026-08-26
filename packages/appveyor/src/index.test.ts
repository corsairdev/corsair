import { describe, expect, it } from "vitest";
import { AppVeyorClient } from "./index";

describe("AppVeyorClient", () => {
  it("throws an error when initialized without an API key", () => {
    expect(() => new AppVeyorClient({ apiKey: "" })).toThrow("AppVeyor API key is required.");
  });

  it("instantiates correctly with valid configuration", () => {
    const client = new AppVeyorClient({ apiKey: "test-token" });
    expect(client).toBeInstanceOf(AppVeyorClient);
  });
});
