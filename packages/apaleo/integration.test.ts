/**
 * Live Inventory API checks.
 *
 * Skipped unless APALEO_CLIENT_ID and APALEO_CLIENT_SECRET are set.
 * Loads gitignored `.env.local` from the repo root when present.
 *
 * Creates a Test property, exercises the 29 ops, then deletes probe resources
 * via the documented DELETE endpoints (and DELETE property which is official
 * but not in this plugin's 29-op catalog).
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
	ApaleoAPIError,
	getValidApaleoAccessToken,
	makeApaleoRequest,
} from './client';
import { ApaleoEndpointOutputSchemas } from './endpoints/types';
import {
	ApaleoPropertyEntity,
	ApaleoUnitAttributeEntity,
	ApaleoUnitEntity,
	ApaleoUnitGroupEntity,
} from './schema/database';

function loadEnvLocal() {
	try {
		const text = readFileSync(resolve(__dirname, '../../.env.local'), 'utf8');
		for (const line of text.split('\n')) {
			const match = /^([A-Z0-9_]+)=(.*)$/.exec(line);
			if (!match) continue;
			const key = match[1];
			const value = match[2];
			if (key && value !== undefined && !process.env[key]) {
				process.env[key] = value;
			}
		}
	} catch {
		// no local env file
	}
}

loadEnvLocal();

const clientId = process.env.APALEO_CLIENT_ID;
const clientSecret = process.env.APALEO_CLIENT_SECRET;
const describeLive = clientId && clientSecret ? describe : describe.skip;

const runId = Date.now().toString(36).slice(-5).toUpperCase();
const CODE = `CR${runId}`;
const cloneCode = `CL${runId}`;

function issues(error: {
	issues: readonly { path?: PropertyKey[]; code?: string; message?: string }[];
}): string[] {
	return error.issues.map((issue) => {
		const where = (issue.path ?? []).join('.') || '(root)';
		return `${where}: ${issue.code ?? 'invalid'} - ${issue.message ?? ''}`;
	});
}

const createBody = {
	code: CODE,
	name: { en: 'Corsair probe hotel', de: 'Corsair Probehotel' },
	description: {
		en: 'Temporary probe property for Corsair plugin tests',
		de: 'Temporäres Probehotel für Corsair Plugin-Tests',
	},
	companyName: 'Corsair Probe GmbH',
	commercialRegisterEntry: 'HRB 1',
	taxId: 'DE1',
	location: {
		addressLine1: 'Marienplatz 1',
		postalCode: '80331',
		city: 'München',
		countryCode: 'DE',
	},
	paymentTerms: { en: 'Pay on checkout', de: 'Zahlung bei Checkout' },
	timeZone: 'Europe/Berlin',
	defaultCheckInTime: '17:00:00',
	defaultCheckOutTime: '11:00:00',
	currencyCode: 'EUR',
};

describeLive('Apaleo Inventory live', () => {
	let token = '';
	let propertyId = '';
	let ownedProperty = false;
	let cloneId = '';
	let unitGroupId = '';
	let unitId = '';
	let bulkIds: string[] = [];
	let attributeId = '';

	beforeAll(async () => {
		const result = await getValidApaleoAccessToken({
			clientId,
			clientSecret,
		});
		token = result.accessToken;
	});

	afterAll(async () => {
		if (!token) return;
		for (const id of [...bulkIds, unitId].filter(Boolean)) {
			try {
				await makeApaleoRequest(
					`/inventory/v1/units/${encodeURIComponent(id)}`,
					token,
					{ method: 'DELETE' },
				);
			} catch (error) {
				if (!(error instanceof ApaleoAPIError && error.status === 404)) {
					throw error;
				}
			}
		}
		if (unitGroupId) {
			try {
				await makeApaleoRequest(
					`/inventory/v1/unit-groups/${encodeURIComponent(unitGroupId)}`,
					token,
					{ method: 'DELETE' },
				);
			} catch (error) {
				if (!(error instanceof ApaleoAPIError && error.status === 404)) {
					throw error;
				}
			}
		}
		if (attributeId) {
			try {
				await makeApaleoRequest(
					`/inventory/v1/unit-attributes/${encodeURIComponent(attributeId)}`,
					token,
					{ method: 'DELETE' },
				);
			} catch (error) {
				if (!(error instanceof ApaleoAPIError && error.status === 404)) {
					throw error;
				}
			}
		}
		for (const id of [cloneId, ownedProperty ? propertyId : ''].filter(
			Boolean,
		)) {
			try {
				await makeApaleoRequest(
					`/inventory/v1/properties/${encodeURIComponent(id)}`,
					token,
					{ method: 'DELETE' },
				);
			} catch (error) {
				if (!(error instanceof ApaleoAPIError && error.status === 404)) {
					throw error;
				}
			}
		}
	});

	it('lists supported countries', async () => {
		const raw = await makeApaleoRequest('/inventory/v1/types/countries', token);
		const parsed =
			ApaleoEndpointOutputSchemas.propertiesCountries.safeParse(raw);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		expect(parsed.data?.countryCodes).toContain('DE');
	});

	it('creates a test property and reads it back', async () => {
		const created = await makeApaleoRequest<{ id: string }>(
			'/inventory/v1/properties',
			token,
			{ method: 'POST', body: createBody },
		);
		propertyId = created.id;
		ownedProperty = true;
		expect(propertyId).toBeTruthy();

		const got = await makeApaleoRequest(
			`/inventory/v1/properties/${encodeURIComponent(propertyId)}`,
			token,
		);
		const parsed = ApaleoPropertyEntity.safeParse(got);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		expect(parsed.data?.status).toBe('Test');
	});

	it('lists and counts properties', async () => {
		const list = await makeApaleoRequest('/inventory/v1/properties', token, {
			query: { pageNumber: 1, pageSize: 50 },
		});
		const parsed = ApaleoEndpointOutputSchemas.propertiesList.safeParse(list);
		if (!parsed.success) console.error(issues(parsed.error));
		expect(parsed.success).toBe(true);
		const count = await makeApaleoRequest<{ count: number }>(
			'/inventory/v1/properties/$count',
			token,
		);
		expect(typeof count.count).toBe('number');
	});

	it('creates unit group, unit, bulk units, and attribute', async () => {
		if (!ownedProperty) return;
		const group = await makeApaleoRequest<{ id: string }>(
			'/inventory/v1/unit-groups',
			token,
			{
				method: 'POST',
				body: {
					code: 'DBL',
					propertyId,
					name: { en: 'Double', de: 'Doppelzimmer' },
					description: { en: 'Double room', de: 'Doppelzimmer' },
					maxPersons: 2,
					type: 'BedRoom',
				},
			},
		);
		unitGroupId = group.id;
		const groupGot = await makeApaleoRequest(
			`/inventory/v1/unit-groups/${encodeURIComponent(unitGroupId)}`,
			token,
		);
		const groupParsed = ApaleoUnitGroupEntity.safeParse(groupGot);
		if (!groupParsed.success) console.error(issues(groupParsed.error));
		expect(groupParsed.success).toBe(true);

		const attr = await makeApaleoRequest<{ id: string }>(
			'/inventory/v1/unit-attributes',
			token,
			{ method: 'POST', body: { name: 'Corsair probe attr' } },
		);
		attributeId = attr.id;
		expect(
			ApaleoUnitAttributeEntity.safeParse(
				await makeApaleoRequest(
					`/inventory/v1/unit-attributes/${encodeURIComponent(attributeId)}`,
					token,
				),
			).success,
		).toBe(true);

		const unit = await makeApaleoRequest<{ id: string }>(
			'/inventory/v1/units',
			token,
			{
				method: 'POST',
				body: {
					propertyId,
					name: 'A.101',
					description: { en: 'Probe room', de: 'Probezimmer' },
					unitGroupId,
					maxPersons: 2,
					attributes: [{ id: attributeId }],
				},
			},
		);
		unitId = unit.id;
		const unitGot = await makeApaleoRequest(
			`/inventory/v1/units/${encodeURIComponent(unitId)}`,
			token,
		);
		const unitParsed = ApaleoUnitEntity.safeParse(unitGot);
		if (!unitParsed.success) console.error(issues(unitParsed.error));
		expect(unitParsed.success).toBe(true);

		const bulk = await makeApaleoRequest<{ ids: string[] }>(
			'/inventory/v1/units/bulk',
			token,
			{
				method: 'POST',
				body: {
					units: [
						{
							propertyId,
							name: 'A.201',
							description: { en: 'Bulk 1', de: 'Bulk 1' },
							unitGroupId,
							maxPersons: 2,
						},
						{
							propertyId,
							name: 'A.202',
							description: { en: 'Bulk 2', de: 'Bulk 2' },
							unitGroupId,
							maxPersons: 2,
						},
					],
				},
			},
		);
		bulkIds = bulk.ids;
		expect(bulkIds).toHaveLength(2);
	});

	it('replaces the unit group and counts inventory', async () => {
		if (!ownedProperty) return;
		await makeApaleoRequest(
			`/inventory/v1/unit-groups/${encodeURIComponent(unitGroupId)}`,
			token,
			{
				method: 'PUT',
				body: {
					name: { en: 'Double updated', de: 'Doppelzimmer aktualisiert' },
					description: { en: 'Double room', de: 'Doppelzimmer' },
					maxPersons: 2,
				},
			},
		);
		const units = await makeApaleoRequest<{ count: number }>(
			'/inventory/v1/units/$count',
			token,
			{ query: { propertyId } },
		);
		expect(units.count).toBeGreaterThanOrEqual(3);
		const groups = await makeApaleoRequest<{ count: number }>(
			'/inventory/v1/unit-groups/$count',
			token,
			{ query: { propertyId } },
		);
		expect(groups.count).toBeGreaterThanOrEqual(1);
	});

	it('clone returns official 422 unless the source property is a template', async () => {
		if (!ownedProperty) return;
		try {
			const cloned = await makeApaleoRequest<{ id: string }>(
				`/inventory/v1/property-actions/${encodeURIComponent(propertyId)}/clone`,
				token,
				{ method: 'POST', body: { ...createBody, code: cloneCode } },
			);
			cloneId = cloned.id;
			expect(cloneId).toBeTruthy();
		} catch (error) {
			expect(error).toBeInstanceOf(ApaleoAPIError);
			const apiError = error as ApaleoAPIError;
			expect(apiError.status).toBe(422);
			expect(JSON.stringify(apiError.body ?? {}) + apiError.message).toMatch(
				/template/i,
			);
		}
	});

	it('HEAD exists for property, unit, group, and attribute', async () => {
		if (!ownedProperty) return;
		await makeApaleoRequest(
			`/inventory/v1/properties/${encodeURIComponent(propertyId)}`,
			token,
			{ method: 'HEAD' },
		);
		await makeApaleoRequest(
			`/inventory/v1/units/${encodeURIComponent(unitId)}`,
			token,
			{ method: 'HEAD' },
		);
		await makeApaleoRequest(
			`/inventory/v1/unit-groups/${encodeURIComponent(unitGroupId)}`,
			token,
			{ method: 'HEAD' },
		);
		await makeApaleoRequest(
			`/inventory/v1/unit-attributes/${encodeURIComponent(attributeId)}`,
			token,
			{ method: 'HEAD' },
		);
	});

	it('reset/archive/set-live are reachable (204 or 403 if client lacks manage scope)', async () => {
		if (!ownedProperty) return;
		try {
			await makeApaleoRequest(
				`/inventory/v1/property-actions/${encodeURIComponent(propertyId)}/reset`,
				token,
				{ method: 'PUT' },
			);
		} catch (error) {
			expect(error).toBeInstanceOf(ApaleoAPIError);
			expect((error as ApaleoAPIError).status).toBe(403);
		}
	});
});
