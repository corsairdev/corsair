import type { Command } from 'commander';
import { formatCliError } from './format-cli-error';

export async function runCli(input: {
	program: Command;
	argv: string[];
}): Promise<void> {
	try {
		await input.program.parseAsync(input.argv);
	} catch (err: unknown) {
		console.error(formatCliError(err));
		process.exit(1);
	}
}
