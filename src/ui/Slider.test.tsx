import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./Slider";

const fmt = (v: number) => `$${v}M`;

describe("Slider", () => {
  it("shows its value in words and tells assistive tech the same", () => {
    render(<Slider label="Sale" value={100} min={0} max={200} step={10} format={fmt} onChange={() => {}} />);
    expect(screen.getByText("$100M")).toBeTruthy();
    expect(screen.getByRole("slider", { name: "Sale" }).getAttribute("aria-valuetext")).toBe("$100M");
  });

  it("reports new values", () => {
    const onChange = vi.fn();
    render(<Slider label="Sale" value={100} min={0} max={200} step={10} format={fmt} onChange={onChange} />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: "150" } });
    expect(onChange).toHaveBeenCalledWith(150);
  });

  it("snaps to named stops so round numbers are reachable by keyboard", () => {
    const onChange = vi.fn();
    const stops = [0, 10, 100, 1000];
    render(<Slider label="Sale" value={100} stops={stops} format={fmt} onChange={onChange} />);
    const input = screen.getByRole("slider");
    expect(input.getAttribute("max")).toBe("3");
    expect((input as HTMLInputElement).value).toBe("2");
    fireEvent.change(input, { target: { value: "3" } });
    expect(onChange).toHaveBeenCalledWith(1000);
  });

  it("shows the letter it sets, and names it for assistive tech", () => {
    render(<Slider label="What the company sells for" letter="E" value={100} min={0} max={200} step={10} format={fmt} onChange={() => {}} />);
    expect(screen.getByRole("slider", { name: /E, the sale price.*sells for/ })).toBeTruthy();
  });
});
