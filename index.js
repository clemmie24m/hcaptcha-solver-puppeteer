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
