import { startHub } from './index';

const port = Number(process.env.PORT ?? 4318);
const host = process.env.HOST ?? '127.0.0.1';

startHub({ host, port }).then(
	() => {
		console.log(`Corsair Hub listening on http://${host}:${port}`);
	},
	(error) => {
		console.error(error);
		process.exit(1);
	},
);
