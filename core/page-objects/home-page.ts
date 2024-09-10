import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";


export class HomePage extends BasePage {
    
    private logo = By.className("sitename");
    private login_button = By.id("login-btn");
    private registration_button = By.id("register-btn")

    constructor(driver: WebDriver) {
        super(driver);
    }

    
    async navigateToHomePage() {
        await this.driver.findElement(this.logo).click();
    }
    async clickInButton(){
        await this.findElementAndClick(this.login_button);
    }
    async clickRegistrationButton(){
        await this.findElementAndClick(this.registration_button);
    }
}