import { corsair } from '@/server/corsair';

export async function exportPosthogEventsToGoogleSheets(params: {
	tenantId: string;
	daysAgo?: number;
	eventType?: string;
}) {
	const { tenantId, daysAgo = 7, eventType } = params;
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	const timeRange = date.toISOString();

	const searchData: any = {
		created_at: { $gte: timeRange },
	};
	if (eventType) {
		searchData.event_type = { $like: `%${eventType}%` };
	}
	const events = await tenant.posthog.db.events.search({
		data: searchData,
	});

	const spreadsheetName = `PostHog Events Export - ${new Date().toISOString().split('T')[0]}`;
	const spreadsheet = await tenant.googlesheets.api.spreadsheets.create({
		properties: {
			title: spreadsheetName,
		},
	});
	const spreadsheetId = spreadsheet.spreadsheetId;

	const rows = [['Timestamp', 'Event Type', 'User ID', 'Properties']];
	events.slice(0, 1000).forEach((event: any) => {
		rows.push([
			event.created_at || '',
			event.event_type || '',
			event.distinct_id || '',
			JSON.stringify(event.properties || {}),
		]);
	});

	await tenant.googlesheets.api.spreadsheets.values.update({
		spreadsheetId,
		range: 'Sheet1!A1',
		values: rows,
		valueInputOption: 'RAW',
	});

	return {
		success: true,
		eventsExported: events.length,
		spreadsheetId,
		timeRange,
		processedAt: new Date().toISOString(),
	};
}
