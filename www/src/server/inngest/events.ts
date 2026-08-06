import { inngest } from './client';

async function sendEvent(
	name:
		| 'integration/claim.created'
		| 'integration/issue.linked'
		| 'integration/pr.linked',
	data: {
		statusId: string;
		integrationId: string;
		userId: string;
		slug: string;
	},
) {
	try {
		await inngest.send({ name, data });
	} catch (error) {
		console.error(`Failed to send Inngest event ${name}`, error);
	}
}

export async function sendClaimCreatedEvent(data: {
	statusId: string;
	integrationId: string;
	userId: string;
	slug: string;
}) {
	await sendEvent('integration/claim.created', data);
}

export async function sendIssueLinkedEvent(data: {
	statusId: string;
	integrationId: string;
	userId: string;
	slug: string;
}) {
	await sendEvent('integration/issue.linked', data);
}

export async function sendPrLinkedEvent(data: {
	statusId: string;
	integrationId: string;
	userId: string;
	slug: string;
}) {
	await sendEvent('integration/pr.linked', data);
}
