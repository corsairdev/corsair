import {
	EsputnikEndpointInputSchemas,
	EsputnikEndpointOutputSchemas,
} from './endpoints/types';
import { EsputnikSchema } from './schema';
import { operationFixtures } from './test-fixtures';

describe('Esputnik schema', () => {
	it('declares a semver version', () => {
		expect(EsputnikSchema.version).toBeDefined();
		expect(EsputnikSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EsputnikSchema.entities).toBe('object');
		expect(EsputnikSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EsputnikSchema.entities))).toBe(true);
		for (const entity of Object.values(EsputnikSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('eSputnik endpoint schemas', () => {
	it.each(Object.keys(EsputnikEndpointInputSchemas))(
		'%s accepts its fixture input',
		(name) => {
			expect(
				EsputnikEndpointInputSchemas[
					name as keyof typeof EsputnikEndpointInputSchemas
				].safeParse(operationFixtures[name] ?? {}).success,
			).toBe(true);
		},
	);

	it('sends contact additional fields as id/value pairs', () => {
		const contact = {
			channels: [{ type: 'email', value: 'person@example.com' }],
			fields: [{ id: 79814, value: 'gold' }],
			address: { town: 'Toulouse', countryCode: 'FR' },
		};
		expect(EsputnikEndpointInputSchemas.addContact.parse(contact)).toEqual(
			contact,
		);
		expect(
			EsputnikEndpointInputSchemas.addContact.safeParse({
				...contact,
				fields: { customerTier: 'gold' },
			}).success,
		).toBe(false);
	});

	it('keeps the documented search parameter for message searches', () => {
		expect(
			EsputnikEndpointInputSchemas.searchEmails.parse({ search: 'welcome' }),
		).toEqual({ search: 'welcome' });
	});

	it('requires contacts to attach or detach', () => {
		expect(
			EsputnikEndpointInputSchemas.attachContactsToGroup.safeParse({ id: 1 })
				.success,
		).toBe(false);
	});

	it('accepts string broadcast ids', () => {
		expect(
			EsputnikEndpointInputSchemas.getBroadcast.safeParse({ id: 'b-1' })
				.success,
		).toBe(true);
	});

	it('rejects contact operations without required identifiers or body channels', () => {
		expect(EsputnikEndpointInputSchemas.getContact.safeParse({}).success).toBe(
			false,
		);
		expect(EsputnikEndpointInputSchemas.addContact.safeParse({}).success).toBe(
			false,
		);
	});

	it('validates representative output contracts', () => {
		expect(
			EsputnikEndpointOutputSchemas.getAccountInfo.safeParse({
				organisationName: 'Test',
			}).success,
		).toBe(true);
		expect(
			EsputnikEndpointOutputSchemas.searchContacts.safeParse([]).success,
		).toBe(true);
	});

	it('keeps undocumented provider responses JSON-safe', () => {
		expect(
			EsputnikEndpointOutputSchemas.registerEvent.safeParse({ accepted: true })
				.success,
		).toBe(true);
		expect(
			EsputnikEndpointOutputSchemas.registerEvent.safeParse(() => {}).success,
		).toBe(false);
		expect(
			EsputnikEndpointOutputSchemas.searchViberMessages.safeParse([{ id: 1 }])
				.success,
		).toBe(true);
	});

	it('accepts empty successful deletion responses', () => {
		expect(
			EsputnikEndpointOutputSchemas.deleteContactByExternalCustomerId.safeParse(
				undefined,
			).success,
		).toBe(true);
		expect(
			EsputnikEndpointOutputSchemas.deleteContactById.safeParse(undefined)
				.success,
		).toBe(true);
	});

	it('rejects malformed path and required-body inputs', () => {
		expect(
			EsputnikEndpointInputSchemas.getContactIdByToken.safeParse({
				app_uuid: '',
				token_id: 'token',
			}).success,
		).toBe(false);
		expect(
			EsputnikEndpointInputSchemas.changeTokenActivated.safeParse({
				app_uuid: 'app',
				token_id: 'token',
			}).success,
		).toBe(false);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
