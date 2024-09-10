import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";


const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class LoginPage extends BasePage {

    private username = By.id("username");
    private password = By.id("password");
    private loginButton = By.id('login-button');
    private profile = By.xpath('//div[@class="sc-cHGsZl header__logged dJEtQg"]//span[@class="_with-chevron"]');
    
    constructor(driver: WebDriver) {
        super(driver);
    }
    async enterEmail() {
        await this.fillInputField(this.username, testData.data.username1);
    }
    async enterPassword() {
        await this.fillInputField(this.password, testData.data.password1);
    }
    async enterPassword2() {
        await this.fillInputField(this.password, testData.data.password2);
    }
    async clickLogin() {
        await this.findElementAndClick(this.loginButton);
    }
    
}