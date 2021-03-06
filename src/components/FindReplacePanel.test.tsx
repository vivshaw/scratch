import { render, screen, fireEvent } from "@testing-library/react";
import FindReplacePanel, { FindReplacePanelProps } from "./FindReplacePanel";

// Test props for the component
const testProps: FindReplacePanelProps = {
  findTerm: "",
  replaceTerm: "",
  onChangeFind: jest.fn(),
  onChangeReplace: jest.fn(),
  doFindReplace: jest.fn(),
};

// Test terms for Find input and Replace input
const findTerm = "test term";
const replaceTerm = "test term";

// Let's make sure the UI actually displays the necessary elements
test("displays a find field", async () => {
  render(<FindReplacePanel {...testProps} />);

  const findField = screen.getByRole("textbox", { name: "Find" });

  expect(findField).toBeInTheDocument;
});

test("displays a replace field", async () => {
  render(<FindReplacePanel {...testProps} />);

  const replaceField = screen.getByRole("textbox", { name: "Replace" });

  expect(replaceField).toBeInTheDocument;
});

test("displays a find and replace button", async () => {
  render(<FindReplacePanel {...testProps} />);

  const findReplaceButton = screen.getByRole("button", {
    name: "Find and Replace",
  });

  expect(findReplaceButton).toBeInTheDocument;
});

// Let's make sure the controlled inputs display their values
test("displays the find term", async () => {
  render(<FindReplacePanel {...testProps} findTerm={findTerm} />);

  const findField = screen.getByDisplayValue(findTerm);

  expect(findField).toBeInTheDocument;
});

test("displays the replace term", async () => {
  render(<FindReplacePanel {...testProps} replaceTerm={replaceTerm} />);

  const replaceField = screen.getByDisplayValue(replaceTerm);

  expect(replaceField).toBeInTheDocument;
});

// Let's make sure the function props get called when they should
test("calls onChangeFind when the find input is changed", async () => {
  render(<FindReplacePanel {...testProps} />);

  const findField = screen.getByRole("textbox", { name: "Find" });

  fireEvent.change(findField, {
    target: { value: findTerm },
  });

  expect(testProps.onChangeFind).toHaveBeenCalledTimes(1);
});

test("calls onChangeReplace when the replace input is changed", async () => {
  render(<FindReplacePanel {...testProps} />);

  const replaceField = screen.getByRole("textbox", { name: "Replace" });

  fireEvent.change(replaceField, {
    target: { value: replaceTerm },
  });

  expect(testProps.onChangeReplace).toHaveBeenCalledTimes(1);
});

test("calls doFindReplace when the clefind & replace button is clicked", async () => {
  render(<FindReplacePanel {...testProps} />);

  const findReplaceButton = screen.getByRole("button", {
    name: "Find and Replace",
  });

  fireEvent.click(findReplaceButton);

  expect(testProps.doFindReplace).toHaveBeenCalledTimes(1);
});
