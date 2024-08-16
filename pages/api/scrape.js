const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');

module.exports = async (req, res) => {
    const url = 'https://www.business-standard.com/advance-search?keyword=zomato';
    
    let browser;
    try {
        const executablePath = await chromium.executablePath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // Local Chrome path for testing

        browser = await puppeteer.launch({
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const content = await page.content();
        const $ = cheerio.load(content);

        const articles = [];

        $('.cardlist').each((i, el) => {
            const headline = $(el).find('a.smallcard-title').text().trim() || $(el).find('h3 a.smallcard-title').text().trim() || $(el).find('h4 a.smallcard-title').text().trim();
            const paragraph = $(el).find('.bookreview-title').text().trim();
            const date = $(el).find('.listingstyle_updtText__lnZb7 span').first().text().trim();

            articles.push({ headline, paragraph, date });
        });

        res.status(200).json({ success: true, articles });
    } catch (error) {
        console.error('Error fetching the website:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
