const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com",
    pageLoadTimeout: 120000,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (browser.family === "chromium") {
          launchOptions.args.push("--disable-application-cache");
          launchOptions.args.push("--disk-cache-size=0");
        }
        return launchOptions;
      });
    },
  },
});
