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
import Notes from "./Notes";
import { notesFixture } from "../testFixtures";
import AuthenticatedRoute from "../components/AuthenticatedRoute";

// We'll use this particular note for our tests.
const testNote = notesFixture[0];

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
  render(
    <MemoryRouter initialEntries={[`/notes/${testNote.noteId}`]}>
      <AppContext.Provider
        value={{ isAuthenticated: true, userHasAuthenticated: () => {} }}
      >
        <AuthenticatedRoute exact path="/notes/:id">
          <Notes />
        </AuthenticatedRoute>
      </AppContext.Provider>
    </MemoryRouter>
  );

  const spinner = screen.getByRole("status");

  expect(spinner).toBeInTheDocument;
});

test("removes the spinner after loading", async () => {
  /* We need to mock the auth context to get to the note screen.
   * We also need to do some funky mocking to get the `useParams` to
   * think we're on a route and pass the appropriate note id.
   */
  render(
    <MemoryRouter initialEntries={[`/notes/${testNote.noteId}`]}>
      <AppContext.Provider
        value={{ isAuthenticated: true, userHasAuthenticated: () => {} }}
      >
        <AuthenticatedRoute exact path="/notes/:id">
          <Notes />
        </AuthenticatedRoute>
      </AppContext.Provider>
    </MemoryRouter>
  );

  const spinner = screen.getByRole("status");

  await waitForElementToBeRemoved(spinner);

  expect(spinner).not.toBeInTheDocument;
});

test("displays the note once loaded", async () => {
  jest.spyOn(window, "alert").mockImplementation((msg) => console.log(msg));

  render(
    <MemoryRouter initialEntries={[`/notes/${testNote.noteId}`]}>
      <AppContext.Provider
        value={{ isAuthenticated: true, userHasAuthenticated: () => {} }}
      >
        <AuthenticatedRoute exact path="/notes/:id">
          <Notes />
        </AuthenticatedRoute>
      </AppContext.Provider>
    </MemoryRouter>
  );

  const noteTextbox = await screen.findByRole("textbox");

  expect(noteTextbox).toBeInTheDocument;
});
