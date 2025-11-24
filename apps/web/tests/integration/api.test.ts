import { describe, expect, it } from "vitest";

describe("API Routes", () => {
  it("should have health check endpoint", async () => {
    const response = await fetch("http://localhost:3000/api/health");
    expect(response.status).toBe(200);
  });
});
