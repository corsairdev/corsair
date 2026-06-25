import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { version } from '../package.json';
import AuthCommand from './commands/auth.command';
import type BaseCommand from './commands/base.command';
import ListCommand from './commands/list.command';
import OnedriveSubscribeCommand from './commands/onedrive-subscribe.command';
import SchemaCommand from './commands/schema.command';
import ScriptCommand from './commands/script.command';
import SetupCommand from './commands/setup.command';
import SharepointSubscribeCommand from './commands/sharepoint-subscribe.command';
import StudioCommand from './commands/studio.command';
import SubscribeCommand from './commands/subscribe.command';
import TeamsSubscribeCommand from './commands/teams-subscribe.command';
import WatchRenewCommand from './commands/watch-renew.command';
import {
	findCorsairConfigPath,
	getCorsairInstance,
} from './utils/corsair-instance';

function createProgram(): Command {
	const program = new Command();

	program.name('corsair');
	program.version(version, '-v, --version', 'Output the current version');

	const COMMANDS: BaseCommand[] = [
		new SetupCommand(),
		new AuthCommand(),
		new WatchRenewCommand(),
		new SubscribeCommand(),
		new SharepointSubscribeCommand(),
		new TeamsSubscribeCommand(),
		new OnedriveSubscribeCommand(),
		new ListCommand(),
		new SchemaCommand(),
		new ScriptCommand(),
		new StudioCommand(),
	];

	COMMANDS.forEach((command) => {
		command.prepare(program);
	});

	return program;
}

function normalizeLegacyArgs(argv: string[]): string[] {
	return argv.map((arg, index) => {
		if (arg === '-backfill' && argv.slice(0, index).includes('setup')) {
			return '--backfill';
		}
		return arg;
	});
}

function detectIsMainModule(): boolean {
	const argv1 = process.argv[1];
	if (!argv1) return false;
	try {
		const argvResolved = realpathSync(argv1);
		const selfResolved = realpathSync(fileURLToPath(import.meta.url));
		return argvResolved === selfResolved;
	} catch {
		return import.meta.url === `file://${argv1.replace(/\\/g, '/')}`;
	}
}

if (detectIsMainModule()) {
	createProgram().parse(normalizeLegacyArgs(process.argv));
}

export { createProgram, findCorsairConfigPath, getCorsairInstance };
