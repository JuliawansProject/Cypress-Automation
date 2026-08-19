class loginPage {
 
  // ---------- Page Actions ----------
 
  visitPage() {
    cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", { failOnStatusCode: false });
    cy.get('input[name="username"]', { timeout: 30000 }).should("exist").and("be.visible");
  }
 
  inputUsername(username) {
    cy.get('input[name="username"]', { timeout: 15000 }).should("be.visible").clear().type(username, { delay: 20 });
  }
 
  inputPassword(password) {
    cy.get('input[name="password"]', { timeout: 15000 }).should("be.visible").clear().type(password, { delay: 20 });
  }
 
  clickLoginBtn() {
    cy.get('button[type="submit"]').should("be.visible").click();
  }
 
  clickForgotPassword() {
    cy.get(".orangehrm-login-forgot-header").click();
  }
 
  getUsernameField() {
    return cy.get('input[name="username"]');
  }
 
  getAlertInvalidCredentials() {
    return cy.get(".oxd-alert-content-text");
  }
 
  login(username, password) {
    this.inputUsername(username);
    this.inputPassword(password);
    this.clickLoginBtn();
  }
 
  logout() {
    cy.get(".oxd-userdropdown-tab").click();
    cy.contains("a", "Logout").click();
  }
 
  // ---------- Assertions ----------
 
  assertionLoginPageDisplayed() {
    cy.get(".orangehrm-login-branding img").should("be.visible");
    cy.get(".orangehrm-login-title").should("be.visible").and("contain.text", "Login");
    cy.get('input[name="username"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible").and("contain.text", "Login");
    cy.get(".orangehrm-login-forgot-header").should("be.visible").and("contain.text", "Forgot your password");
  }
 
  assertionLoginSuccess() {
    cy.url().should("include", "/dashboard/index");
    cy.get(".oxd-topbar-header-breadcrumb h6").should("be.visible").and("contain.text", "Dashboard");
  }
 
  assertionInvalidCredentials() {
    cy.get(".oxd-alert-content-text").should("be.visible").and("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  }
 
  assertionRequiredMessageCount(expectedCount) {
    cy.get(".oxd-input-group .oxd-input-field-error-message").should("have.length", expectedCount);
    cy.get(".oxd-input-group .oxd-input-field-error-message").each(($el) => {
      cy.wrap($el).should("contain.text", "Required");
    });
  }
 
  assertionForgotPasswordPage() {
    cy.url().should("include", "/auth/requestPasswordResetCode");
    cy.get(".orangehrm-forgot-password-title").should("contain.text", "Reset Password");
  }
 
  assertionRedirectedToLogin() {
    cy.url().should("include", "/auth/login");
  }
 
  // ---------- Network Intercepts ----------
 
  interceptLoginPageLoad(alias = "loginPageLoad") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login").as(alias);
  }
 
  interceptLoginRequest(alias = "loginRequest") {
    cy.intercept("POST", "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate").as(alias);
  }
 
  interceptTimeAtWork(alias = "timeAtWork") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/time-at-work*").as(alias);
  }
 
  interceptActionSummary(alias = "actionSummary") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/action-summary").as(alias);
  }
 
  interceptBuzzFeed(alias = "buzzFeed") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/buzz/feed*").as(alias);
  }
 
  interceptSubunit(alias = "subunit") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/subunit").as(alias);
  }
 
  interceptLocations(alias = "locations") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/dashboard/employees/locations").as(alias);
  }
 
  interceptAppCss(alias = "appCss") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/dist/css/app.css*").as(alias);
  }
 
  interceptAppJs(alias = "appJs") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/dist/js/app.js*").as(alias);
  }
 
  interceptI18nMessages(alias = "i18nMessages") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages").as(alias);
  }
 
  interceptForgotPassword(alias = "forgotPasswordPage") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode").as(alias);
  }
 
  interceptLogout(alias = "logoutRequest") {
    cy.intercept("GET", "https://opensource-demo.orangehrmlive.com/web/index.php/auth/logout").as(alias);
  }
}
 
export default new loginPage();