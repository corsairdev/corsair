import type { Command } from 'commander'

export default abstract class BaseCommand {

	abstract getName(): string;

	abstract getDescription(): string;

	abstract action(...args: unknown[]): Promise<void> | void;

	getAliases(): string[] {
		return [];
	}

	getArguments(): Array<{ name: string; description?: string }> {
		return [];
	}

	getOptions(): Array<{ flags: string; description: string }> {
		return [];
	}

	getUsage(): string {
		return '';
	}

	readonly prepare = (program: Command): void => {
		const command = program.command(this.getName()).description(this.getDescription());
		const usage = this.getUsage();
		if (usage) command.usage(usage);
		this.getAliases().forEach((alias) => command.alias(alias));
		this.getArguments().forEach((argument) =>
			command.argument(argument.name, argument.description),
		);
		this.getOptions().forEach((option) =>
			command.option(option.flags, option.description),
		);
		command.action((...args) => this.action(...args));
	};
}
