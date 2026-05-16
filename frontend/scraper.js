const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Intercept network requests to find the JSON URL
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('.json') || url.includes('.lottie')) {
      console.log('FOUND URL:', url);
    }
  });

  await page.goto('https://lottiefiles.com/free-animation/404-error-page-with-cat-ZltNpefmQj');
  
  // Wait a bit for animations to load
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
