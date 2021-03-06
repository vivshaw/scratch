import "./Notes.css";

import { API, Storage } from "aws-amplify";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import LoadingSpinner from "../components/LoadingSpinner";
import { Note } from "../types";
import config from "../config";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";

interface RouteParams {
  id: string;
}

interface NoteUpdateFields {
  content: string;
  attachment: string | null | undefined;
}

interface NoteWithAttachment extends Note {
  attachmentURL: string | undefined;
}

export default function Notes() {
  // Fix to prevent state updates after unmount
  const isMounted = useRef(true);

  const file = useRef<File | null>(null);
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const [note, setNote] = useState<NoteWithAttachment | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  /* Set our isMounted ref to false upon unmount.
   * This way, we can conditionally avoid updating state after unmount.
   */
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`, {});
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }
        if (isMounted.current) {
          setContent(content);
          setNote(note);
        }
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }

  function formatFilename(str: string) {
    return str.replace(/^\w+-/, "");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newFile = event?.currentTarget?.files?.[0];

    if (newFile != null) {
      file.current = newFile;
    }
  }

  function saveNote(note: NoteUpdateFields) {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  }

  async function handleSubmit(event: React.SyntheticEvent) {
    let attachment;

    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }

      await saveNote({
        content,
        attachment: attachment || note?.attachment,
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function deleteNote() {
    return API.del("notes", `/notes/${id}`, {});
  }

  async function handleDelete(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  // We now make use of `note` to decide whether to render a loading state.
  return (
    <div className="Notes">
      {!note && <LoadingSpinner />}
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {note.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}
