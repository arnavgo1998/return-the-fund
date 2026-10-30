import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { F6Clawback, REST_STOPS } from "./F6Clawback";

const t = (id: string) => screen.getByTestId(id).textContent;
const setRest = (v: number) =>
  fireEvent.change(screen.getByRole("slider", { name: /rest of the fund/i }), { target: { value: String(REST_STOPS.indexOf(v)) } });

describe("Part two, model 6: carry taken too early", () => {
  it("takes carry on the early sale straight away", () => {
    render(<F6Clawback />);
    expect(t("f6c-taken")).toBe("20% × ($150M − $10M) = $28M");
  });

  it("gives back what was taken above the whole-fund carry", () => {
    render(<F6Clawback />);
    expect(t("f6c-owed")).toBe("20% × ($180M − $100M) = $16M");
    expect(t("f6c-back")).toBe("$28M − $16M = $12M");
    setRest(0);
    expect(t("f6c-owed")).toBe("20% × ($150M − $100M) = $10M");
    expect(t("f6c-back")).toBe("$28M − $10M = $18M");
  });

  it("owes you the rest when the fund does well", () => {
    render(<F6Clawback />);
    setRest(100);
    expect(t("f6c-back")).toBe("$0");
    expect(t("f6c-due")).toBe("$30M − $28M = $2M");
  });

  it("states the rule", () => {
    render(<F6Clawback />);
    expect(screen.getByText("Carry taken early is only borrowed until the LPs are whole.")).toBeTruthy();
  });
});
