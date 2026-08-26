import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const scriptsDirectory = resolve(import.meta.dirname);
const pathSeparator = process.platform === 'win32' ? ';' : ':';
const env = {
	...process.env,
	PATH: `${scriptsDirectory}${pathSeparator}${process.env.PATH ?? ''}`,
};

const command = process.platform === 'win32' ? 'turbo.cmd' : 'turbo';
const child = spawn(command, ['--filter', './packages/*', 'build'], {
	env,
	stdio: 'inherit',
	shell: true,
});

child.on('exit', (code, signal) => {
	if (signal) {
		process.kill(process.pid, signal);
	}
	process.exit(code ?? 1);
});
