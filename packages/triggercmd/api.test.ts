import { triggercmd, triggercmdEndpointSchemas } from './index';

/**
 * Live smoke test. It runs only when `TRIGGERCMD_TOKEN` is set, under the
 * variable name the provider's own CLI reads.
 *
 * It only reads: running a command would start a process on someone's computer.
 * Every answer is parsed through its output schema before asserting.
 */
const API_TOKEN = process.env.TRIGGERCMD_TOKEN;
const describeIfToken = API_TOKEN ? describe : describe.skip;

if (!API_TOKEN) {
	// Say so out loud: a skipped suite reads as a pass in the summary otherwise.
	console.warn(
		'TRIGGERCMD_TOKEN is not set, skipping the live TRIGGERcmd tests',
	);
}

describeIfToken('TRIGGERcmd live API', () => {
	const computers = triggercmdEndpointSchemas['computers.list'];
	const commands = triggercmdEndpointSchemas['commands.list'];

	// The raw client, built the way the plugin builds it.
	async function get(path: string) {
		const { makeTriggerCmdRequest } = await import('./client');
		return makeTriggerCmdRequest(API_TOKEN ?? '', { method: 'GET', path });
	}

	it('lists computers through the output schema', async () => {
		const parsed = computers.output.parse(await get('api/computer/list'));
		expect(Array.isArray(parsed.records)).toBe(true);
		for (const entry of parsed.records) {
			expect(typeof entry.name === 'string' || entry.name === null).toBe(true);
		}
	});

	it('lists commands through the output schema', async () => {
		const { makeTriggerCmdRequest } = await import('./client');
		const raw = await makeTriggerCmdRequest(API_TOKEN ?? '', {
			method: 'POST',
			path: 'api/command/list',
		});
		const parsed = commands.output.parse(raw);
		expect(Array.isArray(parsed.records)).toBe(true);
	});

	it('is wired with the token it was given', () => {
		expect(triggercmd({ key: API_TOKEN }).id).toBe('triggercmd');
	});
});
