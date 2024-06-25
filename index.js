const puppeteer = require("puppeteer");
require("dotenv").config();

const url = process.env.URL;
const intern_job = "jobs"; // jobs/internships
const keyword = "AskMeOffers";
let n = 3;

const startAutoApply = async () => {
    try {
        // Path to the full version of chrome
        const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

        // Launching the browser instance
        const browser = await puppeteer.launch({
            headless: false,
            executablePath: chromePath,
            defaultViewport: null,
            // slowMo: 100,
            args: ["--start-maximized"],
        });
    
        // Opening a new browser tab/page
        const page = await browser.newPage();
        
        await page.goto("chrome://newtab"); // Navigating to default chrome tab/page
        await page.goto(url, { waitUntil: 'networkidle2'}); // Navigating to main url
    
        await waitAndAction(page, "button.login-cta", "click");
        
        // logging to url
        await waitAndAction(page, "input[type='email']", "type", process.env.EMAIL);
        await waitAndAction(page, "input[type='password']", "type", process.env.PASSWORD);
        await waitAndAction(page, "#modal_login_submit", 'click');
        
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        const dashboardUrl = `${url}/student/dashboard`;
        if(page.url() !== dashboardUrl){
            throw new Error("Login failed");
        }

        // going to jobs/internship page
        await page.goto(`${url}/${intern_job}`, { waitUntil: 'networkidle2' })
        // fitering jobs according to profile
        const profile = `${url}/${intern_job}/keywords-${keyword}`;
        await page.goto(profile, { waitUntil: 'networkidle2' });

        let i = 0;
        while (i<n){
            // applying to jobs
            const allJobs = await page.$$(".internship_meta");
            const jobs = allJobs.slice(1,2);
            let jobSelector = jobs[0];
            // await page.waitForSelector(jobSelector, { visible: true });
            await jobSelector.click();
            
            // opening modal
            try {
                // const buttons = await page.$$("continue_button"); // just to have a wait for button
                // await page.click(".modal-body.easy-apply")
                await page.waitForSelector("#continue_button", { visible: true });
                await page.click("#continue_button", { delay: 1000 });
                await apply(page);
                console.log(`Applied to the job ${i+1}`);
                
                await page.goto(profile, { waitUntil: 'networkidle2' });
            } catch (error) {
                console.log("Error:", error.message);
                console.log(error);
            }
            i++;
        }

        // logout from the browser
        await page.goto(`${url}/logout`, { waitUntil: 'networkidle2' });
    } catch (error) {
        console.log(error.message);
        console.log("Error:", error);
    }

}

const apply = async (page) => {
    if(await checkSelector(page, ".ql-editor")){
        await waitAndAction(page, ".ql-editor", 'type', "Hi, My name is Anish Garg.");
    }

    if(await checkSelector(page, "input[name='location_single']")){
        await waitAndAction(page, "input[name='location_single']", 'click');
    }

    const assessmentSelector = await page.$$("textarea[placeholder='Enter text ...']");
    for(const area of assessmentSelector){
        await area.type("Yes", { delay: 100 });
    }

    if(await checkSelector(page, "#radio1")){
        await waitAndAction(page, "#radio1", 'click');
    }

    if(await checkSelector(page, "input[type='submit']")){
        await waitAndAction(page, "input[type='submit']", 'click');
    }

}

const checkSelector = async (page, selector) => {
    const element = await page.$(selector);
    return element !== null;
}

const waitAndAction = async (page, selector, action, typedText) => {
    try {
        await page.waitForSelector(selector, { visible: true });
        if(action === 'click'){
            await page.click(selector, { delay: 100 });
        }
        if(action === 'type'){
            await page.type(selector, typedText, { delay: 100 });
        }
    } catch (error) {
        console.log(error.message);
        console.log("Error:", error);
    }
}

startAutoApply();