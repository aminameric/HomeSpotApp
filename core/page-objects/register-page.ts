import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";


const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class RegistrationPage extends BasePage {

    private inputNameField = By.id('name');
    private inputSurnameField = By.id('surname');
    private inputUsernameField = By.id('username');
    private UserType = By.xpath('//*[@id="dropdown-button"]');
    private UserTypeSelect = By.xpath('//*[@id="dropdown-menu"]/a[2]');
    private email = By.id('email');
    private password = By.id('password');
    private regButton = By.xpath('//*[@id="regbutton"]');

    constructor(driver: WebDriver) {
        super(driver);
    }

    
    async enterName() {
        await this.fillInputField(this.inputNameField, testData.credentials.name);
    }

    async enterSurname() {
        await this.fillInputField(this.inputSurnameField, testData.credentials.last_name);
    }

    async enterUsername() {
        await this.fillInputField(this.inputUsernameField, testData.credentials.username3);
    }

    async UserTypeChoose(){
        await this.findElementAndClick(this.UserType);
    }

    async clickOnUserTypeSelect(){
        await this.waitForElement(this.UserTypeSelect, 10000);
        await this.findElementAndClick(this.UserTypeSelect);
    }

    async enterEmail() {
        await this.fillInputField(this.email, testData.credentials.email);
    }

    async enterPassword() {
        await this.fillInputField(this.password, testData.credentials.password);
    }

    async clickReg() {
        await this.waitForElement(this.regButton, 10000);
        
        const regButtonElement = await this.driver.findElement(this.regButton);
    
        // Scroll the element into view
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", regButtonElement);
    
        // Ensure the element is located, visible, and enabled
        await this.driver.wait(until.elementLocated(this.regButton), 10000);
        await this.driver.wait(async () => {
            const isDisplayed = await regButtonElement.isDisplayed();
            const isEnabled = await regButtonElement.isEnabled();
            return isDisplayed && isEnabled;
        }, 10000);
    
        // Click using JavaScript to bypass any intercepts
        await this.driver.executeScript("arguments[0].click();", regButtonElement);
    }
    
    
    
    
}