// const chromium = require('chrome-aws-lambda');
// const puppeteer = require('puppeteer-core');
// const cheerio = require('cheerio');

// export default async function handler(req, res){
//     const url = 'https://www.business-standard.com/advance-search?keyword=zomato';
    
//     let browser;
//     try {
//         const executablePath = await chromium.executablePath || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'; // Local Chrome path for testing

//         browser = await puppeteer.launch({
//             args: chromium.args,
//             defaultViewport: chromium.defaultViewport,
//             executablePath,
//             headless: true,
//             ignoreHTTPSErrors: true,
//         });

//         const page = await browser.newPage();
//         await page.goto(url, { waitUntil: 'networkidle2' });

//         const content = await page.content();
//         const $ = cheerio.load(content);
// a
//         const articles = [];

//         $('.cardlist').each((i, el) => {
//             const headline = $(el).find('a.smallcard-title').text().trim() || $(el).find('h3 a.smallcard-title').text().trim() || $(el).find('h4 a.smallcard-title').text().trim();
//             const paragraph = $(el).find('.bookreview-title').text().trim();
//             const date = $(el).find('.listingstyle_updtText__lnZb7 span').first().text().trim();

//             articles.push({ headline, paragraph, date });
//         });

//         res.status(200).json({ success: true, articles });
//     } catch (error) {
//         console.error('Error fetching the website:', error);
//         res.status(500).json({ success: false, error: error.message });
//     } finally {
//         if (browser) {
//             await browser.close();
//         }
//     }
// };


// import puppeteer from 'puppeteer-core';
// import chrome from 'chrome-aws-lambda';

// const isLocal = process.env.NODE_ENV !== 'production';

// export default async function handler(req, res) {
//     let browser = null;

//     try {
//         browser = await puppeteer.launch({
//             args: chrome.args,
//             executablePath: isLocal
//                 ? puppeteer.executablePath()
//                 : await chrome.executablePath,
//             headless: true,
//         });

//         const page = await browser.newPage();
//         await page.goto('https://www.example.com', { waitUntil: 'networkidle2' });

//         const data = await page.evaluate(() => {
//             return {
//                 title: document.title,
//                 content: document.body.innerText,
//             };
//         });

//         res.status(200).json(data);
//     } catch (error) {
//         console.error('Error fetching the website:', error);
//         res.status(500).json({ error: 'Error fetching the website' });
//     } finally {
//         if (browser !== null) {
//             await browser.close();
//         }
//     }
// }



// import axios from 'axios';
const axios = require('axios');
// import cheerio from 'cheerio';
const cheerio = require('cheerio');

export default async function handler(req, res) {
  const url = 'https://techcrunch.com/?s=zepto'; // Replace with the specific URL if needed

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const articles = [];

    $('li.wp-block-post').each((i, element) => {
      const title = $(element).find('h2.wp-block-post-title a').text().trim();
      const date = $(element).find('time').text().trim();
      const firstPara = $(element).find('.wp-block-post-excerpt p').text().split('.')[0].replace('…','.').replace('. ', '') + '.';

      articles.push({ title, date, firstPara });
    });

    // Respond with the articles array as JSON
    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching the page:', error);
    res.status(500).json({ error: 'Failed to scrape articles' });
  }
}
