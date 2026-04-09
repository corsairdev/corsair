import * as p from '@clack/prompts';
import { loadInternalConfig } from '../utils/load-config';
import { promptClientState, promptTenantId, promptWebhookUrl } from '../utils/prompts';
import { resolveAccessToken, saveWebhookSignature } from './credentials';
import { createGraphSubscription, GRAPH_API_BASE } from './graph';

async function fetchJoinedTeams(
	accessToken: string,
): Promise<Array<{ id: string; displayName: string }>> {
	const response = await fetch(`${GRAPH_API_BASE}/me/joinedTeams`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to fetch teams: ${error}`);
	}
	const data = (await response.json()) as {
		value?: Array<{ id: string; displayName: string }>;
	};
	return data.value ?? [];
}

async function fetchTeamChannels(
	accessToken: string,
	teamId: string,
): Promise<Array<{ id: string; displayName: string }>> {
	const response = await fetch(
		`${GRAPH_API_BASE}/teams/${encodeURIComponent(teamId)}/channels`,
		{ headers: { Authorization: `Bearer ${accessToken}` } },
	);
	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to fetch channels: ${error}`);
	}
	const data = (await response.json()) as {
		value?: Array<{ id: string; displayName: string }>;
	};
	return data.value ?? [];
}

async function fetchUserChats(
	accessToken: string,
): Promise<Array<{ id: string; topic?: string | null; chatType: string }>> {
	const response = await fetch(`${GRAPH_API_BASE}/me/chats`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) {
		const error = await response.text();
		throw new Error(`Failed to fetch chats: ${error}`);
	}
	const data = (await response.json()) as {
		value?: Array<{ id: string; topic?: string | null; chatType: string }>;
	};
	return data.value ?? [];
}

