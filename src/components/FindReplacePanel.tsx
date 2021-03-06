import "./SearchPanel.css";
import "./FindReplacePanel.css";

import { Button, Form, InputGroup } from "react-bootstrap";
import React, { FunctionComponent } from "react";

export type FindReplacePanelProps = {
  findTerm: string;
  replaceTerm: string;
  onChangeFind: (term: string) => void;
  onChangeReplace: (term: string) => void;
  doFindReplace: () => void;
};

const FindReplacePanel: FunctionComponent<FindReplacePanelProps> = ({
  findTerm,
  replaceTerm,
  onChangeFind,
  onChangeReplace,
  doFindReplace,
}) => (
  <div className="d-flex flex-column mt-2">
    <InputGroup className="mb-2">
      <InputGroup.Text className="field-label text-center">
        Find
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Text to find"
        value={findTerm}
        onChange={(event) => onChangeFind(event.target.value)}
        aria-label="Find"
      />
    </InputGroup>

    <InputGroup className="mb-2">
      <InputGroup.Text className="field-label text-center">
        Replace
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Replacement text"
        value={replaceTerm}
        onChange={(event) => onChangeReplace(event.target.value)}
        aria-label="Replace"
      />
    </InputGroup>

    <Button onClick={() => doFindReplace()} aria-label="Find and Replace">
      Find and Replace
    </Button>
  </div>
);

export default FindReplacePanel;
