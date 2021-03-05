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

  it("displays a spinner on initial load", () => {
    cy.visit("/");
    cy.findByRole("status").should("exist");
  });

  it("removes the spinner after loading and replaces it with the notes screen", () => {
    cy.visit("/");

    cy.log("Initial Home page load");
    cy.findByRole("status").should("not.exist");

    cy.log("When data loads:");
    cy.findByText("Create a new note").should("exist");
    cy.findByRole("status").should("not.exist");
  });
});

/* We're going quick and dirty here with a hardcoded URL for a precreated note.
 * Obviously don't do this in production!
 */
const noteUrl = "/notes/6e6d4150-7d7d-11eb-80e9-5b5e50c04308";

describe("the Note page", () => {
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

  it("displays a spinner on initial load", () => {
    cy.visit(noteUrl);
    cy.findByRole("status").should("exist");
  });

  it("removes the spinner after loading and replaces it with the note", () => {
    cy.visit(noteUrl);

    cy.log("Initial Home page load");
    cy.findByRole("status").should("not.exist");

    cy.log("When data loads:");
    cy.findByRole("textbox").should("exist");
    cy.findByRole("status").should("not.exist");
  });
});
