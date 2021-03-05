import React, { FunctionComponent } from "react";
import "./SearchPanel.css";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

type SearchPanelProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => {};
  clearSearch: () => {};
};

const SearchPanel: FunctionComponent<SearchPanelProps> = ({
  searchTerm,
  setSearchTerm,
  clearSearch,
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
        onChange={(event) => setSearchTerm(event.target.value)}
      />
      <InputGroup.Append>
        <Button onClick={() => clearSearch()}>Clear</Button>
      </InputGroup.Append>
    </InputGroup>
  </div>
);

export default SearchPanel;
