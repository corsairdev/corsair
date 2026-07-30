import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	formatSubscribePluginList,
	GOOGLE_SUBSCRIBE_PLUGINS,
	isGoogleSubscribePlugin,
	isMicrosoftSubscribePlugin,
	isSubscribePluginId,
	MICROSOFT_SUBSCRIBE_PLUGINS,
	SUBSCRIBE_PLUGINS,
} from './subscription';

describe('subscribe plugin registry', () => {
	it('includes Microsoft and Google webhook providers', () => {
		for (const plugin of MICROSOFT_SUBSCRIBE_PLUGINS) {
			assert.equal(isSubscribePluginId(plugin), true);
			assert.equal(isMicrosoftSubscribePlugin(plugin), true);
			assert.equal(isGoogleSubscribePlugin(plugin), false);
		}

		for (const plugin of GOOGLE_SUBSCRIBE_PLUGINS) {
			assert.equal(isSubscribePluginId(plugin), true);
			assert.equal(isGoogleSubscribePlugin(plugin), true);
			assert.equal(isMicrosoftSubscribePlugin(plugin), false);
		}

		assert.equal(SUBSCRIBE_PLUGINS.length, 8);
	});

	it('rejects unknown plugin ids', () => {
		assert.equal(isSubscribePluginId('slack'), false);
		assert.equal(isGoogleSubscribePlugin('outlook'), false);
		assert.equal(isMicrosoftSubscribePlugin('gmail'), false);
	});

	it('formats a stable supported-plugin list for CLI errors', () => {
		assert.equal(
			formatSubscribePluginList(),
			'outlook, sharepoint, teams, onedrive, gmail, googledrive, googlecalendar, googlesheets',
		);
	});
});
