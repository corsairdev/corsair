import { toExpressHandler } from 'corsair';
import express from 'express';
import { corsair } from './corsair';

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.use('/api/corsair', toExpressHandler(corsair));

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