async function pickTeamId(accessToken: string, label: string): Promise<string> {
	const teamsSpin = p.spinner();
	teamsSpin.start('Fetching your teams...');
	let teams: Array<{ id: string; displayName: string }> = [];
	try {
		teams = await fetchJoinedTeams(accessToken);
		teamsSpin.stop(`Found ${teams.length} team${teams.length === 1 ? '' : 's'}.`);
	} catch (error) {
		teamsSpin.stop('Could not fetch teams.');
		p.log.warn(error instanceof Error ? error.message : String(error));
	}

	if (teams.length > 0) {
		const picked = await p.select({
			message: `[${label}] Select a team:`,
			options: teams.map((t) => ({ value: t.id, label: t.displayName, hint: t.id })),
		});
		if (p.isCancel(picked)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		return picked as string;
	}

	const manual = await p.text({
		message: `[${label}] Enter team ID:`,
		placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		validate: (v) => {
			if (!v || !v.trim()) return 'Team ID is required';
		},
	});
	if (p.isCancel(manual)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}
	return manual as string;
}

async function pickChannelId(
	accessToken: string,
	teamId: string,
	label: string,
): Promise<string> {
	const chanSpin = p.spinner();
	chanSpin.start('Fetching channels...');
	let channels: Array<{ id: string; displayName: string }> = [];
	try {
		channels = await fetchTeamChannels(accessToken, teamId);
		chanSpin.stop(`Found ${channels.length} channel${channels.length === 1 ? '' : 's'}.`);
	} catch (error) {
		chanSpin.stop('Could not fetch channels.');
		p.log.warn(error instanceof Error ? error.message : String(error));
	}

	if (channels.length > 0) {
		const picked = await p.select({
			message: `[${label}] Select a channel:`,
			options: channels.map((c) => ({ value: c.id, label: c.displayName, hint: c.id })),
		});
		if (p.isCancel(picked)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		return picked as string;
	}

	const manual = await p.text({
		message: `[${label}] Enter channel ID:`,
		placeholder: '19:abc123@thread.skype',
		validate: (v) => {
			if (!v || !v.trim()) return 'Channel ID is required';
		},
	});
	if (p.isCancel(manual)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}
	return manual as string;
}

async function pickChatId(accessToken: string, label: string): Promise<string> {
	const chatSpin = p.spinner();
	chatSpin.start('Fetching your chats...');
	let chats: Array<{ id: string; topic?: string | null; chatType: string }> = [];
	try {
		chats = await fetchUserChats(accessToken);
		chatSpin.stop(`Found ${chats.length} chat${chats.length === 1 ? '' : 's'}.`);
	} catch (error) {
		chatSpin.stop('Could not fetch chats.');
		p.log.warn(error instanceof Error ? error.message : String(error));
	}

	if (chats.length > 0) {
		const picked = await p.select({
			message: `[${label}] Select a chat:`,
			options: chats.map((c) => ({
				value: c.id,
				label: c.topic ?? `(${c.chatType})`,
				hint: c.id,
			})),
		});
		if (p.isCancel(picked)) {
			p.cancel('Operation cancelled.');
			process.exit(0);
		}
		return picked as string;
	}

	const manual = await p.text({
		message: `[${label}] Enter chat ID:`,
		placeholder: '19:abc123@thread.v2',
		validate: (v) => {
			if (!v || !v.trim()) return 'Chat ID is required';
		},
	});
	if (p.isCancel(manual)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}
	return manual as string;
}

type TeamsResourceType =
	| 'channelMessage'
	| 'chatMessage'
	| 'channelCreated'
	| 'membershipChanged';

function buildTeamsResource(
	resourceType: TeamsResourceType,
	ids: Record<string, string>,
): string {
	switch (resourceType) {
		case 'channelMessage':
			return `teams/${ids.teamId}/channels/${ids.channelId}/messages`;
		case 'chatMessage':
			return `chats/${ids.chatId}/messages`;
		case 'channelCreated':
			return `teams/${ids.teamId}/channels`;
		case 'membershipChanged':
			return `teams/${ids.teamId}/members`;
	}
}

const TEAMS_MAX_EXPIRY_MINUTES: Record<TeamsResourceType, number> = {
	channelMessage: 60,
	chatMessage: 60,
	channelCreated: 4230,
	membershipChanged: 60,
};

export async function runTeamsSubscribe({ cwd }: { cwd: string }): Promise<void> {
	const { internal } = await loadInternalConfig(
		cwd,
		'Corsair — Microsoft Teams Webhook Subscribe',
		'teams',
		'Teams',
	);

	const tenantId = await promptTenantId();
	const { accessToken, accountKm } = await resolveAccessToken(
		'teams',
		tenantId,
		internal,
	);
	const webhookUrl = await promptWebhookUrl();

	const selectedResourceTypes = await p.multiselect<TeamsResourceType>({
		message: 'Select resources to subscribe to:',
		options: [
			{
				value: 'channelMessage',
				label: 'Channel Messages  (teams/{id}/channels/{id}/messages)',
			},
			{
				value: 'chatMessage',
				label: 'Chat Messages     (chats/{id}/messages)',
			},
			{
				value: 'channelCreated',
				label: 'Channel Created   (teams/{id}/channels)',
			},
			{
				value: 'membershipChanged',
				label: 'Membership Changed (teams/{id}/members)',
			},
		],
		required: true,
	});
	if (p.isCancel(selectedResourceTypes)) {
		p.cancel('Operation cancelled.');
		process.exit(0);
	}

	const resourceConfigs: Array<{
		resourceType: TeamsResourceType;
		ids: Record<string, string>;
	}> = [];

	for (const resourceType of selectedResourceTypes as TeamsResourceType[]) {
		const ids: Record<string, string> = {};

		if (resourceType === 'chatMessage') {
			ids.chatId = await pickChatId(accessToken, resourceType);
		} else {
			ids.teamId = await pickTeamId(accessToken, resourceType);
			if (resourceType === 'channelMessage') {
				ids.channelId = await pickChannelId(accessToken, ids.teamId!, resourceType);
			}
		}

		resourceConfigs.push({ resourceType, ids });
	}

	const clientState = await promptClientState();

	const results: string[] = [];
	let hasError = false;

	for (const { resourceType, ids } of resourceConfigs) {
		const resource = buildTeamsResource(resourceType, ids);
		const expiryMinutes = TEAMS_MAX_EXPIRY_MINUTES[resourceType];

		const subSpin = p.spinner();
		subSpin.start(`Creating subscription: ${resourceType}...`);
		try {
			const subscription = await createGraphSubscription(
				accessToken,
				webhookUrl,
				resource,
				'created,updated,deleted',
				clientState,
				expiryMinutes,
			);
			subSpin.stop(`Created: ${resourceType}`);
			results.push(
				`${resourceType}\n  Resource: ${resource}\n  ID: ${subscription.id}\n  Expires: ${subscription.expirationDateTime}`,
			);
		} catch (error) {
			subSpin.stop(`Failed: ${resourceType}`);
			p.log.error(error instanceof Error ? error.message : String(error));
			hasError = true;
		}
	}

	if (results.length > 0) {
		p.note(results.join('\n\n'), 'Subscriptions created');
	}

	await saveWebhookSignature(accountKm, clientState);

	if (!hasError) {
		p.log.success('Teams webhook subscriptions set up successfully.');
	} else {
		p.log.warn('Some subscriptions failed. Check errors above.');
	}

	p.note(
		`ClientState: ${clientState}\nWebhook URL: ${webhookUrl}\n\nNote: Teams subscriptions expire. Re-run this command to renew.`,
		'Setup complete',
	);

	p.outro('Done!');
}
