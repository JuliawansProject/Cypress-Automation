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
    LoginPage.verifyLoginPageIsDisplayed();
  });

  // TC_LG_002
  it("TC_LG_002 - Login menggunakan username valid dan password valid", () => {
    LoginPage.login(data.validUser.username, data.validUser.password);
    LoginPage.verifyLoginSuccess();
  });

  // TC_LG_003
  it("TC_LG_003 - Login menggunakan username invalid dan password valid", () => {
    LoginPage.login(
      data.invalidUsernameValidPassword.username,
      data.invalidUsernameValidPassword.password
    );
    LoginPage.verifyInvalidCredentialsMessage();
  });

  // TC_LG_004
  it("TC_LG_004 - Login dengan username valid dan password invalid", () => {
    LoginPage.login(
      data.validUsernameInvalidPassword.username,
      data.validUsernameInvalidPassword.password
    );
    LoginPage.verifyInvalidCredentialsMessage();
  });

  // TC_LG_005
  it("TC_LG_005 - Login dengan username invalid dan password invalid", () => {
    LoginPage.login(
      data.invalidUsernameInvalidPassword.username,
      data.invalidUsernameInvalidPassword.password
    );
    LoginPage.verifyInvalidCredentialsMessage();
  });

  // TC_LG_006
  it("TC_LG_006 - Login dengan username kosong dan password valid", () => {
    LoginPage.login(
      data.emptyUsernameValidPassword.username,
      data.emptyUsernameValidPassword.password
    );
    LoginPage.verifyRequiredMessageCount(1);
  });

  // TC_LG_007
  it("TC_LG_007 - Login dengan username valid dan password kosong", () => {
    LoginPage.login(
      data.validUsernameEmptyPassword.username,
      data.validUsernameEmptyPassword.password
    );
    LoginPage.verifyRequiredMessageCount(1);
  });

  // TC_LG_008
  it("TC_LG_008 - Login dengan username kosong dan password kosong", () => {
    LoginPage.login(
      data.emptyUsernameEmptyPassword.username,
      data.emptyUsernameEmptyPassword.password
    );
    LoginPage.verifyRequiredMessageCount(2);
  });

  // TC_LG_009
  it("TC_LG_009 - Memastikan tombol Login tersedia dan dapat ditekan", () => {
    LoginPage.elements.loginButton().should("be.visible").and("be.enabled");
    LoginPage.login(data.validUser.username, data.validUser.password);
    LoginPage.verifyLoginSuccess();
  });

  // TC_LG_010
  it("TC_LG_010 - Verifikasi link Forgot your password tersedia dan berfungsi", () => {
    LoginPage.clickForgotPassword();
    LoginPage.verifyForgotPasswordPage();
  });

 // TC_LG_011
it("TC_LG_011 - Login dengan username huruf kecil semua (case sensitive check)", () => {
  LoginPage.login(data.lowercaseUsername.username, data.lowercaseUsername.password);
  LoginPage.verifyLoginSuccess(); 
});

  // TC_LG_012
  it("TC_LG_012 - Login dengan password salah ketik/huruf tidak sesuai", () => {
    LoginPage.login(data.lowercasePassword.username, data.lowercasePassword.password);
    LoginPage.verifyInvalidCredentialsMessage();
  });
// TC_LG_013
it("TC_LG_013 - Login dengan username mengandung spasi di depan/belakang", () => {
  LoginPage.login(data.spacedUsername.username, data.spacedUsername.password);
  LoginPage.verifyInvalidCredentialsMessage();
});

// TC_LG_014
it("TC_LG_014 - Login dengan password mengandung spasi di depan/belakang", () => {
  LoginPage.login(data.spacedPassword.username, data.spacedPassword.password);
  LoginPage.verifyInvalidCredentialsMessage();
});

// TC_LG_015 - Brute force check
it.skip("TC_LG_015 - Login berkali-kali dengan kredensial salah (brute force check)", () => {
  const attempts = 6;
  for (let i = 0; i < attempts; i++) {
    LoginPage.login(
      data.invalidUsernameInvalidPassword.username,
      data.invalidUsernameInvalidPassword.password
    );
    LoginPage.verifyInvalidCredentialsMessage();
    cy.reload();
  }
});

// TC_LG_016
it("TC_LG_016 - Login ulang setelah logout, pastikan tidak bisa akses dashboard via back button", () => {
  LoginPage.login(data.validUser.username, data.validUser.password);
  LoginPage.verifyLoginSuccess();

  LoginPage.logout();
  LoginPage.verifyRedirectedToLogin();

  cy.go("back");
  LoginPage.verifyRedirectedToLogin();
});

// TC_LG_017
it("TC_LG_017 - Login dengan karakter unicode/emoji di username", () => {
  LoginPage.login(data.unicodeUsername.username, data.unicodeUsername.password);
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
  LoginPage.login(data.longUsername.username, data.longUsername.password);
  LoginPage.elements.usernameInput().then(($el) => {
    const maxLength = $el.attr("maxlength");
    cy.log(maxLength ? `Field punya maxlength: ${maxLength}` : "Tidak ada maxlength");
  });
  LoginPage.verifyInvalidCredentialsMessage();
});

// TC_LG_019
it("TC_LG_019 - Login dengan password sangat panjang (boundary test)", () => {
  LoginPage.login(data.longPassword.username, data.longPassword.password);
  LoginPage.verifyInvalidCredentialsMessage();
  });
})