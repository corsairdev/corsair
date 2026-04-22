import { startStudio } from './index';

const cwd = process.env.CORSAIR_STUDIO_CWD ?? process.cwd();

startStudio({ cwd, port: 4317, open: false }).catch((err) => {
	console.error(err);
	process.exit(1);
});
