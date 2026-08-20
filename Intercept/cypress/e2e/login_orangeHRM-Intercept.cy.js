import loginPage from "../support/LoginPage";
import loginData from "../fixtures/loginData.json";
describe("Scenario Verifikasi Fungsi Login - OrangeHRM", () => {
  it("TC_LG_001 - Verifikasi tampilan halaman login", () => {
    loginPage.interceptLoginPageLoad();
    loginPage.visitPage();
    cy.wait("@loginPageLoad");
    loginPage.assertionLoginPageDisplayed();
  });
  it("TC_LG_002 - Login menggunakan username valid dan password valid", () => {
    loginPage.interceptLoginRequest();
    loginPage.visitPage();
    loginPage.login(loginData.validUsername, loginData.validPassword);
    cy.wait("@loginRequest").its("response.statusCode").should("eq", 302);
    loginPage.assertionLoginSuccess();
  });
  it("TC_LG_003 - Login menggunakan username invalid dan password valid", () => {
    loginPage.interceptI18nMessages();
    loginPage.visitPage();
    cy.wait("@i18nMessages");
    loginPage.login(loginData.invalidUsername, loginData.validPassword);
    loginPage.assertionInvalidCredentials();
  });
   it("TC_LG_004 - Login dengan username valid dan password invalid", () => {
    loginPage.interceptOhrmBranding();
    cy.clearBrowserCache();
    loginPage.visitPage();
    cy.wait("@ohrmBranding")
      .its("response.statusCode")
      .should((status) => {
        expect([200, 304]).to.include(status);
      });
    loginPage.login(loginData.validUsername, loginData.invalidPassword);
    loginPage.assertionInvalidCredentials();
  });
  it("TC_LG_005 - Login dengan username invalid dan password invalid", () => {
    loginPage.interceptOhrmLogo();
    cy.clearBrowserCache();
    loginPage.visitPage();
    cy.wait("@ohrmLogo")
      .its("response.statusCode")
      .should((status) => {
        expect([200, 304]).to.include(status);
      });
    loginPage.login(loginData.invalidUsername, loginData.invalidPassword);
    loginPage.assertionInvalidCredentials();
  });
  it("TC_LG_006 - Login dengan username kosong dan password valid", () => {
    loginPage.interceptBlobSvg();
    cy.clearBrowserCache();
    loginPage.visitPage();
    cy.wait("@blobSvg")
      .its("response.statusCode")
      .should((status) => {
        expect([200, 304]).to.include(status);
      });
    loginPage.login(loginData.emptyUsername, loginData.validPassword);
    loginPage.assertionRequiredMessageCount(1);
  });
  it("TC_LG_007 - Login dengan username valid dan password kosong", () => {
    loginPage.interceptAppJs();
    cy.clearBrowserCache();
    loginPage.visitPage();
    cy.wait("@appJs")
      .its("response.statusCode")
      .should((status) => {
        expect([200, 304]).to.include(status);
      });
    loginPage.login(loginData.validUsername, loginData.emptyPassword);
    loginPage.assertionRequiredMessageCount(1);
  });
  it("TC_LG_008 - Login dengan username kosong dan password kosong", () => {
    loginPage.visitPage();
    loginPage.login(loginData.emptyUsername, loginData.emptyPassword);
    loginPage.assertionRequiredMessageCount(2);
  });
  it("TC_LG_009 - Memastikan tombol Login tersedia dan dapat ditekan", () => {
    loginPage.visitPage();
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("not.be.disabled")
      .and("contain.text", "Login");
    loginPage.login(loginData.validUsername, loginData.validPassword);
    loginPage.assertionLoginSuccess();
  });
  it("TC_LG_010 - Verifikasi link Forgot your password tersedia dan berfungsi", () => {
    loginPage.interceptForgotPassword();
    loginPage.visitPage();
    cy.get(".orangehrm-login-forgot-header")
      .should("be.visible")
      .and("contain.text", "Forgot your password");
    loginPage.clickForgotPassword();
    cy.wait("@forgotPasswordPage");
    loginPage.assertionForgotPasswordPage();
  });
   it("TC_LG_011 - Login dengan username huruf kecil semua", () => {
    loginPage.visitPage();
    loginPage.login(loginData.lowerCaseUsername, loginData.validPassword);
    loginPage.assertionLoginSuccess();
  });
  it("TC_LG_012 - Login dengan password salah ketik/huruf tidak sesuai", () => {
    loginPage.visitPage();
    loginPage.login(loginData.validUsername, loginData.lowerCasePassword);
    loginPage.assertionInvalidCredentials();
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
    const attempts = 3;
    for (let i = 0; i < attempts; i++) {
      loginPage.login(loginData.invalidUsername, loginData.invalidPassword);
      loginPage.assertionInvalidCredentials();
      loginPage.getUsernameField().clear();
    }
  });
  it("TC_LG_016 - Login ulang setelah logout, pastikan tidak bisa akses dashboard via back button", () => {
    loginPage.interceptLogout();
    loginPage.visitPage();
    loginPage.login(loginData.validUsername, loginData.validPassword);
    loginPage.assertionLoginSuccess();
    loginPage.logout();
    cy.wait("@logoutRequest");
    loginPage.assertionRedirectedToLogin();
    cy.go("back");
    loginPage.assertionRedirectedToLogin();
  });
  it("TC_LG_017 - Login dengan karakter unicode/emoji di username", () => {
    loginPage.visitPage();
    loginPage.login(loginData.uniCodeUsername, loginData.validPassword);
    loginPage
      .getAlertInvalidCredentials()
      .should("be.visible")
      .and("contain.text", "Unexpected error occurred");
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
