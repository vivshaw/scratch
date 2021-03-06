describe("the Home page", () => {
  /* We need to persist localStorage so that we stay signed in! */
  before(() => {
    cy.login();
  });

  after(() => {
    cy.clearLocalStorageSnapshot();
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("displays a find & replace button, which opens a find & replace panel when clicked", () => {
    cy.visit("/");
    cy.findByRole("button", { name: "Find & Replace" }).should("exist");

    cy.log("Opening search panel");
    cy.findByRole("button", { name: "Find & Replace" }).click();

    cy.findByRole("textbox", { name: "Find" }).should("exist");
    cy.findByRole("textbox", { name: "Replace" }).should("exist");
  });

  it("when the find & replace panel is open, displays a close button, that closes the panel", () => {
    cy.visit("/");
    cy.findByRole("button", { name: "Find & Replace" }).click();

    cy.log("Closing find & replace panel");
    cy.findByRole("button", {
      name: "Close",
    })
      .should("exist")
      .click();

    cy.log("Find & replace panel and close button should be gone");
    cy.findByRole("button", {
      name: "Close",
    }).should("not.exist");
    cy.findByRole("textbox", { name: "Find" }).should("not.exist");
    cy.findByRole("textbox", { name: "Replace" }).should("not.exist");
  });

  it("should filter for the term the user enters in the find field", () => {
    cy.visit("/");

    cy.log("Checking notes");
    /* We're again going quick & dirty with hardcoded note values-
     * not production ready! Should use fixtures or MSW or something and
     * create them programmatically
     */
    cy.findByText("First Note").should("exist");
    cy.findByText("Second Note").should("exist");

    cy.findByRole("button", { name: "Find & Replace" }).click();

    cy.log("Entering find term");
    cy.findByRole("textbox", { name: "Find" }).type("First");
    cy.findByText("First Note").should("exist");
    cy.findByText("Second Note").should("not.exist");
  });

  it("should show a message if no notes match the find term", () => {
    cy.visit("/");

    cy.findByRole("button", { name: "Find & Replace" }).click();

    cy.log("Entering find term");
    cy.findByRole("textbox", { name: "Find" }).type("This is not a note");

    cy.findByText("No notes to replace!").should("exist");
  });

  it("should successfully execute a find & replace", () => {
    const oldTerm = "Note";
    const newTerm = "Item";

    cy.visit("/");

    cy.findByRole("button", { name: "Find & Replace" }).click();

    cy.log("Executing find & replace");
    cy.findByRole("textbox", { name: "Find" }).type(oldTerm);
    cy.findByRole("textbox", { name: "Replace" }).type(newTerm);
    cy.findByRole("button", { name: "Find and Replace" }).click();

    cy.log("Checking for loading spinner");
    cy.findByRole("status").should("exist");

    cy.log("Checking edited notes");
    cy.findByText("First Note").should("not.exist");
    cy.findByText("Second Note").should("not.exist");
    cy.findByText("First Item").should("exist");
    cy.findByText("Second Item").should("exist");

    cy.log("Returning to previous state");
    cy.findByRole("textbox", { name: "Find" }).clear().type(newTerm);
    cy.findByRole("textbox", { name: "Replace" }).type(oldTerm);
    cy.findByRole("button", { name: "Find and Replace" }).click();

    cy.findByText("First Note").should("exist");
    cy.findByText("Second Note").should("exist");
    cy.findByText("First Item").should("not.exist");
    cy.findByText("Second Item").should("not.exist");
  });
});
