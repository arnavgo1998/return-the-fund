import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { M4Rounds } from "./M4Rounds";

const t = (id: string) => screen.getByTestId(id).textContent;

describe("Model 4: other investors arrive", () => {
  it("starts at the seed: 100 squares, 10% yours", () => {
    render(<M4Rounds />);
    expect(screen.getByRole("button", { name: "Seed" }).getAttribute("aria-pressed")).toBe("true");
    expect(t("total-squares")).toBe("100");
    expect(t("your-share")).toBe("10%");
  });

  it("adds 25 squares in Series A", () => {
    render(<M4Rounds />);
    fireEvent.click(screen.getByRole("button", { name: "Series A" }));
    expect(screen.getByRole("button", { name: "Series A" }).getAttribute("aria-pressed")).toBe("true");
    expect(t("total-squares")).toBe("125");
    expect(t("your-share")).toBe("8%");
  });

  it("prices Series B and moves the napkin", () => {
    render(<M4Rounds />);
    fireEvent.click(screen.getByRole("button", { name: "Series B" }));
    expect(t("total-squares")).toBe("150");
    expect(t("your-share")).toBe("6.7%");
    expect(t("pre-money")).toBe("$100M");
    expect(t("post-money")).toBe("$120M");
    expect(t("exit-small")).toBe("$150M");
    expect(t("exit-big")).toBe("$1.5B");
  });

  it("states the rule", () => {
    render(<M4Rounds />);
    expect(screen.getByText("Every round adds squares and never removes yours. Use the share you'll have at the end.")).toBeTruthy();
  });
});
