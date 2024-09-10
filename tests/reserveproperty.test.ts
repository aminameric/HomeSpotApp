import { HomePage } from "../core/page-objects/home-page";
import { Builder, By, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver} from "../core/config/driver-setup";
import { readFileSync } from "fs";
import * as path from "path";
import { LoginPage } from "../core/page-objects/login-page";
import { ReservePropertyPage } from "../core/page-objects/reserveproperty-page";


const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));


let driver: WebDriver;
let homePage: HomePage;
let loginPage: LoginPage;
let reservePropertyPage: ReservePropertyPage;


beforeAll(async () => {
    driver = await createDriver(testData.url.home_page);
    homePage = new HomePage(driver);
    loginPage = new LoginPage(driver);
    reservePropertyPage = new ReservePropertyPage(driver);
},10000);


test("reserve property", async () => {
    await homePage.navigateToHomePage();
    await homePage.clickInButton();
    await loginPage.enterEmail2();
    await loginPage.enterPassword();
    await loginPage.clickLogin();
    await reservePropertyPage.clickProp();
    await reservePropertyPage.openProp();
    await reservePropertyPage.reservePropButton();
    await reservePropertyPage.enterReserveDate();
    await reservePropertyPage.enterReserveComment();
    await reservePropertyPage.clickSubmit();
    
    

},200000);


afterAll(async () => {
    await quitDriver(driver);
},10000);