import { logEventFromContext } from 'corsair/core';
import { GumroadAPIError } from './client';
import {
	CustomFields,
	Earnings,
	Emails,
	Files,
	Licenses,
	Media,
	OfferCodes,
	Payouts,
	Products,
	Public,
	ResourceSubscriptions,
	Sales,
	Subscribers,
	TaxForms,
	User,
	VariantCategories,
	Workflows,
} from './endpoints';
import type {
	GumroadEndpointInputs,
	GumroadEndpointOutputs,
	GumroadOperation,
} from './endpoints/types';
import {
	GumroadEndpointInputSchemas,
	GumroadEndpointOutputSchemas,
} from './endpoints/types';
import {
	category,
	email,
	errorBody,
	mediaFile,
	offerCode,
	payout,
	product,
	publicProduct,
	publicProfile,
	purchase,
	refundPolicy,
	resourceSubscription,
	review,
	sale,
	subscriber,
	taxForm,
	user,
	variant,
	variantCategory,
	workflow,
	workflowEmail,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'gr-test-key';
const PRODUCT_ID = 'A-m3CDDC5dlrSdKZp0RFhA==';
const SALE_ID = 'B28UKN-dvxYabdavG97Y-Q==';
const LICENSE_KEY = 'A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	// jest types mock calls as any[]; this narrows fetch's (url, init)
	// signature for the last recorded call.
	const call = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url: new URL(call[0]),
		init: call[1],
		headers: new Headers(call[1].headers),
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('endpoint dispatch', () => {
	// One row per operation: the response fixture satisfies the route's
	// output schema, and the row pins the method, path and wire payload.
	// Input and response stay unknown because each row carries its own shape.
	const dispatch: Array<{
		name: string;
		endpoint: AnyEndpoint;
		input: unknown;
		response: unknown;
		sent: { method: string; path: string; query?: string; body?: string };
	}> = [
		{
			name: 'products.list',
			endpoint: Products.list,
			input: {},
			response: { success: true, products: [product] },
			sent: { method: 'GET', path: '/v2/products' },
		},
		{
			name: 'products.get',
			endpoint: Products.get,
			input: { id: PRODUCT_ID },
			response: { success: true, product },
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}`,
			},
		},
		{
			name: 'products.create',
			endpoint: Products.create,
			input: {
				native_type: 'digital',
				name: 'Pencil Icon PSD',
				price: 100,
				category: 'design/ui-and-web/figma',
			},
			response: { success: true, product },
			sent: {
				method: 'POST',
				path: '/v2/products',
				body: 'native_type=digital&name=Pencil%20Icon%20PSD&price=100&category=design%2Fui-and-web%2Ffigma',
			},
		},
		{
			name: 'products.update',
			endpoint: Products.update,
			input: { id: PRODUCT_ID, name: 'v2', max_purchase_count: 100 },
			response: { success: true, product },
			sent: {
				method: 'PUT',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}`,
				body: 'name=v2&max_purchase_count=100',
			},
		},
		{
			name: 'products.delete',
			endpoint: Products.remove,
			input: { id: PRODUCT_ID },
			response: {
				success: true,
				message: 'The product has been deleted successfully.',
			},
			sent: {
				method: 'DELETE',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}`,
			},
		},
		{
			name: 'products.enable',
			endpoint: Products.enable,
			input: { id: PRODUCT_ID },
			response: { success: true, product },
			sent: {
				method: 'PUT',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/enable`,
			},
		},
		{
			name: 'products.disable',
			endpoint: Products.disable,
			input: { id: PRODUCT_ID },
			response: { success: true, product: { ...product, published: false } },
			sent: {
				method: 'PUT',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/disable`,
			},
		},
		{
			name: 'products.reviewsList',
			endpoint: Products.reviewsList,
			input: { product_id: PRODUCT_ID, page_key: 'cursor-1' },
			response: { success: true, product_reviews: [review] },
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/reviews`,
				query: 'page_key=cursor-1',
			},
		},
		{
			name: 'products.categoriesList',
			endpoint: Products.categoriesList,
			input: {},
			response: { success: true, categories: [category] },
			sent: { method: 'GET', path: '/v2/categories' },
		},
		{
			name: 'products.coversAdd',
			endpoint: Products.coversAdd,
			input: {
				product_id: PRODUCT_ID,
				url: 'https://www.youtube.com/watch?v=qKebcV1jv3A',
			},
			response: { success: true, covers: [], main_cover_id: null },
			sent: {
				method: 'POST',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/covers`,
				body: 'url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DqKebcV1jv3A',
			},
		},
		{
			name: 'products.coversDelete',
			endpoint: Products.coversDelete,
			input: { product_id: PRODUCT_ID, id: 'abc123' },
			response: { success: true, covers: [], main_cover_id: null },
			sent: {
				method: 'DELETE',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/covers/abc123`,
			},
		},
		{
			name: 'products.thumbnailSet',
			endpoint: Products.thumbnailSet,
			input: {
				product_id: PRODUCT_ID,
				url: 'https://example.com/thumbnail.png',
			},
			response: {
				success: true,
				thumbnail: { url: 'https://public-files.gumroad.com/v/x', guid: 'g' },
			},
			sent: {
				method: 'POST',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/thumbnail`,
				body: 'url=https%3A%2F%2Fexample.com%2Fthumbnail.png',
			},
		},
		{
			name: 'products.thumbnailDelete',
			endpoint: Products.thumbnailDelete,
			input: { product_id: PRODUCT_ID },
			response: { success: true, thumbnail: null },
			sent: {
				method: 'DELETE',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/thumbnail`,
			},
		},
		{
			name: 'offerCodes.list',
			endpoint: OfferCodes.list,
			input: { auto_apply: 'true', page_key: 'c-2' },
			response: {
				success: true,
				offer_codes: [offerCode],
				next_page_key: 'c-3',
			},
			sent: {
				method: 'GET',
				path: '/v2/offer_codes',
				query: 'auto_apply=true&page_key=c-2',
			},
		},
		{
			name: 'offerCodes.get',
			endpoint: OfferCodes.get,
			input: { id: 'bfi_30HLgGWL8H2wo_Gzlg==' },
			response: { success: true, offer_code: offerCode },
			sent: {
				method: 'GET',
				path: '/v2/offer_codes/bfi_30HLgGWL8H2wo_Gzlg%3D%3D',
			},
		},
		{
			name: 'offerCodes.update',
			endpoint: OfferCodes.update,
			input: {
				id: 'bfi_30HLgGWL8H2wo_Gzlg==',
				max_purchase_count: 10,
				valid_at: '2026-11-27T00:00:00-05:00',
				expires_at: '2026-12-01T00:00:00-05:00',
			},
			response: { success: true, offer_code: offerCode },
			sent: {
				method: 'PUT',
				path: '/v2/offer_codes/bfi_30HLgGWL8H2wo_Gzlg%3D%3D',
				body: 'max_purchase_count=10&valid_at=2026-11-27T00%3A00%3A00-05%3A00&expires_at=2026-12-01T00%3A00%3A00-05%3A00',
			},
		},
		{
			name: 'offerCodes.listForProduct',
			endpoint: OfferCodes.listForProduct,
			input: { product_id: PRODUCT_ID },
			response: { success: true, offer_codes: [offerCode] },
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/offer_codes`,
			},
		},
		{
			name: 'offerCodes.getForProduct',
			endpoint: OfferCodes.getForProduct,
			input: { product_id: PRODUCT_ID, id: 'bfi_30HLgGWL8H2wo_Gzlg==' },
			response: { success: true, offer_code: offerCode },
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/offer_codes/bfi_30HLgGWL8H2wo_Gzlg%3D%3D`,
			},
		},
		{
			name: 'offerCodes.createForProduct',
			endpoint: OfferCodes.createForProduct,
			input: {
				product_id: PRODUCT_ID,
				name: '1OFF',
				amount_off: 100,
			},
			response: { success: true, offer_code: offerCode },
			sent: {
				method: 'POST',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/offer_codes`,
				body: 'name=1OFF&amount_off=100&offer_type=cents&universal=false',
			},
		},
		{
			name: 'offerCodes.updateForProduct',
			endpoint: OfferCodes.updateForProduct,
			input: {
				product_id: PRODUCT_ID,
				id: 'bfi_30HLgGWL8H2wo_Gzlg==',
				sale_label: 'Black Friday',
			},
			response: { success: true, offer_code: offerCode },
			sent: {
				method: 'PUT',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/offer_codes/bfi_30HLgGWL8H2wo_Gzlg%3D%3D`,
				body: 'sale_label=Black%20Friday',
			},
		},
		{
			name: 'offerCodes.deleteForProduct',
			endpoint: OfferCodes.deleteForProduct,
			input: { product_id: PRODUCT_ID, id: 'bfi_30HLgGWL8H2wo_Gzlg==' },
			response: {
				success: true,
				message: 'The offer_code has been deleted successfully.',
			},
			sent: {
				method: 'DELETE',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/offer_codes/bfi_30HLgGWL8H2wo_Gzlg%3D%3D`,
			},
		},
		{
			name: 'variantCategories.list',
			endpoint: VariantCategories.list,
			input: { product_id: PRODUCT_ID },
			response: { success: true, variant_categories: [variantCategory] },
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories`,
			},
		},
		{
			name: 'variantCategories.create',
			endpoint: VariantCategories.create,
			input: { product_id: PRODUCT_ID, title: 'colors' },
			response: { success: true, variant_category: variantCategory },
			sent: {
				method: 'POST',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories`,
				body: 'title=colors',
			},
		},
		{
			name: 'variantCategories.get',
			endpoint: VariantCategories.get,
			input: { product_id: PRODUCT_ID, id: 'mN7CdHiwHaR9FlxKvF-n-g==' },
			response: { success: true, variant_category: variantCategory },
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories/mN7CdHiwHaR9FlxKvF-n-g%3D%3D`,
			},
		},
		{
			name: 'variantCategories.update',
			endpoint: VariantCategories.update,
			input: {
				product_id: PRODUCT_ID,
				id: 'mN7CdHiwHaR9FlxKvF-n-g==',
				title: 'sizes',
			},
			response: { success: true, variant_category: variantCategory },
			sent: {
				method: 'PUT',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories/mN7CdHiwHaR9FlxKvF-n-g%3D%3D`,
				body: 'title=sizes',
			},
		},
		{
			name: 'variantCategories.delete',
			endpoint: VariantCategories.remove,
			input: { product_id: PRODUCT_ID, id: 'mN7CdHiwHaR9FlxKvF-n-g==' },
			response: {
				success: true,
				message: 'The variant_category has been deleted successfully.',
			},
			sent: {
				method: 'DELETE',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories/mN7CdHiwHaR9FlxKvF-n-g%3D%3D`,
			},
		},
		{
			name: 'variantCategories.variantsList',
			endpoint: VariantCategories.variantsList,
			input: {
				product_id: PRODUCT_ID,
				variant_category_id: 'mN7CdHiwHaR9FlxKvF-n-g==',
			},
			response: { success: true, variants: [variant] },
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories/mN7CdHiwHaR9FlxKvF-n-g%3D%3D/variants`,
			},
		},
		{
			name: 'variantCategories.variantsCreate',
			endpoint: VariantCategories.variantsCreate,
			input: {
				product_id: PRODUCT_ID,
				variant_category_id: 'mN7CdHiwHaR9FlxKvF-n-g==',
				name: 'red',
				price_difference_cents: 250,
			},
			response: { success: true, variant },
			sent: {
				method: 'POST',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories/mN7CdHiwHaR9FlxKvF-n-g%3D%3D/variants`,
				body: 'name=red&price_difference_cents=250',
			},
		},
		{
			name: 'variantCategories.variantsGet',
			endpoint: VariantCategories.variantsGet,
			input: {
				product_id: PRODUCT_ID,
				variant_category_id: 'mN7CdHiwHaR9FlxKvF-n-g==',
				id: 'kuaXCPHTmRuoK13rNGVbxg==',
			},
			response: { success: true, variant },
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories/mN7CdHiwHaR9FlxKvF-n-g%3D%3D/variants/kuaXCPHTmRuoK13rNGVbxg%3D%3D`,
			},
		},
		{
			name: 'variantCategories.variantsUpdate',
			endpoint: VariantCategories.variantsUpdate,
			input: {
				product_id: PRODUCT_ID,
				variant_category_id: 'mN7CdHiwHaR9FlxKvF-n-g==',
				id: 'kuaXCPHTmRuoK13rNGVbxg==',
				price_difference_cents: 150,
			},
			response: { success: true, variant },
			sent: {
				method: 'PUT',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories/mN7CdHiwHaR9FlxKvF-n-g%3D%3D/variants/kuaXCPHTmRuoK13rNGVbxg%3D%3D`,
				body: 'price_difference_cents=150',
			},
		},
		{
			name: 'variantCategories.variantsDelete',
			endpoint: VariantCategories.variantsDelete,
			input: {
				product_id: PRODUCT_ID,
				variant_category_id: 'mN7CdHiwHaR9FlxKvF-n-g==',
				id: 'kuaXCPHTmRuoK13rNGVbxg==',
			},
			response: {
				success: true,
				message: 'The variant has been deleted successfully.',
			},
			sent: {
				method: 'DELETE',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/variant_categories/mN7CdHiwHaR9FlxKvF-n-g%3D%3D/variants/kuaXCPHTmRuoK13rNGVbxg%3D%3D`,
			},
		},
		{
			name: 'customFields.list',
			endpoint: CustomFields.list,
			input: { product_id: PRODUCT_ID },
			response: {
				success: true,
				custom_fields: [{ name: 'phone number', required: 'false' }],
			},
			sent: {
				method: 'GET',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/custom_fields`,
			},
		},
		{
			name: 'customFields.create',
			endpoint: CustomFields.create,
			input: {
				product_id: PRODUCT_ID,
				name: 'phone number',
				required: 'true',
			},
			response: {
				success: true,
				custom_field: { name: 'phone number', required: 'false' },
			},
			sent: {
				method: 'POST',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/custom_fields`,
				body: 'name=phone%20number&required=true',
			},
		},
		{
			name: 'customFields.update',
			endpoint: CustomFields.update,
			input: {
				product_id: PRODUCT_ID,
				name: 'phone number',
				required: 'false',
			},
			response: {
				success: true,
				custom_field: { name: 'phone number', required: 'false' },
			},
			sent: {
				method: 'PUT',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/custom_fields/phone%20number`,
				body: 'required=false',
			},
		},
		{
			name: 'customFields.delete',
			endpoint: CustomFields.remove,
			input: { product_id: PRODUCT_ID, name: 'phone number' },
			response: {
				success: true,
				message: 'The custom_field has been deleted successfully.',
			},
			sent: {
				method: 'DELETE',
				path: `/v2/products/${encodeURIComponent(PRODUCT_ID)}/custom_fields/phone%20number`,
			},
		},
		{
			name: 'user.get',
			endpoint: User.get,
			input: {},
			response: { success: true, user },
			sent: { method: 'GET', path: '/v2/user' },
		},
		{
			name: 'user.customHtmlGet',
			endpoint: User.customHtmlGet,
			input: {},
			response: {
				success: true,
				custom_html: '<main><h1>Moonwalk Records</h1></main>',
				rendered_html: '<main><h1>Moonwalk Records</h1></main>',
				has_landing_page: true,
				profile_url: 'https://sailorjohn.gumroad.com',
			},
			sent: { method: 'GET', path: '/v2/user/custom_html' },
		},
		{
			name: 'user.customHtmlUpdate',
			endpoint: User.customHtmlUpdate,
			input: { custom_html: '<main><h1>My profile</h1></main>' },
			response: {
				success: true,
				custom_html: '<main><h1>My profile</h1></main>',
				previous_custom_html: null,
				profile_url: 'https://sailorjohn.gumroad.com',
				sanitization_report: {
					removed_tags: [],
					removed_attributes: [],
					total_removed: 0,
					truncated: false,
				},
			},
			sent: {
				method: 'PUT',
				path: '/v2/user/custom_html',
				body: '{"custom_html":"<main><h1>My profile</h1></main>"}',
			},
		},
		{
			name: 'user.customHtmlPreview',
			endpoint: User.customHtmlPreview,
			input: { custom_html: '<main><h1>My profile</h1></main>' },
			response: {
				success: true,
				custom_html: '<main><h1>My profile</h1></main>',
				sanitization_report: {
					removed_tags: [],
					removed_attributes: [],
					total_removed: 0,
					truncated: false,
				},
			},
			sent: {
				method: 'POST',
				path: '/v2/user/preview_custom_html',
				body: '{"custom_html":"<main><h1>My profile</h1></main>"}',
			},
		},
		{
			name: 'user.refundPolicyGet',
			endpoint: User.refundPolicyGet,
			input: {},
			response: { success: true, refund_policy: refundPolicy },
			sent: { method: 'GET', path: '/v2/refund_policy' },
		},
		{
			name: 'user.refundPolicyUpdate',
			endpoint: User.refundPolicyUpdate,
			input: {
				refund_period: '30',
				fine_print: 'Refund requests are reviewed within 2 business days.',
			},
			response: { success: true, refund_policy: refundPolicy },
			sent: {
				method: 'PUT',
				path: '/v2/refund_policy',
				body: 'refund_period=30&fine_print=Refund%20requests%20are%20reviewed%20within%202%20business%20days.',
			},
		},
		{
			name: 'public.product',
			endpoint: Public.product,
			input: { seller: 'sahil', permalink: 'pencil' },
			response: publicProduct,
			sent: {
				method: 'GET',
				path: '/l/pencil.json',
				query: '',
			},
		},
		{
			name: 'public.profile',
			endpoint: Public.profile,
			input: { username: 'sahil' },
			response: publicProfile,
			sent: { method: 'GET', path: '/sahil.json', query: '' },
		},
		{
			name: 'media.list',
			endpoint: Media.list,
			input: {},
			response: { success: true, media: [mediaFile] },
			sent: { method: 'GET', path: '/v2/media' },
		},
		{
			name: 'media.create',
			endpoint: Media.create,
			input: { url: 'https://example.com/logo.png', name: 'logo' },
			response: { success: true, media: mediaFile },
			sent: {
				method: 'POST',
				path: '/v2/media',
				body: 'url=https%3A%2F%2Fexample.com%2Flogo.png&name=logo',
			},
		},
		{
			name: 'media.delete',
			endpoint: Media.remove,
			input: { id: 'k7m2q9x4tb1zn6dw' },
			response: { success: true, message: 'The file was deleted.' },
			sent: { method: 'DELETE', path: '/v2/media/k7m2q9x4tb1zn6dw' },
		},
		{
			name: 'files.presign',
			endpoint: Files.presign,
			input: { filename: 'course.pdf', file_size: 104857600 },
			response: {
				success: true,
				upload_id: 'ibZBv_75gd9o',
				key: 'attachments/x/original/course.pdf',
				file_url:
					'https://gumroad-specials.s3.amazonaws.com/attachments/x/original/course.pdf',
				parts: [
					{
						part_number: 1,
						presigned_url:
							'https://gumroad-specials.s3.amazonaws.com/...&partNumber=1',
					},
				],
			},
			sent: {
				method: 'POST',
				path: '/v2/files/presign',
				body: 'filename=course.pdf&file_size=104857600',
			},
		},
		{
			name: 'files.complete',
			endpoint: Files.complete,
			input: {
				upload_id: 'ibZBv_75gd9o',
				key: 'attachments/x/original/course.pdf',
				parts: [{ part_number: 1, etag: '"9b2cf535f27731c974343645a3985328"' }],
			},
			response: {
				success: true,
				file_url:
					'https://gumroad-specials.s3.amazonaws.com/attachments/x/original/course.pdf',
			},
			sent: {
				method: 'POST',
				path: '/v2/files/complete',
				body: 'upload_id=ibZBv_75gd9o&key=attachments%2Fx%2Foriginal%2Fcourse.pdf&parts%5B%5D%5Bpart_number%5D=1&parts%5B%5D%5Betag%5D=%229b2cf535f27731c974343645a3985328%22',
			},
		},
		{
			name: 'files.abort',
			endpoint: Files.abort,
			input: {
				upload_id: 'ibZBv_75gd9o',
				key: 'attachments/x/original/course.pdf',
			},
			response: { success: true, status: 'accepted' },
			sent: {
				method: 'POST',
				path: '/v2/files/abort',
				body: 'upload_id=ibZBv_75gd9o&key=attachments%2Fx%2Foriginal%2Fcourse.pdf',
			},
		},
		{
			name: 'emails.list',
			endpoint: Emails.list,
			input: { type: 'draft', page_key: 'c-1' },
			response: { success: true, emails: [email] },
			sent: {
				method: 'GET',
				path: '/v2/emails',
				query: 'type=draft&page_key=c-1',
			},
		},
		{
			name: 'emails.get',
			endpoint: Emails.get,
			input: { id: 'bfi_30HLgGWL8H2wo_Gzlg==' },
			response: { success: true, email },
			sent: {
				method: 'GET',
				path: '/v2/emails/bfi_30HLgGWL8H2wo_Gzlg%3D%3D',
			},
		},
		{
			name: 'emails.create',
			endpoint: Emails.create,
			input: {
				subject: 'Launch update',
				body: '<p>Hello, world!</p>',
				audience: 'all',
			},
			response: { success: true, email },
			sent: {
				method: 'POST',
				path: '/v2/emails',
				body: 'subject=Launch%20update&body=%3Cp%3EHello%2C%20world!%3C%2Fp%3E&audience=all',
			},
		},
		{
			name: 'emails.preview',
			endpoint: Emails.preview,
			input: { id: 'bfi_30HLgGWL8H2wo_Gzlg==' },
			response: {
				success: true,
				email,
				preview_url: 'https://gumroad.com/emails/x/edit?preview_post=true',
				message: 'A preview has been sent to your email.',
			},
			sent: {
				method: 'POST',
				path: '/v2/emails/bfi_30HLgGWL8H2wo_Gzlg%3D%3D/preview',
			},
		},
		{
			name: 'emails.send',
			endpoint: Emails.send,
			input: { id: 'bfi_30HLgGWL8H2wo_Gzlg==' },
			response: { success: true, email: { ...email, state: 'published' } },
			sent: {
				method: 'POST',
				path: '/v2/emails/bfi_30HLgGWL8H2wo_Gzlg%3D%3D/send',
			},
		},
		{
			name: 'emails.schedule',
			endpoint: Emails.schedule,
			input: {
				id: 'bfi_30HLgGWL8H2wo_Gzlg==',
				to_be_published_at: '2026-07-01 14:00',
			},
			response: { success: true, email: { ...email, state: 'scheduled' } },
			sent: {
				method: 'POST',
				path: '/v2/emails/bfi_30HLgGWL8H2wo_Gzlg%3D%3D/schedule',
				body: 'to_be_published_at=2026-07-01%2014%3A00',
			},
		},
		{
			name: 'emails.unschedule',
			endpoint: Emails.unschedule,
			input: { id: 'bfi_30HLgGWL8H2wo_Gzlg==' },
			response: { success: true, email },
			sent: {
				method: 'POST',
				path: '/v2/emails/bfi_30HLgGWL8H2wo_Gzlg%3D%3D/unschedule',
			},
		},
		{
			name: 'emails.delete',
			endpoint: Emails.remove,
			input: { id: 'bfi_30HLgGWL8H2wo_Gzlg==' },
			response: {
				success: true,
				message: 'The email was deleted successfully.',
			},
			sent: {
				method: 'DELETE',
				path: '/v2/emails/bfi_30HLgGWL8H2wo_Gzlg%3D%3D',
			},
		},
		{
			name: 'workflows.list',
			endpoint: Workflows.list,
			input: {},
			response: { success: true, workflows: [workflow] },
			sent: { method: 'GET', path: '/v2/workflows' },
		},
		{
			name: 'workflows.get',
			endpoint: Workflows.get,
			input: { id: '0ssD7B0cF6B5XQd3J7lY2A==' },
			response: { success: true, workflow },
			sent: {
				method: 'GET',
				path: '/v2/workflows/0ssD7B0cF6B5XQd3J7lY2A%3D%3D',
			},
		},
		{
			name: 'workflows.emailsAdd',
			endpoint: Workflows.emailsAdd,
			input: {
				workflow_id: '0ssD7B0cF6B5XQd3J7lY2A==',
				subject: 'Week four',
				body: '<p>Keep going.</p>',
				delay_amount: 4,
				delay_unit: 'week',
			},
			response: { success: true, email: workflowEmail },
			sent: {
				method: 'POST',
				path: '/v2/workflows/0ssD7B0cF6B5XQd3J7lY2A%3D%3D/emails',
				body: 'subject=Week%20four&body=%3Cp%3EKeep%20going.%3C%2Fp%3E&delay_amount=4&delay_unit=week',
			},
		},
		{
			name: 'workflows.emailsUpdate',
			endpoint: Workflows.emailsUpdate,
			input: {
				workflow_id: '0ssD7B0cF6B5XQd3J7lY2A==',
				email_id: 'bfi_30HLgGWL8H2wo_Gzlg==',
				body: '<p>Updated copy.</p>',
			},
			response: { success: true, email: workflowEmail },
			sent: {
				method: 'PUT',
				path: '/v2/workflows/0ssD7B0cF6B5XQd3J7lY2A%3D%3D/emails/bfi_30HLgGWL8H2wo_Gzlg%3D%3D',
				body: 'body=%3Cp%3EUpdated%20copy.%3C%2Fp%3E',
			},
		},
		{
			name: 'resourceSubscriptions.subscribe',
			endpoint: ResourceSubscriptions.subscribe,
			input: {
				resource_name: 'sale',
				post_url: 'https://postatmebro.com',
			},
			response: {
				success: true,
				resource_subscription: resourceSubscription,
			},
			sent: {
				method: 'PUT',
				path: '/v2/resource_subscriptions',
				body: 'resource_name=sale&post_url=https%3A%2F%2Fpostatmebro.com',
			},
		},
		{
			name: 'resourceSubscriptions.list',
			endpoint: ResourceSubscriptions.list,
			input: { resource_name: 'sale' },
			response: {
				success: true,
				resource_subscriptions: [resourceSubscription],
			},
			sent: {
				method: 'GET',
				path: '/v2/resource_subscriptions',
				query: 'resource_name=sale',
			},
		},
		{
			name: 'resourceSubscriptions.testEvent',
			endpoint: ResourceSubscriptions.testEvent,
			input: { resource_subscription_id: 'G_-mnBf9b1j9A7a4ub4nFQ==' },
			response: {
				success: true,
				message: 'A test refund event has been queued.',
				source: 'sample',
				payload: { sale_id: 'sample-sale-id', test: true },
			},
			sent: {
				method: 'POST',
				path: '/v2/resource_subscriptions/G_-mnBf9b1j9A7a4ub4nFQ%3D%3D/test_event',
			},
		},
		{
			name: 'resourceSubscriptions.unsubscribe',
			endpoint: ResourceSubscriptions.unsubscribe,
			input: { resource_subscription_id: 'G_-mnBf9b1j9A7a4ub4nFQ==' },
			response: {
				success: true,
				message: 'The resource_subscription was deleted successfully.',
			},
			sent: {
				method: 'DELETE',
				path: '/v2/resource_subscriptions/G_-mnBf9b1j9A7a4ub4nFQ%3D%3D',
			},
		},
		{
			name: 'sales.list',
			endpoint: Sales.list,
			input: { after: '2020-09-03' },
			response: { success: true, sales: [sale] },
			sent: { method: 'GET', path: '/v2/sales', query: 'after=2020-09-03' },
		},
		{
			name: 'sales.get',
			endpoint: Sales.get,
			input: { id: SALE_ID },
			response: { success: true, sale },
			sent: {
				method: 'GET',
				path: `/v2/sales/${encodeURIComponent(SALE_ID)}`,
			},
		},
		{
			name: 'sales.markAsShipped',
			endpoint: Sales.markAsShipped,
			input: {
				id: SALE_ID,
				tracking_url: 'https://www.shippingcompany.com/track/t123',
			},
			response: { success: true, sale: { ...sale, shipped: true } },
			sent: {
				method: 'PUT',
				path: `/v2/sales/${encodeURIComponent(SALE_ID)}/mark_as_shipped`,
				body: 'tracking_url=https%3A%2F%2Fwww.shippingcompany.com%2Ftrack%2Ft123',
			},
		},
		{
			name: 'sales.refund',
			endpoint: Sales.refund,
			input: { id: SALE_ID, amount_cents: 200 },
			response: { success: true, sale: { ...sale, partially_refunded: true } },
			sent: {
				method: 'PUT',
				path: `/v2/sales/${encodeURIComponent(SALE_ID)}/refund`,
				body: 'amount_cents=200',
			},
		},
		{
			name: 'sales.revokeAccess',
			endpoint: Sales.revokeAccess,
			input: { id: SALE_ID },
			response: { success: true, sale: { ...sale, access_revoked: true } },
			sent: {
				method: 'PUT',
				path: `/v2/sales/${encodeURIComponent(SALE_ID)}/revoke_access`,
			},
		},
		{
			name: 'sales.undoRevokeAccess',
			endpoint: Sales.undoRevokeAccess,
			input: { id: SALE_ID },
			response: { success: true, sale: { ...sale, access_revoked: false } },
			sent: {
				method: 'PUT',
				path: `/v2/sales/${encodeURIComponent(SALE_ID)}/undo_revoke_access`,
			},
		},
		{
			name: 'sales.resendReceipt',
			endpoint: Sales.resendReceipt,
			input: { id: SALE_ID },
			response: { success: true },
			sent: {
				method: 'POST',
				path: `/v2/sales/${encodeURIComponent(SALE_ID)}/resend_receipt`,
			},
		},
		{
			name: 'subscribers.list',
			endpoint: Subscribers.list,
			input: { product_id: '0ssD7adjRklGBjS5cwlWPq==' },
			response: { success: true, subscribers: [subscriber] },
			sent: {
				method: 'GET',
				path: '/v2/products/0ssD7adjRklGBjS5cwlWPq%3D%3D/subscribers',
			},
		},
		{
			name: 'subscribers.get',
			endpoint: Subscribers.get,
			input: { id: 'P5ppE6H8XIjy2JSCgUhbAw==' },
			response: { success: true, subscribers: subscriber },
			sent: {
				method: 'GET',
				path: '/v2/subscribers/P5ppE6H8XIjy2JSCgUhbAw%3D%3D',
			},
		},
		{
			name: 'licenses.verify',
			endpoint: Licenses.verify,
			input: {
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: LICENSE_KEY,
			},
			response: { success: true, uses: 3, purchase },
			sent: {
				method: 'POST',
				path: '/v2/licenses/verify',
				body: `product_id=32-nPAicqbLj8B_WswVlMw%3D%3D&license_key=${LICENSE_KEY}&increment_uses_count=true`,
			},
		},
		{
			name: 'licenses.enable',
			endpoint: Licenses.enable,
			input: {
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: LICENSE_KEY,
			},
			response: { success: true, uses: 3, purchase },
			sent: {
				method: 'PUT',
				path: '/v2/licenses/enable',
				body: `product_id=32-nPAicqbLj8B_WswVlMw%3D%3D&license_key=${LICENSE_KEY}`,
			},
		},
		{
			name: 'licenses.disable',
			endpoint: Licenses.disable,
			input: {
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: LICENSE_KEY,
			},
			response: { success: true, uses: 3, purchase },
			sent: {
				method: 'PUT',
				path: '/v2/licenses/disable',
				body: `product_id=32-nPAicqbLj8B_WswVlMw%3D%3D&license_key=${LICENSE_KEY}`,
			},
		},
		{
			name: 'licenses.decrementUsesCount',
			endpoint: Licenses.decrementUsesCount,
			input: {
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: LICENSE_KEY,
			},
			response: { success: true, uses: 3, purchase },
			sent: {
				method: 'PUT',
				path: '/v2/licenses/decrement_uses_count',
				body: `product_id=32-nPAicqbLj8B_WswVlMw%3D%3D&license_key=${LICENSE_KEY}`,
			},
		},
		{
			name: 'licenses.rotate',
			endpoint: Licenses.rotate,
			input: {
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: LICENSE_KEY,
			},
			response: { success: true, uses: 3, purchase },
			sent: {
				method: 'PUT',
				path: '/v2/licenses/rotate',
				body: `product_id=32-nPAicqbLj8B_WswVlMw%3D%3D&license_key=${LICENSE_KEY}`,
			},
		},
		{
			name: 'payouts.list',
			endpoint: Payouts.list,
			input: { after: '2020-09-03', before: '2021-09-03' },
			response: {
				success: true,
				payouts: [payout],
				next_page_key: 'c-2',
			},
			sent: {
				method: 'GET',
				path: '/v2/payouts',
				query: 'after=2020-09-03&before=2021-09-03&include_upcoming=true',
			},
		},
		{
			name: 'payouts.get',
			endpoint: Payouts.get,
			input: { id: 'fEGTaEpuKDsnDvf_MfecTA==' },
			response: { success: true, payout },
			sent: {
				method: 'GET',
				path: '/v2/payouts/fEGTaEpuKDsnDvf_MfecTA%3D%3D',
				query: 'include_sales=true&include_transactions=false',
			},
		},
		{
			name: 'payouts.upcoming',
			endpoint: Payouts.upcoming,
			input: {},
			response: { success: true, payouts: [payout] },
			sent: {
				method: 'GET',
				path: '/v2/payouts/upcoming',
				query: 'include_sales=true&include_transactions=false',
			},
		},
		{
			name: 'taxForms.list',
			endpoint: TaxForms.list,
			input: { year: '2025' },
			response: { success: true, tax_forms: [taxForm] },
			sent: {
				method: 'GET',
				path: '/v2/tax_forms',
				query: 'year=2025',
			},
		},
		{
			name: 'earnings.get',
			endpoint: Earnings.get,
			input: { year: '2025' },
			response: {
				success: true,
				year: 2025,
				currency: 'usd',
				gross_cents: 123456,
				fees_cents: 12345,
				taxes_cents: 678,
				affiliate_credit_cents: 0,
				net_cents: 110433,
			},
			sent: {
				method: 'GET',
				path: '/v2/earnings',
				query: 'year=2025',
			},
		},
	];

	for (const row of dispatch) {
		it(`${row.name} ${row.sent.method}s ${row.sent.path}`, async () => {
			respond(row.response);

			const result = await invoke(row.endpoint, row.input);

			const { url, init } = lastRequest();
			expect(init.method).toBe(row.sent.method);
			expect(url.pathname).toBe(row.sent.path);
			expect(url.search).toBe(row.sent.query ? `?${row.sent.query}` : '');
			if (row.sent.body !== undefined) {
				expect(init.body).toBe(row.sent.body);
			} else {
				expect(init.body).toBeUndefined();
			}
			// Every fixture must parse through its output schema before the
			// endpoint returns; truthiness here only proves a value came back,
			// the parse itself is pinned by the rejection test below.
			expect(result).toBeTruthy();
		});
	}

	it('rejects a response body that violates the output schema', async () => {
		respond({ success: true, products: 'not-an-array' });

		await expect(invoke(Products.list, {})).rejects.toThrow(
			expect.objectContaining({ name: 'ZodError' }),
		);
	});

	it('taxForms.download fetches the PDF and returns it base64-encoded', async () => {
		const pdf = Buffer.from('%PDF-1.4 fake tax form');
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array(pdf), {
				status: 200,
				headers: {
					'Content-Type': 'application/pdf',
					'Content-Disposition': 'attachment; filename="1099-K-2025.pdf"',
				},
			}),
		);

		const result = await invoke(TaxForms.download, {
			year: '2025',
			tax_form_type: 'us_1099_k',
		});

		const call = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(call[0]).toBe(
			'https://api.gumroad.com/v2/tax_forms/2025/us_1099_k/download',
		);
		expect(call[1].method).toBe('GET');
		expect(new Headers(call[1].headers).get('authorization')).toBe(
			`Bearer ${API_KEY}`,
		);
		expect(result).toMatchObject({
			filename: '1099-K-2025.pdf',
			contentType: 'application/pdf',
			contentBase64: pdf.toString('base64'),
		});
	});

	it('taxForms.download decodes filename* but leaves plain filenames alone', async () => {
		const pdf = Buffer.from('%PDF-1.4 fake tax form');
		for (const [header, expected] of [
			['attachment; filename="50% off.pdf"', '50% off.pdf'],
			["attachment; filename*=UTF-8''1099%2DK%202025.pdf", '1099-K 2025.pdf'],
		] as const) {
			fetchMock.mockResolvedValueOnce(
				new Response(new Uint8Array(pdf), {
					status: 200,
					headers: {
						'Content-Type': 'application/pdf',
						'Content-Disposition': header,
					},
				}),
			);

			const result = (await invoke(TaxForms.download, {
				year: '2025',
				tax_form_type: 'us_1099_k',
			})) as { filename?: string };

			expect(result.filename).toBe(expected);
		}
	});

	it('public.product reads from the seller subdomain, not the API host', async () => {
		respond(publicProduct);

		await invoke(Public.product, { seller: 'sahil', permalink: 'pencil' });

		const call = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(call[0]).toBe('https://sahil.gumroad.com/l/pencil.json');
	});

	it('public.profile reads from the apex host path form', async () => {
		respond(publicProfile);

		await invoke(Public.profile, { username: 'sahil' });

		const call = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(call[0]).toBe('https://gumroad.com/sahil.json');
	});

	it('products.create sends repeated files[][...] keys in file order', async () => {
		respond({ success: true, product });

		await invoke(Products.create, {
			name: 'My product',
			price: 500,
			files: [
				{
					id: 'K7QmZw==',
					url: 'https://gumroad-specials.s3.amazonaws.com/a.pdf',
				},
				{
					external_id: 'cli-upload-1',
					url: 'https://gumroad-specials.s3.amazonaws.com/b.pdf',
				},
			],
		});

		expect(String(lastRequest().init.body)).toBe(
			'name=My%20product&price=500&files%5B%5D%5Bid%5D=K7QmZw%3D%3D&files%5B%5D%5Burl%5D=https%3A%2F%2Fgumroad-specials.s3.amazonaws.com%2Fa.pdf&files%5B%5D%5Bexternal_id%5D=cli-upload-1&files%5B%5D%5Burl%5D=https%3A%2F%2Fgumroad-specials.s3.amazonaws.com%2Fb.pdf',
		);
	});

	it('products.create serializes rich_content pages as JSON', async () => {
		respond({ success: true, product });

		await invoke(Products.create, {
			name: 'My product',
			price: 500,
			rich_content: [
				{
					id: 'page-1',
					title: 'Welcome',
					description: { type: 'doc', content: [] },
				},
			],
		});

		expect(String(lastRequest().init.body)).toContain(
			`rich_content=${encodeURIComponent(
				JSON.stringify([
					{
						id: 'page-1',
						title: 'Welcome',
						description: { type: 'doc', content: [] },
					},
				]),
			)}`,
		);
	});

	it('products.update joins tags and cover_ids as comma lists', async () => {
		respond({ success: true, product });

		await invoke(Products.update, {
			id: PRODUCT_ID,
			tags: ['pencil', 'icon'],
			cover_ids: ['c2', 'c1'],
		});

		expect(String(lastRequest().init.body)).toBe(
			'tags=pencil%2Cicon&cover_ids=c2%2Cc1',
		);
	});

	it('products.update clears tags and cover_ids when passed empty arrays', async () => {
		respond({ success: true, product });

		await invoke(Products.update, {
			id: PRODUCT_ID,
			tags: [],
			cover_ids: [],
		});

		expect(String(lastRequest().init.body)).toBe('tags=&cover_ids=');
	});

	it('products.update omits tags and cover_ids entirely when not passed', async () => {
		respond({ success: true, product });

		await invoke(Products.update, { id: PRODUCT_ID, name: 'New name' });

		const body = String(lastRequest().init.body);
		expect(body).toBe('name=New%20name');
		expect(body).not.toContain('tags=');
		expect(body).not.toContain('cover_ids=');
	});

	it('offerCodes.updateForProduct clears a date with an empty string', async () => {
		respond({ success: true, offer_code: offerCode });

		await invoke(OfferCodes.updateForProduct, {
			product_id: PRODUCT_ID,
			id: 'bfi_30HLgGWL8H2wo_Gzlg==',
			valid_at: '',
			expires_at: '2026-12-01T00:00:00Z',
		});

		expect(String(lastRequest().init.body)).toBe(
			'valid_at=&expires_at=2026-12-01T00%3A00%3A00Z',
		);
	});

	it('offerCodes.update can clear expires_at without valid_at', async () => {
		respond({ success: true, offer_code: offerCode });

		await invoke(OfferCodes.update, {
			id: 'mN7CdHiwHaR9FlxKvF-n-g==',
			expires_at: '',
		});

		expect(String(lastRequest().init.body)).toBe('expires_at=');
	});

	it('sales.list sends every filter and the page cursor', async () => {
		respond({ success: true, sales: [sale] });

		await invoke(Sales.list, {
			after: '2020-09-03',
			before: '2021-09-03',
			product_id: '32-nPainqpLj1B_WIwVlMw==',
			email: 'calvin@gumroad.com',
			order_id: 'FO8TXN-abc',
			name: 'Calvin',
			license_key: '83DB262A-C19D3B06-A5235A6B-8C079166',
			page_key: '20230119081040000000-123456',
		});

		const { url } = lastRequest();
		expect(url.searchParams.get('after')).toBe('2020-09-03');
		expect(url.searchParams.get('before')).toBe('2021-09-03');
		expect(url.searchParams.get('product_id')).toBe('32-nPainqpLj1B_WIwVlMw==');
		expect(url.searchParams.get('email')).toBe('calvin@gumroad.com');
		expect(url.searchParams.get('order_id')).toBe('FO8TXN-abc');
		expect(url.searchParams.get('name')).toBe('Calvin');
		expect(url.searchParams.get('license_key')).toBe(
			'83DB262A-C19D3B06-A5235A6B-8C079166',
		);
		expect(url.searchParams.get('page_key')).toBe(
			'20230119081040000000-123456',
		);
	});

	it('sales.list omits unset filters from the query', async () => {
		respond({ success: true, sales: [] });

		await invoke(Sales.list, {});

		expect(lastRequest().url.search).toBe('');
	});

	it('subscribers.list sends its filters and the paginated flag', async () => {
		respond({
			success: true,
			next_page_key: '20241004235318372406-857093235',
			subscribers: [subscriber],
		});

		const result = await invoke(Subscribers.list, {
			product_id: '0ssD7adjRklGBjS5cwlWPq==',
			email: 'calvin@gumroad.com',
			paginated: 'true',
			page_key: '20241004235318372406-857093235',
		});

		const { url } = lastRequest();
		expect(url.searchParams.get('email')).toBe('calvin@gumroad.com');
		expect(url.searchParams.get('paginated')).toBe('true');
		expect(result).toMatchObject({
			next_page_key: '20241004235318372406-857093235',
			subscribers: [{ status: 'alive' }],
		});
	});

	it('licenses.verify passes increment_uses_count=false through', async () => {
		respond({ success: true, uses: 3, purchase });

		await invoke(Licenses.verify, {
			product_id: '32-nPAicqbLj8B_WswVlMw==',
			license_key: LICENSE_KEY,
			increment_uses_count: 'false',
		});

		expect(String(lastRequest().init.body)).toContain(
			'increment_uses_count=false',
		);
	});

	it('throws the documented 404 error body for a missing license', async () => {
		respond(
			errorBody('That license does not exist for the provided product.'),
			404,
		);

		await expect(
			invoke(Licenses.verify, {
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: LICENSE_KEY,
			}),
		).rejects.toBeInstanceOf(GumroadAPIError);
	});

	it('throws for a success:false envelope inside a 200 body', async () => {
		respond({ success: false, message: 'The product could not be found.' });

		await expect(invoke(Products.get, { id: PRODUCT_ID })).rejects.toThrow(
			'The product could not be found.',
		);
	});

	it('taxForms.download throws the JSON error envelope for a missing form', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(errorBody('Tax form not found.')), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await expect(
			invoke(TaxForms.download, { year: '2025', tax_form_type: 'us_1099_k' }),
		).rejects.toThrow('Gumroad 404: Tax form not found.');
	});

	it('logs the event path without filters or bodies', async () => {
		respond({ success: true, sales: [sale] });

		await invoke(Sales.list, {
			email: 'calvin@gumroad.com',
			license_key: '83DB262A-C19D3B06-A5235A6B-8C079166',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gumroad.sales.list',
			{ path: '/sales' },
			'completed',
		);
		const logged = JSON.stringify(mockLog.mock.calls[0]);
		expect(logged).not.toContain('calvin@gumroad.com');
		expect(logged).not.toContain('83DB262A');
	});

	it('parses empty result arrays and missing page cursors', async () => {
		respond({ success: true, sales: [] });

		const result = await invoke(Sales.list, {});

		expect(result).toEqual({ success: true, sales: [] });
	});

	it('passes undocumented vendor fields through on loose outputs', async () => {
		// Loose outputs keep an index signature, so the extra key survives.
		const parsed = GumroadEndpointOutputSchemas.subscribersList.parse({
			success: true,
			subscribers: [{ ...subscriber, new_vendor_field: 'x' }],
		});

		expect(parsed.subscribers[0]?.new_vendor_field).toBe('x');
	});
});

