import BaseCommand from './base.command'
import type { CommandActionData, CommandOption } from '../index.types'
import { getCorsairInstance, resolveClient } from '../utils/corsair-instance'

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
	...args: string[]
) => (...fnArgs: unknown[]) => Promise<unknown>;

export default class ScriptCommand extends BaseCommand {
	getName(): string {
		return 'script';
	}

	getDescription(): string {
		return 'Execute inline JavaScript with corsair injected';
	}

	getOptions(): CommandOption[] {
		return [
			{ short: '-c', long: '--code <js>', description: 'Async JavaScript body to execute' },
			{ short: '-t', long: '--tenant <id>', description: 'Tenant id for multi-tenant instances' },
		];
	}

	async action({ options }: CommandActionData) {
		const { code, tenant } = options
		if (!code) {
			console.error('[#corsair]: Usage: corsair script --code "<js>"');
			process.exit(1);
		}

		let fn: (...fnArgs: unknown[]) => Promise<unknown>;
		try {
			fn = new AsyncFunction('corsair', code);
		} catch (error) {
			this.exitWithScriptError(error);
		}

		const instance = await getCorsairInstance({ cwd: process.cwd() });
		const client = resolveClient(instance, tenant);
		try {
			const result = await fn(client);
			if (result !== undefined) console.log(JSON.stringify(result, null, 2));
		} catch (error) {
			this.exitWithScriptError(error);
		}
	}

	private exitWithScriptError(error: unknown): never {
		const msg = error instanceof Error ? error.message : String(error);
		console.error(`[#corsair]: ${msg.slice(0, 500)}`);
		process.exit(1);
	}
}
