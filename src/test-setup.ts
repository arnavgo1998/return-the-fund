import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
afterEach(() => cleanup());
// jsdom doesn't scroll; the page switch calls this.
window.scrollTo = () => {};
