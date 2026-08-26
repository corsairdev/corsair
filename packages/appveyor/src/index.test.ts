import { describe, expect, it, vi, beforeEach } from "vitest";
import { AppVeyorClient } from "./index";

describe("AppVeyorClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws an error when initialized without an API key", () => {
    expect(() => new AppVeyorClient({ apiKey: "" })).toThrow("AppVeyor API key is required.");
  });

  it("instantiates correctly with valid configuration", () => {
    const client = new AppVeyorClient({ apiKey: "test-token" });
    expect(client).toBeInstanceOf(AppVeyorClient);
  });

  it("fetches projects list successfully", async () => {
    const mockProjects = [{ projectId: 1, accountName: "test", name: "repo", slug: "repo", repositoryType: "git", repositoryName: "org/repo" }];
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProjects,
    } as Response);

    const client = new AppVeyorClient({ apiKey: "test-token" });
    const result = await client.getProjects();
    expect(result).toEqual(mockProjects);
    expect(global.fetch).toHaveBeenCalledWith("https://ci.appveyor.com/api/projects", expect.any(Object));
  });

  it("fetches the last build status for a project", async () => {
    const mockBuildData = {
      project: { projectId: 1, accountName: "test", name: "repo", slug: "repo", repositoryType: "git", repositoryName: "org/repo" },
      build: { buildId: 101, buildNumber: 5, version: "1.0.5", message: "Initial commit", branch: "main", status: "success" }
    };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBuildData,
    } as Response);

    const client = new AppVeyorClient({ apiKey: "test-token" });
    const result = await client.getLastBuild("test", "repo");
    expect(result.build.status).toBe("success");
    expect(result.build.buildNumber).toBe(5);
  });

  it("throws formatted error when API request fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: async () => "Project not found",
    } as Response);

    const client = new AppVeyorClient({ apiKey: "test-token" });
    await expect(client.getLastBuild("test", "nonexistent")).rejects.toThrow("AppVeyor API Error");
  });
});
