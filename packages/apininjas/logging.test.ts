/**
 * What may and may not reach `corsair_events`.
 *
 * The audit payload is deny-by-default: a parameter's value is written only if
 * it is on the loggable list. This suite proves that for every parameter of
 * every operation rather than for the handful anyone thought to check, because
 * the failure this replaces was exactly a list that looked complete and was
 * not - it put income, deductions, street addresses, IBANs and routing numbers
 * into permanent storage.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DOCUMENTED_OPERATIONS } from './docs-contract';
import { auditPayload, isLoggableKey, loggableKeys } from './endpoints/logging';

/** Every parameter name across all 129 documented operations. */
const ALL_PARAMETERS = [
	...new Set(
		Object.values(DOCUMENTED_OPERATIONS).flatMap((operation) =>
			operation.params.map((param) => param.name),
		),
	),
].sort();

/** A value distinctive enough that finding it in a payload proves a leak. */
const CANARY = 'CANARY-VALUE-9c3f1a';

describe('the surface being protected', () => {
	it('covers every parameter the plugin accepts', () => {
		expect(ALL_PARAMETERS.length).toBeGreaterThan(200);
	});
});

describe('deny by default', () => {
	test.each(ALL_PARAMETERS)(
		'%s is either loggable by review or redacted',
		(parameter) => {
			const payload = auditPayload({ [parameter]: CANARY }, [parameter]);

			if (isLoggableKey(parameter)) {
				expect(payload[parameter]).toBe(CANARY);
			} else {
				expect(payload[parameter]).toBeUndefined();
				expect(JSON.stringify(payload)).not.toContain(CANARY);
			}
		},
	);

	test.each(ALL_PARAMETERS)(
		'%s is recorded by name whether or not its value is',
		(parameter) => {
			// Redaction must not hide that a call supplied the field: an operator
			// still needs to see what an operation was asked to do.
			const payload = auditPayload({ [parameter]: CANARY }, [parameter]);

			expect(payload.supplied_fields).toEqual([parameter]);
		},
	);

	it('records a length for a redacted value, so calls stay comparable', () => {
		const payload = auditPayload({ income: 125000, text: 'hello there' }, [
			'income',
			'text',
		]);

		expect(payload.text_length).toBe(11);
		// A number has no length; the field name is still recorded.
		expect(payload.income_length).toBeUndefined();
		expect(payload.supplied_fields).toEqual(['income', 'text']);
	});

	it('cannot be widened by an endpoint naming a field as an identifier', () => {
		// `identifierKeys` is a hint from the handler. If it could override the
		// list, every one of the 129 handlers would be a place to get this wrong.
		const payload = auditPayload(
			{ iban: 'DE89370400440532013000', routing_number: '121000248' },
			['iban', 'routing_number'],
		);

		expect(payload.iban).toBeUndefined();
		expect(payload.routing_number).toBeUndefined();
		expect(JSON.stringify(payload)).not.toContain('DE89');
		expect(JSON.stringify(payload)).not.toContain('121000248');
	});

	it('redacts a parameter this plugin has never seen', () => {
		// The point of the inversion: a parameter added by a future operation is
		// protected before anyone reviews it.
		const payload = auditPayload({ social_security_number: CANARY }, [
			'social_security_number',
		]);

		expect(payload.social_security_number).toBeUndefined();
		expect(payload.social_security_number_length).toBe(CANARY.length);
	});
});

describe('the fields this was reported for', () => {
	// Each of these was previously written to the event log in full.
	it.each([
		['income', 125_000],
		['deductions', 12_400],
		['credits', 2_000],
		['home_value', 750_000],
		['loan_amount', 400_000],
		['downpayment', 80_000],
		['annual_property_tax', 9_500],
		['annual_home_insurance', 2_100],
		['monthly_hoa', 350],
		['interest_rate', 3.5],
		['filing_status', 'married'],
		['self_employed', true],
		['street_address', '1 Example Street'],
		['zip_code', '90210'],
		['postal_code', 'K1A 0B1'],
		['routing_number', '121000248'],
		['iban', 'DE89370400440532013000'],
		['bin', '411111'],
		['swift', 'BOFAUS3N'],
		['transaction_code', 'P'],
		['vin', 'JH4TB2H26CC000000'],
		['email', 'someone@example.com'],
		['number', '+15550100'],
		['address', '203.0.113.7'],
		['lat', 51.5074],
		['lon', -0.1278],
		['word', 'secret-lookup-term'],
	])('never records %s by value', (key, value) => {
		const payload = auditPayload({ [key]: value }, [key]);

		expect(payload[key]).toBeUndefined();
		expect(JSON.stringify(payload)).not.toContain(String(value));
	});
});

