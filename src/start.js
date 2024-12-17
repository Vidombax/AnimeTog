import express from 'express';
import cron from 'node-cron';
import axios from "axios";
import animeJoyRoute from './routes/animejoy.route.js';
import mainRoute from "./routes/main.route.js";
import roomRoute from "./routes/room.route.js";

const app = express();

app.use(express.json());

app.use('/', animeJoyRoute);
app.use('/', mainRoute);
app.use('/', roomRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

cron.schedule(`*/2 * * * *`, async () => {
    console.log('Запрашиваю пинг сервера...');
    try {
        const response = await axios.get(`${process.env.HOST}/ping`);
        console.log('Ответ:', response.data);
    } catch (error) {
        console.error('Cron job failed:', error.message);
        console.error('Stack trace:', error.stack);
    }
});
