import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";


const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class AddPropertyPage extends BasePage {
    
    private propNav = By.xpath('//*[@id="properties-nav"]');
    private addButton = By.id('new-prop');
    private propName = By.id('name');
    private propDescription = By.id('description');
    private propArea = By.id('size');
    private propBedrooms = By.id('bedrooms');
    private propBathrooms = By.id('bathrooms');
    private propPrice=By.id('price');
    private drop1= By.xpath('//*[@id="select2-property_type-container"]/span');
    private drop1Choose = By.xpath('//*[@id="myModal"]/span/span/span[1]/input');
    private propAddress = By.id('street_address');
    private propCity = By.id('city');
    private drop2=By.xpath('//*[@id="select2-country-container"]/span');
    private drop2Choose= By.xpath('//*[@id="myModal"]/span/span/span[1]/input');
    private postalCode= By.id('postal_code');
    private propSubmitButton = By.xpath('//*[@id="property-form"]/div[2]/button[2]');

   
    constructor(driver: WebDriver) {
        super(driver);
    }
    async clickProp() {
        await this.findElementAndClick(this.propNav);
    }
    async openProp() {
        await this.findElementAndClick(this.addButton);
    }
    async enterPropName() {
        await this.fillInputField(this.propName, testData.prop.name);
    }
    async enterPropDescription() {
        await this.fillInputField(this.propDescription, testData.prop.description);
    }
    async enterPropArea() {
        await this.fillInputField(this.propArea, testData.prop.area);
    }
    async enterPropBedrooms() {
        await this.fillInputField(this.propBedrooms, testData.prop.bedrooms);
    }
    async enterPropBathrooms() {
        await this.fillInputField(this.propBathrooms, testData.prop.bathrooms);
    }
    async enterPropPrice() {
        await this.fillInputField(this.propPrice, testData.prop.price);
    }
    async clickFirstDrop() {
        await this.findElementAndClick(this.drop1);
    }
    async clickFirstDropChoose() {
        await this.fillInputField(this.drop1Choose, testData.prop.type)
    }
    async enterPropAddress() {
        await this.fillInputField(this.propAddress, testData.prop.street_address);
    }
    async enterPropCity() {
        await this.fillInputField(this.propCity, testData.prop.city);
    }
    async clickSecondDrop() {
        await this.findElementAndClick(this.drop2);
    }
    async enterPropCountry() {
        await this.fillInputField(this.drop2Choose, testData.prop.country);
    }
    async enterPropPostalCode() {
        await this.fillInputField(this.postalCode, testData.prop.postal_code);
    }
    async clickSubmit() {
        await this.findElementAndClick(this.propSubmitButton);
    }
    
}