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
 * On a real project it first runs the control plane, which works on a new
 * Spark (free) project with no setup: project and web app management, a
 * Hosting site and version, a Rules ruleset, Remote Config (validate only)
 * and FCM (validate only), each created and deleted again. Then it writes and
 * deletes one Firestore document and one Realtime Database path, and creates
 * and deletes one Authentication user; each of those three runs only when the
 * project has that product turned on (Firestore and Realtime Database
 * created, Authentication started in the console) and says so otherwise.
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

const live = !emulator && ready;
/** Why a product can't run in this project, or undefined when it can. */
function notSetUp(error: unknown): string | undefined {
	const message = error instanceof Error ? error.message : String(error);
	if (/has not been used in project|is disabled/.test(message)) {
		return message.slice(0, 120);
	}
	if (/CONFIGURATION_NOT_FOUND/.test(message)) {
		return 'Authentication has not been started in the console';
	}
	return undefined;
}

describeIfLive('firebase live', () => {
	jest.setTimeout(120_000);
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
	const projectName = `projects/${project}`;
	const docs = `${projectName}/databases/(default)/documents`;
	let databaseUrl = `https://${project}-default-rtdb.firebaseio.com`;
	const skip = (product: string, why: string) =>
		console.warn(`Firebase live: ${product} skipped: ${why}`);

	(live ? it : it.skip)(
		'manages the project, a web app, Hosting, Rules, Remote Config and FCM',
		async () => {
			// Everything created is undone at the end, even after a failure
			// (a project has at most 36 Hosting sites); one failed cleanup
			// doesn't stop the others.
			const cleanup: Array<() => Promise<unknown>> = [];
			try {
				const info = await api.management.projects.get({ name: projectName });
				expect(info.projectId).toBe(project);
				const sdk = await api.management.projects.getAdminSdkConfig({
					name: `${projectName}/adminSdkConfig`,
				});
				expect(sdk.projectId).toBe(project);

				const op = await api.management.webApps.create({
					parent: projectName,
					displayName: `corsair-live-${STAMP}`,
				});
				let appName: string | undefined;
				for (let i = 0; i < 15 && op.name && !appName; i++) {
					const done = await api.management.operations.get({ name: op.name });
					if (done.done) appName = String(done.response?.name);
					else await new Promise((resolve) => setTimeout(resolve, 2000));
				}
				expect(appName).toMatch(/\/webApps\//);
				const app = String(appName);
				let appRemoved = false;
				cleanup.push(() =>
					appRemoved
						? Promise.resolve()
						: api.management.webApps.remove({ name: app, immediate: true }),
				);
				const config = await api.management.webApps.getConfig({
					name: `${app}/config`,
				});
				expect(config.projectId).toBe(project);
				await api.management.webApps.patch({
					name: app,
					updateMask: 'displayName',
					displayName: `corsair-live-${STAMP}-2`,
				});
				await api.management.webApps.remove({ name: app, immediate: true });
				appRemoved = true;

				const site = await api.hosting.sites.create({
					parent: projectName,
					siteId: `corsair-live-${STAMP}`,
				});
				const siteName = String(site.name);
				let siteDeleted = false;
				cleanup.push(() =>
					siteDeleted
						? Promise.resolve()
						: api.hosting.sites.delete({ name: siteName }),
				);
				const version = await api.hosting.sites.versions.create({
					parent: siteName,
					config: {
						headers: [{ glob: '**', headers: { 'X-Corsair': 'live' } }],
					},
				});
				expect(version.status).toBe('CREATED');
				await api.hosting.sites.versions.delete({ name: String(version.name) });
				await expect(
					api.hosting.sites.delete({ name: siteName }),
				).resolves.toEqual({ success: true });
				siteDeleted = true;

				const ruleset = await api.rules.rulesets.create({
					name: projectName,
					source: {
						files: [
							{
								name: 'storage.rules',
								content:
									"rules_version = '2';\nservice firebase.storage { match /b/{bucket}/o { match /{all=**} { allow read, write: if false; } } }",
							},
						],
					},
				});
				let rulesetDeleted = false;
				cleanup.push(() =>
					rulesetDeleted
						? Promise.resolve()
						: api.rules.rulesets.delete({ name: String(ruleset.name) }),
				);
				expect(ruleset.metadata?.services).toContain('firebase.storage');
				await api.rules.rulesets.delete({ name: String(ruleset.name) });
				rulesetDeleted = true;

				const template = await api.remoteConfig.projects.getRemoteConfig({
					project: projectName,
				});
				expect(template.etag).toBeTruthy();
				const draft = await api.remoteConfig.projects.updateRemoteConfig({
					project: projectName,
					ifMatch: String(template.etag),
					validateOnly: true,
					parameters: { corsair_live: { defaultValue: { value: 'on' } } },
				});
				expect(draft.parameters?.corsair_live).toBeDefined();

				// validateOnly: FCM checks the message and delivers nothing.
				const sent = await api.messaging.messages.send({
					parent: projectName,
					validateOnly: true,
					message: {
						topic: 'corsair-live',
						notification: { title: 'Live run' },
					},
				});
				expect(sent.name).toContain(`${projectName}/messages/`);
			} finally {
				for (const undo of cleanup.reverse()) {
					await undo().catch((error: unknown) =>
						console.warn('Firebase live: cleanup failed', error),
					);
				}
			}
		},
	);

	it('writes, reads, queries and deletes a Firestore document', async () => {
		if (live) {
			try {
				const databases = await api.firestore.databases.list({
					parent: projectName,
				});
				const hasDefault = (databases.databases ?? []).some(
					(database) => database.name === `${projectName}/databases/(default)`,
				);
				if (!hasDefault) {
					return skip('Firestore', 'the project has no (default) database');
				}
			} catch (error) {
				const why = notSetUp(error);
				if (why) return skip('Firestore', why);
				throw error;
			}
		}
		const name = `${docs}/corsair-live/${STAMP}`;
		await api.firestore.databases.documents.createDocument({
			parent: docs,
			collectionId: 'corsair-live',
			documentId: STAMP,
			fields: { n: { integerValue: '1' } },
		});
		let deleted = false;
		try {
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
			deleted = true;
		} finally {
			if (!deleted) {
				await api.firestore.databases.documents
					.delete({ name })
					.catch(() => {});
			}
		}
	});

	it('writes and reads a Realtime Database path', async () => {
		if (live) {
			try {
				const found = await api.databaseInstances.locations.instances.list({
					parent: `${projectName}/locations/-`,
				});
				const instance = found.instances?.find(
					(candidate) => candidate.type === 'DEFAULT_DATABASE',
				);
				if (!instance?.databaseUrl) {
					return skip('Realtime Database', 'the project has no database yet');
				}
				databaseUrl = instance.databaseUrl;
			} catch (error) {
				const why = notSetUp(error);
				if (why) return skip('Realtime Database', why);
				throw error;
			}
		}
		const path = `corsair-live/${STAMP}`;
		await api.database.set({ databaseUrl, path, data: { ok: true } });
		try {
			await expect(api.database.get({ databaseUrl, path })).resolves.toEqual({
				ok: true,
			});
		} finally {
			await api.database.delete({ databaseUrl, path });
		}
	});

	it('creates, looks up and deletes an Authentication user', async () => {
		if (live) {
			try {
				await api.authAdmin.projects.getConfig({
					name: `${projectName}/config`,
				});
			} catch (error) {
				const why = notSetUp(error);
				if (why) return skip('Authentication', why);
				throw error;
			}
		}
		const user = await api.auth.projects.accounts.create({
			targetProjectId: String(project),
			email: `corsair-${STAMP}@example.com`,
			password: 'correct-horse-battery-staple',
		});
		try {
			const found = await api.auth.projects.accounts.lookup({
				targetProjectId: String(project),
				localId: [String(user.localId)],
			});
			expect(found.users?.[0]?.email).toBe(`corsair-${STAMP}@example.com`);
		} finally {
			await api.auth.projects.accounts.delete({
				targetProjectId: String(project),
				localId: String(user.localId),
			});
		}
	});
});
