import { By, WebDriver, until } from "selenium-webdriver";
import BasePage from "./base-page";
import { readFileSync } from "fs";
import * as path from "path";


const dataFilePath = path.resolve(__dirname, "../data/data.json");
const testData = JSON.parse(readFileSync(dataFilePath, "utf8"));

export class FeedbackPage extends BasePage {

    private contact = By.xpath('//*[@id="contact-nav"]');
    private name = By.xpath('//*[@id="contact"]/div/div[2]/div[2]/form/div/div[1]/input');
    private email = By.xpath('//*[@id="contact"]/div/div[2]/div[2]/form/div/div[2]/input');
    private subject = By.xpath('//*[@id="contact"]/div/div[2]/div[2]/form/div/div[3]/input');
    private message = By.xpath('//*[@id="contact"]/div/div[2]/div[2]/form/div/div[4]/textarea');
    private sendMessage =By.xpath('//*[@id="contact"]/div/div[2]/div[2]/form/div/div[5]/button');
    private text = By.xpath('//*[@id="contact"]/div/div[2]/div[2]/form/div/div[5]/div[3]');
    
    constructor(driver: WebDriver) {
        super(driver);
    }
    async clickContact() {
        await this.findElementAndClick(this.contact);
    }
    async enterName() {
        await this.fillInputField(this.name, testData.feedback.name);
    }
    async enterEmail() {
        await this.fillInputField(this.email, testData.feedback.email);
    }
    async enterSubject() {
        await this.fillInputField(this.subject, testData.feedback.subject);
    }
    async enterMessage() {
        await this.fillInputField(this.message, testData.feedback.message);
    }
    async clickSend() {
        await this.waitForElement(this.sendMessage, 50000); 
        const sendMessageButton = await this.driver.findElement(this.sendMessage);
        // Scroll the button into view
        await this.driver.executeScript("arguments[0].scrollIntoView(true);", sendMessageButton);
        // Add a small delay 
        await this.driver.sleep(500);
        await this.findElementAndClick(this.sendMessage);
    }
    
    async checkText(){
        await this.checkMatchingElements(this.text,'Your message has been sent. Thank you!');
    }
    
}