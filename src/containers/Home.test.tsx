import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { AppContext } from "../libs/contextLib";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import { notesFixture } from "../testFixtures";

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

/* This one has a `Can't perform a React state update on an unmounted component.`
 * warning due to how the initial useEffect hook was written. It will fire even
 * if the component was removed!
 */
test("displays a spinner while loading", async () => {
  /* We need to mock the auth context to get to the notes screen.
   * We also need to provide a React Router instance so our
   * LinkContainers can load. We'll do the same for the other Home tests.
   */
  render(
    <AppContext.Provider
      value={{ isAuthenticated: true, userHasAuthenticated: () => {} }}
    >
      <Home />
    </AppContext.Provider>,
    { wrapper: MemoryRouter }
  );

  const spinner = screen.getByRole("status");

  expect(spinner).toBeInTheDocument;
});

test("removes the spinner once loaded", async () => {
  render(
    <AppContext.Provider
      value={{ isAuthenticated: true, userHasAuthenticated: () => {} }}
    >
      <Home />
    </AppContext.Provider>,
    { wrapper: MemoryRouter }
  );

  const spinner = screen.getByRole("status");

  await waitForElementToBeRemoved(spinner);

  expect(spinner).not.toBeInTheDocument;
});

test("displays the Notes section once loaded", async () => {
  render(
    <AppContext.Provider
      value={{ isAuthenticated: true, userHasAuthenticated: () => {} }}
    >
      <Home />
    </AppContext.Provider>,
    { wrapper: MemoryRouter }
  );

  const createNoteButton = await screen.findByText("Create a new note");

  expect(createNoteButton).toBeInTheDocument;
});