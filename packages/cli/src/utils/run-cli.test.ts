import { Command } from 'commander';
import { runCli } from './run-cli';

function programWithAction(name: string, action: () => Promise<void>): Command {
	const program = new Command();
	program.exitOverride();
	program.command(name).action(action);
	return program;
}

describe('runCli', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('prints one [#corsair] diagnostic and exits 1 when an action rejects', async () => {
		const error = jest.spyOn(console, 'error').mockImplementation(() => {});
		const exit = jest.spyOn(process, 'exit').mockImplementation((code) => {
			throw new Error(`process.exit:${String(code)}`);
		});
		const program = programWithAction('boom', async () => {
			throw new Error('token exchange failed');
		});

		await expect(
			runCli({ program, argv: ['node', 'corsair', 'boom'] }),
		).rejects.toThrow('process.exit:1');

		expect(error).toHaveBeenCalledWith('[#corsair]: token exchange failed');
		expect(error).toHaveBeenCalledTimes(1);
		expect(exit).toHaveBeenCalledWith(1);
	});

	it('does not exit when the action resolves', async () => {
		const error = jest.spyOn(console, 'error').mockImplementation(() => {});
		const exit = jest.spyOn(process, 'exit').mockImplementation((code) => {
			throw new Error(`process.exit:${String(code)}`);
		});
		const program = programWithAction('ok', async () => {});

		await runCli({ program, argv: ['node', 'corsair', 'ok'] });

		expect(error).not.toHaveBeenCalled();
		expect(exit).not.toHaveBeenCalled();
	});
});
