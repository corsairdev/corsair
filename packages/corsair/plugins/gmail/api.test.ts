import dotenv from 'dotenv';
import { makeGmailRequest } from './client';
import type {
	Draft,
	DraftListResponse,
	Label,
	LabelListResponse,
	Message,
	MessageListResponse,
	Profile,
	ThreadListResponse,
	Thread,
} from './types';
import { GmailEndpointOutputSchemas } from './endpoints/types';

dotenv.config();

const TEST_TOKEN = process.env.GMAIL_ACCESS_TOKEN!;
const TEST_EMAIL = 'mukulydv15@gmail.com';

function createRawEmailMessage(
	to: string,
	from: string,
	subject: string,
	body: string,
): string {
	const email = [
		`From: ${from}`,
		`To: ${to}`,
		`Subject: ${subject}`,
		'Content-Type: text/plain; charset=utf-8',
		'',
		body,
	].join('\r\n');

	return Buffer.from(email)
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

describe('Gmail API Type Tests', () => {
	describe('messages', () => {
		it('messagesList returns correct type', async () => {
			const response = await makeGmailRequest<MessageListResponse>(
				'/users/me/messages',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 10,
					},
				},
			);
            const result = response;

			GmailEndpointOutputSchemas.messagesList.parse(result);
		});

		it('messagesGet returns correct type', async () => {
			const messagesListResponse = await makeGmailRequest<MessageListResponse>(
				'/users/me/messages',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const messageId = messagesListResponse.messages?.[0]?.id;
			if (!messageId) {
				throw new Error('No messages found');
			}

			const response = await makeGmailRequest<Message>(
				`/users/me/messages/${messageId}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.messagesGet.parse(result);
		});

		it('messagesSend returns correct type', async () => {
			const rawMessage = createRawEmailMessage(
				TEST_EMAIL,
				TEST_EMAIL,
				'Test Message from API test',
				'This is a test message sent by the API test suite',
			);

			const response = await makeGmailRequest<Message>(
				'/users/me/messages/send',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						raw: rawMessage,
					},
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.messagesSend.parse(result);
		});

		it('messagesModify returns correct type', async () => {
			const messagesListResponse = await makeGmailRequest<MessageListResponse>(
				'/users/me/messages',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const messageId = messagesListResponse.messages?.[0]?.id;
			if (!messageId) {
				throw new Error('No messages found');
			}

			const labelsListResponse = await makeGmailRequest<LabelListResponse>(
				'/users/me/labels',
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const labelId = labelsListResponse.labels?.find(
				(l) => l.type === 'user',
			)?.id;
			if (!labelId) {
				throw new Error('No user labels found');
			}

			const response = await makeGmailRequest<Message>(
				`/users/me/messages/${messageId}/modify`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						addLabelIds: [labelId],
					},
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.messagesModify.parse(result);
		});

		it('messagesTrash returns correct type', async () => {
			const messagesListResponse = await makeGmailRequest<MessageListResponse>(
				'/users/me/messages',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const messageId = messagesListResponse.messages?.[0]?.id;
			if (!messageId) {
				throw new Error('No messages found');
			}

			const response = await makeGmailRequest<Message>(
				`/users/me/messages/${messageId}/trash`,
				TEST_TOKEN,
				{
					method: 'POST',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.messagesTrash.parse(result);

			await makeGmailRequest(
				`/users/me/messages/${messageId}/untrash`,
				TEST_TOKEN,
				{
					method: 'POST',
				},
			);
		});

		it('messagesUntrash returns correct type', async () => {
			const messagesListResponse = await makeGmailRequest<MessageListResponse>(
				'/users/me/messages',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const messageId = messagesListResponse.messages?.[0]?.id;
			if (!messageId) {
				throw new Error('No messages found');
			}

			await makeGmailRequest(`/users/me/messages/${messageId}/trash`, TEST_TOKEN, {
				method: 'POST',
			});

			const response = await makeGmailRequest<Message>(
				`/users/me/messages/${messageId}/untrash`,
				TEST_TOKEN,
				{
					method: 'POST',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.messagesUntrash.parse(result);
		});
	});

	describe('labels', () => {
		it('labelsList returns correct type', async () => {
			const response = await makeGmailRequest<LabelListResponse>(
				'/users/me/labels',
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.labelsList.parse(result);
		});

		it('labelsGet returns correct type', async () => {
			const labelsListResponse = await makeGmailRequest<LabelListResponse>(
				'/users/me/labels',
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const labelId = labelsListResponse.labels?.[0]?.id;
			if (!labelId) {
				throw new Error('No labels found');
			}

			const response = await makeGmailRequest(
				`/users/me/labels/${labelId}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.labelsGet.parse(result);
		});

		it('labelsCreate returns correct type', async () => {
			const labelName = `test-label-${Date.now()}`;
			const response = await makeGmailRequest<Label>(
				'/users/me/labels',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: labelName,
						messageListVisibility: 'show',
						labelListVisibility: 'labelShow',
					},
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.labelsCreate.parse(result);

			if (result.id) {
				await makeGmailRequest(`/users/me/labels/${result.id}`, TEST_TOKEN, {
					method: 'DELETE',
				});
			}
		});

		it('labelsUpdate returns correct type', async () => {
			const labelsListResponse = await makeGmailRequest<LabelListResponse>(
				'/users/me/labels',
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			let userLabel = labelsListResponse.labels?.find((l) => l.type === 'user');
			if (!userLabel?.id) {
				const createResponse = await makeGmailRequest<Label>(
					'/users/me/labels',
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							name: `test-label-update-${Date.now()}`,
							messageListVisibility: 'show',
							labelListVisibility: 'labelShow',
						},
					},
				);
				if (!createResponse.id) {
					throw new Error('Failed to create test label');
				}
				userLabel = { ...userLabel, id: createResponse.id };
			}

			if (!userLabel?.id) {
				throw new Error('No user label available for update test');
			}

			const response = await makeGmailRequest<Label>(
				`/users/me/labels/${userLabel.id}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: {
						name: userLabel.name,
						messageListVisibility: 'hide',
					},
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.labelsUpdate.parse(result);
		});
	});

	describe('drafts', () => {
		it('draftsList returns correct type', async () => {
			const response = await makeGmailRequest<DraftListResponse>(
				'/users/me/drafts',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 10,
					},
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.draftsList.parse(result);
		});

		it('draftsGet returns correct type', async () => {
			const draftsListResponse = await makeGmailRequest<DraftListResponse>(
				'/users/me/drafts',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const draftId = draftsListResponse.drafts?.[0]?.id;
			if (!draftId) {
				throw new Error('No drafts found');
			}

			const response = await makeGmailRequest(
				`/users/me/drafts/${draftId}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.draftsGet.parse(result);
		});

		it('draftsCreate returns correct type', async () => {
			const rawMessage = createRawEmailMessage(
				TEST_EMAIL,
				TEST_EMAIL,
				'Test Draft from API test',
				'This is a test draft created by the API test suite',
			);

			const response = await makeGmailRequest<Draft>(
				'/users/me/drafts',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						message: {
							raw: rawMessage,
						},
					},
				},
			);
            const result = response;
            
			GmailEndpointOutputSchemas.draftsCreate.parse(result);

			if (result.id) {
				await makeGmailRequest(`/users/me/drafts/${result.id}`, TEST_TOKEN, {
					method: 'DELETE',
				});
			}
		});

		it('draftsUpdate returns correct type', async () => {
			const rawMessage = createRawEmailMessage(
				TEST_EMAIL,
				TEST_EMAIL,
				'Test Draft for Update',
				'This is a test draft for updating',
			);

			const createResponse = await makeGmailRequest<Draft>(
				'/users/me/drafts',
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						message: {
							raw: rawMessage,
						},
					},
				},
			);
			if (!createResponse.id) {
				throw new Error('Failed to create test draft');
			}

			const updatedRawMessage = createRawEmailMessage(
				TEST_EMAIL,
				TEST_EMAIL,
				'Updated Draft from API test',
				'This is an updated test draft',
			);

			const response = await makeGmailRequest<Draft>(
				`/users/me/drafts/${createResponse.id}`,
				TEST_TOKEN,
				{
					method: 'PUT',
					body: {
						message: {
							raw: updatedRawMessage,
						},
					},
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.draftsUpdate.parse(result);

			await makeGmailRequest(`/users/me/drafts/${createResponse.id}`, TEST_TOKEN, {
				method: 'DELETE',
			});
		});
	});

	describe('threads', () => {
		it('threadsList returns correct type', async () => {
			const response = await makeGmailRequest<ThreadListResponse>(
				'/users/me/threads',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 10,
					},
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.threadsList.parse(result);
		});

		it('threadsGet returns correct type', async () => {
			const threadsListResponse = await makeGmailRequest<ThreadListResponse>(
				'/users/me/threads',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const threadId = threadsListResponse.threads?.[0]?.id;
			if (!threadId) {
				throw new Error('No threads found');
			}

			const response = await makeGmailRequest<Thread>(
				`/users/me/threads/${threadId}`,
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.threadsGet.parse(result);
		});

		it('threadsModify returns correct type', async () => {
			const threadsListResponse = await makeGmailRequest<ThreadListResponse>(
				'/users/me/threads',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const threadId = threadsListResponse.threads?.[0]?.id;
			if (!threadId) {
				throw new Error('No threads found');
			}

			const labelsListResponse = await makeGmailRequest<LabelListResponse>(
				'/users/me/labels',
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const labelId = labelsListResponse.labels?.find(
				(l) => l.type === 'user',
			)?.id;
			if (!labelId) {
				throw new Error('No user labels found');
			}

			const response = await makeGmailRequest<Thread>(
				`/users/me/threads/${threadId}/modify`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						addLabelIds: [labelId],
					},
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.threadsModify.parse(result);
		});

		it('threadsTrash returns correct type', async () => {
			const threadsListResponse = await makeGmailRequest<ThreadListResponse>(
				'/users/me/threads',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const threadId = threadsListResponse.threads?.[0]?.id;
			if (!threadId) {
				throw new Error('No threads found');
			}

			const response = await makeGmailRequest<Thread>(
				`/users/me/threads/${threadId}/trash`,
				TEST_TOKEN,
				{
					method: 'POST',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.threadsTrash.parse(result);

			await makeGmailRequest(`/users/me/threads/${threadId}/untrash`, TEST_TOKEN, {
				method: 'POST',
			});
		});

		it('threadsUntrash returns correct type', async () => {
			const threadsListResponse = await makeGmailRequest<ThreadListResponse>(
				'/users/me/threads',
				TEST_TOKEN,
				{
					method: 'GET',
					query: {
						maxResults: 1,
					},
				},
			);
			const threadId = threadsListResponse.threads?.[0]?.id;
			if (!threadId) {
				throw new Error('No threads found');
			}

			await makeGmailRequest(`/users/me/threads/${threadId}/trash`, TEST_TOKEN, {
				method: 'POST',
			});

			const response = await makeGmailRequest<Thread>(
				`/users/me/threads/${threadId}/untrash`,
				TEST_TOKEN,
				{
					method: 'POST',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.threadsUntrash.parse(result);
		});
	});

	describe('users', () => {
		it('usersGetProfile returns correct type', async () => {
			const response = await makeGmailRequest<Profile>(
				'/users/me/profile',
				TEST_TOKEN,
				{
					method: 'GET',
				},
			);
			const result = response;

			GmailEndpointOutputSchemas.usersGetProfile.parse(result);
		});
	});
});
