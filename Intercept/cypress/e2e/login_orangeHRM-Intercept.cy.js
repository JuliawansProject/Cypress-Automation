import loginPage from "../support/LoginPage";
import loginData from "../fixtures/loginData.json";

describe("Scenario Verifikasi Fungsi Login - OrangeHRM (Network Intercepts - Unique per TC)", () => {
  // TC_LG_001 — Intercept: GET /auth/login
  it("TC_LG_001 - Verifikasi halaman login termuat dari server (GET auth/login)", () => {
    loginPage.interceptLoginPageLoad();
    loginPage.visitPage();
    cy.wait("@loginPageLoad").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginPageDisplayed();
  });

  // TC_LG_002 — Intercept: POST /auth/validate
  it("TC_LG_002 - Login dengan kredensial valid (POST auth/validate)", () => {
    loginPage.visitPage();
    loginPage.interceptLoginRequest();

    loginPage.login(loginData.validUsername, loginData.validPassword);

    cy.wait("@loginRequest").its("response.statusCode").should("eq", 302);
    loginPage.assertionLoginSuccess();
  });

  // TC_LG_003 — Intercept: GET /auth/requestPasswordResetCode
  it("TC_LG_003 - Verifikasi link Forgot Password (GET requestPasswordResetCode)", () => {
    loginPage.visitPage();
    loginPage.interceptForgotPassword();

    loginPage.clickForgotPassword();

    cy.wait("@forgotPasswordPage").its("response.statusCode").should("eq", 200);
    loginPage.assertionForgotPasswordPage();
  });

  // TC_LG_004 — Intercept: GET /auth/logout
  it("TC_LG_004 - Logout setelah login berhasil (GET auth/logout)", () => {
    loginPage.visitPage();
    loginPage.login(loginData.validUsername, loginData.validPassword);
    loginPage.assertionLoginSuccess();

    loginPage.interceptLogout();
    loginPage.logout();

    cy.wait("@logoutRequest").its("response.statusCode").should("eq", 302);
    loginPage.assertionRedirectedToLogin();
  });

  // TC_LG_005 — Intercept: GET /api/v2/dashboard/employees/time-at-work
  it("TC_LG_005 - Verifikasi widget Time at Work termuat setelah login (GET time-at-work)", () => {
    loginPage.visitPage();
    loginPage.interceptTimeAtWork();

    loginPage.login(loginData.validUsername, loginData.validPassword);

    cy.wait("@timeAtWork").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginSuccess();
  });

  // TC_LG_006 — Intercept: GET /api/v2/dashboard/employees/action-summary
  it("TC_LG_006 - Verifikasi widget Action Summary termuat setelah login (GET action-summary)", () => {
    loginPage.visitPage();
    loginPage.interceptActionSummary();

    loginPage.login(loginData.validUsername, loginData.validPassword);

    cy.wait("@actionSummary").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginSuccess();
  });

  // TC_LG_007 — Intercept: GET /api/v2/buzz/feed
  it("TC_LG_007 - Verifikasi widget Buzz Feed termuat setelah login (GET buzz/feed)", () => {
    loginPage.visitPage();
    loginPage.interceptBuzzFeed();

    loginPage.login(loginData.validUsername, loginData.validPassword);

    cy.wait("@buzzFeed").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginSuccess();
  });

  // TC_LG_008 — Intercept: GET /api/v2/dashboard/employees/subunit
  it("TC_LG_008 - Verifikasi widget Employees by Subunit termuat setelah login (GET subunit)", () => {
    loginPage.visitPage();
    loginPage.interceptSubunit();

    loginPage.login(loginData.validUsername, loginData.validPassword);

    cy.wait("@subunit").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginSuccess();
  });

  // TC_LG_009 — Intercept: GET /api/v2/dashboard/employees/locations
  it("TC_LG_009 - Verifikasi widget Employee Distribution by Location termuat setelah login (GET locations)", () => {
    loginPage.visitPage();
    loginPage.interceptLocations();

    loginPage.login(loginData.validUsername, loginData.validPassword);

    cy.wait("@locations").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginSuccess();
  });

  // TC_LG_010 — Intercept: GET app.js
  it("TC_LG_010 - Verifikasi asset app.js termuat saat halaman login dibuka (GET app.js)", () => {
    loginPage.interceptAppJs();
    loginPage.visitPage();
    cy.wait("@appJs").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginPageDisplayed();
  });

  // TC_LG_011 — Intercept: GET app.css
  it("TC_LG_011 - Verifikasi asset app.css termuat saat halaman login dibuka (GET app.css)", () => {
    loginPage.interceptAppCss();
    loginPage.visitPage();
    cy.wait("@appCss").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginPageDisplayed();
  });

  // TC_LG_012 — Intercept: GET /core/i18n/messages
  it("TC_LG_012 - Verifikasi resource i18n messages termuat saat halaman login dibuka (GET i18n/messages)", () => {
    loginPage.interceptI18nMessages();
    loginPage.visitPage();

    cy.wait("@i18nMessages").its("response.statusCode").should("eq", 200);
    loginPage.assertionLoginPageDisplayed();
  });

    it("TC_LG_013 - Login dengan username mengandung spasi di depan/belakang", () => {
    loginPage.visitPage();
    loginPage.login(loginData.spacecdUsername, loginData.validPassword);
    loginPage.assertionInvalidCredentials();
  });

  it("TC_LG_014 - Login dengan password mengandung spasi di depan/belakang", () => {
    loginPage.visitPage();
    loginPage.login(loginData.validUsername, loginData.spacecdPassword);
    loginPage.assertionInvalidCredentials();
  });

  it("TC_LG_015 - Login berkali-kali dengan kredensial salah", () => {
    loginPage.visitPage();
    const totalAttempts = 3;

    for (let attempt = 1; attempt <= totalAttempts; attempt++) {
      loginPage.login(loginData.invalidUsername, loginData.invalidPassword);
      loginPage.assertionInvalidCredentials();
    }
  });

  it("TC_LG_016 - Login ulang setelah logout, pastikan tidak bisa akses dashboard via back button", () => {
    loginPage.visitPage();
    loginPage.login(loginData.validUsername, loginData.validPassword);
    loginPage.assertionLoginSuccess();

    loginPage.logout();
    loginPage.assertionRedirectedToLogin();

    cy.go("back");
    loginPage.assertionRedirectedToLogin();
  });

  it("TC_LG_017 - Login dengan karakter unicode/emoji di username", () => {
    loginPage.visitPage();
    loginPage.login(loginData.uniCodeUsername, loginData.validPassword);
    cy.get(".oxd-alert-content-text").should("be.visible");
    cy.url().should("include", "/auth/login");
  });

  it("TC_LG_018 - Login dengan username sangat panjang (boundary test)", () => {
    loginPage.visitPage();
    loginPage.login(loginData.longUsername, loginData.validPassword);
    loginPage.assertionInvalidCredentials();
  });

  it("TC_LG_019 - Login dengan password sangat panjang (boundary test)", () => {
    loginPage.visitPage();
    loginPage.login(loginData.validUsername, loginData.longPassword);
    loginPage.assertionInvalidCredentials();
  });
});
