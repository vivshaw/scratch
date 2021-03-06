import React, { FunctionComponent, ReactElement } from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { AppContext } from "../libs/contextLib";
import AuthenticatedRoute from "../components/AuthenticatedRoute";
import { MemoryRouter } from "react-router-dom";
import Notes from "./Notes";
import { notesFixture } from "../testFixtures";
import { rest } from "msw";
import { setupServer } from "msw/node";

// We'll use this particular note for our tests.
const testNote = notesFixture[0];

// Wrapper for Notes screen tests
const testAppContext = {
  value: { isAuthenticated: true, userHasAuthenticated: jest.fn() },
};

/* We need to mock the auth context to get to the note screen.
 * We also need to do some funky mocking to get the `useParams` to
 * think we're on a route and pass the appropriate note id.
 */
const AllProviders: FunctionComponent = ({ children }) => {
  return (
    <MemoryRouter initialEntries={[`/notes/${testNote.noteId}`]}>
      <AppContext.Provider {...testAppContext}>
        <AuthenticatedRoute exact path="/notes/:id">
          {children}
        </AuthenticatedRoute>
      </AppContext.Provider>
    </MemoryRouter>
  );
};

const renderWrapped = (ui: ReactElement) =>
  render(ui, { wrapper: AllProviders });

/* We'll use Mock Service Worker to fake an AWS response from our API.
 * Since we're doing a GET at the `/notes/:id` endpoint,
 * we fake a 200 with one note.
 */
const server = setupServer(
  rest.get(
    `https://api.serverless-stack.seed-demo.club/dev/notes/${testNote.noteId}`,
    (req, res, ctx) => {
      return res(ctx.json(testNote));
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
test("displays a spinner on initial load", async () => {
  /* We need to mock the auth context to get to the note screen.
   * We also need to do some funky mocking to get the `useParams` to
   * think we're on a route and pass the appropriate note id.
   */
  renderWrapped(<Notes />);

  const spinner = screen.getByRole("status");

  expect(spinner).toBeInTheDocument;
});

test("removes the spinner after loading", async () => {
  renderWrapped(<Notes />);

  const spinner = screen.getByRole("status");

  await waitForElementToBeRemoved(spinner);

  expect(spinner).not.toBeInTheDocument;
});

test("displays the note once loaded", async () => {
  renderWrapped(<Notes />);

  const noteTextbox = await screen.findByRole("textbox");

  expect(noteTextbox).toBeInTheDocument;
});
