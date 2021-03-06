import "./Home.css";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { API } from "aws-amplify";
import { BsPencilSquare } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { FaWindowClose } from "react-icons/fa";
import FindReplacePanel from "../components/FindReplacePanel";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchPanel from "../components/SearchPanel";
import { onError } from "../libs/errorLib";
import { useAppContext } from "../libs/contextLib";

/* Hit our AWS API endpoint to load notes. */
function loadNotes() {
  return API.get("notes", "/notes");
}

/* Do a find & replace. */
function findReplaceNotes(selectedNotes, findTerm, replaceTerm) {
  if (selectedNotes.length === 0) {
    return;
  }

  const notePromises = selectedNotes.map((note) => {
    console.log("note: ", note);
    const { noteId, content } = note;
    const newContent = content.replace(findTerm, replaceTerm);

    return API.put("notes", `/notes/${noteId}`, {
      body: { content: newContent },
    });
  });

  return Promise.all(notePromises);
}

export default function Home() {
  // Fix to prevent state updates after unmount
  const isMounted = useRef(true);

  // Home screen state
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  // Search hooks
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Find & Replace hooks
  const [isFindReplacing, setIsFindReplacing] = useState(false);
  const [findReplacePanelOpen, setFindReplacePanelOpen] = useState(false);
  const [findTerm, setFindTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");

  // Derived state
  const isAnyPanelOpen = findReplacePanelOpen || searchPanelOpen;
  const isAnyLoadingState = isLoading || isFindReplacing;

  // UI helpers
  function clearSearch() {
    setSearchTerm("");
  }

  function clearFindReplace() {
    setFindTerm("");
    setReplaceTerm("");
  }

  // Exit both Search and Find & Replace panels and reset their state.
  function exitAllPanels() {
    setSearchPanelOpen(false);
    setFindReplacePanelOpen(false);
    clearSearch();
    clearFindReplace();
  }

  /* If we have typed in a searchTerm or findTerm,
   * we will filter the notes to just ones that contain that term.
   * Otherwise, we'll just use all the notes.
   */
  const filterTerm = searchTerm || findTerm;
  const filteredNotes = filterTerm
    ? notes.filter((note) => note.content.includes(filterTerm))
    : notes;
  const notesPresent = filteredNotes.length > 0;

  /* Set our isMounted ref to false upon unmount.
   * This way, we can conditionally avoid updating state after unmount.
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  /* Async callback for loading notes */
  const doLoadNotes = useCallback(async () => {
    try {
      const notes = await loadNotes();
      if (isMounted.current) {
        setNotes(notes);
      }
    } catch (e) {
      onError(e);
    }
  }, [isMounted]);

  /* Async callback for our Find & Replace */
  const doFindReplace = useCallback(async () => {
    if (isFindReplacing || !isAuthenticated) {
      return;
    }

    setIsFindReplacing(true);

    try {
      await findReplaceNotes(filteredNotes, findTerm, replaceTerm);
    } catch (e) {
      onError(e);
    }

    /* Reset find and replace terms to show changes */
    clearFindReplace();
    setFindTerm(replaceTerm);

    /* Quick & dirty approach: after our Find & Replace, reload the notes
     * from server. More robust approach could cache locally and do optimistic
     * updates.
     */
    await doLoadNotes();

    if (isMounted.current) {
      setIsFindReplacing(false);
    }
  }, [
    isFindReplacing,
    filteredNotes,
    findTerm,
    replaceTerm,
    isAuthenticated,
    isMounted,
    doLoadNotes,
  ]);

  /* Async load notes when we load the Home screen */
  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      setIsLoading(true);

      await doLoadNotes();

      if (isMounted.current) {
        setIsLoading(false);
      }
    }

    onLoad();
  }, [isAuthenticated, isMounted, doLoadNotes]);

  // Render landing page. Used if user is not authenticated.
  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p className="text-muted">A simple note taking app</p>
        <div className="pt-3">
          <Link to="/login" className="btn btn-info btn-lg mr-3">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  // The actual list of notes.
  function renderNotesList(notes) {
    return (
      <>
        {notes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split("\n")[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>
        ))}
      </>
    );
  }

  /* Renders the actual notes, if we're done loading them.
   * Depending on whether we are searching or not, and whether any notes
   * are found, we may display the note list, or one of two messages.
   */
  function renderNotesSection() {
    return (
      <>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>

        {/* If there are notes that pass the filter, display them. */}
        {notesPresent && (
          <ListGroup> {renderNotesList(filteredNotes)}</ListGroup>
        )}

        {/* If no notes pass the filter... */}
        {!notesPresent && (
          <>
            {/* and if we're searching, then no notes were found. */}
            {searchPanelOpen && (
              <h4 className="text-muted mt-4">No notes found by search!</h4>
            )}

            {/* and if we're find & replacing, then there are no matching notes. */}
            {findTerm && (
              <h4 className="text-muted mt-4">No notes to replace!</h4>
            )}

            {/* Otherwise, there are no notes at all!
             * Prompt the user to create one. */}
            {!searchTerm && !findTerm && (
              <>
                <h4 className="text-muted mt-4">
                  You don't have any notes yet!
                </h4>
                <p className="text-muted">
                  Get started by creating a note above.
                </p>
              </>
            )}
          </>
        )}
      </>
    );
  }

  /* Renders the whole Home screen.
   * We now make use of:
   * `isAnyLoadingState` to decide whether to render a loading state, and
   * `isAnyPanelOpen` to decide whether to show the Close button.
   */
  function renderHomeScreen() {
    return (
      <div className="notes">
        <div className="pb-3 mt-4 mb-3 border-bottom">
          <div className="notes-bar">
            <h2>Your Notes</h2>

            {/* If either our Search or Find & Replace Panel are open,
             * just display a Close button. */}
            {isAnyPanelOpen && (
              <Button
                variant="danger"
                aria-label="Close"
                onClick={() => exitAllPanels()}
              >
                <FaWindowClose />
              </Button>
            )}

            {/* Otherwise, display buttons to open Search or Find & Replace */}
            {!isAnyPanelOpen && (
              <div>
                <Button
                  className="mr-2"
                  onClick={() => setSearchPanelOpen(true)}
                >
                  Search
                </Button>
                <Button onClick={() => setFindReplacePanelOpen(true)}>
                  Find &amp; Replace
                </Button>
              </div>
            )}
          </div>

          {/* Panel for Searching our notes. */}
          {searchPanelOpen && (
            <SearchPanel
              searchTerm={searchTerm}
              onChange={setSearchTerm}
              onClear={() => clearSearch()}
            />
          )}

          {/* Panel for Find & Replacing in our notes */}
          {findReplacePanelOpen && (
            <FindReplacePanel
              findTerm={findTerm}
              onChangeFind={setFindTerm}
              replaceTerm={replaceTerm}
              onChangeReplace={setReplaceTerm}
              doFindReplace={doFindReplace}
            />
          )}
        </div>

        {/* If we're either loading notes or executing a find & replace,
         * render a spinner. Otherwise, actually render the notes. */}
        {isAnyLoadingState ? <LoadingSpinner /> : renderNotesSection()}
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderHomeScreen() : renderLander()}
    </div>
  );
}
