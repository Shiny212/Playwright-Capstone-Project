class LoginPage {
  constructor(page) {
    this.page = page;
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.email = page.locator('#Email');
    this.password = page.locator('#Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
    this.logoutLink = page.getByRole('link', { name: 'Log out' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async openLogin() {
    await this.loginLink.click();
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = LoginPage;