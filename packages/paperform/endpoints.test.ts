import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { PaperformContext } from './context';
import {
	getCoupon,
	getForm,
	getPartialSubmission,
	getProduct,
	getSpace,
	getSubmission,
	listCoupons,
	listFields,
	listForms,
	listPartialSubmissions,
	listProducts,
	listSpaceForms,
	listSpaces,
	listSubmissions,
	listTranslations,
	listWebhooks,
	signFile,
} from './endpoints/read';
import {
	createCoupon,
	createWebhook,
	deleteCoupon,
	deleteSubmission,
	deleteWebhook,
	updateCoupon,
	updateProduct,
} from './endpoints/write';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function table() {
	return {
		upsertByEntityId: jest.fn().mockResolvedValue(undefined),
		deleteByEntityId: jest.fn().mockResolvedValue(undefined),
	};
}

function context(key?: string, db?: Record<string, unknown>): PaperformContext {
	return { key, db } as unknown as PaperformContext;
}

function call(n = 0) {
	return mockRequest.mock.calls[n]?.[1];
}

// Trimmed from the live API (11-17); ids are from a throwaway test account.
const FORM = {
	id: '6afc3c563cdbd4623b070434',
	slug: 'eqadkzns',
	custom_slug: null,
	space_id: 10001131833,
	title: 'Order form',
	description: '',
	url: 'https://eqadkzns.paperform.co',
	live: true,
	tags: null,
	submission_count: 1,
	created_at_utc: '2026-11-17T11:36:54+00:00',
	updated_at_utc: '2026-11-17T11:36:54+00:00',
};
const PAGE = { status: 'ok', total: 1, has_more: false, limit: 20, skip: 0 };
const SUBMISSION = {
	id: '6afc3d806e698e3d810e785b',
	form_id: '6afc3c563cdbd4623b070434',
	data: { fv0rg: 'corsair-plugin-test', f5rji: 'cpt-sku-1', score: false },
	device: { type: 'desktop', browser: 'Chrome' },
	charge: { total: 10, payment_source_service: 'No Payments Taken' },
	pdfs: null,
	created_at_utc: '2026-11-17T11:41:52+00:00',
};
const PRODUCT = {
	SKU: 'cpt-sku-1',
	name: 'corsair-plugin-test product',
	price: '10',
	quantity: 5,
	minimum: null,
	maximum: null,
	discountable: false,
	images: [],
	sold: 0,
};
const COUPON = {
	code: 'CPTTEST10',
	enabled: true,
	target: 'price',
	discountPercentage: 10,
	expiresAt: null,
};

