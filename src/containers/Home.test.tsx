import React, { FunctionComponent, ReactElement } from "react";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { AppContext } from "../libs/contextLib";
import Home from "./Home";
import { MemoryRouter } from "react-router-dom";
import { notesFixture } from "../testFixtures";
import { rest } from "msw";
import { setupServer } from "msw/node";

// Wrapper for Home screen tests
const testAppContext = {
  value: { isAuthenticated: true, userHasAuthenticated: jest.fn() },
};

const AllProviders: FunctionComponent = ({ children }) => {
  return (
    <MemoryRouter>
      <AppContext.Provider {...testAppContext}>{children}</AppContext.Provider>
    </MemoryRouter>
  );
};

const renderWrapped = (ui: ReactElement) =>
  render(ui, { wrapper: AllProviders });

/* We'll use Mock Service Worker to fake an AWS response from our API.
 * Since we're doing a GET at the `/notes` endpoint,
 * we can just fake a 200 with some fixture data containing some notes.
 */
const server = setupServer(
  rest.get(
    "https://api.serverless-stack.seed-demo.club/dev/notes",
    (req, res, ctx) => {
      return res(ctx.json(notesFixture));
    }
  )
);

/* MSW setup: initialize before tests, reset between tests, and clean up
 * when we're done.
 */
beforeAll(() => {
  server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/* Test the spinners */
test("displays a spinner while loading", async () => {
  /* We need to mock the auth context to get to the notes screen.
   * We also need to provide a React Router instance so our
   * LinkContainers can load. We'll do the same for the other Home tests.
   */
  renderWrapped(<Home />);

  const spinner = screen.getByRole("status");

  expect(spinner).toBeInTheDocument;
});

test("displays the Notes section once loaded", async () => {
  renderWrapped(<Home />);

  const createNoteLink = await screen.findByRole("link", {
    name: "Create a new note",
  });

  expect(createNoteLink).toBeInTheDocument;
});

test("removes the spinner once loaded", async () => {
  renderWrapped(<Home />);

  const spinner = screen.getByRole("status");

  await waitForElementToBeRemoved(spinner);

  expect(spinner).not.toBeInTheDocument;
});

/* Test the search functionality */
test("displays a search button", async () => {
  renderWrapped(<Home />);

  const searchButton = await screen.findByRole("button", { name: "Search" });

  expect(searchButton).toBeInTheDocument;
});

test("instead displays a close button after clicking the search button", async () => {
  renderWrapped(<Home />);

  const searchButton = await screen.findByRole("button", { name: "Search" });
  fireEvent.click(searchButton);

  expect(searchButton).not.toBeInTheDocument;

  const closeButton = await screen.findByRole("button", {
    name: "Close",
  });
  expect(closeButton).toBeInTheDocument;
});

test("displays the search panel after clicking the search button", async () => {
  renderWrapped(<Home />);

  const searchButton = await screen.findByRole("button", { name: "Search" });
  fireEvent.click(searchButton);

  const searchBox = await screen.findByRole("textbox", {
    name: "Search",
  });
  expect(searchBox).toBeInTheDocument;
});

test("closes the search once the close button is clicked", async () => {
  renderWrapped(<Home />);

  const searchButton = await screen.findByRole("button", { name: "Search" });

  fireEvent.click(searchButton);
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Close",
    })
  );

  expect(searchButton).toBeInTheDocument;
});

/* Test the find & replace functionality */
test("displays a find & replace button", async () => {
  renderWrapped(<Home />);

  const findReplaceButton = await screen.findByRole("button", {
    name: "Find & Replace",
  });

  expect(findReplaceButton).toBeInTheDocument;
});

test("instead displays a close button after clicking the find & replace button", async () => {
  renderWrapped(<Home />);

  const findReplaceButton = await screen.findByRole("button", {
    name: "Find & Replace",
  });
  fireEvent.click(findReplaceButton);

  expect(findReplaceButton).not.toBeInTheDocument;

  const closeButton = await screen.findByRole("button", {
    name: "Close",
  });
  expect(closeButton).toBeInTheDocument;
});

test("closes the find & replace once the close button is clicked", async () => {
  renderWrapped(<Home />);

  const findReplaceButton = await screen.findByRole("button", {
    name: "Find & Replace",
  });
  fireEvent.click(findReplaceButton);

  fireEvent.click(
    await screen.findByRole("button", {
      name: "Close",
    })
  );

  expect(findReplaceButton).toBeInTheDocument;
});
