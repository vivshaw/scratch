import SearchPanel, { SearchPanelProps } from "./SearchPanel";
import { fireEvent, render, screen } from "@testing-library/react";

// Test props for the component
const testProps: SearchPanelProps = {
  searchTerm: "",
  onChange: jest.fn(),
  onClear: jest.fn(),
};

test("displays a search field", async () => {
  render(<SearchPanel {...testProps} />);

  const searchField = screen.getByRole("textbox");

  expect(searchField).toBeInTheDocument;
});

test("displays a clear button", async () => {
  render(<SearchPanel {...testProps} />);

  const clearButton = screen.getByRole("button");

  expect(clearButton).toBeInTheDocument;
});

test("displays the search term", async () => {
  const searchTerm = "test term";
  render(<SearchPanel {...testProps} searchTerm={searchTerm} />);

  const searchField = screen.getByDisplayValue(searchTerm);

  expect(searchField).toBeInTheDocument;
});

test("calls setSearchTerm when the input is changed", async () => {
  render(<SearchPanel {...testProps} />);

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "test input" },
  });

  expect(testProps.onChange).toHaveBeenCalledTimes(1);
});

test("calls clearSearch when the clear button is clicked", async () => {
  render(<SearchPanel {...testProps} />);

  fireEvent.click(screen.getByRole("button"));

  expect(testProps.onClear).toHaveBeenCalledTimes(1);
});