describe('paperform', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('forms', () => {
		it('lists forms with paging, a Bearer token and a string space id', async () => {
			mockRequest.mockResolvedValue({ results: { forms: [FORM] }, ...PAGE });
			const forms = table();
			const result = await listForms(context('sekrit', { forms }), {
				search: 'order',
				limit: 5,
				skip: 10,
				afterDate: '2026-11-01',
				sort: 'DESC',
			});
			expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
				Accept: 'application/json',
				Authorization: 'Bearer sekrit',
			});
			expect(call()).toEqual({
				method: 'GET',
				url: '/v1/forms',
				query: {
					search: 'order',
					limit: 5,
					skip: 10,
					after_id: undefined,
					before_id: undefined,
					after_date: '2026-11-01',
					before_date: undefined,
					sort: 'DESC',
				},
				body: undefined,
				mediaType: undefined,
			});
			expect(result.forms[0]?.space_id).toBe('10001131833');
			expect(result.page).toEqual({
				total: 1,
				hasMore: false,
				limit: 20,
				skip: 0,
			});
			expect(forms.upsertByEntityId).toHaveBeenCalledWith(
				'6afc3c563cdbd4623b070434',
				{
					id: '6afc3c563cdbd4623b070434',
					title: 'Order form',
					slug: 'eqadkzns',
					spaceId: '10001131833',
					live: true,
					submissionCount: 1,
				},
			);
			expect(mockLog.mock.calls[0]?.[1]).toBe('paperform.forms.list');
		});

		it('gets one form by slug', async () => {
			mockRequest.mockResolvedValue({ results: { form: FORM }, status: 'ok' });
			const result = await getForm(context(), { form: 'eqadkzns' });
			expect(call()?.url).toBe('/v1/forms/eqadkzns');
			expect(result.form.slug).toBe('eqadkzns');
		});

		it('escapes the form reference in the path', async () => {
			mockRequest.mockResolvedValue({ results: { form: FORM }, status: 'ok' });
			await getForm(context(), { form: '../spaces' });
			expect(call()?.url).toBe('/v1/forms/..%2Fspaces');
		});

		it('lists fields', async () => {
			mockRequest.mockResolvedValue({
				results: {
					fields: [
						{ key: 'fv0rg', title: 'Test note', type: 'text', required: true },
						{ key: 'f5rji', title: 'Test product', type: 'products' },
					],
				},
				status: 'ok',
			});
			const result = await listFields(context(), {
				form: 'eqadkzns',
				search: 'note',
			});
			expect(call()).toMatchObject({
				url: '/v1/forms/eqadkzns/fields',
				query: { search: 'note' },
			});
			expect(result.fields.map((f) => f.key)).toEqual(['fv0rg', 'f5rji']);
		});
	});

	describe('spaces and translations', () => {
		it('keeps spaces whose id is a number', async () => {
			mockRequest.mockResolvedValue({
				results: { spaces: [{ id: 10001131833, name: 'Team' }] },
				...PAGE,
			});
			const spaces = table();
			const result = await listSpaces(context(undefined, { spaces }), {});
			expect(result.spaces).toEqual([{ id: '10001131833', name: 'Team' }]);
			expect(spaces.upsertByEntityId).toHaveBeenCalledWith('10001131833', {
				id: '10001131833',
				name: 'Team',
			});
		});

		it('gets one space', async () => {
			mockRequest.mockResolvedValue({
				results: { space: { id: 10001131833, name: 'Team' } },
			});
			const result = await getSpace(context(), { id: '10001131833' });
			expect(call()?.url).toBe('/v1/spaces/10001131833');
			expect(result.space.id).toBe('10001131833');
		});

		it('lists the forms in a space', async () => {
			mockRequest.mockResolvedValue({ results: { forms: [FORM] }, ...PAGE });
			const result = await listSpaceForms(context(), { id: '10001131833' });
			expect(call()?.url).toBe('/v1/spaces/10001131833/forms');
			expect(result.forms).toHaveLength(1);
		});

		it('stores a translation title and language, not the mapping', async () => {
			mockRequest.mockResolvedValue({
				results: {
					translations: [
						{
							id: 'tr1',
							title: 'German',
							language: 'German',
							translations: { hello: 'hallo' },
						},
					],
				},
				...PAGE,
			});
			const translations = table();
			await listTranslations(context(undefined, { translations }), {
				limit: 50,
			});
			expect(call()?.query).toMatchObject({ limit: 50 });
			expect(translations.upsertByEntityId).toHaveBeenCalledWith('tr1', {
				id: 'tr1',
				title: 'German',
				language: 'German',
			});
		});
	});

	describe('submissions', () => {
		it('lists submissions with answers and stores only metadata', async () => {
			mockRequest.mockResolvedValue({
				results: { submissions: [SUBMISSION] },
				...PAGE,
			});
			const submissions = table();
			const result = await listSubmissions(
				context(undefined, { submissions }),
				{ form: 'eqadkzns', limit: 10, beforeId: 'abc' },
			);
			expect(call()).toMatchObject({
				url: '/v1/forms/eqadkzns/submissions',
				query: { limit: 10, before_id: 'abc' },
			});
			expect(result.submissions[0]?.data).toEqual(SUBMISSION.data);
			expect(submissions.upsertByEntityId).toHaveBeenCalledWith(SUBMISSION.id, {
				id: SUBMISSION.id,
				formId: SUBMISSION.form_id,
				createdAt: SUBMISSION.created_at_utc,
			});
			expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
				'corsair-plugin-test',
			);
		});

		it('gets one submission', async () => {
			mockRequest.mockResolvedValue({ results: { submission: SUBMISSION } });
			const result = await getSubmission(context(), {
				form: 'eqadkzns',
				id: SUBMISSION.id,
			});
			expect(call()?.url).toBe(
				`/v1/forms/eqadkzns/submissions/${SUBMISSION.id}`,
			);
			expect(result.submission.id).toBe(SUBMISSION.id);
		});

		it('deletes a submission and then the local row', async () => {
			mockRequest.mockResolvedValue({ status: 'ok' });
			const submissions = table();
			const result = await deleteSubmission(
				context(undefined, { submissions }),
				{ form: 'eqadkzns', id: SUBMISSION.id },
			);
			expect(call()).toMatchObject({
				method: 'DELETE',
				url: `/v1/forms/eqadkzns/submissions/${SUBMISSION.id}`,
			});
			expect(submissions.deleteByEntityId).toHaveBeenCalledWith(SUBMISSION.id);
			expect(result).toEqual({ deleted: true });
		});

		it('keeps the local row when the delete fails', async () => {
			mockRequest.mockRejectedValue(new Error('boom'));
			const submissions = table();
			await expect(
				deleteSubmission(context(undefined, { submissions }), {
					form: 'eqadkzns',
					id: SUBMISSION.id,
				}),
			).rejects.toThrow('boom');
			expect(submissions.deleteByEntityId).not.toHaveBeenCalled();
		});

		it('lists partial submissions from the hyphenated key', async () => {
			mockRequest.mockResolvedValue({
				results: {
					'partial-submissions': [
						{
							id: '6afc3d79939666bf340d8a77',
							form_id: FORM.id,
							data: { fv0rg: 'x' },
							last_answered: 'f5rji',
							submitted_at_utc: null,
						},
					],
				},
				...PAGE,
			});
			const result = await listPartialSubmissions(context(), {
				form: 'eqadkzns',
			});
			expect(call()?.url).toBe('/v1/forms/eqadkzns/partial-submissions');
			expect(result.partialSubmissions[0]?.last_answered).toBe('f5rji');
		});

		it('gets one partial submission', async () => {
			mockRequest.mockResolvedValue({
				results: {
					'partial-submission': { id: 'p1', form_id: FORM.id, data: {} },
				},
			});
			const result = await getPartialSubmission(context(), {
				form: 'eqadkzns',
				id: 'p1',
			});
			expect(call()?.url).toBe('/v1/forms/eqadkzns/partial-submissions/p1');
			expect(result.partialSubmission.id).toBe('p1');
		});
	});

	describe('products', () => {
		it('lists products and accepts a string price', async () => {
			mockRequest.mockResolvedValue({ results: { products: [PRODUCT] } });
			const result = await listProducts(context(), { form: 'eqadkzns' });
			expect(call()?.url).toBe('/v1/forms/eqadkzns/products');
			expect(result.products[0]?.price).toBe('10');
		});

		it('gets one product from a one-item products list', async () => {
			mockRequest.mockResolvedValue({ results: { products: [PRODUCT] } });
			const result = await getProduct(context(), {
				form: 'eqadkzns',
				sku: 'cpt-sku-1',
			});
			expect(call()?.url).toBe('/v1/forms/eqadkzns/products/cpt-sku-1');
			expect(result.product.SKU).toBe('cpt-sku-1');
		});

		it('updates only the fields given', async () => {
			mockRequest.mockResolvedValue({
				results: { product: { ...PRODUCT, quantity: 4 } },
			});
			const result = await updateProduct(context(), {
				form: 'eqadkzns',
				sku: 'cpt-sku-1',
				quantity: 4,
			});
			expect(call()).toMatchObject({
				method: 'PUT',
				url: '/v1/forms/eqadkzns/products/cpt-sku-1',
				body: { quantity: 4 },
			});
			expect(result.product.quantity).toBe(4);
		});

		it('refuses an update with no fields', async () => {
			await expect(
				updateProduct(context(), { form: 'eqadkzns', sku: 'cpt-sku-1' }),
			).rejects.toThrow('at least one');
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('coupons', () => {
		it('creates a coupon', async () => {
			mockRequest.mockResolvedValue({ results: { coupon: COUPON } });
			const result = await createCoupon(context(), {
				form: 'eqadkzns',
				code: 'CPTTEST10',
				enabled: true,
				target: 'price',
				discountPercentage: 10,
			});
			expect(call()).toMatchObject({
				method: 'POST',
				url: '/v1/forms/eqadkzns/coupons',
				body: {
					code: 'CPTTEST10',
					enabled: true,
					target: 'price',
					discountPercentage: 10,
				},
			});
			expect(result.coupon.code).toBe('CPTTEST10');
		});

		it('lists and gets coupons', async () => {
			mockRequest.mockResolvedValueOnce({ results: { coupons: [COUPON] } });
			mockRequest.mockResolvedValueOnce({ results: { coupon: COUPON } });
			const list = await listCoupons(context(), { form: 'eqadkzns' });
			const one = await getCoupon(context(), {
				form: 'eqadkzns',
				code: 'CPTTEST10',
			});
			expect(call(0)?.url).toBe('/v1/forms/eqadkzns/coupons');
			expect(call(1)?.url).toBe('/v1/forms/eqadkzns/coupons/CPTTEST10');
			expect(list.coupons).toHaveLength(1);
			expect(one.coupon.discountPercentage).toBe(10);
		});

		it('updates a coupon without resending the code in the body', async () => {
			mockRequest.mockResolvedValue({
				results: { coupon: { ...COUPON, enabled: false } },
			});
			const result = await updateCoupon(context(), {
				form: 'eqadkzns',
				code: 'CPTTEST10',
				enabled: false,
			});
			expect(call()).toMatchObject({
				method: 'PUT',
				url: '/v1/forms/eqadkzns/coupons/CPTTEST10',
				body: { enabled: false },
			});
			expect(result.coupon.enabled).toBe(false);
		});

		it('deletes a coupon', async () => {
			mockRequest.mockResolvedValue({ status: 'ok' });
			await expect(
				deleteCoupon(context(), { form: 'eqadkzns', code: 'CPT 10' }),
			).resolves.toEqual({ deleted: true });
			expect(call()).toMatchObject({
				method: 'DELETE',
				url: '/v1/forms/eqadkzns/coupons/CPT%2010',
			});
		});
	});

	describe('webhooks and files', () => {
		it('creates a webhook and keeps the URL out of the event', async () => {
			mockRequest.mockResolvedValue({
				results: {
					webhook: {
						id: 'wh1',
						target_url: 'https://example.com/hook',
						triggers: ['submission'],
					},
				},
			});
			const result = await createWebhook(context(), {
				form: 'eqadkzns',
				targetUrl: 'https://example.com/hook',
				triggers: ['submission'],
			});
			expect(call()).toMatchObject({
				method: 'POST',
				url: '/v1/forms/eqadkzns/webhooks',
				body: {
					target_url: 'https://example.com/hook',
					triggers: ['submission'],
				},
			});
			expect(result.webhook.id).toBe('wh1');
			expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
				'example.com',
			);
		});

		it('refuses a plain http webhook URL', async () => {
			await expect(
				createWebhook(context(), {
					form: 'eqadkzns',
					targetUrl: 'http://example.com/hook',
					triggers: ['submission'],
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('lists and deletes webhooks', async () => {
			mockRequest.mockResolvedValueOnce({
				results: { webhooks: [{ id: 'wh1', triggers: ['submission'] }] },
				...PAGE,
			});
			mockRequest.mockResolvedValueOnce({ status: 'ok' });
			const list = await listWebhooks(context(), { form: 'eqadkzns' });
			await deleteWebhook(context(), { id: 'wh1' });
			expect(call(0)?.url).toBe('/v1/forms/eqadkzns/webhooks');
			expect(call(1)).toMatchObject({
				method: 'DELETE',
				url: '/v1/webhooks/wh1',
			});
			expect(list.webhooks[0]?.id).toBe('wh1');
		});

		it('signs a file URL', async () => {
			mockRequest.mockResolvedValue({
				status: 'ok',
				results: {
					file_url: 'https://signed.example/file.pdf',
					storage_url: 'https://storage.example/file.pdf',
					expires_at_utc: '2026-11-24T00:00:00Z',
				},
			});
			const result = await signFile(context(), {
				url: 'https://paperform.co/file/s3.amazonaws.com/paperform/x/file.pdf',
			});
			expect(call()).toMatchObject({
				method: 'POST',
				url: '/v1/files/sign',
				body: {
					url: 'https://paperform.co/file/s3.amazonaws.com/paperform/x/file.pdf',
				},
			});
			expect(result).toEqual({
				fileUrl: 'https://signed.example/file.pdf',
				storageUrl: 'https://storage.example/file.pdf',
				expiresAt: '2026-11-24T00:00:00Z',
			});
		});
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/forms' },
			{
				url: 'https://api.paperform.co/v1/forms',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error_type: 'authentication' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listForms(context(), {})).rejects.toBe(error);
	});
});
