![439001856-caff6caa-814c-4f89-a6b1-86e5d71518c5 (2)](https://github.com/user-attachments/assets/f51518a3-4d16-48fe-b67c-4b469ec4a68e)

<!-- ![hcaptcha solver screenshot](https://github.com/user-attachments/assets/cf327968-7229-45b1-bf5c-8baa8d7e8230) -->

# hcaptcha solver puppeteer

This sample demonstrates how to automatically solve an hCaptcha using JavaScript with the Puppeteer library. It leverages the 2captcha.com service to handle the captcha challenge found on the page https://democaptcha.com/demo-form-eng/hcaptcha.html. An active 2captcha.com account is necessary for this example to function.

## Demo:
![image](https://github.com/user-attachments/assets/33e28113-d6c5-4561-a8b2-a0c4b7dcac23)

## How to Get Started

1. Clone the Repository
   
   Clone this repository to your local machine:
 
   ```
   git clone https://github.com/clemmie24m/solving-hCaptcha-using-puppeteer.git
   ```

2. Install Dependencies
   
   Navigate to the project directory and install the required packages:
   ```
   npm install
   ```
   
3. Configure the Application
   Set your APIKEY in the `./index.js` file.
   > Note: Your APIKEY is available in your personal account at 2captcha.com. Before copying, ensure that your account has the "developer" role enabled. (Because even captchas need a VIP pass sometimes!)

4. Start the Application
   Launch the application using the following command:
   ```
   npm run start
   ```
   
   Now you're all set to let your code handle the heavy lifting – solving captchas so you don't have to. Happy coding! 🚀

## Source code:
Source code [index.js](/index.js):
```js
import puppeteer from "puppeteer";
import { Solver } from "2captcha-ts";

const API_KEY = "2captcha_api_key"; // Your 2captcha API key
const SITEKEY = "338af34c-7bcb-4c7c-900b-acbec73d7d43"
const PAGE_URL = "https://democaptcha.com/demo-form-eng/hcaptcha.html"
const HEADLESS = false
const solver = new Solver(API_KEY);

;(async () => {
  const browser = await puppeteer.launch({
    headless: HEADLESS,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  // Open target page
  await page.goto(PAGE_URL);
  await page.waitForSelector("form.recaptcha_demo_form");

  // Send a captcha to the 2captcha service to get a solution
  const res = await solver.hcaptcha({
    pageurl: PAGE_URL,
    sitekey: SITEKEY,
  });

  console.log(res);

  // The resulting solution
  const captchaAnswer = res.data;

  // Use the resulting solution on the page
  const setAnswer = await page.evaluate((captchaAnswer) => {
    document.querySelector("textarea[name='h-captcha-response']").value =
      captchaAnswer;
    document.querySelector("textarea[name='g-recaptcha-response']").value =
      captchaAnswer;
  }, captchaAnswer);

  // Press the button to check the result.
  await page.click('input[type="submit"]');

  // Waiting for the <h2> element with the desired text to appear
  await page.waitForFunction(() => {
    const h2 = document.querySelector('h2');
    return h2 && h2.textContent.trim() === 'Thank you, your message "" was posted!';
  }, { timeout: 30000 }); // wait 30seconds

  // After the element appears, we output a message to the console.
  console.log("The captcha has been successfully completed!");

})();
```
