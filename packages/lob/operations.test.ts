import {
	endpoints,
	installFetchMock,
	lastCall,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
	sentHeader,
} from './test-helpers';

/**
 * One row per operation added beyond the original 14: the HTTP method, the
 * path and query Lob's OpenAPI 1.22.0 documents, and the JSON body. Response
 * shapes are covered by spec-examples.test.ts.
 */

const BASE = 'https://api.lob.com/v1';
const LIST = { object: 'list', data: [], count: 0 };
const ADR = 'adr_210a8d4b0b76d77b';

type Row = {
	op: string;
	// unknown: each operation's own input, validated by its schema.
	input: Record<string, unknown>;
	method: string;
	url: string;
	// unknown: the JSON body the operation should send.
	body?: Record<string, unknown>;
	// unknown: the canned response; defaults to { id: 'x' }.
	response?: unknown;
};

const mail = {
	to: ADR,
	use_type: 'marketing',
};

const rows: Row[] = [
	{
		op: 'intlVerifications.bulk',
		input: {
			addresses: [{ primary_line: '370 Water St', country: 'CA' }],
		},
		method: 'POST',
		url: '/bulk/intl_verifications',
		body: { addresses: [{ primary_line: '370 Water St', country: 'CA' }] },
		response: { addresses: [], errors: false },
	},
	{
		op: 'reverseGeocode.lookup',
		input: { latitude: 37.777456, longitude: -122.393039, size: 2 },
		method: 'POST',
		url: '/us_reverse_geocode_lookups?size=2',
		body: { latitude: 37.777456, longitude: -122.393039 },
	},
	{
		op: 'identityValidation.validate',
		input: { recipient: 'Lob', primary_line: '210 King St', zip_code: '94107' },
		method: 'POST',
		url: '/identity_validation',
		body: { recipient: 'Lob', primary_line: '210 King St', zip_code: '94107' },
	},
	{
		op: 'postcards.list',
		input: {
			limit: 2,
			after: 'psc_1',
			include: ['total_count'],
			size: ['4x6', '6x9'],
			date_created: { gt: '2026-01-01' },
			metadata: { batch: '7' },
			sort_by: { date_created: 'asc' },
			status: 'rendered',
			scheduled: false,
		},
		method: 'GET',
		url: '/postcards?limit=2&after=psc_1&include=total_count&date_created%5Bgt%5D=2026-01-01&metadata%5Bbatch%5D=7&status=rendered&scheduled=false&sort_by%5Bdate_created%5D=asc&size=4x6&size=6x9',
		response: LIST,
	},
	{
		op: 'postcards.cancel',
		input: { id: 'psc_1' },
		method: 'DELETE',
		url: '/postcards/psc_1',
	},
	{
		op: 'letters.list',
		input: { color: true, mail_type: 'usps_standard' },
		method: 'GET',
		url: '/letters?mail_type=usps_standard&color=true',
		response: LIST,
	},
	{
		op: 'letters.cancel',
		input: { id: 'ltr_1' },
		method: 'DELETE',
		url: '/letters/ltr_1',
	},
	{
		op: 'checks.send',
		input: {
			...mail,
			from: 'adr_fa64eaa6b3f335',
			bank_account: 'bank_8cad8df5354d33f',
			amount: 22.5,
			memo: 'rent',
			message: 'Thanks',
			idempotency_key: 'chk-1',
		},
		method: 'POST',
		url: '/checks',
		body: {
			...mail,
			from: 'adr_fa64eaa6b3f335',
			bank_account: 'bank_8cad8df5354d33f',
			amount: 22.5,
			memo: 'rent',
			message: 'Thanks',
		},
	},
	{
		op: 'checks.get',
		input: { id: 'chk_1' },
		method: 'GET',
		url: '/checks/chk_1',
	},
	{
		op: 'checks.list',
		input: { send_date: { lt: '2026-12-01' } },
		method: 'GET',
		url: '/checks?send_date%5Blt%5D=2026-12-01',
		response: LIST,
	},
	{
		op: 'checks.cancel',
		input: { id: 'chk_1' },
		method: 'DELETE',
		url: '/checks/chk_1',
	},
	{
		op: 'selfMailers.send',
		input: {
			...mail,
			inside: '<html>In</html>',
			outside: '<html>Out</html>',
			size: '11x9_bifold',
		},
		method: 'POST',
		url: '/self_mailers',
		body: {
			...mail,
			inside: '<html>In</html>',
			outside: '<html>Out</html>',
			size: '11x9_bifold',
		},
	},
	{
		op: 'selfMailers.get',
		input: { id: 'sfm_1' },
		method: 'GET',
		url: '/self_mailers/sfm_1',
	},
	{
		op: 'selfMailers.list',
		input: { campaign_id: 'cmp_1' },
		method: 'GET',
		url: '/self_mailers?campaign_id=cmp_1',
		response: LIST,
	},
	{
		op: 'selfMailers.cancel',
		input: { id: 'sfm_1' },
		method: 'DELETE',
		url: '/self_mailers/sfm_1',
	},
	{
		op: 'snapPacks.send',
		input: {
			...mail,
			inside: 'tmpl_c94e83ca2cd5121',
			outside: 'tmpl_c94e83ca2cd5122',
			color: true,
		},
		method: 'POST',
		url: '/snap_packs',
		body: {
			...mail,
			inside: 'tmpl_c94e83ca2cd5121',
			outside: 'tmpl_c94e83ca2cd5122',
			color: true,
		},
	},
	{
		op: 'snapPacks.get',
		input: { id: 'ord_1' },
		method: 'GET',
		url: '/snap_packs/ord_1',
	},
	{
		op: 'snapPacks.list',
		input: {},
		method: 'GET',
		url: '/snap_packs',
		response: LIST,
	},
	{
		op: 'snapPacks.cancel',
		input: { id: 'ord_1' },
		method: 'DELETE',
		url: '/snap_packs/ord_1',
	},
	{
		op: 'booklets.send',
		input: {
			...mail,
			from: ADR,
			file: 'https://example.com/booklet.pdf',
			pages: 8,
			size: '8.375x5.375',
		},
		method: 'POST',
		url: '/booklets',
		body: {
			...mail,
			from: ADR,
			file: 'https://example.com/booklet.pdf',
			pages: 8,
			size: '8.375x5.375',
		},
	},
	{
		op: 'booklets.get',
		input: { id: 'ord_2' },
		method: 'GET',
		url: '/booklets/ord_2',
	},
	{
		op: 'booklets.list',
		input: {},
		method: 'GET',
		url: '/booklets',
		response: LIST,
	},
	{
		op: 'booklets.cancel',
		input: { id: 'ord_2' },
		method: 'DELETE',
		url: '/booklets/ord_2',
	},
	{
		op: 'bankAccounts.create',
		input: {
			routing_number: '322271627',
			account_number: '123456789',
			account_type: 'company',
			signatory: 'Jordan Lee',
		},
		method: 'POST',
		url: '/bank_accounts',
		body: {
			routing_number: '322271627',
			account_number: '123456789',
			account_type: 'company',
			signatory: 'Jordan Lee',
		},
	},
	{
		op: 'bankAccounts.get',
		input: { id: 'bank_1' },
		method: 'GET',
		url: '/bank_accounts/bank_1',
	},
	{
		op: 'bankAccounts.list',
		input: { limit: 5 },
		method: 'GET',
		url: '/bank_accounts?limit=5',
		response: LIST,
	},
	{
		op: 'bankAccounts.delete',
		input: { id: 'bank_1' },
		method: 'DELETE',
		url: '/bank_accounts/bank_1',
	},
	{
		op: 'bankAccounts.verify',
		input: { id: 'bank_1', amounts: [25, 63] },
		method: 'POST',
		url: '/bank_accounts/bank_1/verify',
		body: { amounts: [25, 63] },
	},
	{
		op: 'billingGroups.create',
		input: { name: 'Marketing' },
		method: 'POST',
		url: '/billing_groups',
		body: { name: 'Marketing' },
	},
	{
		op: 'billingGroups.get',
		input: { id: 'bg_1' },
		method: 'GET',
		url: '/billing_groups/bg_1',
	},
	{
		op: 'billingGroups.list',
		input: { offset: 10, sort_by: { date_modified: 'desc' } },
		method: 'GET',
		url: '/billing_groups?offset=10&sort_by%5Bdate_modified%5D=desc',
		response: LIST,
	},
	{
		op: 'billingGroups.update',
		input: { id: 'bg_1', name: 'Ops' },
		method: 'POST',
		url: '/billing_groups/bg_1',
		body: { name: 'Ops' },
	},
	{
		op: 'buckslips.create',
		input: { front: 'https://example.com/front.pdf' },
		method: 'POST',
		url: '/buckslips',
		body: { front: 'https://example.com/front.pdf' },
	},
	{
		op: 'buckslips.get',
		input: { id: 'bck_1' },
		method: 'GET',
		url: '/buckslips/bck_1',
	},
	{
		op: 'buckslips.list',
		input: {},
		method: 'GET',
		url: '/buckslips',
		response: LIST,
	},
	{
		op: 'buckslips.update',
		input: { id: 'bck_1', auto_reorder: false },
		method: 'PATCH',
		url: '/buckslips/bck_1',
		body: { auto_reorder: false },
	},
	{
		op: 'buckslips.delete',
		input: { id: 'bck_1' },
		method: 'DELETE',
		url: '/buckslips/bck_1',
	},
	{
		op: 'buckslips.listOrders',
		input: { id: 'bck_1', limit: 3 },
		method: 'GET',
		url: '/buckslips/bck_1/orders?limit=3',
		response: LIST,
	},
	{
		op: 'buckslips.createOrder',
		input: { id: 'bck_1', quantity: 5000 },
		method: 'POST',
		url: '/buckslips/bck_1/orders',
		body: { quantity: 5000 },
	},
	{
		op: 'cards.create',
		input: { front: 'https://example.com/card.pdf', size: '3.375x2.125' },
		method: 'POST',
		url: '/cards',
		body: { front: 'https://example.com/card.pdf', size: '3.375x2.125' },
	},
	{
		op: 'cards.get',
		input: { id: 'card_1' },
		method: 'GET',
		url: '/cards/card_1',
	},
	{ op: 'cards.list', input: {}, method: 'GET', url: '/cards', response: LIST },
	{
		op: 'cards.update',
		input: { id: 'card_1', description: 'Loyalty' },
		method: 'POST',
		url: '/cards/card_1',
		body: { description: 'Loyalty' },
	},
	{
		op: 'cards.delete',
		input: { id: 'card_1' },
		method: 'DELETE',
		url: '/cards/card_1',
	},
	{
		op: 'cards.listOrders',
		input: { id: 'card_1', offset: 1 },
		method: 'GET',
		url: '/cards/card_1/orders?offset=1',
		response: LIST,
	},
	{
		op: 'cards.createOrder',
		input: { id: 'card_1', quantity: 10000 },
		method: 'POST',
		url: '/cards/card_1/orders',
		body: { quantity: 10000 },
	},
	{
		op: 'campaigns.create',
		input: {
			name: 'Spring',
			schedule_type: 'immediate',
			use_type: 'marketing',
		},
		method: 'POST',
		url: '/campaigns',
		body: { name: 'Spring', schedule_type: 'immediate', use_type: 'marketing' },
	},
	{
		op: 'campaigns.get',
		input: { id: 'cmp_1' },
		method: 'GET',
		url: '/campaigns/cmp_1',
	},
	{
		op: 'campaigns.list',
		input: { limit: 1 },
		method: 'GET',
		url: '/campaigns?limit=1',
		response: LIST,
	},
	{
		op: 'campaigns.update',
		input: { id: 'cmp_1', is_draft: true },
		method: 'PATCH',
		url: '/campaigns/cmp_1',
		body: { is_draft: true },
	},
	{
		op: 'campaigns.delete',
		input: { id: 'cmp_1' },
		method: 'DELETE',
		url: '/campaigns/cmp_1',
	},
	{
		op: 'campaigns.send',
		input: { id: 'cmp_1' },
		method: 'POST',
		url: '/campaigns/cmp_1/send',
	},
	{
		op: 'creatives.create',
		input: {
			campaign_id: 'cmp_1',
			resource_type: 'postcard',
			details: { size: '4x6' },
			front: '<html>F</html>',
			back: '<html>B</html>',
		},
		method: 'POST',
		url: '/creatives',
		body: {
			campaign_id: 'cmp_1',
			resource_type: 'postcard',
			details: { size: '4x6' },
			front: '<html>F</html>',
			back: '<html>B</html>',
		},
	},
	{
		op: 'creatives.get',
		input: { id: 'crv_1' },
		method: 'GET',
		url: '/creatives/crv_1',
	},
	{
		op: 'creatives.update',
		input: { id: 'crv_1', description: 'v2' },
		method: 'PATCH',
		url: '/creatives/crv_1',
		body: { description: 'v2' },
	},
	{
		op: 'uploads.create',
		input: { campaignId: 'cmp_1' },
		method: 'POST',
		url: '/uploads',
		body: { campaignId: 'cmp_1' },
	},
	{
		op: 'uploads.get',
		input: { id: 'upl_1' },
		method: 'GET',
		url: '/uploads/upl_1',
	},
	{
		op: 'uploads.list',
		input: { campaignId: 'cmp_1' },
		method: 'GET',
		url: '/uploads?campaignId=cmp_1',
		response: [],
	},
	{
		op: 'uploads.update',
		input: { id: 'upl_1', originalFilename: 'a.csv' },
		method: 'PATCH',
		url: '/uploads/upl_1',
		body: { originalFilename: 'a.csv' },
	},
	{
		op: 'uploads.createExport',
		input: { id: 'upl_1', type: 'failures' },
		method: 'POST',
		url: '/uploads/upl_1/exports',
		body: { type: 'failures' },
	},
	{
		op: 'uploads.getExport',
		input: { id: 'upl_1', export_id: 'ex_1' },
		method: 'GET',
		url: '/uploads/upl_1/exports/ex_1',
	},
	{
		op: 'uploads.getReport',
		input: { id: 'upl_1', status: 'Failed', limit: 5 },
		method: 'GET',
		url: '/uploads/upl_1/report?status=Failed&limit=5',
	},
	{
		op: 'informedDelivery.list',
		input: {},
		method: 'GET',
		url: '/informed_delivery_campaigns',
		response: LIST,
	},
	{
		op: 'informedDelivery.get',
		input: { id: '123' },
		method: 'GET',
		url: '/informed_delivery_campaigns/123',
	},
	{
		op: 'resourceProofs.create',
		input: {
			resource_type: 'postcard',
			resource_parameters: { to: ADR, front: 'tmpl_a', back: 'tmpl_b' },
		},
		method: 'POST',
		url: '/resource_proofs',
		body: {
			resource_type: 'postcard',
			resource_parameters: { to: ADR, front: 'tmpl_a', back: 'tmpl_b' },
		},
	},
	{
		op: 'resourceProofs.get',
		input: { id: 'res_prf_1' },
		method: 'GET',
		url: '/resource_proofs/res_prf_1',
	},
	{
		op: 'resourceProofs.update',
		input: { id: 'res_prf_1', template_id: 'tmpl_c' },
		method: 'PATCH',
		url: '/resource_proofs/res_prf_1',
		body: { template_id: 'tmpl_c' },
	},
	{
		op: 'templates.create',
		input: { html: '<html>{{name}}</html>', engine: 'handlebars' },
		method: 'POST',
		url: '/templates',
		body: { html: '<html>{{name}}</html>', engine: 'handlebars' },
	},
	{
		op: 'templates.get',
		input: { id: 'tmpl_1' },
		method: 'GET',
		url: '/templates/tmpl_1',
	},
	{
		op: 'templates.list',
		input: { metadata: { team: 'growth' } },
		method: 'GET',
		url: '/templates?metadata%5Bteam%5D=growth',
		response: LIST,
	},
	{
		op: 'templates.update',
		input: { id: 'tmpl_1', published_version: 'vrsn_2' },
		method: 'POST',
		url: '/templates/tmpl_1',
		body: { published_version: 'vrsn_2' },
	},
	{
		op: 'templates.delete',
		input: { id: 'tmpl_1' },
		method: 'DELETE',
		url: '/templates/tmpl_1',
	},
	{
		op: 'templateVersions.create',
		input: { template_id: 'tmpl_1', html: '<html>v2</html>' },
		method: 'POST',
		url: '/templates/tmpl_1/versions',
		body: { html: '<html>v2</html>' },
	},
	{
		op: 'templateVersions.get',
		input: { template_id: 'tmpl_1', id: 'vrsn_2' },
		method: 'GET',
		url: '/templates/tmpl_1/versions/vrsn_2',
	},
	{
		op: 'templateVersions.list',
		input: { template_id: 'tmpl_1', limit: 2 },
		method: 'GET',
		url: '/templates/tmpl_1/versions?limit=2',
		response: LIST,
	},
	{
		op: 'templateVersions.update',
		input: { template_id: 'tmpl_1', id: 'vrsn_2', description: 'final' },
		method: 'POST',
		url: '/templates/tmpl_1/versions/vrsn_2',
		body: { description: 'final' },
	},
	{
		op: 'templateVersions.delete',
		input: { template_id: 'tmpl_1', id: 'vrsn_2' },
		method: 'DELETE',
		url: '/templates/tmpl_1/versions/vrsn_2',
	},
	{
		op: 'domains.create',
		input: { domain: 'go.example.com' },
		method: 'POST',
		url: '/domains',
		body: { domain: 'go.example.com' },
	},
	{
		op: 'domains.get',
		input: { id: 'dom_1' },
		method: 'GET',
		url: '/domains/dom_1',
	},
	{
		op: 'domains.list',
		input: { status: 'configured' },
		method: 'GET',
		url: '/domains?status=configured',
		response: LIST,
	},
	{
		op: 'domains.delete',
		input: { id: 'dom_1' },
		method: 'DELETE',
		url: '/domains/dom_1',
	},
	{
		op: 'links.create',
		input: { redirect_link: 'https://example.com/offer', slug: 'spring' },
		method: 'POST',
		url: '/links',
		body: { redirect_link: 'https://example.com/offer', slug: 'spring' },
	},
	{
		op: 'links.get',
		input: { id: 'lnk_1' },
		method: 'GET',
		url: '/links/lnk_1',
	},
	{
		op: 'links.list',
		input: { domain_id: 'dom_1' },
		method: 'GET',
		url: '/links?domain_id=dom_1',
		response: LIST,
	},
	{
		op: 'links.update',
		input: { id: 'lnk_1', redirect_link: 'https://example.com/new' },
		method: 'PATCH',
		url: '/links/lnk_1',
		body: { redirect_link: 'https://example.com/new' },
	},
	{
		op: 'links.delete',
		input: { id: 'lnk_1' },
		method: 'DELETE',
		url: '/links/lnk_1',
	},
	{
		op: 'qrCodes.list',
		input: { scanned: true, resource_ids: ['psc_1', 'ltr_2'] },
		method: 'GET',
		url: '/qr_code_analytics?scanned=true&resource_ids=psc_1&resource_ids=ltr_2',
		response: LIST,
	},
];

