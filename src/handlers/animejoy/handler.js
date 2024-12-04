import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
dotenv.config();

class AnimeHandler {
    async getAnime(req, res) {
        try {
            const animeName = req.query.animeName;
            console.log('Начинаем поиск аниме...');
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setViewport({ width: 1920, height: 2080 });

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3');

            console.log('Получили ссылку на сайт: ', process.env.ANIME_PARSE_SITE);
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
                await new Promise(resolve => setTimeout(resolve, 10000));
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
                if (process.env.IS_TEST === 'true') {
                    //Проверяем нашел ли то аниме которое нужно
                    await page.screenshot({ path: './public/screen_test/correct-anime.png' });
                }

                console.log('Переходим на страницу с аниме...');
                await page.goto(firstAnimeLink, { timeout: 10000, waitUntil: 'domcontentloaded' });

                await page.waitForSelector('.playlists-items');

                if (process.env.IS_TEST === 'true') {
                    //проверяем загрузилась ли страница аниме
                    await page.screenshot({ path: './public/screen_test/check-load-page-anime.png' });
                }

                const carouselOfPlayers = await page.evaluate(() => {
                    return Array.from(
                        document.querySelectorAll('.playlists-items ul li') // Находим все <li> элементы
                    ).filter(li => {
                        const text = li.textContent.trim(); // Текст элемента
                        return text.includes('Sibnet') || text.includes('Kodik'); // Фильтруем по тексту
                    }).map(li => ({
                        text: li.textContent.trim(), // Извлекаем текст
                        index: Array.from(li.parentNode.children).indexOf(li) // Сохраняем индекс элемента
                    }));
                });

                for (let i = 0; i < carouselOfPlayers.length; i++) {
                    console.log('Найденные плееры: ', carouselOfPlayers);
                    if (carouselOfPlayers[i].text.toUpperCase() === 'KODIK') {
                        console.log('Нашли Kodik...');

                        // Используем индекс для выбора элемента через Puppeteer
                        const targetSelector = `.playlists-items ul li:nth-child(${carouselOfPlayers[i].index})`;

                        // Кликаем по элементу
                        const target = await page.$(targetSelector); // Находим элемент
                        if (target) {
                            await target.click();

                            if (process.env.IS_TEST === 'true') {
                                // Проверяем, нажат ли плеер Kodik
                                await page.screenshot({ path: './public/screen_test/check-kodik-click.png' });
                            }

                            // Ждем 10 секунд
                            await new Promise(resolve => setTimeout(resolve, 10000));

                            // Получаем iframe
                            const getFrame = await page.evaluate(() => {
                                return document.getElementsByClassName('playlists-ajax')[0].childNodes[0].childNodes[3].childNodes[0].outerHTML;
                            });
                            if (getFrame.includes('aniqit.com')) {
                                console.log('Получили iframe: ', getFrame);
                                res.json(getFrame);
                            } else {
                                console.log('Не удалось найти iframe с aniqit.com.', getFrame);
                            }
                        } else {
                            console.log('Не удалось найти целевой элемент Kodik.');
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
}

export default new AnimeHandler();
