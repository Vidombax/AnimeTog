const puppeteer = require('puppeteer');
require('dotenv').config();

export const getAnime = async (animeName) => {
    try {
        console.log('Начинаем поиск аниме...');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

        await page.goto(`${process.env.ANIME_PARSE_SITE}`);

        const inputHandle = await page.evaluateHandle(() => {
            try {
                const form = document.getElementById('m_search');

                return form.querySelector('#story');
            }
            catch (e) {
                console.error(e);
            }
        });

        const inputElement = inputHandle.asElement();
        if (inputElement) {
            await inputElement.type(`${animeName}`);
            console.log(`Пишем название аниме: ${animeName}`);
            await page.keyboard.press('Enter');
            await inputHandle.dispose();
            console.log('Ждем загрузку...');
            await page.waitForNavigation({
                timeout: 60000,
                waitUntil: 'networkidle0'
            });
        } else {
            console.error('Не нашел поиск');
        }

        const firstAnimeLink = await page.evaluate(async () => {
            try {
                const animeElement = document.querySelectorAll('.story')[1]?.querySelector('a');
                return animeElement ? animeElement.href : null;
            } catch (e) {
                console.error(e);
                return null;
            }
        });
        if (firstAnimeLink) {
            console.log('Переходим на страницу с аниме...');
            await page.goto(firstAnimeLink, { timeout: 60000, waitUntil: 'domcontentloaded' });

            await page.waitForSelector('.playlists-items');

            const carouselOfPlayers = await page.evaluate(() => {
                return Array.from(document.getElementsByClassName('playlists-items')[0].childNodes[0].childNodes).map(node => node.innerText);
            });

            for (let i = 0; i < carouselOfPlayers.length; i++) {
                if (carouselOfPlayers[i] === 'Kodik') {
                    console.log('Нашли кодек...');
                    const target = await page.evaluateHandle(() => {
                        try {
                            return document.getElementsByClassName('playlists-items')[0].childNodes[0].childNodes[i - 2];
                        }
                        catch (e) {
                            console.error(e);
                        }
                    });
                    if (target) {
                        await target.click();
                        await new Promise(resolve => setTimeout(resolve, 20000));

                        const getLink = await page.evaluate(() => {
                            return document.getElementsByClassName('playlists-ajax')[0].childNodes[0].childNodes[3].childNodes[0].outerHTML;
                        });
                        console.log('Получили iframe: ', getLink);
                    }
                    break;
                }
            }
        } else {
            console.error('Ссылка не найдена.');
        }

        await browser.close();

        console.log('Закончили поиск аниме...');
    }
    catch (e) {
        throw e;
    }
}