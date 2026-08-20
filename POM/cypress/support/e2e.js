
// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("Cannot read properties of undefined (reading 'response')")) {
    return false;
  }
  return true;
});
import './commands'

