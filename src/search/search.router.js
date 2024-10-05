const puppeteer = require('puppeteer')

module.exports = async (req, res) => {
        const searchTerm = req.query.query || 'medal';
      
        try {
          const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/chromium-browser', // Path to Chromium in Linux environments
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for many cloud environments
          });
          const page = await browser.newPage();
      
          // Set User-Agent and other headers as needed
          await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
          );
      
          // Navigate to the search page
          await page.goto(
            `https://violity.com/en/search/result?auction_id=&query=${encodeURIComponent(searchTerm)}&filter=1&phrase=1`,
            {
              waitUntil: 'networkidle2',
            }
          );
      
          // Extract relevant data from the page
          const items = await page.evaluate(() => {
            const extractedItems = [];
      
            // Select all articles with the item data
            const articles = document.querySelectorAll('div.rows article.tr');
            articles.forEach((article) => {
              // Extract item title
              const titleElement = article.querySelector('.title a');
              const title = titleElement ? titleElement.innerText.trim() : null;
      
              // Extract prices
              const priceElements = article.querySelectorAll('.price .p_box .current');
              const prices = Array.from(priceElements).map((priceElement) => priceElement.innerText.replace(/\n/g, '').trim()
              
              );
      
              // Extract ending time
              const endingElement = article.querySelector('.h .ending span');
              const endingTime = endingElement ? endingElement.innerText.trim() : null;
      
              // Extract seller name
              const sellerElement = article.querySelector('.seller u');
              const seller = sellerElement ? sellerElement.innerText.trim() : null;
      
              // Extract image URL
              const imageElement = article.querySelector('.slider_stage .slide img');
              const imageUrl = imageElement
                ? imageElement.getAttribute('data-original') || imageElement.src
                : null;
      
              // Extract link to the item
              const link = titleElement ? titleElement.href : null;
      
              // Push the extracted data to the array
              if (title && prices.length > 0) {
                extractedItems.push({
                  title,
                  prices,
                  endingTime,
                  seller,
                  imageUrl,
                  link,
                });
              }
            });
      
            return extractedItems;
          });
      

          await browser.close()
      
          // Return the extracted data as JSON
          res.json(items);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).send('Error: ' + error.message);
        }
      }