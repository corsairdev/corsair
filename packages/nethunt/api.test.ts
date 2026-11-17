import { createCorsair } from 'corsair/core';
import { NethuntEndpointOutputSchemas as Outputs } from './endpoints/types';
import { nethunt } from './index';

/**
 * Live smoke test. NetHunt's auth is an email and an API key, so both are
 * required and the suite skips when either is missing, logging which one.
 *
 * Read-only: nothing here creates, updates or deletes a record. Every answer
 * goes through its output schema first, so a field typed wrongly fails here as
 * well as for a caller.
 */
const apiKey = process.env.NETHUNT_API_KEY;
const email = process.env.NETHUNT_EMAIL;
const describeIfKey = apiKey && email ? describe : describe.skip;

if (!apiKey) console.warn('NETHUNT_API_KEY is not set: live tests skipped');
if (!email) console.warn('NETHUNT_EMAIL is not set: live tests skipped');

describeIfKey('NetHunt live API', () => {
	const corsair = createCorsair({
		plugins: [nethunt({ key: apiKey, email })],
	});

	it('verifies the credentials through the output schema', async () => {
		const parsed = Outputs.accountVerify.parse(
			await corsair.nethunt.api.account.verify({}),
		);

		expect(parsed.user.emailAddress).toBeTruthy();
	}, 30_000);

	it('lists folders through the output schema', async () => {
		const parsed = Outputs.foldersList.parse(
			await corsair.nethunt.api.folders.list({}),
		);

		expect(Array.isArray(parsed.folders)).toBe(true);
		for (const folder of parsed.folders) {
			expect(typeof folder.id).toBe('string');
			expect(typeof folder.name).toBe('string');
		}
	}, 30_000);

	it('lists a folder’s fields when the account has at least one', async () => {
		const { folders } = Outputs.foldersList.parse(
			await corsair.nethunt.api.folders.list({}),
		);
		const folderId = folders[0]?.id;
		// An account with no folders has nothing to read; that is not a failure.
		if (!folderId) return;

		const parsed = Outputs.foldersFields.parse(
			await corsair.nethunt.api.folders.fields({ folderId }),
		);
		expect(Array.isArray(parsed.fields)).toBe(true);
		for (const field of parsed.fields) {
			expect(typeof field.name).toBe('string');
		}
	}, 30_000);

	it('reads recent records when a folder exists', async () => {
		const { folders } = Outputs.foldersList.parse(
			await corsair.nethunt.api.folders.list({}),
		);
		const folderId = folders[0]?.id;
		if (!folderId) return;

		const parsed = Outputs.recordsRecent.parse(
			await corsair.nethunt.api.records.recent({ folderId, limit: 1 }),
		);
		expect(Array.isArray(parsed.records)).toBe(true);
		// Every record read carries a recordId and a fields map.
		for (const record of parsed.records) {
			expect(typeof record.recordId).toBe('string');
		}
	}, 30_000);
});
