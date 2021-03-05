import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { BsPencilSquare } from "react-icons/bs";
import ListGroup from "react-bootstrap/ListGroup";
import { LinkContainer } from "react-router-bootstrap";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { Button } from "react-bootstrap";
import { FaWindowClose } from "react-icons/fa";
import SearchPanel from "../components/SearchPanel";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function clearSearch() {
    setSearchTerm("");
  }

  function exitSearchPanel() {
    setIsSearching(false);
    clearSearch();
  }

  /* If we have typed in a searchTerm,
   * we will filter the notes to just ones that contain that term.
   * Otherwise, we'll just use all the notes.
   */
  const filteredNotes = searchTerm
    ? notes.filter((note) => note.content.includes(searchTerm))
    : notes;
  const notesPresent = filteredNotes.length > 0;

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

  /* Depending on whether we are searching or not, and whether any notes
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

        {notesPresent && (
          <ListGroup> {renderNotesList(filteredNotes)}</ListGroup>
        )}
        {searchTerm && !notesPresent && (
          <h4 className="text-muted mt-4">No notes found by search!</h4>
        )}
        {!searchTerm && !notesPresent && (
          <>
            <h4 className="text-muted mt-4">You don't have any notes yet!</h4>
            <p className="text-muted">Get started by creating a note above.</p>
          </>
        )}
      </>
    );
  }

  // We now make use of `isLoading` to decide whether to render a loading state.
  function renderNotes() {
    return (
      <div className="notes">
        <div className="pb-3 mt-4 mb-3 border-bottom">
          <div className="notes-bar">
            <h2>Your Notes</h2>

            {!isSearching && (
              <Button onClick={() => setIsSearching(true)}>Search</Button>
            )}

            {isSearching && (
              <Button
                variant="danger"
                aria-label="Close search panel"
                onClick={() => exitSearchPanel()}
              >
                <FaWindowClose />
              </Button>
            )}
          </div>

          {isSearching && (
            <SearchPanel
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              clearSearch={() => clearSearch()}
            />
          )}
        </div>

        {isLoading && <LoadingSpinner />}
        {!isLoading && renderNotesSection()}
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
