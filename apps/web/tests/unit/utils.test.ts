import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils", () => {
  describe("cn (className utility)", () => {
    it("should merge class names", () => {
      const result = cn("class1", "class2");
      expect(result).toContain("class1");
      expect(result).toContain("class2");
    });

    it("should handle conditional classes", () => {
      const result = cn("base", true && "conditional");
      expect(result).toContain("base");
      expect(result).toContain("conditional");
    });

    it("should handle false conditional classes", () => {
      const result = cn("base", false && "conditional");
      expect(result).toContain("base");
      expect(result).not.toContain("conditional");
    });
  });
});
