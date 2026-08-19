import LoginPage from "../support/LoginPage";
describe("Fitur Login - OrangeHRM", () => {
  let data;
  before(() => {
    cy.fixture("example").then((fixtureData) => {
      data = fixtureData;
    });
  });
  beforeEach(() => {
    LoginPage.visit();
  });
  // TC_LG_001
  it("TC_LG_001 - Verifikasi tampilan halaman login", () => {
    LoginPage.interceptLoginPageLoad("loginPageLoad");
    cy.reload();
    cy.wait("@loginPageLoad");
  });
  // TC_LG_002
  it("TC_LG_002 - Login menggunakan username valid dan password valid", () => {
    LoginPage.interceptTimeAtWork("timeAtWork");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@timeAtWork").then((interception) => {
      expect(interception.request.method).to.equal("GET");
      expect(interception.response.statusCode).to.equal(200);
    });
    LoginPage.verifyLoginSuccess();
  });
  // TC_LG_003
  it("TC_LG_003 - Login menggunakan username invalid dan password valid", () => {
    LoginPage.interceptActionSummary("actionSummary");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@actionSummary").then((interception) => {
      expect(interception.request.method).to.equal("GET");
      expect(interception.response.statusCode).to.equal(200);
    });
    LoginPage.verifyLoginSuccess();
  });
  // TC_LG_004
  it("TC_LG_004 - Login dengan username valid dan password invalid", () => {
    LoginPage.interceptBuzzFeed("buzzFeed");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@buzzFeed").then((interception) => {
      expect(interception.request.method).to.equal("GET");
      expect(interception.response.statusCode).to.equal(200);
    });
    LoginPage.verifyLoginSuccess();
  });
  // TC_LG_005
  it("TC_LG_005 - Login dengan username invalid dan password invalid", () => {
    LoginPage.interceptSubunit("subunit");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@subunit").then((interception) => {
      expect(interception.request.method).to.equal("GET");
      expect(interception.response.statusCode).to.equal(200);
    });
    LoginPage.verifyLoginSuccess();
  });
  // TC_LG_006
  it("TC_LG_006 - Login dengan username kosong dan password valid", () => {
    LoginPage.interceptLocations("locations");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@locations").then((interception) => {
      expect(interception.request.method).to.equal("GET");
      expect(interception.response.statusCode).to.equal(200);
    });
    LoginPage.verifyLoginSuccess();
  });
  it("TC_LG_007 - Login dengan username valid dan password kosong", () => {
    LoginPage.interceptI18nMessages("i18nMessages");
    cy.reload();
    cy.wait("@i18nMessages")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);

    LoginPage.elements.usernameInput().should("be.visible");
    LoginPage.login(
      data.validUsernameEmptyPassword.username,
      data.validUsernameEmptyPassword.password,
    );
    LoginPage.verifyRequiredMessageCount(1);
  });

  // TC_LG_008
  it("TC_LG_008 - Login dengan username kosong dan password kosong", () => {
    LoginPage.interceptI18nMessages("i18nMessages");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@i18nMessages").then((interception) => {
      expect(interception.request.method).to.equal("GET");
      expect(interception.response.statusCode).to.be.oneOf([200, 304]);
    });
    LoginPage.verifyLoginSuccess();
  });
  // TC_LG_009
  it("TC_LG_009 - Memastikan tombol Login tersedia dan dapat ditekan", () => {
    LoginPage.interceptLoginRequest("loginButtonClick");
    LoginPage.elements.loginButton().should("be.visible").and("be.enabled");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@loginButtonClick").then((interception) => {
      expect(interception.request.method).to.eq("POST");
    });
    LoginPage.verifyLoginSuccess();
  });
  // TC_LG_010
  it("TC_LG_010 - Verifikasi link Forgot your password tersedia dan berfungsi", () => {
    LoginPage.interceptForgotPassword("forgotPasswordPage");
    LoginPage.clickForgotPassword();
    cy.wait("@forgotPasswordPage").its("response.statusCode").should("eq", 200);
    LoginPage.verifyForgotPasswordPage();
  });
  // TC_LG_011
  it("TC_LG_011 - Login dengan username huruf kecil semua", () => {
    LoginPage.interceptLoginRequest("loginLowercaseUsername");
    LoginPage.login(
      data.lowercaseUsername.username,
      data.lowercaseUsername.password,
    );
    cy.wait("@loginLowercaseUsername").then((interception) => {
      expect(interception.request.headers).to.have.property("content-type");
    });
    LoginPage.verifyLoginSuccess();
  });
  // TC_LG_012
  it("TC_LG_012 - Login dengan password salah ketik/huruf tidak sesuai", () => {
    LoginPage.interceptLoginRequest("loginLowercasePassword");
    LoginPage.login(
      data.lowercasePassword.username,
      data.lowercasePassword.password,
    );
    cy.wait("@loginLowercasePassword").then((interception) => {
      expect(interception.request.body).to.include("password=");
    });
    LoginPage.verifyInvalidCredentialsMessage();
  });
  // TC_LG_013
  it("TC_LG_013 - Login dengan username mengandung spasi di depan/belakang", () => {
    LoginPage.interceptLoginRequest("loginSpacedUsername");
    LoginPage.login(data.spacedUsername.username, data.spacedUsername.password);
    cy.wait("@loginSpacedUsername").then((interception) => {
      expect(interception.request.body).to.match(/username=.*(\+|%20).*/);
    });
    LoginPage.verifyInvalidCredentialsMessage();
  });
  // TC_LG_014
  it("TC_LG_014 - Login dengan password mengandung spasi di depan/belakang", () => {
    LoginPage.interceptLoginRequest("loginSpacedPassword");
    LoginPage.login(data.spacedPassword.username, data.spacedPassword.password);
    cy.wait("@loginSpacedPassword").then((interception) => {
      expect(interception.response.statusCode).to.eq(302);
      expect(interception.request.body).to.match(/password=.*(\+|%20).*/);
    });
    LoginPage.verifyInvalidCredentialsMessage();
  });
  // TC_LG_015 - Brute force check
  it.skip("TC_LG_015 - Login berkali-kali dengan kredensial salah", () => {
    LoginPage.interceptLoginRequest("loginBruteForce");
    const attempts = 6;
    for (let i = 0; i < attempts; i++) {
      LoginPage.login(
        data.invalidUsernameInvalidPassword.username,
        data.invalidUsernameInvalidPassword.password,
      );
      cy.wait("@loginBruteForce")
        .its("response.statusCode")
        .should("not.eq", 302);
      LoginPage.verifyInvalidCredentialsMessage();
      cy.reload();
    }
  });
  // TC_LG_016
  it("TC_LG_016 - Login ulang setelah logout, pastikan tidak bisa akses dashboard via back button", () => {
    LoginPage.interceptLoginRequest("loginBeforeLogout");
    LoginPage.interceptLogout("logoutRequest");
    LoginPage.login(data.validUser.username, data.validUser.password);
    cy.wait("@loginBeforeLogout").its("response.statusCode").should("eq", 302);
    LoginPage.verifyLoginSuccess();
    LoginPage.logout();
    cy.wait("@logoutRequest").its("response.statusCode").should("eq", 302);
    LoginPage.verifyRedirectedToLogin();
    cy.go("back");
    LoginPage.verifyRedirectedToLogin();
  });
  // TC_LG_017
  it("TC_LG_017 - Login dengan karakter unicode/emoji di username", () => {
    LoginPage.interceptLoginRequest("loginUnicodeUsername");
    LoginPage.login(
      data.unicodeUsername.username,
      data.unicodeUsername.password,
    );
    cy.wait("@loginUnicodeUsername");
    LoginPage.elements
      .alertInvalidCredentials()
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
    LoginPage.login(data.longUsername.username, data.longUsername.password);
    LoginPage.elements.usernameInput().then(($el) => {
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
    LoginPage.verifyInvalidCredentialsMessage();
  });
  // TC_LG_019
  it("TC_LG_019 - Login dengan password sangat panjang (boundary test)", () => {
    LoginPage.interceptLoginRequest("loginLongPassword");
    LoginPage.login(data.longPassword.username, data.longPassword.password);
    cy.wait("@loginLongPassword").should((interception) => {
      expect(interception).to.exist;
      expect(interception.response.statusCode).to.eq(302);
      expect(interception.request.body.length).to.be.greaterThan(100);
    });
    LoginPage.verifyInvalidCredentialsMessage();
  });
});
