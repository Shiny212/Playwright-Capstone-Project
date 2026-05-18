class CartPage {
  constructor(page) {
    this.page = page;
    this.cartLink = page.getByRole('link', { name: /Shopping cart/ });
    this.termsCheckbox = page.locator('#termsofservice');
    this.checkoutButton = page.locator('#checkout');
  }

  async openCart() {
    await this.cartLink.click();
  }

  async acceptTerms() {
    await this.termsCheckbox.check();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

module.exports = CartPage;