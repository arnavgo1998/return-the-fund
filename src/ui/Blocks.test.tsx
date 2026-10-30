import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Blocks } from "./Blocks";

const squares = (el: HTMLElement) => el.querySelectorAll("[data-square]");

describe("Blocks", () => {
  it("draws a fraction as a partial square, not a rounded one", () => {
    render(<Blocks count={1.25} color="you" label="1.25 squares" />);
    const img = screen.getByRole("img", { name: "1.25 squares" });
    expect(squares(img)).toHaveLength(2);
    expect(squares(img)[1].getAttribute("data-fraction")).toBe("0.25");
    expect(squares(img)[0].hasAttribute("data-fraction")).toBe(false);
  });

  it("draws nothing for zero", () => {
    render(<Blocks count={0} color="you" label="nothing" />);
    expect(squares(screen.getByRole("img", { name: "nothing" }))).toHaveLength(0);
  });

  it("draws whole counts exactly", () => {
    render(<Blocks count={100} color="ink" label="a hundred" perRow={10} />);
    expect(squares(screen.getByRole("img", { name: "a hundred" }))).toHaveLength(100);
  });
});
