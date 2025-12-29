export const logger = {
	info(message: string) {
		process.stdout.write(`${message}\n`);
	},
	error(message: string) {
		process.stderr.write(`${message}\n`);
	},
};
