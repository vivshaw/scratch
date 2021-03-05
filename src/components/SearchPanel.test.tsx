import { render, screen } from "@testing-library/react";
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
    <SearchPanel
      searchTerm=""
      setSearchTerm={setSearchTerm}
      clearSearch={clearSearch}
    />
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
      setSearchTerm={setSearchTerm}
      clearSearch={clearSearch}
    />
  );

  const searchField = screen.getByDisplayValue(searchTerm);

  expect(searchField).toBeInTheDocument;
});
