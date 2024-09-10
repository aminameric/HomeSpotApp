import { HomePage } from "../core/page-objects/home-page";
import { Builder, By, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver} from "../core/config/driver-setup";
import { readFileSync } from "fs";
import * as path from "path";
import { LoginPage } from "../core/page-objects/login-page";
import { BuyPropertyPage } from "../core/page-objects/buyproperty-page";


const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));


let driver: WebDriver;
let homePage: HomePage;
let loginPage: LoginPage;
let buyPropertyPage: BuyPropertyPage;


beforeAll(async () => {
    driver = await createDriver(testData.url.home_page);
    homePage = new HomePage(driver);
    loginPage = new LoginPage(driver);
    buyPropertyPage = new BuyPropertyPage(driver);
},10000);


test("reserve property", async () => {
    await homePage.navigateToHomePage();
    await homePage.clickInButton();
    await loginPage.enterEmail2();
    await loginPage.enterPassword();
    await loginPage.clickLogin();
    await buyPropertyPage.clickProp();
    await buyPropertyPage.openProp();
    await buyPropertyPage.buyPropButton();
    await buyPropertyPage.enterCardDetails();
    await buyPropertyPage.enterCardName();
    await buyPropertyPage.enterCardDate();
    await buyPropertyPage.enterCardCVC();
    await buyPropertyPage.clickSubmit();
    
    

},200000);


/*afterAll(async () => {
    await quitDriver(driver);
},10000);*/