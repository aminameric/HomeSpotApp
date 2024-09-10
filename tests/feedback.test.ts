import { HomePage } from "../core/page-objects/home-page";
import { Builder, By, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver} from "../core/config/driver-setup";
import { readFileSync } from "fs";
import * as path from "path";
import { LoginPage } from "../core/page-objects/login-page";
import { FeedbackPage } from "../core/page-objects/feedback-page";


const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));


let driver: WebDriver;
let homePage: HomePage;
let loginPage: LoginPage;
let feedbackPage: FeedbackPage;


beforeAll(async () => {
    driver = await createDriver(testData.url.home_page);
    homePage = new HomePage(driver);
    loginPage = new LoginPage(driver);
    feedbackPage = new FeedbackPage(driver);
},10000);


test("feedback", async () => {
    await homePage.navigateToHomePage();
    await homePage.clickInButton();
    await loginPage.enterEmail2();
    await loginPage.enterPassword();
    await loginPage.clickLogin();
    await feedbackPage.clickContact();
    await feedbackPage.enterName();
    await feedbackPage.enterEmail();
    await feedbackPage.enterSubject();
    await feedbackPage.enterMessage();
    await feedbackPage.clickSend();
    await feedbackPage.checkText();
    
    

},200000);


/*afterAll(async () => {
    await quitDriver(driver);
},10000);*/