import { render, screen } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

test("displays a spinner", async () => {
  render(<LoadingSpinner />);

  const spinner = screen.getByRole("status");

  expect(spinner).toBeInTheDocument;
});

test("contains a11y text for screen readers", async () => {
  render(<LoadingSpinner />);

  const srText = screen.getByText("Loading...");

  expect(srText).toBeInTheDocument;
});
