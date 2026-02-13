import { corsair } from '@/server/corsair';

export async function backupSlackMessagesToGoogleSheets(params: {
	tenantId: string;
	channelName?: string;
	daysAgo?: number;
}) {
	const { tenantId, channelName = 'sdk-test', daysAgo = 30 } = params;
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	const timeRange = date.toISOString();

	const channels = await tenant.slack.db.channels.search({
		data: { name: channelName },
	});
	let foundChannel = channels?.[0];
	if (!foundChannel?.id) {
		await tenant.slack.api.channels.list({ exclude_archived: true });
		const dbChannels = await tenant.slack.db.channels.search({
			data: { name: channelName },
		});
		foundChannel = dbChannels?.[0];
	}
	if (!foundChannel?.id) {
		throw new Error(`Couldn't find #${channelName} channel`);
	}

	const messagesList = await tenant.slack.api.channels.getHistory({
		channel: foundChannel.entity_id,
		oldest: Math.floor(new Date(timeRange).getTime() / 1000).toString(),
	});
	const messages = messagesList.messages || [];

	const spreadsheetName = `Slack Backup - ${channelName} - ${new Date().toISOString().split('T')[0]}`;
	const spreadsheet = await tenant.googlesheets.api.spreadsheets.create({
		properties: {
			title: spreadsheetName,
		},
	});
	const spreadsheetId = spreadsheet.spreadsheetId;
	if (!spreadsheetId) {
		throw new Error('Failed to create spreadsheet');
	}

	const rows = [['Timestamp', 'User', 'Text', 'Thread TS']];
	messages.forEach((msg: any) => {
		rows.push([
			new Date(parseFloat(msg.ts) * 1000).toISOString(),
			msg.user || 'Unknown',
			msg.text || '',
			msg.thread_ts || '',
		]);
	});

	for (const row of rows) {
		await tenant.googlesheets.api.sheets.appendRow({
			spreadsheetId,
			values: row,
			valueInputOption: 'RAW',
		});
	}

	return {
		success: true,
		channelName,
		messagesBackedUp: messages.length,
		spreadsheetId,
		processedAt: new Date().toISOString(),
	};
}
