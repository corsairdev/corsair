import { AuthMissingError } from 'corsair/core';
import { request } from 'corsair/http';
import { z } from 'zod';
import { makeFreshdeskRequest } from './client';
import { FRESHDESK_OPERATIONS } from './endpoints/operations';
import { createFreshdeskRouteInputSchema } from './endpoints/types';
import type { FreshdeskContext } from './index';
import { freshdeskEndpointMeta } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function buildContext(): FreshdeskContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-key',
		options: { domain: 'acme.freshdesk.com' },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-key'),
			get_domain: () => Promise.resolve(null),
			set_domain: () => Promise.resolve(),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

type Operation = keyof typeof FRESHDESK_OPERATIONS;
type SendInput = Parameters<typeof makeFreshdeskRequest>[3];

async function send(name: Operation, input: SendInput) {
	await makeFreshdeskRequest(
		buildContext(),
		'test-api-key',
		FRESHDESK_OPERATIONS[name],
		input,
	);
	return mockedRequest.mock.calls.at(-1)?.[1];
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedRequest.mockResolvedValue({ id: 1 });
});

describe('Freshdesk review fixes', () => {
	// Freshdesk answers 405 to PUT on these routes and its curl samples use PATCH.
	it.each([
		['updateAgentAvailabilityPutAvailability', '/api/v2/agents/7/availability'],
		['updateSkillPut', '/api/v2/admin/skills/7'],
	] as const)('sends %s as PATCH', async (name, url) => {
		const options = await send(name, { pathParams: { id: '7' } });
		expect(options).toMatchObject({ method: 'PATCH', url });
	});

	// Request bodies copied from the curl samples in the Freshdesk v2 reference.
	const documentedBodies: Array<[Operation, SendInput]> = [
		[
			'ticketSummaryPutSummary',
			{ pathParams: { id: '20' }, body: { body: 'Updated summary' } },
		],
		[
			'ticketUserAccessesPatchAccesses',
			{
				pathParams: { id: '1' },
				body: { user_ids: [{ id: 2, deleted: true }, { id: 3 }] },
			},
		],
		[
			'sendOutboundMessagePostOutboundMessages',
			{
				body: {
					from: { channel_identifier: '+10000000000' },
					to: { recipient_identifier: '+10000000001' },
					channel_type: 'WHATSAPP',
				},
			},
		],
		[
			'createEmailMailboxPostMailboxes',
			{
				body: {
					name: 'Support',
					support_email: 'support@freshdesk.invalid',
					default_reply_email: true,
					mailbox_type: 'freshdesk_mailbox',
				},
			},
		],
		[
			'createAnAutomationRulePostRules',
			{
				pathParams: { automationTypeId: '4' },
				body: { name: 'Rule', performer: { type: 1, members: [8] } },
			},
		],
		[
			'createSkillPostSkills',
			{
				body: {
					name: 'German travel experts',
					conditions: [
						{
							resource_type: 'ticket',
							field_name: 'source',
							operator: 'in',
							value: [2, 4],
						},
					],
				},
			},
		],
		[
			'updateSkillPut',
			{
				pathParams: { id: '1' },
				body: { conditions: [{ resource_type: 'ticket' }] },
			},
		],
		[
			'createMultipleAgentsPostBulk',
			{
				body: {
					agents: [{ email: 'agent@freshdesk.invalid', ticket_scope: 1 }],
				},
			},
		],
		[
			'bulkCreateCannedResponsesPostBulk',
			{
				body: {
					canned_responses: [
						{
							title: 'Sample',
							content_html: 'Hello',
							folder_id: 1,
							visibility: 1,
						},
					],
				},
			},
		],
		[
			'updateSlaPolicyPut',
			{
				pathParams: { id: '43' },
				body: {
					name: 'Service Agent SLA Policy',
					sla_target: {
						priority_1: {
							respond_within: 1200,
							resolve_within: 1200,
							business_hours: true,
							escalation_enabled: false,
						},
					},
					escalation: { response: { escalation_time: 14400 } },
				},
			},
		],
		[
			'createOutboundEmailPostOutboundEmail',
			{
				body: {
					email: 'customer@freshdesk.invalid',
					subject: 'Status',
					email_config_id: 2,
					cc_emails: ['cc@freshdesk.invalid'],
				},
			},
		],
	];

	it.each(documentedBodies)(
		'accepts the documented %s request body',
		async (name, input) => {
			const options = await send(name, input);
			expect(options?.body).toEqual(input.body);
		},
	);

	it.each(['importContactPostImports', 'importCompanyPostImports'] as const)(
		'uploads the %s CSV under the file part with bracketed field indexes',
		async (name) => {
			const options = await send(name, {
				body: { fields: { name: 0, email: 2 } },
				attachments: [
					{ filename: 'import.csv', contentType: 'text/csv', base64: 'YSxi' },
				],
			});
			if (!(options?.body instanceof FormData))
				throw new Error('Expected multipart body');
			expect(options.body.get('file')).toBeInstanceOf(Blob);
			expect(options.body.get('fields[name]')).toBe('0');
			expect(options.body.get('fields[email]')).toBe('2');
			expect(options.body.get('fields')).toBeNull();
		},
	);

	it('sends ticket custom_fields as bracketed multipart parts', async () => {
		const options = await send('createTicketPostTickets', {
			body: { subject: 'Help', custom_fields: { cf_region: 'EU' } },
			attachments: [
				{ filename: 'a.txt', contentType: 'text/plain', base64: 'SGk=' },
			],
		});
		if (!(options?.body instanceof FormData))
			throw new Error('Expected multipart body');
		expect(options.body.get('custom_fields[cf_region]')).toBe('EU');
	});

	it('exposes each route path parameter and body field in its input schema', () => {
		const json = z.toJSONSchema(
			createFreshdeskRouteInputSchema(
				FRESHDESK_OPERATIONS.addNoteToATicketPostNotes,
			),
			{ unrepresentable: 'any' },
		) as {
			required?: string[];
			properties: Record<
				string,
				// unknown because only the property names are read, not their schemas.
				{ required?: string[]; properties?: Record<string, unknown> }
			>;
		};
		expect(json.required).toContain('pathParams');
		expect(json.properties.pathParams?.required).toEqual(['ticketId']);
		expect(Object.keys(json.properties.body?.properties ?? {})).toContain(
			'private',
		);
	});

	// R8: sends and changes that can't be undone are destructive.
	it.each([
		'createOutboundEmailPostOutboundEmail',
		'forwardTicketsPostForward',
		'replyTicketPostReply',
		'replyToForwardPostReplyToForward',
		'sendOutboundMessagePostOutboundMessages',
		'sendInvitePutSendInvite',
		'createMessageForThreadPostMessages',
		'ticketMergePutMerge',
		'mergeContactPostMerge',
		'makeAgentPutMakeAgent',
	] as const)('marks %s destructive', (name) => {
		expect(freshdeskEndpointMeta[`routes.${name}.run`].riskLevel).toBe(
			'destructive',
		);
	});

	it('uses the connected account domain when no domain option is set', async () => {
		const ctx = buildContext();
		ctx.options = {};
		ctx.keys.get_domain = () => Promise.resolve('tenant-b.freshdesk.com');
		await makeFreshdeskRequest(
			ctx,
			'test-api-key',
			FRESHDESK_OPERATIONS.listAllTicketsGetTickets,
			{},
		);
		expect(mockedRequest.mock.calls.at(-1)?.[0].BASE).toBe(
			'https://tenant-b.freshdesk.com',
		);
	});

	it('asks for a connection when neither a domain option nor a stored domain exists', async () => {
		const ctx = buildContext();
		ctx.options = {};
		await expect(
			makeFreshdeskRequest(
				ctx,
				'test-api-key',
				FRESHDESK_OPERATIONS.listAllTicketsGetTickets,
				{},
			),
		).rejects.toThrow(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
