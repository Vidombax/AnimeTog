import express from 'express';
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