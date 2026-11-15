import { makePdfApiRequest } from './client';
import { pdfApiPathParameter } from './endpoints/path';

import {
	listTemplates,
	mergeTemplates,
	renderTemplate,
	retrieveTemplate,
} from './endpoints/templates';
import { PdfApiEndpointOutputSchemas } from './endpoints/types';

jest.mock('./client', () => ({
	makePdfApiRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const request = jest.mocked(makePdfApiRequest);

describe('PdfApi endpoint request seams', () => {
	beforeEach(() => {
		request.mockClear();
		request.mockResolvedValue({});
	});

	// never: every route-seam call passes a provider-shaped literal whose
	// exact type the generic runtime boundary cannot express; the same shapes
	// are validated against the zod contracts by the schema-boundary suite.
	const ctx = {
		key: 'secret',
		options: {},
		$getAccountId: jest.fn().mockResolvedValue('account-1'),
	} as never;

	it('covers every registered operation route', async () => {
		request.mockResolvedValue([]);

		await listTemplates(ctx, {} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/templates', {
			method: 'GET',
		});

		request.mockResolvedValue({
			id: 'tpl-1',
			name: 'Invoice Template',
			variables: [],
		});
		await retrieveTemplate(ctx, { template: 'tpl-1' } as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			pdfApiPathParameter('/templates/{template}', 'template', 'tpl-1'),
			{ method: 'GET' },
		);

		request.mockResolvedValue({ status: 200, data: 'base64-pdf' });
		await renderTemplate(ctx, {
			templateId: 'tpl-1',
			data: { name: 'Jane' },
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			pdfApiPathParameter('/templates/{templateId}/pdf', 'templateId', 'tpl-1'),
			{
				method: 'POST',
				accept: 'application/json',
				body: { data: { name: 'Jane' } },
			},
		);

		request.mockResolvedValue({ status: 200, data: 'base64-pdf' });
		await mergeTemplates(ctx, {
			templates: [{ id: 'tpl-1', data: { name: 'Jane' } }],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/templates/merge', {
			method: 'POST',
			accept: 'application/json',
			body: { templates: [{ id: 'tpl-1', data: { name: 'Jane' } }] },
		});
	});

	it('parses provider responses through the output schemas', async () => {
		const parsedList = PdfApiEndpointOutputSchemas.listTemplates.parse([
			{
				id: 'tpl-1',
				name: 'Invoice Template',
				meta: { description: 'A simple invoice template' },
				variables: [{ name: 'customer_name', type: 'string' }],
			},
		]);
		expect(parsedList[0]?.id).toBe('tpl-1');
		// The documented list response carries meta and variables.
		expect(parsedList[0]?.meta).toEqual({
			description: 'A simple invoice template',
		});
		expect(parsedList[0]?.variables).toEqual([
			{ name: 'customer_name', type: 'string' },
		]);

		const parsedRender = PdfApiEndpointOutputSchemas.renderTemplate.parse({
			status: 200,
			data: 'base64-pdf',
		});
		expect(parsedRender.data).toBe('base64-pdf');
	});

	it('parses the live get-template shape: integer ids and an empty meta array', () => {
		// Trimmed from a live GET /api/templates/{id} response (values replaced).
		const parsed = PdfApiEndpointOutputSchemas.retrieveTemplate.parse({
			id: 123456789012345,
			name: 'New Template',
			team_id: 4242,
			type: 'editor',
			created_at: '2026-11-15T08:00:00.000000Z',
			meta: [],
			variables: [{ name: 'first_name', type: 'string' }],
			team_name: "Test's Team",
		});
		expect(parsed.id).toBe(123456789012345);
		expect(parsed.meta).toEqual([]);
	});

	it('accepts the integer template id the API returns as input', async () => {
		request.mockResolvedValue({ status: 200, data: 'base64-pdf' });
		await mergeTemplates(ctx, {
			templates: [{ id: 123456789012345, data: {} }],
		} as never);
		expect(request).toHaveBeenLastCalledWith(ctx, '/templates/merge', {
			method: 'POST',
			accept: 'application/json',
			body: { templates: [{ id: '123456789012345', data: {} }] },
		});
		await retrieveTemplate(ctx, { template: 123456789012345 } as never);
		expect(request).toHaveBeenLastCalledWith(
			ctx,
			'/templates/123456789012345',
			{ method: 'GET' },
		);
	});

	it('redacts template data from the render event log payload', async () => {
		const logMock = jest.requireMock('corsair/core')
			.logEventFromContext as jest.Mock;
		// unknown: the event-writer mock records the runtime context and
		// provider payload, which the endpoint signature does not expose; only
		// the logged payload is asserted.
		logMock.mockClear();
		await renderTemplate(ctx, {
			templateId: 'tpl-2',
			data: { name: 'Jane' },
		} as never);
		// Read the calls after mockClear: Jest replaces the array on clear.
		const calls = logMock.mock.calls as Array<
			[unknown, string, unknown, string]
		>;
		const renderCalls = calls.filter(
			(c) => c[1] === 'pdfapi.templates.renderTemplate',
		);
		const payload = renderCalls[renderCalls.length - 1]?.[2];
		// R8: document placeholder values are customer data and never reach the
		// event history — only the template id and output mode are logged.
		expect(payload).toEqual({ templateId: 'tpl-2', output: 'pdf' });
	});
});
