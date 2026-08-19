import loginPage from "../support/LoginPage";
import loginData from "../fixtures/loginData.json";
describe("Scenario Verifikasi Fungsi Login - OrangeHRM (with Network Intercepts)", () => {
  beforeEach(() => {
    // Pasang intercept sebelum halaman dibuka agar request awal ikut tertangkap
    loginPage.interceptLoginPageLoad();
    loginPage.interceptLoginRequest();
    loginPage.visitPage();
    cy.wait("@loginPageLoad");
  });
  // ---------- Tampilan & Elemen Halaman ----------
  it("TC_LG_001 - Verifikasi tampilan halaman login", () => {
    loginPage.assertionLoginPageDisplayed();
  });
it("TC_LG_002 - Login menggunakan username valid dan password valid", () => {
  loginPage.interceptLoginRequest("loginRequestValid");

  loginPage.login(
    loginData.validUsername,
    loginData.validPassword
  );

  cy.wait("@loginRequestValid")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionLoginSuccess();
});
it("TC_LG_003 - Login menggunakan username invalid dan password valid", () => {
  loginPage.interceptLoginRequest("loginRequestInvalidUsername");

  loginPage.login(
    loginData.invalidUsername,
    loginData.validPassword
  );

  cy.wait("@loginRequestInvalidUsername")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionInvalidCredentials();
});
it("TC_LG_004 - Login dengan username valid dan password invalid", () => {
  loginPage.interceptLoginRequest("loginRequestInvalidPassword");

  loginPage.login(
    loginData.validUsername,
    loginData.invalidPassword
  );

  cy.wait("@loginRequestInvalidPassword")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionInvalidCredentials();
});

it("TC_LG_005 - Login dengan username invalid dan password invalid", () => {
  loginPage.interceptLoginRequest("loginRequestInvalidCredentials");

  loginPage.login(
    loginData.invalidUsername,
    loginData.invalidPassword
  );

  cy.wait("@loginRequestInvalidCredentials")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionInvalidCredentials();
});

  it("TC_LG_006 - Login dengan username kosong dan password valid", () => {
    loginPage.inputPassword(loginData.validPassword);
    loginPage.clickLoginBtn();
    loginPage.assertionRequiredMessageCount(1);
  });
  it("TC_LG_007 - Login dengan username valid dan password kosong", () => {
    loginPage.inputUsername(loginData.validUsername);
    loginPage.clickLoginBtn();
    loginPage.assertionRequiredMessageCount(1);
  });
  it("TC_LG_008 - Login dengan username kosong dan password kosong", () => {
    loginPage.clickLoginBtn();
    loginPage.assertionRequiredMessageCount(2);
  });
  it("TC_LG_009 - Memastikan tombol Login tersedia dan dapat ditekan", () => {
    cy.get('button[type="submit"]')
      .should("be.visible")
      .and("not.be.disabled")
      .and("contain.text", "Login");
  });
  it("TC_LG_010 - Verifikasi link Forgot your password tersedia dan berfungsi", () => {
    loginPage.interceptForgotPassword();
    loginPage.clickForgotPassword();
    cy.wait("@forgotPasswordPage");
    loginPage.assertionForgotPasswordPage();
  });
it("TC_LG_011 - Login dengan username huruf kecil semua", () => {
  loginPage.interceptLoginRequest("loginRequestLowerCase");

  loginPage.login(
    loginData.lowerCaseUsername,
    loginData.lowerCasePassword
  );

  cy.wait("@loginRequestLowerCase")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionInvalidCredentials();
});

it("TC_LG_012 - Login dengan password salah ketik/huruf tidak sesuai", () => {
  loginPage.interceptLoginRequest("loginRequestWrongPassword");

  loginPage.login(
    loginData.validUsername,
    loginData.invalidPassword
  );

  cy.wait("@loginRequestWrongPassword")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionInvalidCredentials();
});
it("TC_LG_013 - Login dengan username mengandung spasi di depan/belakang", () => {
  loginPage.interceptLoginRequest("loginRequestUsernameSpace");

  loginPage.login(
    loginData.spacecdUsername,
    loginData.validPassword
  );

  cy.wait("@loginRequestUsernameSpace")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionInvalidCredentials();
});

it("TC_LG_014 - Login dengan password mengandung spasi di depan/belakang", () => {
  loginPage.interceptLoginRequest("loginRequestPasswordSpace");

  loginPage.login(
    loginData.validUsername,
    loginData.spacecdPassword
  );

  cy.wait("@loginRequestPasswordSpace")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionInvalidCredentials();
});


it("TC_LG_015 - Login berkali-kali dengan kredensial salah", () => {
  loginPage.interceptLoginRequest("loginRequestRepeated");

  const totalAttempts = 3;

  for (let attempt = 1; attempt <= totalAttempts; attempt++) {
    loginPage.login(
      loginData.invalidUsername,
      loginData.invalidPassword
    );

    cy.wait("@loginRequestRepeated")
      .its("response.statusCode")
      .should("eq", 302);

    loginPage.assertionInvalidCredentials();
  }
});

it("TC_LG_016 - Login ulang setelah logout, pastikan tidak bisa akses dashboard via back button", () => {
  loginPage.interceptLoginRequest("loginRequestRelogin");

  loginPage.login(
    loginData.validUsername,
    loginData.validPassword
  );

  cy.wait("@loginRequestRelogin")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionLoginSuccess();

  loginPage.interceptLogout("logoutRequest");

  loginPage.logout();

  cy.wait("@logoutRequest")
    .its("response.statusCode")
    .should("eq", 302);

  loginPage.assertionRedirectedToLogin();

  cy.go("back");

  loginPage.assertionRedirectedToLogin();
});

  it("TC_LG_017 - Login dengan karakter unicode/emoji di username", () => {
    loginPage.login(loginData.uniCodeUsername, loginData.validPassword);
    cy.wait("@loginRequest");
    cy.get(".oxd-alert-content-text").should("be.visible");
    cy.url().should("include", "/auth/login");
  });
  it("TC_LG_018 - Login dengan username sangat panjang (boundary test)", () => {
    loginPage.login(loginData.longUsername, loginData.validPassword);
    cy.wait("@loginRequest");
    loginPage.assertionInvalidCredentials();
  });

  it("TC_LG_019 - Login dengan password sangat panjang (boundary test)", () => {
    loginPage.login(loginData.validUsername, loginData.longPassword);
    cy.wait("@loginRequest");
    loginPage.assertionInvalidCredentials();
  });
});
