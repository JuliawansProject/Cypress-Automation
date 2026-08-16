
class LoginPage {
  // ---------- Selectors ----------
 elements = {
   logo: () => cy.get(".orangehrm-login-branding img"),
   usernameInput: (opts = {}) => cy.get('input[name="username"]', opts),
   passwordInput: (opts = {}) => cy.get('input[name="password"]', opts),
   loginButton: () => cy.get('button[type="submit"]'),
   forgotPasswordLink: () => cy.get(".orangehrm-login-forgot-header"),
   loginTitle: () => cy.get(".orangehrm-login-title"),
   alertInvalidCredentials: () => cy.get(".oxd-alert-content-text"),
   requiredErrorMessages: () => cy.get(".oxd-input-group .oxd-input-field-error-message"),
   dashboardHeader: () => cy.get(".oxd-topbar-header-breadcrumb h6"),
   resetPasswordTitle: () => cy.get(".orangehrm-forgot-password-title"),
   userDropdown: () => cy.get(".oxd-userdropdown-tab"),
   logoutMenuItem: () => cy.contains("a", "Logout"),
   alertBox: () => cy.get(".oxd-alert"),
};

  // ---------- Actions ----------
  visit() {
  cy.visit("/web/index.php/auth/login", {
    failOnStatusCode: false,
  });
  this.elements.usernameInput({ timeout: 30000 })
    .should("exist")
    .and("be.visible");
  return this;
}

 fillUsername(username) {
  if (username && username.length > 0) {
    this.elements.usernameInput({ timeout: 15000 })
      .should("be.visible")
      .clear()
      .type(username, { delay: 20 });
  }
  return this;
}

fillPassword(password) {
  if (password && password.length > 0) {
    this.elements.passwordInput({ timeout: 15000 })
      .should("be.visible")
      .clear()
      .type(password, { delay: 20 });
  }
  return this;
}

  clickLoginButton() {
    this.elements.loginButton().click();
    return this;
  }

  clickForgotPassword() {
    this.elements.forgotPasswordLink().click();
    return this;
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLoginButton();
    return this;
  }
  logout() {
  this.elements.userDropdown().click();
  this.elements.logoutMenuItem().click();
  return this;
}
  // ---------- Assertions helpers ----------
  verifyLoginPageIsDisplayed() {
    this.elements.logo().should("be.visible");
    this.elements.loginTitle().should("be.visible").and("contain.text", "Login");
    this.elements.usernameInput().should("be.visible");
    this.elements.passwordInput().should("be.visible");
    this.elements.loginButton().should("be.visible").and("contain.text", "Login");
    this.elements.forgotPasswordLink().should("be.visible").and("contain.text", "Forgot your password");
    return this;
  }

  verifyLoginSuccess() {
    cy.url().should("include", "/dashboard/index");
    this.elements.dashboardHeader().should("be.visible").and("contain.text", "Dashboard");
    return this;
  }

  verifyInvalidCredentialsMessage() {
    this.elements
      .alertInvalidCredentials()
      .should("be.visible")
      .and("contain.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
    return this;
  }

  verifyRequiredMessageCount(expectedCount) {
    this.elements.requiredErrorMessages().should("have.length", expectedCount);
    this.elements.requiredErrorMessages().each(($el) => {
      cy.wrap($el).should("contain.text", "Required");
    });
    return this;
  }

  verifyForgotPasswordPage() {
    cy.url().should("include", "/auth/requestPasswordResetCode");
    this.elements.resetPasswordTitle().should("contain.text", "Reset Password");
    return this;
  }
  verifyRedirectedToLogin() {
  cy.url().should("include", "/auth/login");
  return this;
  }
}

export default new LoginPage();
