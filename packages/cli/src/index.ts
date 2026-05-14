import { Command } from 'commander'
import { version } from '../package.json'
import type BaseCommand from './commands/base.command'
import AuthCommand from './commands/auth.command'
import ListCommand from './commands/list.command'
import SchemaCommand from './commands/schema.command'
import ScriptCommand from './commands/script.command'
import SetupCommand from './commands/setup.command'
import StudioCommand from './commands/studio.command'
import SubscribeCommand from './commands/subscribe.command'
import WatchRenewCommand from './commands/watch-renew.command'
import { getCorsairInstance } from './utils/corsair-instance'

const program = new Command();

program.name('corsair');
program.version(version, '-v, --version', 'Output the current version');

const COMMANDS: BaseCommand[] = [
	new SetupCommand(),
	new AuthCommand(),
	new WatchRenewCommand(),
	new SubscribeCommand(),
	new ListCommand(),
	new SchemaCommand(),
	new ScriptCommand(),
	new StudioCommand(),
];

COMMANDS.forEach((command) => {
	command.prepare(program);
});

program.parse(process.argv);

export { getCorsairInstance };