describe('input schemas: accept and reject', () => {
	// The endpoint's real parameter types are contravariant-assignable to the
	// never-based helper, which lets negative cases pass values no schema
	// accepts.
	const verify = Licenses.verify as AnyEndpoint;

	// unknown: accept/reject cases pass values no schema accepts.
	const accepts = (schema: GumroadOperation, input: unknown) =>
		GumroadEndpointInputSchemas[schema].safeParse(input).success;

	it('accepts the documented date format and rejects others', () => {
		expect(accepts('salesList', { after: '2020-09-03' })).toBe(true);
		expect(accepts('salesList', { after: '2020-9-3' })).toBe(false);
		expect(accepts('salesList', { after: '03-09-2020' })).toBe(false);
	});

	it('rejects dot path segments in path-carrier ids', () => {
		expect(accepts('productsGet', { id: '.' })).toBe(false);
		expect(accepts('productsGet', { id: '..' })).toBe(false);
		expect(accepts('salesGet', { id: '..' })).toBe(false);
		expect(
			accepts('customFieldsDelete', { product_id: PRODUCT_ID, name: '.' }),
		).toBe(false);
		expect(accepts('productsGet', { id: '.hidden' })).toBe(true);
	});

	it('accepts only the documented "true"/"false" flag strings', () => {
		expect(
			accepts('subscribersList', { product_id: 'p==', paginated: 'true' }),
		).toBe(true);
		expect(
			accepts('subscribersList', { product_id: 'p==', paginated: 'false' }),
		).toBe(true);
		expect(
			accepts('subscribersList', { product_id: 'p==', paginated: 'yes' }),
		).toBe(false);
		expect(
			accepts('subscribersList', { product_id: 'p==', paginated: true }),
		).toBe(false);
	});

	it('rejects unknown filter keys on strict filter inputs', () => {
		expect(accepts('salesList', { product: 'x' })).toBe(false);
		expect(
			accepts('subscribersList', { product_id: 'p==', customer_email: 'x' }),
		).toBe(false);
		expect(
			accepts('licensesVerify', {
				product_id: 'p==',
				license_key: 'k',
				uses: 1,
			}),
		).toBe(false);
	});

	it('tolerates extra keys on no-arg inputs', () => {
		expect(accepts('productsList', { harmless: 'extra' })).toBe(true);
		expect(accepts('productsCategoriesList', { harmless: 'extra' })).toBe(true);
		expect(accepts('userGet', { harmless: 'extra' })).toBe(true);
		expect(accepts('mediaList', { harmless: 'extra' })).toBe(true);
		expect(accepts('workflowsList', { harmless: 'extra' })).toBe(true);
	});

	it('rejects empty ids and license keys before any request', () => {
		expect(accepts('productsGet', { id: '' })).toBe(false);
		expect(accepts('salesGet', { id: '' })).toBe(false);
		expect(accepts('subscribersList', { product_id: '' })).toBe(false);
	});

	it('requires both license fields', () => {
		expect(accepts('licensesVerify', { product_id: 'p==' })).toBe(false);
		expect(accepts('licensesVerify', { license_key: 'k' })).toBe(false);
	});

	it('pins the product create enums and currency shape', () => {
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				native_type: 'course',
			}),
		).toBe(true);
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				native_type: 'ebook-reader',
			}),
		).toBe(false);
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				subscription_duration: 'every_two_years',
			}),
		).toBe(true);
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				subscription_duration: 'weekly',
			}),
		).toBe(false);
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				price_currency_type: 'usd',
			}),
		).toBe(false);
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				price_currency_type: 'USD',
			}),
		).toBe(true);
		expect(accepts('productsCreate', { name: 'x', price: 100.5 })).toBe(false);
	});

	it('rejects category sent together with taxonomy_id', () => {
		const both = {
			name: 'x',
			price: 100,
			category: 'design/ui-and-web/figma',
			taxonomy_id: 123,
		};
		expect(accepts('productsCreate', both)).toBe(false);
		expect(accepts('productsUpdate', { id: 'p==', ...both })).toBe(false);
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				category: 'design/ui-and-web/figma',
			}),
		).toBe(true);
	});

	it('rejects refund_fine_print combined with refund_period "inherit"', () => {
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				refund_period: 'inherit',
				refund_fine_print: 'no refunds after use',
			}),
		).toBe(false);
		expect(
			accepts('productsCreate', {
				name: 'x',
				price: 100,
				refund_period: '30',
				refund_fine_print: 'reviewed in 2 days',
			}),
		).toBe(true);
		expect(accepts('userRefundPolicyUpdate', { refund_period: '365' })).toBe(
			false,
		);
		expect(accepts('userRefundPolicyUpdate', { refund_period: '183' })).toBe(
			true,
		);
		expect(
			accepts('userRefundPolicyUpdate', {
				refund_period: '183',
				fine_print: 'x'.repeat(3001),
			}),
		).toBe(false);
	});

	it('pins the offer code bounds: enums, 32-char label, RFC 3339 dates', () => {
		const base = { product_id: 'p==', name: '1OFF', amount_off: 100 };
		expect(accepts('offerCodesCreateForProduct', base)).toBe(true);
		expect(
			accepts('offerCodesCreateForProduct', {
				...base,
				offer_type: 'percent',
			}),
		).toBe(true);
		expect(
			accepts('offerCodesCreateForProduct', { ...base, offer_type: 'dollar' }),
		).toBe(false);
		expect(
			accepts('offerCodesCreateForProduct', {
				...base,
				sale_label: 'x'.repeat(32),
			}),
		).toBe(true);
		expect(
			accepts('offerCodesCreateForProduct', {
				...base,
				sale_label: 'x'.repeat(33),
			}),
		).toBe(false);
		expect(
			accepts('offerCodesCreateForProduct', {
				...base,
				valid_at: '2026-11-27T00:00:00-05:00',
			}),
		).toBe(true);
		expect(
			accepts('offerCodesCreateForProduct', {
				...base,
				valid_at: '2026-11-27T00:00:00',
			}),
		).toBe(false);
		// An end requires a start.
		expect(
			accepts('offerCodesCreateForProduct', {
				...base,
				expires_at: '2026-12-01T00:00:00Z',
			}),
		).toBe(false);
		expect(
			accepts('offerCodesCreateForProduct', {
				...base,
				valid_at: '',
				expires_at: '2026-12-01T00:00:00Z',
			}),
		).toBe(true);
	});

	it('pins the xor url/signed_blob_id rule on media and thumbnail', () => {
		expect(accepts('mediaCreate', { url: 'https://example.com/a.png' })).toBe(
			true,
		);
		expect(accepts('mediaCreate', { signed_blob_id: 'blob-1' })).toBe(true);
		expect(
			accepts('mediaCreate', {
				url: 'https://example.com/a.png',
				signed_blob_id: 'blob-1',
			}),
		).toBe(false);
		expect(accepts('mediaCreate', {})).toBe(false);
		expect(
			accepts('productsThumbnailSet', {
				product_id: 'p==',
				signed_blob_id: 'blob-1',
			}),
		).toBe(true);
		expect(accepts('productsThumbnailSet', { product_id: 'p==' })).toBe(false);
		expect(
			accepts('productsThumbnailSet', {
				product_id: 'p==',
				url: 'ftp://example.com/a.png',
			}),
		).toBe(false);
	});

	it('pins the 20 GB presign ceiling', () => {
		const max = 20 * 1024 * 1024 * 1024;
		expect(accepts('filesPresign', { filename: 'a.pdf', file_size: max })).toBe(
			true,
		);
		expect(
			accepts('filesPresign', { filename: 'a.pdf', file_size: max + 1 }),
		).toBe(false);
		expect(accepts('filesPresign', { filename: 'a.pdf', file_size: 0 })).toBe(
			false,
		);
	});

	it('requires complete upload parts with both fields', () => {
		expect(
			accepts('filesComplete', {
				upload_id: 'u',
				key: 'k',
				parts: [{ part_number: 1, etag: '"e"' }],
			}),
		).toBe(true);
		expect(
			accepts('filesComplete', {
				upload_id: 'u',
				key: 'k',
				parts: [{ part_number: 1 }],
			}),
		).toBe(false);
		expect(
			accepts('filesComplete', { upload_id: 'u', key: 'k', parts: [] }),
		).toBe(false);
	});

	it('pins the email enums and the product-audience rule', () => {
		expect(accepts('emailsList', { type: 'draft' })).toBe(true);
		expect(accepts('emailsList', { type: 'archived' })).toBe(false);
		expect(
			accepts('emailsCreate', {
				subject: 's',
				body: '<p>b</p>',
				audience: 'followers',
			}),
		).toBe(true);
		expect(
			accepts('emailsCreate', {
				subject: 's',
				body: '<p>b</p>',
				audience: 'everyone',
			}),
		).toBe(false);
		expect(
			accepts('emailsCreate', {
				subject: 's',
				body: '<p>b</p>',
				audience: 'product',
			}),
		).toBe(false);
		expect(
			accepts('emailsCreate', {
				subject: 's',
				body: '<p>b</p>',
				audience: 'product',
				product_id: 'p==',
			}),
		).toBe(true);
		expect(
			accepts('emailsSchedule', {
				id: 'e1',
				to_be_published_at: '2026-07-01 14:00',
			}),
		).toBe(true);
		expect(
			accepts('emailsSchedule', {
				id: 'e1',
				to_be_published_at: '2026-07-01T14:00',
			}),
		).toBe(false);
	});

	it('pins the workflow delay rules', () => {
		const base = {
			workflow_id: 'w1',
			subject: 's',
			body: '<p>b</p>',
			delay_amount: 4,
			delay_unit: 'week',
		};
		expect(accepts('workflowsEmailsAdd', base)).toBe(true);
		expect(accepts('workflowsEmailsAdd', { ...base, delay_unit: 'year' })).toBe(
			false,
		);
		expect(accepts('workflowsEmailsAdd', { ...base, delay_amount: -1 })).toBe(
			false,
		);
		expect(
			accepts('workflowsEmailsAdd', { ...base, delay_amount: 2_147_483_648 }),
		).toBe(false);
		// Update needs the delay pair together and at least one field.
		expect(
			accepts('workflowsEmailsUpdate', {
				workflow_id: 'w1',
				email_id: 'e1',
				delay_amount: 2,
			}),
		).toBe(false);
		expect(
			accepts('workflowsEmailsUpdate', {
				workflow_id: 'w1',
				email_id: 'e1',
				delay_amount: 2,
				delay_unit: 'day',
			}),
		).toBe(true);
		expect(
			accepts('workflowsEmailsUpdate', { workflow_id: 'w1', email_id: 'e1' }),
		).toBe(false);
	});

	it('pins the resource subscription resource names', () => {
		expect(
			accepts('resourceSubscriptionsSubscribe', {
				resource_name: 'subscription_restarted',
				post_url: 'https://postatmebro.com',
			}),
		).toBe(true);
		expect(
			accepts('resourceSubscriptionsSubscribe', {
				resource_name: 'purchase',
				post_url: 'https://postatmebro.com',
			}),
		).toBe(false);
		expect(
			accepts('resourceSubscriptionsList', { resource_name: 'refund' }),
		).toBe(true);
	});

	it('pins sale write shapes: tracking URL scheme, refund amount', () => {
		expect(
			accepts('salesMarkAsShipped', {
				id: 's==',
				tracking_url: 'https://www.shippingcompany.com/track/t123',
			}),
		).toBe(true);
		expect(
			accepts('salesMarkAsShipped', {
				id: 's==',
				tracking_url: 'javascript:alert(1)',
			}),
		).toBe(false);
		expect(accepts('salesRefund', { id: 's==' })).toBe(true);
		expect(accepts('salesRefund', { id: 's==', amount_cents: 200 })).toBe(true);
		expect(accepts('salesRefund', { id: 's==', amount_cents: 0 })).toBe(false);
	});

	it('pins the 4-digit year and tax form type enums', () => {
		expect(accepts('taxFormsList', { year: '2025' })).toBe(true);
		expect(accepts('taxFormsList', { year: '2025-01' })).toBe(false);
		expect(accepts('taxFormsList', {})).toBe(true);
		expect(accepts('earningsGet', { year: '2025' })).toBe(true);
		expect(accepts('earningsGet', { year: '25' })).toBe(false);
		expect(
			accepts('taxFormsDownload', { year: '2025', tax_form_type: 'us_1099_k' }),
		).toBe(true);
		expect(
			accepts('taxFormsDownload', { year: '2025', tax_form_type: 'w9' }),
		).toBe(false);
	});

	it('allows null to clear custom HTML but requires content to preview', () => {
		expect(accepts('userCustomHtmlUpdate', { custom_html: null })).toBe(true);
		expect(accepts('userCustomHtmlUpdate', { custom_html: '<main/>' })).toBe(
			true,
		);
		expect(accepts('userCustomHtmlUpdate', {})).toBe(false);
		expect(accepts('userCustomHtmlPreview', { custom_html: '' })).toBe(false);
	});

	it('pins the public subdomain shape', () => {
		expect(
			accepts('publicProduct', { seller: 'sahil', permalink: 'pencil' }),
		).toBe(true);
		expect(
			accepts('publicProduct', { seller: 'sahil.gumroad.com', permalink: 'p' }),
		).toBe(false);
		expect(accepts('publicProfile', { username: 'a-b-2' })).toBe(true);
	});

	it('pins custom field names and flags', () => {
		expect(
			accepts('customFieldsCreate', {
				product_id: 'p==',
				name: 'phone number',
			}),
		).toBe(true);
		expect(
			accepts('customFieldsCreate', {
				product_id: 'p==',
				name: '',
				required: 'maybe',
			}),
		).toBe(false);
	});

	it('rejects bad input before any request', async () => {
		await expect(
			invoke(verify, { product_id: '', license_key: 'k' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('output schemas parse the documented envelopes', () => {
	// unknown: each output schema parses its own payload shape.
	const outputs: Array<[GumroadOperation, unknown]> = [
		['productsList', { success: true, products: [product] }],
		['productsGet', { success: true, product }],
		['productsCreate', { success: true, product }],
		[
			'productsUpdate',
			{
				success: true,
				product,
				file_id_mappings: { 'cli-upload-1': 'NEW_FILE_ID' },
			},
		],
		[
			'productsDelete',
			{ success: true, message: 'The product has been deleted successfully.' },
		],
		['productsEnable', { success: true, product }],
		['productsDisable', { success: true, product }],
		['productsReviewsList', { success: true, product_reviews: [review] }],
		['productsCategoriesList', { success: true, categories: [category] }],
		[
			'productsCoversAdd',
			{
				success: true,
				covers: [
					{
						id: 'abc123',
						url: 'https://www.youtube.com/embed/x',
						original_url: 'https://www.youtube.com/embed/x',
						thumbnail: null,
						type: 'oembed',
						filetype: null,
						width: 670,
						height: 377,
						native_width: 1280,
						native_height: 720,
					},
				],
				main_cover_id: 'abc123',
			},
		],
		[
			'productsCoversDelete',
			{ success: true, covers: [], main_cover_id: null },
		],
		[
			'productsThumbnailSet',
			{
				success: true,
				thumbnail: {
					url: 'https://public-files.gumroad.com/v/x',
					guid: 'abc123',
				},
			},
		],
		['productsThumbnailDelete', { success: true, thumbnail: null }],
		['offerCodesList', { success: true, offer_codes: [offerCode] }],
		['offerCodesGet', { success: true, offer_code: offerCode }],
		['offerCodesUpdate', { success: true, offer_code: offerCode }],
		['offerCodesListForProduct', { success: true, offer_codes: [offerCode] }],
		['offerCodesGetForProduct', { success: true, offer_code: offerCode }],
		['offerCodesCreateForProduct', { success: true, offer_code: offerCode }],
		['offerCodesUpdateForProduct', { success: true, offer_code: offerCode }],
		[
			'offerCodesDeleteForProduct',
			{
				success: true,
				message: 'The offer_code has been deleted successfully.',
			},
		],
		[
			'variantCategoriesList',
			{ success: true, variant_categories: [variantCategory] },
		],
		[
			'variantCategoriesCreate',
			{ success: true, variant_category: variantCategory },
		],
		[
			'variantCategoriesGet',
			{ success: true, variant_category: variantCategory },
		],
		[
			'variantCategoriesUpdate',
			{ success: true, variant_category: variantCategory },
		],
		[
			'variantCategoriesDelete',
			{
				success: true,
				message: 'The variant_category has been deleted successfully.',
			},
		],
		['variantCategoriesVariantsList', { success: true, variants: [variant] }],
		['variantCategoriesVariantsCreate', { success: true, variant }],
		['variantCategoriesVariantsGet', { success: true, variant }],
		['variantCategoriesVariantsUpdate', { success: true, variant }],
		[
			'variantCategoriesVariantsDelete',
			{ success: true, message: 'The variant has been deleted successfully.' },
		],
		[
			'customFieldsList',
			{
				success: true,
				custom_fields: [{ name: 'phone number', required: 'false' }],
			},
		],
		[
			'customFieldsCreate',
			{
				success: true,
				custom_field: { name: 'phone number', required: 'false' },
			},
		],
		[
			'customFieldsUpdate',
			{
				success: true,
				custom_field: { name: 'phone number', required: 'false' },
			},
		],
		[
			'customFieldsDelete',
			{
				success: true,
				message: 'The custom_field has been deleted successfully.',
			},
		],
		['userGet', { success: true, user }],
		[
			'userCustomHtmlGet',
			{
				success: true,
				custom_html: null,
				rendered_html: '<html></html>',
				has_landing_page: false,
				profile_url: 'https://sailorjohn.gumroad.com',
			},
		],
		[
			'userCustomHtmlUpdate',
			{
				success: true,
				custom_html: '<main/>',
				previous_custom_html: null,
				profile_url: 'https://sailorjohn.gumroad.com',
				sanitization_report: {
					removed_tags: ['script'],
					removed_attributes: [],
					total_removed: 1,
					truncated: false,
				},
			},
		],
		[
			'userCustomHtmlPreview',
			{
				success: true,
				custom_html: '<main/>',
				sanitization_report: {
					removed_tags: [],
					removed_attributes: [],
					total_removed: 0,
					truncated: false,
				},
			},
		],
		['userRefundPolicyGet', { success: true, refund_policy: refundPolicy }],
		['userRefundPolicyUpdate', { success: true, refund_policy: refundPolicy }],
		['publicProduct', publicProduct],
		['publicProfile', publicProfile],
		['mediaList', { success: true, media: [mediaFile] }],
		['mediaCreate', { success: true, media: mediaFile }],
		['mediaDelete', { success: true, message: 'The file was deleted.' }],
		[
			'filesPresign',
			{
				success: true,
				upload_id: 'u',
				key: 'k',
				file_url: 'https://s3/x.pdf',
				parts: [{ part_number: 1, presigned_url: 'https://s3/p1' }],
			},
		],
		['filesComplete', { success: true, file_url: 'https://s3/x.pdf' }],
		['filesAbort', { success: true, status: 'already_gone' }],
		['emailsList', { success: true, emails: [email] }],
		['emailsGet', { success: true, email }],
		['emailsCreate', { success: true, email }],
		[
			'emailsPreview',
			{
				success: true,
				email,
				preview_url: 'https://gumroad.com/emails/x/edit',
				message: 'A preview has been sent to your email.',
			},
		],
		['emailsSend', { success: true, email }],
		['emailsSchedule', { success: true, email }],
		['emailsUnschedule', { success: true, email }],
		[
			'emailsDelete',
			{ success: true, message: 'The email was deleted successfully.' },
		],
		['workflowsList', { success: true, workflows: [workflow] }],
		['workflowsGet', { success: true, workflow }],
		['workflowsEmailsAdd', { success: true, email: workflowEmail }],
		['workflowsEmailsUpdate', { success: true, email: workflowEmail }],
		[
			'resourceSubscriptionsSubscribe',
			{ success: true, resource_subscription: resourceSubscription },
		],
		[
			'resourceSubscriptionsList',
			{ success: true, resource_subscriptions: [resourceSubscription] },
		],
		[
			'resourceSubscriptionsTestEvent',
			{
				success: true,
				message: 'A test refund event has been queued.',
				source: 'sample',
				payload: { sale_id: 'sample-sale-id', test: true },
			},
		],
		[
			'resourceSubscriptionsUnsubscribe',
			{
				success: true,
				message: 'The resource_subscription was deleted successfully.',
			},
		],
		['salesList', { success: true, sales: [sale], next_page_key: 'k-1' }],
		['salesGet', { success: true, sale }],
		['salesMarkAsShipped', { success: true, sale: { ...sale, shipped: true } }],
		[
			'salesRefund',
			{ success: true, sale: { ...sale, partially_refunded: true } },
		],
		[
			'salesRevokeAccess',
			{ success: true, sale: { ...sale, access_revoked: true } },
		],
		[
			'salesUndoRevokeAccess',
			{ success: true, sale: { ...sale, access_revoked: false } },
		],
		['salesResendReceipt', { success: true }],
		['subscribersList', { success: true, subscribers: [subscriber] }],
		['subscribersGet', { success: true, subscribers: subscriber }],
		['licensesVerify', { success: true, uses: 3, purchase }],
		['licensesEnable', { success: true, uses: 3, purchase }],
		['licensesDisable', { success: true, uses: 3, purchase }],
		['licensesDecrementUsesCount', { success: true, uses: 3, purchase }],
		['licensesRotate', { success: true, uses: 3, purchase }],
		['payoutsList', { success: true, payouts: [payout], next_page_key: 'k' }],
		['payoutsGet', { success: true, payout }],
		['payoutsUpcoming', { success: true, payouts: [payout] }],
		['taxFormsList', { success: true, tax_forms: [taxForm] }],
		[
			'taxFormsDownload',
			{
				filename: '1099-K-2025.pdf',
				contentType: 'application/pdf',
				contentBase64: 'JVBERi0xLjQ=',
			},
		],
		[
			'earningsGet',
			{
				success: true,
				year: 2025,
				currency: 'usd',
				gross_cents: 123456,
				fees_cents: 12345,
				taxes_cents: 678,
				affiliate_credit_cents: 0,
				net_cents: 110433,
			},
		],
	];

	it('accepts every documented envelope', () => {
		for (const [operation, payload] of outputs) {
			expect(
				GumroadEndpointOutputSchemas[operation].safeParse(payload).success,
			).toBe(true);
		}
	});

	it('covers every operation in the registry', () => {
		const covered = new Set(outputs.map(([operation]) => operation));
		// Object.keys returns plain strings; every registry key is an
		// operation by construction.
		const registryOps = Object.keys(
			GumroadEndpointOutputSchemas,
		) as GumroadOperation[];
		for (const operation of registryOps) {
			expect(covered.has(operation)).toBe(true);
		}
	});

	it('accepts empty list results with no cursor keys', () => {
		for (const operation of [
			'salesList',
			'offerCodesList',
			'emailsList',
			'mediaList',
			'payoutsList',
			'taxFormsList',
		] as const) {
			const empty = GumroadEndpointOutputSchemas[operation].safeParse({
				success: true,
				sales: [],
				offer_codes: [],
				emails: [],
				media: [],
				payouts: [],
				tax_forms: [],
			});
			expect(empty.success).toBe(true);
		}
	});

	it('keeps per-operation types tied together for handlers', () => {
		// Compile-time pairing: each endpoint's input and output flow through
		// the registry types the handlers are typed with.
		type Check<K extends GumroadOperation> = [
			GumroadEndpointInputs[K],
			GumroadEndpointOutputs[K],
		];
		const check: Check<'licensesVerify'> = [
			{ product_id: 'p==', license_key: 'k' },
			{ success: true, uses: 0, purchase },
		];
		expect(check[0].license_key).toBe('k');
	});
});
