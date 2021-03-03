describe("Cypress", () => {
  it("works", () => {
    expect(true).to.equal(true);
  });

  it("successfully visits Scratch", () => {
    cy.visit("/");
  });
});
