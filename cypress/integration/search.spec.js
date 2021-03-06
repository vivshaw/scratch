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

  it("displays a search button, which opens a search panel when clicked", () => {
    cy.visit("/");
    cy.findByText("Search").should("exist");

    cy.log("Opening search panel");
    cy.findByText("Search").click();

    cy.findByRole("textbox").should("exist");
  });

  it("when the search panel is open, displays a close button, that closes the panel", () => {
    cy.visit("/");
    cy.findByText("Search").click();

    cy.log("Closing search panel");
    cy.findByRole("button", {
      name: "Close search panel",
    })
      .should("exist")
      .click();

    cy.log("Search panel and close button should be gone");
    cy.findByRole("button", {
      name: "Close search panel",
    }).should("not.exist");
    cy.findByRole("textbox").should("not.exist");
  });

  it("should search for the term the user enters", () => {
    cy.visit("/");

    cy.log("Checking notes");
    /* We're again going quick & dirty with hardcoded note values-
     * not production ready! Should use fixtures or MSW or something and
     * create them programmatically
     */
    cy.findByText("First Note").should("exist");
    cy.findByText("Second Note").should("exist");

    cy.findByText("Search").click();

    cy.log("Entering search term");
    cy.findByRole("textbox").type("First");
    cy.findByText("First Note").should("exist");
    cy.findByText("Second Note").should("not.exist");
  });

  it("should show a message if no notes match the search term", () => {
    cy.visit("/");

    cy.findByText("Search").click();

    cy.log("Entering search term");
    cy.findByRole("textbox").type("This is not a note");

    cy.findByText("No notes found by search!").should("exist");
  });

  it("should clear the search when the clear button is clicked", () => {
    const enteredTerm = "Search Term";

    cy.visit("/");

    cy.findByText("Search").click();

    cy.log("Entering search term");
    cy.findByRole("textbox").type(enteredTerm);
    cy.findByDisplayValue(enteredTerm).should("exist");

    cy.log("Clearing search term");
    cy.findByText("Clear").click();
    cy.findByText(enteredTerm).should("not.exist");
  });
});
