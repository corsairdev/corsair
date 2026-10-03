import { buildCorsairToolDefs, runScriptInSandbox } from './tools.js';

describe('MCP runScriptInSandbox', () => {
	it('executes valid JavaScript and returns output', async () => {
		const mockCorsair = {
			slack: {
				api: {
					channels: {
						list: async () => ({
							channels: [{ id: 'C123', name: 'general' }],
						}),
					},
				},
			},
		};

		const code = `
			const result = await corsair.slack.api.channels.list();
			return result.channels[0].id;
		`;

		const output = await runScriptInSandbox(code, mockCorsair);
		expect(output).toBe('C123');
	});

	it('blocks access to host process and globals', async () => {
		const mockCorsair = {};
		const code = `
			return typeof process;
		`;
		const output = await runScriptInSandbox(code, mockCorsair);
		expect(output).toBe('undefined');
	});

	it('blocks prototype / constructor escape on corsair membrane', async () => {
		const mockCorsair = {
			echo: (val: string) => val,
		};

		const code = `
			return corsair.constructor;
		`;
		const output = await runScriptInSandbox(code, mockCorsair);
		expect(output).toBeUndefined();
	});

	it('blocks constructor on methods and returned objects', async () => {
		const mockCorsair = {
			getData: async () => ({ secret: '123' }),
		};

		const code = `
			const fnConstructor = corsair.getData.constructor;
			const data = await corsair.getData();
			return {
				fnConstructor: typeof fnConstructor,
				dataConstructor: typeof data.constructor,
			};
		`;
		const output = (await runScriptInSandbox(code, mockCorsair)) as {
			fnConstructor: string;
			dataConstructor: string;
		};
		expect(output.fnConstructor).toBe('undefined');
		expect(output.dataConstructor).toBe('undefined');
	});

	it('fails when attempting eval inside the sandbox', async () => {
		const mockCorsair = {};
		const code = `
			return eval('1 + 1');
		`;
		await expect(runScriptInSandbox(code, mockCorsair)).rejects.toThrow();
	});
});

describe('buildCorsairToolDefs run_script handler', () => {
	it('runs script via handler and formats result', async () => {
		const mockCorsair = {
			math: {
				add: async (a: number, b: number) => a + b,
			},
		};

		const defs = buildCorsairToolDefs({
			corsair: mockCorsair as any,
		});

		const runScriptDef = defs.find((d) => d.name === 'run_script');
		expect(runScriptDef).toBeDefined();

		const result = await runScriptDef!.handler({
			code: 'return await corsair.math.add(2, 3);',
		});

		const firstContent = result.content[0];
		expect(firstContent).toBeDefined();
		expect(firstContent?.type).toBe('text');
		if (firstContent && 'text' in firstContent) {
			expect(firstContent.text).toBe('5');
		}
	});
});

