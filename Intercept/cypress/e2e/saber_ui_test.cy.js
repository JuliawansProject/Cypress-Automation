describe('Verifikasi fungsi login', () => {

    it('TC01 - Login menggunakan username valid dan password valid', () => {

        cy.visit('https://www.saucedemo.com/')

        // Input username
        cy.get('[data-test="username"]')
            .type('standard_user')

        // Input password
        cy.get('[data-test="password"]')
            .type('secret_sauce')

        // Klik tombol login
        cy.get('[data-test="login-button"]')
            .click()

        // Verifikasi berhasil login
        cy.url()
            .should('include', '/inventory.html')

    })

})