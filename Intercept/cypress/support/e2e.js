<<<<<<< HEAD
// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("Cannot read properties of undefined (reading 'response')")) {
    return false;
  }
  return true;
});
=======
// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
>>>>>>> 2bb9ca417143fb91382ad80b676ee9b5f7e430cf
