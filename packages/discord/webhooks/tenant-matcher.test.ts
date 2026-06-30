import type { RawWebhookRequest } from 'corsair/core';
import { matchDiscordTenantWebhook } from './tenant-matcher';
import { DiscordInteractionType } from './types';

describe('matchDiscordTenantWebhook', () => {
	it('returns guild_id for server interactions', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: {
				type: DiscordInteractionType.APPLICATION_COMMAND,
				application_id: 'app-123',
				guild_id: 'guild-456',
			},
		};

		expect(matchDiscordTenantWebhook(request)).toEqual({
			linkType: 'guild_id',
			externalId: 'guild-456',
		});
	});

	it('returns null for DM interactions without guild_id', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: {
				type: DiscordInteractionType.APPLICATION_COMMAND,
				application_id: 'app-123',
			},
		};

		expect(matchDiscordTenantWebhook(request)).toBeNull();
	});

	it('returns null for PING verification handshakes', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: {
				type: DiscordInteractionType.PING,
				application_id: 'app-123',
			},
		};

		expect(matchDiscordTenantWebhook(request)).toBeNull();
	});
});
