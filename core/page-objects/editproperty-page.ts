import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";


const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class EditPropertyPage extends BasePage {
    
    private propNav = By.xpath('//*[@id="properties-nav"]');
    private property = By.xpath('//*[@id="real-estate"]/div/div/div[1]/div');
    private editButoon = By.xpath('/html/body/section/main/section[5]/main/section/div/div/div/div[1]/div[3]/button[1]');
    private newPropName = By.id('property-name-input');
    private saveChangesButton = By.id('save-property-btn1');
   
    constructor(driver: WebDriver) {
        super(driver);
    }
    async clickProp() {
        await this.findElementAndClick(this.propNav);
    }
    async openProp() {
        await this.waitForElement(this.property, 50000);
        
        const propertyElement = await this.driver.findElement(this.property);
        
        // Scroll the element into view
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", propertyElement);
        
        // Use JavaScript to perform the click, bypassing the interception issue
        await this.driver.executeScript("arguments[0].click();", propertyElement);
    }
    
    async editPropButton() {
        // Wait for the button to be visible
        await this.waitForElement(this.editButoon, 30000);
    
        const editButtonElement = await this.driver.findElement(this.editButoon);
    
        // Scroll the button into view before attempting to click
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", editButtonElement);
    
        // Wait a bit for the page to scroll and ensure the element is fully in view
        await this.driver.sleep(500);  
    
        // Now try clicking the button
        await this.findElementAndClick(this.editButoon);
    }
    
    async enterPropName() {
        await this.fillInputField(this.newPropName, testData.prop.newName);
    }
    async clickSubmit() {
        await this.findElementAndClick(this.saveChangesButton);
    }
    
}