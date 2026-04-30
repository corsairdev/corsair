import BaseCommand from './base.command';
import { getCorsairInstance, resolveClient } from '../utils/corsair-instance';
import { parseScriptOptions } from '../utils/arg-parsers';

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
	getOptions(): Array<{ flags: string; description: string }> {
		return [
			{ flags: '--code <js>', description: 'Async JavaScript body to execute' },
			{ flags: '--tenant <id>', description: 'Tenant id for multi-tenant instances' },
		];
	}
	async action(options: { code?: string; tenant?: string }) {
		const { code, tenant } = parseScriptOptions(options);
		if (!code) {
			console.error('[#corsair]: Usage: corsair script --code "<js>"');
			process.exit(1);
		}
		const instance = await getCorsairInstance({ cwd: process.cwd() });
		const client = resolveClient(instance, tenant);
		const fn = new AsyncFunction('corsair', code);
		try {
			const result = await fn(client);
			if (result !== undefined) console.log(JSON.stringify(result, null, 2));
		} catch (error) {
			const msg = error instanceof Error ? error.message : String(error);
			console.error(`[#corsair]: ${msg.slice(0, 500)}`);
			process.exit(1);
		}
	}
}
