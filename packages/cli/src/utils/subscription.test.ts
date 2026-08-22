jest.mock('../lib/microsoft/subscribe-microsoft', () => ({
	runOnedriveSubscribe: jest.fn().mockResolvedValue(undefined),
	runOutlookSubscribe: jest.fn().mockResolvedValue(undefined),
	runSharepointSubscribe: jest.fn().mockResolvedValue(undefined),
	runTeamsSubscribe: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../lib/google/subscribe-google', () => ({
	runGoogleSubscribe: jest.fn().mockResolvedValue(undefined),
}));

import SubscribeCommand from '../commands/subscribe.command';
import { runGoogleSubscribe } from '../lib/google/subscribe-google';
import * as microsoftSubscriptions from '../lib/microsoft/subscribe-microsoft';
import {
	formatSubscribePluginList,
	GOOGLE_SUBSCRIBE_PLUGINS,
	isGoogleSubscribePlugin,
	isMicrosoftSubscribePlugin,
	isSubscribePluginId,
	MICROSOFT_SUBSCRIBE_PLUGINS,
	runWebhookSubscription,
	SUBSCRIBE_PLUGINS,
} from './subscription';

const cwd = '/tmp/corsair-cli-subscribe-test';
const microsoftRunners = {
	onedrive: microsoftSubscriptions.runOnedriveSubscribe,
	outlook: microsoftSubscriptions.runOutlookSubscribe,
	sharepoint: microsoftSubscriptions.runSharepointSubscribe,
	teams: microsoftSubscriptions.runTeamsSubscribe,
} as const;

describe('subscribe plugin registry', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('includes Microsoft and Google webhook providers', () => {
		for (const plugin of MICROSOFT_SUBSCRIBE_PLUGINS) {
			expect(isSubscribePluginId(plugin)).toBe(true);
			expect(isMicrosoftSubscribePlugin(plugin)).toBe(true);
			expect(isGoogleSubscribePlugin(plugin)).toBe(false);
		}

		for (const plugin of GOOGLE_SUBSCRIBE_PLUGINS) {
			expect(isSubscribePluginId(plugin)).toBe(true);
			expect(isGoogleSubscribePlugin(plugin)).toBe(true);
			expect(isMicrosoftSubscribePlugin(plugin)).toBe(false);
		}

		expect(SUBSCRIBE_PLUGINS).toHaveLength(8);
	});

	it('rejects unknown plugin ids', () => {
		expect(isSubscribePluginId('slack')).toBe(false);
		expect(isGoogleSubscribePlugin('outlook')).toBe(false);
		expect(isMicrosoftSubscribePlugin('gmail')).toBe(false);
	});

	it('formats a stable supported-plugin list for CLI errors', () => {
		expect(formatSubscribePluginList()).toBe(
			'outlook, sharepoint, teams, onedrive, gmail, googledrive, googlecalendar, googlesheets',
		);
	});

	it('registers every supported plugin as a subscribe subcommand', () => {
		const commandNames = new SubscribeCommand()
			.getSubCommands()
			.map((command) => command.getName());

		expect(new Set(commandNames)).toEqual(new Set(SUBSCRIBE_PLUGINS));
	});

	it.each(MICROSOFT_SUBSCRIBE_PLUGINS)(
		'routes %s to its Microsoft subscription runner',
		async (pluginId) => {
			await runWebhookSubscription(cwd, pluginId);

			expect(microsoftRunners[pluginId]).toHaveBeenCalledWith({ cwd });
			expect(runGoogleSubscribe).not.toHaveBeenCalled();
		},
	);

	it.each(GOOGLE_SUBSCRIBE_PLUGINS)(
		'routes %s to the Google subscription runner',
		async (pluginId) => {
			await runWebhookSubscription(cwd, pluginId);

			expect(runGoogleSubscribe).toHaveBeenCalledWith({ cwd, pluginId });
			for (const runner of Object.values(microsoftRunners)) {
				expect(runner).not.toHaveBeenCalled();
			}
		},
	);

	it('reports unsupported plugins and exits', async () => {
		const errorSpy = jest.spyOn(console, 'error').mockImplementation();
		const exitSpy = jest.spyOn(process, 'exit').mockImplementation((code) => {
			throw new Error(`process.exit:${code}`);
		});

		await expect(runWebhookSubscription(cwd, 'slack')).rejects.toThrow(
			'process.exit:1',
		);
		expect(errorSpy).toHaveBeenCalledWith(
			expect.stringContaining(
				"Webhook subscription not supported for plugin 'slack'",
			),
		);
		expect(exitSpy).toHaveBeenCalledWith(1);
	});
});
