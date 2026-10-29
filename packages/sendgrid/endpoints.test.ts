import {
	SendGridEndpointInputSchemas,
	SendGridEndpointOutputSchemas,
} from './endpoints/types';

describe('SendGrid Endpoint Schemas', () => {
	it('validates mail.send input and output schemas', () => {
		const validInput = {
			personalizations: [
				{
					to: [{ email: 'recipient@example.com', name: 'Recipient' }],
					subject: 'Test Subject',
				},
			],
			from: { email: 'sender@example.com', name: 'Sender' },
			subject: 'Global Subject',
			content: [{ type: 'text/plain', value: 'Hello World' }],
		};
		const parsedInput = SendGridEndpointInputSchemas.mailSend.parse(validInput);
		expect(parsedInput.from.email).toBe('sender@example.com');
		expect(parsedInput.personalizations[0]!.to[0]!.email).toBe(
			'recipient@example.com',
		);

		const validOutput = { x_message_id: 'filter0001' };
		const parsedOutput =
			SendGridEndpointOutputSchemas.mailSend.parse(validOutput);
		expect(parsedOutput.x_message_id).toBe('filter0001');
	});

	it('rejects mail.send without content or subject unless template_id is set', () => {
		expect(() =>
			SendGridEndpointInputSchemas.mailSend.parse({
				personalizations: [{ to: [{ email: 'recipient@example.com' }] }],
				from: { email: 'sender@example.com' },
				content: [],
			}),
		).toThrow();

		expect(
			SendGridEndpointInputSchemas.mailSend.parse({
				personalizations: [{ to: [{ email: 'recipient@example.com' }] }],
				from: { email: 'sender@example.com' },
				template_id: 'd-123',
			}),
		).toMatchObject({ template_id: 'd-123' });
	});

	it('validates contacts.addOrUpdate input and output schemas', () => {
		const validInput = {
			contacts: [
				{ email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe' },
			],
			list_ids: ['list-123'],
		};
		const parsedInput =
			SendGridEndpointInputSchemas.contactsAddOrUpdate.parse(validInput);
		expect(parsedInput.contacts[0]!.email).toBe('john.doe@example.com');

		const validOutput = { job_id: 'job-456' };
		const parsedOutput =
			SendGridEndpointOutputSchemas.contactsAddOrUpdate.parse(validOutput);
		expect(parsedOutput.job_id).toBe('job-456');
	});

	it('rejects contacts.addOrUpdate without an identifier', () => {
		expect(() =>
			SendGridEndpointInputSchemas.contactsAddOrUpdate.parse({
				contacts: [{ first_name: 'Jane' }],
			}),
		).toThrow();
	});

	it('validates lists.getAll input and output schemas', () => {
		const validInput = { page_size: 10, page_token: 'token-abc' };
		const parsedInput =
			SendGridEndpointInputSchemas.listsGetAll.parse(validInput);
		expect(parsedInput.page_size).toBe(10);

		const validOutput = {
			result: [{ id: 'list-1', name: 'Main List', contact_count: 50 }],
		};
		const parsedOutput =
			SendGridEndpointOutputSchemas.listsGetAll.parse(validOutput);
		expect(parsedOutput.result[0]!.name).toBe('Main List');
	});

	it('validates lists.create input and output schemas', () => {
		const validInput = { name: 'New Subscribers' };
		const parsedInput =
			SendGridEndpointInputSchemas.listsCreate.parse(validInput);
		expect(parsedInput.name).toBe('New Subscribers');

		const validOutput = {
			id: 'list-999',
			name: 'New Subscribers',
			contact_count: 0,
		};
		const parsedOutput =
			SendGridEndpointOutputSchemas.listsCreate.parse(validOutput);
		expect(parsedOutput.id).toBe('list-999');
	});

	it('validates suppressions.getBounces input and output schemas', () => {
		const validInput = {
			start_time: 1600000000,
			end_time: 1700000000,
			limit: 50,
			offset: 0,
		};
		const parsedInput =
			SendGridEndpointInputSchemas.suppressionsGetBounces.parse(validInput);
		expect(parsedInput.start_time).toBe(1600000000);

		const validOutput = {
			bounces: [
				{
					created: 1650000000,
					email: 'bounced@example.com',
					reason: '550 User unknown',
					status: '5.1.1',
				},
			],
		};
		const parsedOutput =
			SendGridEndpointOutputSchemas.suppressionsGetBounces.parse(validOutput);
		expect(parsedOutput.bounces[0]!.email).toBe('bounced@example.com');
	});

	it('validates senders.getAll input and output schemas', () => {
		const validInput = { limit: 10 };
		const parsedInput =
			SendGridEndpointInputSchemas.sendersGetAll.parse(validInput);
		expect(parsedInput.limit).toBe(10);

		const validOutput = {
			results: [
				{
					id: 1,
					nickname: 'Support',
					from_email: 'support@example.com',
					from_name: 'Support',
					verified: true,
					locked: false,
				},
			],
		};
		const parsedOutput =
			SendGridEndpointOutputSchemas.sendersGetAll.parse(validOutput);
		expect(parsedOutput.results[0]!.verified).toBe(true);
	});
});
