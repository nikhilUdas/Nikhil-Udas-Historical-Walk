describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should login successfully with provided credentials', async () => {
    // 1. Navigate from Index to Login
    await expect(element(by.id('getStartedButton'))).toBeVisible();
    await element(by.id('getStartedButton')).tap();

    // 2. Perform Login
    await expect(element(by.id('emailInput'))).toBeVisible();
    await element(by.id('emailInput')).typeText('nikhiludas38@gmail.com');
    await element(by.id('passwordInput')).typeText('123456');
    
    // Dismiss keyboard if necessary (often needed on Android)
    await element(by.id('loginButton')).tap();

    // 3. Verify Home Screen after login
    // Successful login navigates to /navigationbar which contains /home
    await expect(element(by.id('homeGreeting'))).toBeVisible();
  });
});
