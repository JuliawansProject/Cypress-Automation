describe("SauceDemo", () => {

  it("Berhasil login", () => {
    cy.visit("/");

    cy.get('[data-test="username"]')
      .type("standard_user");

    cy.get('[data-test="password"]')
      .type("secret_sauce");

    cy.get('[data-test="login-button"]')
      .click();

    cy.url()
      .should("include", "/inventory.html");

    cy.get(".title")
      .should("have.text", "Products");
  });


  it("Melihat detail produk", () => {
    // Login
    cy.visit("/");

    cy.get('[data-test="username"]')
      .type("standard_user");

    cy.get('[data-test="password"]')
      .type("secret_sauce");

    cy.get('[data-test="login-button"]')
      .click();

    // Pastikan berada di halaman produk
    cy.url()
      .should("include", "/inventory.html");

    // Klik produk Sauce Labs Backpack
    cy.get('[data-test="inventory-item-name"]')
      .first()
      .click();

    // Pastikan masuk ke halaman detail produk
    cy.url()
      .should("include", "/inventory-item.html");

    // Assertion nama produk
    cy.get('[data-test="inventory-item-name"]')
      .should("be.visible")
      .and("have.text", "Sauce Labs Backpack");

    // Assertion harga produk
    cy.get('[data-test="inventory-item-price"]')
      .should("be.visible");

    // Assertion deskripsi produk
    cy.get('[data-test="inventory-item-desc"]')
      .should("be.visible");

    // Tombol Add to Cart harus tersedia
    cy.get('[data-test="add-to-cart"]')
      .should("be.visible")
      .and("contain", "Add to cart");
  });

});