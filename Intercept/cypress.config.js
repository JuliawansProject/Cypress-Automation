const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    pageLoadTimeout: 120000, 
    setupNodeEvents(on, config) {
    },
  },
});