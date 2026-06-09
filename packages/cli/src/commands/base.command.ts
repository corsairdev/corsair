import type { Command } from 'commander';
import { Option } from 'commander';
import type {
	CommandActionData,
	CommandArgument,
	CommandOption,
} from '../index.types';

export default abstract class BaseCommand {
	abstract getName(): string;

	abstract getDescription(): string;

	action({}: CommandActionData): Promise<void> | void {}

	getAliases(): string[] {
		return [];
	}

	getArguments(): CommandArgument[] {
		return [];
	}

	getOptions(): CommandOption[] {
		return [];
	}

	getUsage(): string {
		return '';
	}

	getSubCommands(): BaseCommand[] {
		return [];
	}

	/** When true, unknown flags (e.g. `--slack`) are passed through to the action. */
	protected allowUnknownOptions(): boolean {
		return false;
	}

	readonly prepare = (program: Command): void => {
		const command = program
			.command(this.getName())
			.description(this.getDescription())
			.allowUnknownOption(this.allowUnknownOptions());

		const usage = this.getUsage();
		if (usage) {
			command.usage(usage);
		}

		this.getAliases().forEach((alias) => command.alias(alias));

		this.getOptions().forEach((option) => {
			const newOption: Option = new Option(
				`${option.short}, ${option.long}`,
				option.description,
			).default(option.defaultValue);

			option.choices &&
				option.choices.length > 0 &&
				newOption.choices(option.choices);

			command.addOption(newOption);
		});
		this.getArguments().forEach((argument) =>
			command.argument(argument.name, argument.description),
		);

		command.action(async (...data) => {
			const argsCount = this.getArguments().length;

			const commandOptions = data[argsCount];
			const args: string[] = data.slice(0, argsCount);
			await this.action({ args, options: commandOptions });
		});

		this.getSubCommands().forEach((subCommand) => {
			subCommand.prepare(command);
		});
	};
}
