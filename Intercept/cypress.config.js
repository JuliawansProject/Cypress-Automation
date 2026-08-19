const { defineConfig } = require("cypress");

module.exports = defineConfig({
<<<<<<< HEAD
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
=======
  allowCypressEnv: false,

  e2e: {
    baseUrl: "https://www.saucedemo.com",

>>>>>>> 2bb9ca417143fb91382ad80b676ee9b5f7e430cf
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});