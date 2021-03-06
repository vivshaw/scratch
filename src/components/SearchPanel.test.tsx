import { render, screen, fireEvent } from "@testing-library/react";
import SearchPanel from "./SearchPanel";

test("displays a search field", async () => {
  const searchTerm = "";
  const setSearchTerm = jest.fn();
  const clearSearch = jest.fn();
  render(
    <SearchPanel
      searchTerm=""
      setSearchTerm={setSearchTerm}
      clearSearch={clearSearch}
    />
  );

  const searchField = screen.getByRole("textbox");

  expect(searchField).toBeInTheDocument;
});

test("displays a clear button", async () => {
  const searchTerm = "";
  const setSearchTerm = jest.fn();
  const clearSearch = jest.fn();
  render(
    <SearchPanel searchTerm="" onChange={setSearchTerm} onClear={clearSearch} />
  );

  const clearButton = screen.getByRole("button");

  expect(clearButton).toBeInTheDocument;
});

test("displays the search term", async () => {
  const searchTerm = "test term";
  const setSearchTerm = jest.fn();
  const clearSearch = jest.fn();
  render(
    <SearchPanel
      searchTerm={searchTerm}
      onChange={setSearchTerm}
      onClear={clearSearch}
    />
  );

  const searchField = screen.getByDisplayValue(searchTerm);

  expect(searchField).toBeInTheDocument;
});

test("calls setSearchTerm when the input is changed", async () => {
  const searchTerm = "";
  const setSearchTerm = jest.fn();
  const clearSearch = jest.fn();
  render(
    <SearchPanel
      searchTerm={searchTerm}
      onChange={setSearchTerm}
      onClear={clearSearch}
    />
  );

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "test input" },
  });

  expect(setSearchTerm).toHaveBeenCalledTimes(1);
});

test("calls clearSearch when the clear button is clicked", async () => {
  const searchTerm = "";
  const setSearchTerm = jest.fn();
  const clearSearch = jest.fn();
  render(
    <SearchPanel
      searchTerm={searchTerm}
      onChange={setSearchTerm}
      onClear={clearSearch}
    />
  );

  fireEvent.click(screen.getByRole("button"));

  expect(clearSearch).toHaveBeenCalledTimes(1);
});
