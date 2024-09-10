import { HomePage } from "../core/page-objects/home-page";
import { Builder, By, WebDriver } from "selenium-webdriver";
import { createDriver, quitDriver} from "../core/config/driver-setup";
import { readFileSync } from "fs";
import * as path from "path";
import { LoginPage } from "../core/page-objects/login-page";
import { EditPropertyPage } from "../core/page-objects/editproperty-page";


const dataFilePath = path.resolve(__dirname, "../core/data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));


let driver: WebDriver;
let homePage: HomePage;
let loginPage: LoginPage;
let editPropertyPage: EditPropertyPage;


beforeAll(async () => {
    driver = await createDriver(testData.url.home_page);
    homePage = new HomePage(driver);
    loginPage = new LoginPage(driver);
    editPropertyPage = new EditPropertyPage(driver);
},10000);


test("edit property", async () => {
    await homePage.navigateToHomePage();
    await homePage.clickInButton();
    await loginPage.enterEmail();
    await loginPage.enterPassword();
    await loginPage.clickLogin();
    await editPropertyPage.clickProp();
    await editPropertyPage.openProp();
    await editPropertyPage.editPropButton();
    await editPropertyPage.enterPropName();
    await editPropertyPage.clickSubmit();
    
    

},200000);


/*afterAll(async () => {
    await quitDriver(driver);
},10000);*/