// unknown: an operation from the nested map, called with its own input.
type AnyOp = (
	ctx: ReturnType<typeof makeCtx>,
	input: unknown,
) => Promise<unknown>;

function operation(path: string): AnyOp {
	const [group, name] = path.split('.') as [string, string];
	const ops = endpoints as unknown as Record<string, Record<string, AnyOp>>;
	const fn = ops[group]?.[name];
	if (!fn) throw new Error(`no operation ${path}`);
	return fn;
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('request shapes of the operations beyond the original 14', () => {
	it.each(rows.map((row) => [row.op, row] as const))('%s', async (_, row) => {
		mockFetch(ok(row.response ?? { id: 'x' }));
		await operation(row.op)(makeCtx(), row.input);
		const { url, init } = lastCall();
		expect(init.method).toBe(row.method);
		expect(url).toBe(`${BASE}${row.url}`);
		if (row.body === undefined) {
			expect(init.body).toBeUndefined();
		} else {
			expect(JSON.parse(String(init.body))).toEqual(row.body);
		}
	});

	it('covers every added operation except the multipart and 204 ones', () => {
		const covered = new Set(rows.map((row) => row.op));
		const all = Object.entries(endpoints).flatMap(([group, fns]) =>
			Object.keys(fns).map((name) => `${group}.${name}`),
		);
		const original = new Set([
			'usVerifications.verify',
			'usVerifications.bulk',
			'intlVerifications.verify',
			'autocomplete.usAutocomplete',
			'zip.usZipLookup',
			'addresses.create',
			'addresses.get',
			'addresses.list',
			'addresses.delete',
			'postcards.send',
			'postcards.get',
			'letters.send',
			'letters.get',
			'account.getBalance',
		]);
		const separate = new Set([
			'uploads.delete',
			'uploads.uploadFile',
			'informedDelivery.create',
			'informedDelivery.update',
		]);
		const missing = all.filter(
			(op) => !original.has(op) && !separate.has(op) && !covered.has(op),
		);
		expect(missing).toEqual([]);
	});
});

describe('headers and special bodies', () => {
	it('moves the idempotency key from the check body into its header', async () => {
		mockFetch(ok({ id: 'chk_1' }));
		await operation('checks.send')(makeCtx(), {
			...mail,
			from: ADR,
			bank_account: 'bank_1',
			amount: 1,
			message: 'hi',
			idempotency_key: 'k-1',
		});
		expect(sentHeader('Idempotency-Key')).toBe('k-1');
	});

	it('sends Lob-Version on a letter only when asked', async () => {
		mockFetch(ok({ id: 'ltr_1' }));
		await operation('letters.send')(makeCtx(), {
			to: ADR,
			from: ADR,
			file: '<html>x</html>',
			color: false,
			use_type: 'operational',
			size: 'us_legal',
			lob_version: '2024-01-01',
		});
		expect(sentHeader('Lob-Version')).toBe('2024-01-01');
		const body = JSON.parse(String(lastCall().init.body));
		expect(body.size).toBe('us_legal');
		expect(body.lob_version).toBeUndefined();
	});

	it('answers a 204 upload delete with the ID', async () => {
		mockFetch(new Response(null, { status: 204 }));
		const result = await operation('uploads.delete')(makeCtx(), {
			id: 'upl_1',
		});
		expect(result).toEqual({ id: 'upl_1', deleted: true });
		expect(lastCall().init.method).toBe('DELETE');
	});

	it('uploads the audience CSV as a multipart file part', async () => {
		mockFetch(ok({ message: 'File uploaded successfully', filename: 'a.csv' }));
		const result = await operation('uploads.uploadFile')(makeCtx(), {
			id: 'upl_1',
			file: {
				base64: Buffer.from('name,address_line1\n').toString('base64'),
				filename: 'a.csv',
				contentType: 'text/csv',
			},
		});
		expect(result).toMatchObject({ filename: 'a.csv' });
		const { url, init } = lastCall();
		expect(url).toBe(`${BASE}/uploads/upl_1/file`);
		expect(init.body).toBeInstanceOf(FormData);
		const file = (init.body as FormData).get('file');
		expect(file).toBeInstanceOf(Blob);
		expect(await (file as Blob).text()).toBe('name,address_line1\n');
	});

	it('creates an Informed Delivery campaign as multipart with image parts', async () => {
		mockFetch(ok({ id: 'idc_1' }));
		await operation('informedDelivery.create')(makeCtx(), {
			quantity: 2,
			start_date: '2026-12-01',
			ride_along_url: 'https://example.com',
			ride_along_image: { base64: 'iVBORw0KGgo=', filename: 'ride.png' },
			status: 'pending_approval',
		});
		const { url, init } = lastCall();
		expect(url).toBe(`${BASE}/informed_delivery_campaigns`);
		const form = init.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(form.get('quantity')).toBe('2');
		expect(form.get('status')).toBe('pending_approval');
		expect(form.get('ride_along_image')).toBeInstanceOf(Blob);
	});

	it('sends no status on an Informed Delivery create that omits it (Lob approves it)', async () => {
		mockFetch(ok({ id: 'idc_1' }));
		await operation('informedDelivery.create')(makeCtx(), {
			quantity: 2,
			start_date: '2026-12-01',
		});
		const form = lastCall().init.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(form.has('status')).toBe(false);
	});

	it('approves an Informed Delivery campaign with PATCH and no id field', async () => {
		mockFetch(ok({ id: 'idc_1' }));
		await operation('informedDelivery.update')(makeCtx(), {
			id: '123',
			status: 'approved',
		});
		const { url, init } = lastCall();
		expect(init.method).toBe('PATCH');
		expect(url).toBe(`${BASE}/informed_delivery_campaigns/123`);
		const form = init.body as FormData;
		expect(form.get('status')).toBe('approved');
		expect(form.get('id')).toBeNull();
	});
});

describe('input checks from the spec', () => {
	it('needs message or check_bottom on a check, not both', async () => {
		const base = { ...mail, from: ADR, bank_account: 'bank_1', amount: 1 };
		await expect(operation('checks.send')(makeCtx(), base)).rejects.toThrow(
			'Provide message or check_bottom',
		);
		await expect(
			operation('checks.send')(makeCtx(), {
				...base,
				message: 'a',
				check_bottom: '<html>b</html>',
			}),
		).rejects.toThrow('not both');
	});

	it('needs amounts or a descriptor code to verify a bank account', async () => {
		await expect(
			operation('bankAccounts.verify')(makeCtx(), { id: 'bank_1' }),
		).rejects.toThrow('Provide amounts or descriptor_code');
	});

	it('refuses print orders below Lob minimums', async () => {
		await expect(
			operation('cards.createOrder')(makeCtx(), { id: 'card_1', quantity: 10 }),
		).rejects.toThrow();
		await expect(
			operation('buckslips.createOrder')(makeCtx(), {
				id: 'bck_1',
				quantity: 4999,
			}),
		).rejects.toThrow();
	});

	it('names the artwork a creative is missing for its format', async () => {
		await expect(
			operation('creatives.create')(makeCtx(), {
				campaign_id: 'cmp_1',
				resource_type: 'letter',
				details: {},
				file: '<html>x</html>',
			}),
		).rejects.toThrow('A letter creative needs from');
	});

	it('refuses both list cursors at once', async () => {
		await expect(
			operation('checks.list')(makeCtx(), { before: 'a', after: 'b' }),
		).rejects.toThrow('Use before or after, not both');
	});

	it('refuses a path value that would leave the route', async () => {
		await expect(
			operation('templates.get')(makeCtx(), { id: '..' }),
		).rejects.toThrow('Invalid Lob path value');
	});
});
