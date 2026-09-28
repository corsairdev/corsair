import { runTunnel } from 'corsair/hub/tunnel/run-tunnel';
import { extractInternalConfig } from '../utils/corsair';
import HttpCommand from './http.command';

jest.mock('../utils/corsair', () => ({
	extractInternalConfig: jest.fn(),
}));

jest.mock(
	'corsair/hub',
	() => ({
		CORSAIR_TUNNEL_PATH: '/api/corsair',
	}),
	{ virtual: true },
);

jest.mock(
	'corsair/hub/tunnel/run-tunnel',
	() => ({
		runTunnel: jest.fn(),
	}),
	{ virtual: true },
);

const extractMock = extractInternalConfig as jest.Mock;
const runTunnelMock = runTunnel as jest.Mock;

function mockTunnelSuccess() {
	extractMock.mockResolvedValue({
		hub: { apiUrl: 'https://hub.test', projectApiKey: 'test-key' },
	});
	runTunnelMock.mockResolvedValue({
		url: 'https://test.corsair.test',
		stop: jest.fn(),
	});
	// The command waits for SIGINT/SIGTERM at the end — resolve it right away.
	jest.spyOn(process, 'once').mockImplementation((event, listener) => {
		if (event === 'SIGINT') {
			(listener as () => void)();
		}
		return process;
	});
	jest.spyOn(console, 'log').mockImplementation(() => {});
}

describe('HttpCommand port parsing', () => {
	const originalPort = process.env.PORT;

	afterEach(() => {
		if (originalPort === undefined) {
			// biome-ignore lint/performance/noDelete: must be truly unset, not "undefined"
			delete process.env.PORT;
		} else {
			process.env.PORT = originalPort;
		}
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('accepts a port with surrounding spaces', async () => {
		mockTunnelSuccess();
		const command = new HttpCommand();

		await command.action({ args: [' 3000 '], options: {} });

		expect(runTunnelMock).toHaveBeenCalledWith(
			expect.objectContaining({ port: 3000 }),
		);
	});

	it('accepts a port with a trailing newline (env-style)', async () => {
		mockTunnelSuccess();
		const command = new HttpCommand();

		await command.action({ args: ['8080\n'], options: {} });

		expect(runTunnelMock).toHaveBeenCalledWith(
			expect.objectContaining({ port: 8080 }),
		);
	});

	it('accepts padded PORT from the environment', async () => {
		mockTunnelSuccess();
		process.env.PORT = ' 4567 ';
		const command = new HttpCommand();

		await command.action({ args: [], options: {} });

		expect(runTunnelMock).toHaveBeenCalledWith(
			expect.objectContaining({ port: 4567 }),
		);
	});

	it('rejects a non-numeric port', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit:1');
		}) as never);
		const command = new HttpCommand();

		await expect(
			command.action({ args: ['abc'], options: {} }),
		).rejects.toThrow('process.exit:1');
		expect(runTunnelMock).not.toHaveBeenCalled();
	});

	it('rejects port 0', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit:1');
		}) as never);
		const command = new HttpCommand();

		await expect(command.action({ args: ['0'], options: {} })).rejects.toThrow(
			'process.exit:1',
		);
		expect(runTunnelMock).not.toHaveBeenCalled();
	});

	it('rejects a port above 65535', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		jest.spyOn(process, 'exit').mockImplementation((() => {
			throw new Error('process.exit:1');
		}) as never);
		const command = new HttpCommand();

		await expect(
			command.action({ args: ['99999'], options: {} }),
		).rejects.toThrow('process.exit:1');
		expect(runTunnelMock).not.toHaveBeenCalled();
	});
});
