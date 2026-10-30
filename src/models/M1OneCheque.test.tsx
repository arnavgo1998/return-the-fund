import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { M1OneCheque } from "./M1OneCheque";
import { EXIT_STOPS } from "./stops";

const setSale = (v: number) =>
  fireEvent.change(screen.getByRole("slider", { name: /sells for/i }), { target: { value: String(EXIT_STOPS.indexOf(v)) } });

describe("Model 1: one cheque", () => {
  it("returns ten per cent of the sale, in blocks", () => {
    render(<M1OneCheque />);
    expect(screen.getByText(/10 blocks back/)).toBeTruthy();
    setSale(1000);
    expect(screen.getByText(/100 blocks back/)).toBeTruthy();
    setSale(0);
    expect(screen.getByText(/0 blocks back/)).toBeTruthy();
  });

  it("states the rule", () => {
    render(<M1OneCheque />);
    expect(screen.getByText("The most you can lose is the cheque. What you can win is your share × the sale, with no ceiling.")).toBeTruthy();
  });
});
