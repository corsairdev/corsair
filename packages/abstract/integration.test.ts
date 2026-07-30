import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { abstract } from './index';

// Abstract issues a separate API key per product — confirmed empirically:
// the VAT key 401s against Email Reputation and IBAN, and the Email
// Reputation key 401s against IBAN. A single client is configured below
// with all three distinct keys via plugin options so each endpoint proves
// it resolves and uses its own key, not a shared/fallback one.
const EMAIL_REPUTATION_KEY = process.env.ABSTRACT_EMAIL_REPUTATION_API_KEY;
const VAT_KEY = process.env.ABSTRACT_VAT_API_KEY;
const IBAN_KEY = process.env.ABSTRACT_IBAN_VALIDATION_API_KEY;

async function createAbstractClient() {
	if (!EMAIL_REPUTATION_KEY || !VAT_KEY || !IBAN_KEY) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'abstract', 'default');

	const corsair = createCorsair({
		plugins: [
			abstract({
				emailReputationApiKey: EMAIL_REPUTATION_KEY,
				vatApiKey: VAT_KEY,
				ibanApiKey: IBAN_KEY,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	// Deliberately no issue_new_dek() / set_api_key() call here — this is a
	// dedicated-key-only setup (options only, no shared key, no DEK ever
	// issued on the account) and must work without one. keyBuilder used to
	// call ctx.keys.get_api_key() unconditionally, which throws "No DEK
	// found" when the account was never initialized this way, aborting
	// every request even though none of these endpoints touch the shared
	// key at all.

	return { corsair, testDb };
}

describe('Abstract plugin integration', () => {
	it('email.validate uses the email-reputation key and persists to DB', async () => {
		const setup = await createAbstractClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		const input = { email: 'support@abstractapi.com' };
		const result = await corsair.abstract.api.email.validate(input);

		expect(result).toBeDefined();
		expect(result.email).toBe(input.email);
		expect(typeof result.deliverability).toBe('string');

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'abstract.email.validate' },
		});
		expect(events.length).toBeGreaterThan(0);

		const fromDb = await corsair.abstract.db.emailValidations.findByEntityId(
			input.email,
		);
		expect(fromDb).not.toBeNull();
		expect(fromDb?.data.email).toBe(input.email);
		expect(fromDb?.data.deliverability).toBe(result.deliverability);

		testDb.cleanup();
	});

	it('email.reputation uses the email-reputation key and persists to DB', async () => {
		const setup = await createAbstractClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		const input = { email: 'support@abstractapi.com' };
		const result = await corsair.abstract.api.email.reputation(input);

		expect(result).toBeDefined();
		expect(result.email_address).toBe(input.email);

		const fromDb = await corsair.abstract.db.emailReputations.findByEntityId(
			input.email,
		);
		expect(fromDb).not.toBeNull();
		expect(fromDb?.data.emailAddress).toBe(input.email);
		expect(fromDb?.data.qualityScore).toBe(result.email_quality.score);

		testDb.cleanup();
	});

	it('vat.getCategories uses the vat key and persists to DB', async () => {
		const setup = await createAbstractClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		const input = { countryCode: 'DE' };
		const result = await corsair.abstract.api.vat.getCategories(input);

		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);

		const first = result[0];
		if (first) {
			const entityId = `${first.country_code}:${first.category}`;
			const fromDb =
				await corsair.abstract.db.vatCategories.findByEntityId(entityId);
			expect(fromDb).not.toBeNull();
			expect(fromDb?.data.countryCode).toBe(first.country_code);
			expect(fromDb?.data.rate).toBe(first.rate);
		}

		testDb.cleanup();
	});

	it('iban.validate uses the iban key and persists to DB', async () => {
		const setup = await createAbstractClient();
		if (!setup) {
			return;
		}
		const { corsair, testDb } = setup;

		const input = { iban: 'DE89370400440532013000' };
		const result = await corsair.abstract.api.iban.validate(input);

		expect(result).toBeDefined();
		expect(result.iban).toBeTruthy();

		const fromDb = await corsair.abstract.db.ibanValidations.findByEntityId(
			result.iban,
		);
		expect(fromDb).not.toBeNull();
		expect(fromDb?.data.isValid).toBe(result.is_valid);

		testDb.cleanup();
	});

	it('fails fast with AuthMissingError when no key is configured anywhere, instead of calling Abstract with an empty key', async () => {
		// No env keys needed — this never reaches the network. No plugin
		// options, no DEK issued, no key manager value set anywhere.
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'abstract', 'default');

		const corsair = createCorsair({
			plugins: [abstract({})],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});

		await expect(
			corsair.abstract.api.vat.getCategories({ countryCode: 'DE' }),
		).rejects.toThrow(/auth-missing/);

		testDb.cleanup();
	});
});
