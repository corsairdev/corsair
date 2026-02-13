import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function syncHubspotContactsToSlack(params: {
	tenantId: string;
	daysAgo?: number;
}) {
	const { tenantId, daysAgo = 7 } = params;
	const tenant = corsair.withTenant(tenantId);

	const contactsList = await tenant.hubspot.api.contacts.list({
		limit: 50,
	});
	const contacts = contactsList.results || [];

	const slackChannel = await getSlackChannel(tenantId, 'sales');

	const contactList = contacts.slice(0, 10).map((contact: any) => {
		const props = contact.properties || {};
		return `  • ${props.firstname || ''} ${props.lastname || ''} (${props.email || 'No email'}) - ${props.company || 'No company'}`;
	}).join('\n');
	const summary = `📇 *HubSpot Contacts Summary*\n\n*Total Contacts:* ${contacts.length}\n\n*Recent Contacts:*\n${contactList}`;

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: summary,
	});

	return {
		success: true,
		contactsProcessed: contacts.length,
		processedAt: new Date().toISOString(),
	};
}
