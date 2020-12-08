/// <reference types="cypress" />
/* eslint-disable */

describe('Test - All login/sign up triggers', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
    cy.get('#login_modal').as('modal');
    cy.get('#login_modal .bx--modal-close').as('close');
    cy.get('nav a.bx--header__name.menu_item[href="/"]').as('home');
  });

  it('Activates and closes each trigger', () => {
    // Confirm modal is hidden
    cy.get('@modal').should('be.hidden');
    // Click all login / sign up triggers
    cy.get('.auth-type').each(($el, index) => {
      cy.get($el).click();
      // Assert that each one is visible at the time
      cy.get('@modal').should('be.visible');
      // Close modal and confirm that it is hidden
      cy.get('@close').click();
      cy.get('@modal').should('be.hidden');
    });
  });

  it('Modal switches between login and sign up', () => {
    // Confirm modal is hidden
    cy.get('@modal').should('be.hidden');
    // Click initial "log in" button in navbar
    cy.get('#loginNav').click();
    // Assert that modal is visible at the time
    cy.get('@modal').should('be.visible');

    // Switch to "register" state
    cy.get('button[data-auth-type="register"]').click();

    // Confirm modal is in "register" state
    cy.get('form[data-modal-auth-type="register"]').should('exist');
    
    // Close modal & confirm it's closed
    cy.get('@close').click();
    cy.get('@modal').should('be.hidden');
  });

  it('Test form error handling', () => {
    // Confirm modal is hidden
    cy.get('@modal').should('be.hidden');

    // Activate register modal
    cy.get('#registerBtn').click();
    cy.get('@modal').should('be.visible');

    // Type in first input display name, "foo"
    cy.get('#displayName').type('foo');
    cy.get('#emailRegister').focus();

    // Assert error is shown "Display Name must be more than 3 characters!"
    cy.get('.error_container').should('be.visible')
      .contains('Display Name must be more than 3 characters!');

    // Type "foobar"
    cy.get('#displayName').type('foobar');
    cy.get('.error_container').should('not.exist');

    // Type in email "foo"
    cy.get('#emailRegister').type('foo');

    // Click "register"/submit button
    cy.get('.submit-auth').click();

    // Assert focus is on email input
    cy.focused()
      .should('have.id', 'emailRegister');
    cy.get('#emailRegister')
      .type('foo@bar.com');

    // Type in password 1 input "foo"
    cy.get('#password-1').type('foo');

    // Type in password 2 input "bar"
    cy.get('#password-2').type('bar');

    // Assert error is shown "Passwords must match!"
    cy.get('.error_container').should('be.visible')
      .contains('Passwords must match!');

    // Go to "login" state
    cy.get('button[data-auth-type="login"]').should('be.visible')
      .click();

    // Type incorrect username & password
    cy.get('#loginEmail').type('foo@mail.com');
    cy.get('#loginPassword').type('bar');

    // Click "login"
    cy.get('.submit-auth').click();

    // Assert error is shown
    cy.get('.error_container').should('be.visible');

    // Close modal & confirm it's closed
    cy.get('@close').click();
    cy.get('@modal').should('be.hidden');
  });

  it('Try and test different routes', () => {
    // Click "About" in footer
    cy.get('footer a[href="/about"]').click();
    // Assert correct route
    cy.url().should('include', '/about');
    // Click "Home" in navbar
    cy.get('@home').click();
    // Assert correct route
    cy.url().should('include', '/login');
  });

  it('Accessibility checks', () => {
    cy.get('#loginNav').click();
    cy.get('@modal').should('be.visible');

    // We should be focused on the close button
    cy.focused()
      .should('be.visible')
      .should('have.attr', 'class', 'bx--modal-close');

    cy.get('legend.type-auth_title')
      .should('be.visible')
      .contains('Login');

    cy.get('input#loginEmail')
      .should('have.attr', 'required');

    cy.get('input#loginPassword')
      .should('have.attr', 'required');

    cy.get('button[data-auth-type="register"]').click();

    // Focus should stay on button
    cy.get('button[data-auth-type="login"]').should('have.focus');

    cy.get('legend.type-auth_title')
      .should('be.visible')
      .contains('Create Account');

    cy.get('input#displayName')
      .should('have.attr', 'required');

    cy.get('input#emailRegister')
      .should('have.attr', 'required');

    cy.get('input#password-1')
      .should('have.attr', 'required');

    cy.get('input#password-2')
      .should('have.attr', 'required');
  });
});