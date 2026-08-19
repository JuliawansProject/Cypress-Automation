import LoginPage from "../support/LoginPage";
describe("Fitur Login - OrangeHRM", () => {
  let data;
  before(() => {
    cy.fixture("example").then((fixtureData) => {
      data = fixtureData;
    });
  });
  beforeEach(() => {
    LoginPage.visitPage();
  });
  // TC_LG_001
  it("TC_LG_001 - Verifikasi tampilan halaman login", () => {
    LoginPage.interceptLoginPageLoad("loginPageLoad");
    cy.reload();
    cy.wait("@loginPageLoad");
    LoginPage.assertionLoginPageDisplayed();
  });
  // TC_LG_002
  it("TC_LG_002 - Login menggunakan username valid dan password valid", () => {
    LoginPage.interceptTimeAtWork("timeAtWork");
    LoginPage.login(data.validUsername, data.validPassword);
    cy.wait("@timeAtWork").then((interception) => {
      expect(interception.request.method).to.equal("GET");
      expect(interception.response.statusCode).to.equal(200);
    });
    LoginPage.assertionLoginSuccess();
  });
  // TC_LG_003
  it("TC_LG_003 - Login menggunakan username invalid dan password valid", () => {
    LoginPage.interceptLoginRequest("loginInvalidUsername");
    LoginPage.login(data.invalidUsername, data.validPassword);
    cy.wait("@loginInvalidUsername").then((interception) => {
      expect(interception.request.method).to.equal("POST");
      expect(interception.request.body).to.include(
        `username=${data.invalidUsername}`,
      );
    });
    LoginPage.assertionInvalidCredentials();
  });
  // TC_LG_004
  it("TC_LG_004 - Login dengan username valid dan password invalid", () => {
    LoginPage.interceptLoginRequest("loginInvalidPassword");
    LoginPage.login(data.validUsername, data.invalidPassword);
    cy.wait("@loginInvalidPassword").then((interception) => {
      expect(interception.request.method).to.equal("POST");
      expect(interception.request.body).to.include(
        `password=${data.invalidPassword}`,
      );
    });
    LoginPage.assertionInvalidCredentials();
  });
  // TC_LG_005
  it("TC_LG_005 - Login dengan username invalid dan password invalid", () => {
    LoginPage.interceptLoginRequest("loginInvalidBoth");
    LoginPage.login(data.invalidUsername, data.invalidPassword);
    cy.wait("@loginInvalidBoth").then((interception) => {
      expect(interception.request.method).to.equal("POST");
      expect(interception.request.body).to.include(
        `username=${data.invalidUsername}`,
      );
      expect(interception.request.body).to.include(
        `password=${data.invalidPassword}`,
      );
    });
    LoginPage.assertionInvalidCredentials();
  });
  // TC_LG_006
  it("TC_LG_006 - Login dengan username kosong dan password valid", () => {
    LoginPage.interceptAppCss("appCss");
    cy.reload();
    cy.wait("@appCss")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
    LoginPage.login(data.emptyUsername, data.validPassword);
    LoginPage.assertionRequiredMessageCount(1);
  });
  // TC_LG_007
  it("TC_LG_007 - Login dengan username valid dan password kosong", () => {
    LoginPage.interceptI18nMessages("i18nMessages");
    cy.reload();
    cy.wait("@i18nMessages")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
    LoginPage.getUsernameField().should("be.visible");
    LoginPage.login(data.validUsername, data.emptyPassword);
    LoginPage.assertionRequiredMessageCount(1);
  });
  // TC_LG_008
  it("TC_LG_008 - Login dengan username kosong dan password kosong", () => {
    LoginPage.interceptAppJs("appJs");
    cy.reload();
    cy.wait("@appJs").its("response.statusCode").should("be.oneOf", [200, 304]);
    LoginPage.login(data.emptyUsername, data.emptyPassword);
    LoginPage.assertionRequiredMessageCount(2);
  });
  // TC_LG_009
  it("TC_LG_009 - Memastikan tombol Login tersedia dan dapat ditekan", () => {
    LoginPage.interceptLoginRequest("loginButtonClick");
    LoginPage.login(data.validUsername, data.validPassword);
    cy.wait("@loginButtonClick").then((interception) => {
      expect(interception.request.method).to.eq("POST");
    });
    LoginPage.assertionLoginSuccess();
  });
  // TC_LG_010
  it("TC_LG_010 - Verifikasi link Forgot your password tersedia dan berfungsi", () => {
    LoginPage.interceptForgotPassword("forgotPasswordPage");
    LoginPage.clickForgotPassword();
    cy.wait("@forgotPasswordPage").its("response.statusCode").should("eq", 200);
    LoginPage.assertionForgotPasswordPage();
  });
  // TC_LG_011
  it("TC_LG_011 - Login dengan username huruf kecil semua", () => {
    LoginPage.interceptLoginRequest("loginLowercaseUsername");
    LoginPage.login(data.lowerCaseUsername, data.validPassword);
    cy.wait("@loginLowercaseUsername").then((interception) => {
      expect(interception.request.headers).to.have.property("content-type");
    });
    LoginPage.assertionInvalidCredentials();
  });
  // TC_LG_012
  it("TC_LG_012 - Login dengan password salah ketik/huruf tidak sesuai", () => {
    LoginPage.interceptLoginRequest("loginLowercasePassword");
    LoginPage.login(data.validUsername, data.lowerCasePassword);
    cy.wait("@loginLowercasePassword").then((interception) => {
      expect(interception.request.body).to.include("password=");
    });
    LoginPage.assertionInvalidCredentials();
  });
  // TC_LG_013
  it("TC_LG_013 - Login dengan username mengandung spasi di depan/belakang", () => {
    LoginPage.interceptLoginRequest("loginSpacedUsername");
    LoginPage.login(data.spacedUsername, data.validPassword);
    cy.wait("@loginSpacedUsername").then((interception) => {
      expect(interception.request.body).to.match(/username=.*(\+|%20).*/);
    });
    LoginPage.assertionInvalidCredentials();
  });
  // TC_LG_014
  it("TC_LG_014 - Login dengan password mengandung spasi di depan/belakang", () => {
    LoginPage.interceptLoginRequest("loginSpacedPassword");
    LoginPage.login(data.validUsername, data.spacedPassword);
    cy.wait("@loginSpacedPassword").then((interception) => {
      expect(interception.response.statusCode).to.eq(302);
      expect(interception.request.body).to.match(/password=.*(\+|%20).*/);
    });
    LoginPage.assertionInvalidCredentials();
  });
  // TC_LG_015 - Brute force check
  it.skip("TC_LG_015 - Login berkali-kali dengan kredensial salah", () => {
    LoginPage.interceptLoginRequest("loginBruteForce");
    const attempts = 6;
    for (let i = 0; i < attempts; i++) {
      LoginPage.login(data.invalidUsername, data.invalidPassword);
      cy.wait("@loginBruteForce")
        .its("response.statusCode")
        .should("not.eq", 302);
      LoginPage.assertionInvalidCredentials();
      cy.reload();
    }
  });
  // TC_LG_016
  it("TC_LG_016 - Login ulang setelah logout, pastikan tidak bisa akses dashboard via back button", () => {
    LoginPage.interceptLoginRequest("loginBeforeLogout");
    LoginPage.interceptLogout("logoutRequest");
    LoginPage.login(data.validUsername, data.validPassword);
    cy.wait("@loginBeforeLogout").its("response.statusCode").should("eq", 302);
    LoginPage.assertionLoginSuccess();
    LoginPage.logout();
    cy.wait("@logoutRequest").its("response.statusCode").should("eq", 302);
    LoginPage.assertionRedirectedToLogin();
    cy.go("back");
    LoginPage.assertionRedirectedToLogin();
  });
  // TC_LG_017
  it("TC_LG_017 - Login dengan karakter unicode/emoji di username", () => {
    LoginPage.interceptLoginRequest("loginUnicodeUsername");
    LoginPage.login(data.unicodeUsername, data.validPassword);
    cy.wait("@loginUnicodeUsername");
    LoginPage.getAlertInvalidCredentials()
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        cy.log(`Pesan error yang muncul: "${text}"`);
        expect(text).to.match(/Invalid credentials|Unexpected error occurred/);
      });
    cy.url().should("include", "/auth/login");
  });
  // TC_LG_018
  it("TC_LG_018 - Login dengan username sangat panjang (boundary test)", () => {
    LoginPage.interceptLoginRequest("loginLongUsername");
    LoginPage.login(data.longUsername, data.validPassword);
    LoginPage.getUsernameField().then(($el) => {
      const maxLength = $el.attr("maxlength");
      cy.log(
        maxLength
          ? `Field punya maxlength: ${maxLength}`
          : "Tidak ada maxlength",
      );
    });
    cy.wait("@loginLongUsername").then((interception) => {
      expect(interception.request.body.length).to.be.greaterThan(50);
    });
    LoginPage.assertionInvalidCredentials();
  });
  // TC_LG_019
  it("TC_LG_019 - Login dengan password sangat panjang (boundary test)", () => {
    LoginPage.interceptLoginRequest("loginLongPassword");
    LoginPage.login(data.validUsername, data.longPassword);
    cy.wait("@loginLongPassword").should((interception) => {
      expect(interception).to.exist;
      expect(interception.response.statusCode).to.eq(302);
      expect(interception.request.body.length).to.be.greaterThan(100);
    });
    LoginPage.assertionInvalidCredentials();
  });
});
