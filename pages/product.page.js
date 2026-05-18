class ProductPage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async searchProduct(productName) {
    await this.searchBox.fill(productName);
    await this.searchButton.click();
  }

  async openBooksCategory() {
    await this.page.getByRole('link', { name: 'Books' }).first().click();
  }
}

module.exports = ProductPage;