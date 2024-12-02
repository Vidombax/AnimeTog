import express from 'express';

import animeJoyRoute from "./routes/animejoy.route";

const app = express();

app.use(express.json());

app.use('/', animeJoyRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})