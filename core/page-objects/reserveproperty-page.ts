import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";


const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class ReservePropertyPage extends BasePage {
    
    private propNav = By.xpath('//*[@id="properties-nav"]');
    private property = By.xpath('//*[@id="real-estate"]/div/div/div[1]/div');
    private reserveButton = By.xpath('//*[@id="reserveBtn"]');
    private reserveDate = By.xpath('//*[@id="reservation-date"]');
    private comment = By.xpath('//*[@id="reservation-comments"]');
    private saveReserveButton = By.xpath('//*[@id="save-property-btn"]');

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
    
    async reservePropButton() {
        await this.waitForElement(this.reserveButton, 30000);
        const reserveButtonElement = await this.driver.findElement(this.reserveButton);
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", reserveButtonElement);
        await this.driver.sleep(500); 
        await this.findElementAndClick(this.reserveButton);
    }
    
    async enterReserveDate() {
        await this.fillInputField(this.reserveDate, testData.prop.reserveDate);
    }
    async enterReserveComment() {
        await this.fillInputField(this.comment, testData.prop.comment);
    }
    async clickSubmit() {
        await this.findElementAndClick(this.saveReserveButton);
    }
    
}