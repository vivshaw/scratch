import "./SearchPanel.css";

import { Button, Form, InputGroup } from "react-bootstrap";
import React, { FunctionComponent } from "react";

import { FaSearch } from "react-icons/fa";

export type SearchPanelProps = {
  searchTerm: string;
  onChange: (term: string) => void;
  onClear: () => void;
};

const SearchPanel: FunctionComponent<SearchPanelProps> = ({
  searchTerm,
  onChange,
  onClear,
}) => (
  <div className="search-control mt-2">
    <InputGroup>
      <InputGroup.Text>
        <FaSearch />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(event) => onChange(event.target.value)}
        aria-label="Search"
      />
      <InputGroup.Append>
        <Button onClick={() => onClear()}>Clear</Button>
      </InputGroup.Append>
    </InputGroup>
  </div>
);

export default SearchPanel;
