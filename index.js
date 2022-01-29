const puppeteer = require('puppeteer');
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const start = async () => {
    await rl.question("Please enter the search term ? ", async function (searchText) {
       await  run(searchText).then(console.log).catch(console.error);
        rl.close();
    });
}

rl.on("close", function () {
    console.log("\nBYE BYE !!!");
    process.exit(0);
});


function run(searchText) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://www.amazon.in/s?k=" + searchText);
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('div.s-result-item');
                items.forEach((item) => {
                    var s = item.querySelector('h2.s-line-clamp-2 > a.s-link-style');
                    var sptext = item.querySelector('span.s-label-popover-default');
                    if (s !== null) {
                        results.push({
                            sponsered: sptext !== null ? sptext.innerText : '',
                            title: s.innerText,
                            price: item.querySelector('.a-price-whole').innerText,
                            asin: item.getAttribute('data-asin')
                        });
                    }
                });
                return results;
            });
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}

start();