describe('the loggable list itself', () => {
	it('contains nothing that names money, an account or a precise location', () => {
		// A guard against the list drifting back: these describe a caller rather
		// than a public thing, and none of them belong here.
		//
		// Matched on whole words. Substring matching was the first attempt and it
		// rejected `province` for containing "vin".
		const forbidden =
			/\b(iban|routing|routing_number|swift|account|income|salary|deduction|deductions|credit|credits|balance|address|street_address|zip|zip_code|zipcode|postal_code|lat|lon|latitude|longitude|vin|password|token|secret|ssn|filing_status|self_employed|loan_amount|downpayment|home_value|monthly_hoa|interest_rate|transaction_code)\b/i;

		const offenders = loggableKeys().filter((key) => forbidden.test(key));

		expect(offenders).toEqual([]);
	});

	it('holds only parameters the plugin actually accepts', () => {
		// A stale entry is a claim that something was reviewed when it no longer
		// exists, and it hides the fact that a real parameter is unreviewed.
		const unknown = loggableKeys().filter(
			(key) => !ALL_PARAMETERS.includes(key),
		);

		expect(unknown).toEqual([]);
	});

	it('is what every handler actually asks to record', () => {
		// Enforcement is central - `auditPayload` filters whatever it is handed -
		// but a handler naming a forbidden field would still read as though the
		// plugin intended to log it, and would start logging it the moment anyone
		// relaxed the filter. This reads the 12 endpoint modules and checks the
		// identifier list of all 129 call sites.
		const modules = readdirSync(join(__dirname, 'endpoints')).filter((file) =>
			file.endsWith('.ts'),
		);
		const named = new Set<string>();
		let callSites = 0;
		let occurrences = 0;
		const unmatched: string[] = [];

		for (const file of modules) {
			const source = readFileSync(join(__dirname, 'endpoints', file), 'utf8');
			const calls = [...source.matchAll(/auditPayload\(/g)];
			const parsed = [...source.matchAll(/auditPayload\(input, \[([^\]]*)\]/g)];
			occurrences += calls.length;
			callSites += parsed.length;

			const parsedAt = new Set(parsed.map((match) => match.index));
			for (const call of calls) {
				if (parsedAt.has(call.index)) continue;
				const line = source.slice(0, call.index).split('\n').length;
				unmatched.push(`${file}:${line}`);
			}

			for (const match of parsed) {
				for (const key of match[1]?.matchAll(/'([a-z0-9_]+)'/g) ?? []) {
					named.add(key[1] as string);
				}
			}
		}

		expect(unmatched).toEqual([]);
		expect(occurrences).toBe(callSites);
		expect(callSites).toBe(129);
		expect([...named].filter((key) => !isLoggableKey(key))).toEqual([]);
	});

	it('still records enough to make the log useful', () => {
		// Deny-by-default is only correct if the log still answers "what was
		// asked for". These are the keys that carry that meaning.
		for (const key of ['ticker', 'country', 'city', 'iata', 'year', 'limit']) {
			expect(isLoggableKey(key)).toBe(true);
		}

		const payload = auditPayload(
			{ ticker: 'AAPL', year: 2026, filing: '10-K' },
			['ticker', 'year', 'filing'],
		);
		expect(payload).toEqual({
			ticker: 'AAPL',
			year: 2026,
			filing: '10-K',
			supplied_fields: ['ticker', 'year', 'filing'],
		});
	});
});
