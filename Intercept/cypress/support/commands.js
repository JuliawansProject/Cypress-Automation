Cypress.Commands.add("typeWhenReady", (selector, value, opts = {}) => {
  const timeout = opts.timeout ?? 60000;
  const delay = opts.delay ?? 20;
 
  cy.get(selector, { timeout }).should("be.visible");
  cy.get(selector).clear({ timeout });
 
  if (value) {
    cy.get(selector).type(value, { delay, timeout });
  }
});
 
Cypress.Commands.add("clickWhenReady", (selector, opts = {}) => {
  const timeout = opts.timeout ?? 60000;
 
  cy.get(selector, { timeout }).should("be.visible");
  cy.get(selector).click({ timeout });
});
Cypress.Commands.add("clearBrowserCache", () => {
  Cypress.automation("remote:debugger:protocol", {
    command: "Network.clearBrowserCache",
  });
});