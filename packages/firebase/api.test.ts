import { createCorsair } from 'corsair/core';
import { firebase } from './index';

/**
 * Live run, either against the Firebase Local Emulator Suite:
 *
 *   npx firebase-tools emulators:start --only firestore,auth,database,storage --project demo-corsair
 *   FIREBASE_EMULATOR=1 npx jest api.test.ts
 *
 * or against a real project with a service account key:
 *
 *   FIREBASE_SERVICE_ACCOUNT="$(cat key.json)" FIREBASE_PROJECT=<id> npx jest api.test.ts
 *
 * Skipped unless one of them is set (CI never runs files named api.test.ts).
 * It writes and deletes one Firestore document and one Realtime Database
 * path, and creates and deletes one Authentication user.
 */
const emulator = process.env.FIREBASE_EMULATOR === '1';
const key = process.env.FIREBASE_SERVICE_ACCOUNT;
const project = emulator ? 'demo-corsair' : process.env.FIREBASE_PROJECT;
const ready = emulator || Boolean(key && project);
const describeIfLive = ready ? describe : describe.skip;
if (!ready) {
	console.warn(
		'Skipping Firebase live run: set FIREBASE_EMULATOR=1 (emulators running) or FIREBASE_SERVICE_ACCOUNT and FIREBASE_PROJECT.',
	);
}

const STAMP = Date.now().toString(36);

describeIfLive('firebase live', () => {
	const corsair = createCorsair({
		plugins: [
			firebase({
				...(key ? { key } : {}),
				permissions: { mode: 'open' },
				...(emulator
					? {
							emulatorUrls: {
								firestore: 'http://127.0.0.1:8080/',
								auth: 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/',
								database: 'http://127.0.0.1:9000',
							},
						}
					: {}),
			}),
		],
	});
	const api = corsair.firebase.api;
	const docs = `projects/${project}/databases/(default)/documents`;
	const databaseUrl = `https://${project}-default-rtdb.firebaseio.com`;

	it('writes, reads, queries and deletes a Firestore document', async () => {
		const name = `${docs}/corsair-live/${STAMP}`;
		await api.firestore.databases.documents.createDocument({
			parent: docs,
			collectionId: 'corsair-live',
			documentId: STAMP,
			fields: { n: { integerValue: '1' } },
		});
		const doc = await api.firestore.databases.documents.get({ name });
		expect(doc.fields?.n).toEqual({ integerValue: '1' });
		const results = await api.firestore.databases.documents.runQuery({
			parent: docs,
			structuredQuery: { from: [{ collectionId: 'corsair-live' }] },
		});
		expect(results.some((r) => r.document?.name === name)).toBe(true);
		await expect(
			api.firestore.databases.documents.delete({ name }),
		).resolves.toEqual({ success: true });
	});

	it('writes and reads a Realtime Database path', async () => {
		await api.database.set({
			databaseUrl,
			path: `corsair-live/${STAMP}`,
			data: { ok: true },
		});
		await expect(
			api.database.get({ databaseUrl, path: `corsair-live/${STAMP}` }),
		).resolves.toEqual({ ok: true });
		await api.database.delete({ databaseUrl, path: `corsair-live/${STAMP}` });
	});

	it('creates, looks up and deletes an Authentication user', async () => {
		const user = await api.auth.projects.accounts.create({
			targetProjectId: String(project),
			email: `corsair-${STAMP}@example.com`,
			password: 'correct-horse-battery-staple',
		});
		const found = await api.auth.projects.accounts.lookup({
			targetProjectId: String(project),
			localId: [String(user.localId)],
		});
		expect(found.users?.[0]?.email).toBe(`corsair-${STAMP}@example.com`);
		await api.auth.projects.accounts.delete({
			targetProjectId: String(project),
			localId: String(user.localId),
		});
	});
});
