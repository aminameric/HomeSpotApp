import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";


const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class BuyPropertyPage extends BasePage {
    
    private propNav = By.xpath('//*[@id="properties-nav"]');
    private property = By.xpath('//*[@id="real-estate"]/div/div/div[1]/div');
    private buyButoon = By.xpath('//*[@id="buyBtn"]');
    private cardDetails = By.xpath('//*[@id="card-number"]');
    private cardName = By.xpath('//*[@id="card-holder-name"]');
    private cardDate = By.xpath('//*[@id="expiry-date"]');
    private cardCVC = By.xpath('//*[@id="cvc"]');
    private savePaymentButton = By.xpath('//*[@id="submit-buy-btn"]');
   
    constructor(driver: WebDriver) {
        super(driver);
    }
    async clickProp() {
        await this.findElementAndClick(this.propNav);
    }
    async openProp() {
        await this.waitForElement(this.property, 50000); 
        const propertyElement = await this.driver.findElement(this.property); 
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", propertyElement);
        await this.driver.executeScript("arguments[0].click();", propertyElement);
    }
    
    async buyPropButton() {
        await this.waitForElement(this.buyButoon, 30000);
    
        const buyButtonElement = await this.driver.findElement(this.buyButoon);
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", buyButtonElement);
        await this.driver.sleep(500);  
        await this.findElementAndClick(this.buyButoon);
    }
    
    async enterCardDetails() {
        await this.fillInputField(this.cardDetails, testData.card.number);
    }
    async enterCardName() {
        await this.fillInputField(this.cardName, testData.card.name);
    }
    async enterCardDate() {
        await this.fillInputField(this.cardDate, testData.card.date);
    }
    async enterCardCVC() {
        await this.fillInputField(this.cardCVC, testData.card.cvc);
    }
    async clickSubmit() {
        await this.waitForElement(this.savePaymentButton, 30000);
    
        const savePaymentButtonElement = await this.driver.findElement(this.savePaymentButton);
    
        // Ensure the button is visible and enabled
        await this.driver.wait(async () => {
            const isDisplayed = await savePaymentButtonElement.isDisplayed();
            const isEnabled = await savePaymentButtonElement.isEnabled();
            return isDisplayed && isEnabled;
        }, 10000);
    
        // Scroll into view if needed
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", savePaymentButtonElement);
    
        // Click using JavaScript (to avoid interception issues)
        await this.driver.executeScript("arguments[0].click();", savePaymentButtonElement);
    
       
    }
    
    
    
}