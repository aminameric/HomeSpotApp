import { HomePage } from "../core/page-objects/home-page";
import { Builder, By, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver} from "../core/config/driver-setup";
import { readFileSync } from "fs";
import * as path from "path";
import { LoginPage } from "../core/page-objects/login-page";
import { AddPropertyPage } from "../core/page-objects/addproperty-page";


const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));


let driver: WebDriver;
let homePage: HomePage;
let loginPage: LoginPage;
let addPropertyPage: AddPropertyPage;


beforeAll(async () => {
    driver = await createDriver(testData.url.home_page);
    homePage = new HomePage(driver);
    loginPage = new LoginPage(driver);
    addPropertyPage = new AddPropertyPage(driver);
},10000);


test("user registration", async () => {
    await homePage.navigateToHomePage();
    await homePage.clickInButton();
    await loginPage.enterEmail();
    await loginPage.enterPassword();
    await loginPage.clickLogin();
    await addPropertyPage.clickProp();
    await addPropertyPage.openProp();
    await addPropertyPage.enterPropName();
    await addPropertyPage.enterPropDescription();
    await addPropertyPage.enterPropArea();
    await addPropertyPage.enterPropBedrooms();
    await addPropertyPage.enterPropBathrooms();
    await addPropertyPage.enterPropPrice();
    await addPropertyPage.clickFirstDrop();
    await addPropertyPage.clickFirstDropChoose();
    await addPropertyPage.enterPropAddress();
    await addPropertyPage.enterPropCity();
    await addPropertyPage.clickSecondDrop();
    await addPropertyPage.enterPropCountry();
    await addPropertyPage.enterPropPostalCode();
    await addPropertyPage.clickSubmit();
    

},200000);


afterAll(async () => {
    await quitDriver(driver);
},10000);