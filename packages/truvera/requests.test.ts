import {
	CredentialsEndpoints,
	DidsEndpoints,
	JobsEndpoints,
	ProfilesEndpoints,
	RegistriesEndpoints,
	SchemasEndpoints,
	VerifyEndpoints,
} from './endpoints';
import {
	createdDid,
	createdRegistry,
	createdSchema,
	credentialMetadata,
	deleted,
	didDocument,
	getDidEnvelope,
	job,
	profile,
	registry,
	revocationStatus,
	schema,
	signedCredential,
	verificationResult,
} from './test-fixtures';
import { captureError, DID, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the parsed request body, when there is one.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.truvera.io');
	expect(sent.headers.get('authorization')).toBe('Bearer tv-test-key');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('dids', () => {
	it('dids.list GETs v1/dids', async () => {
		respond([didDocument]);

		const result = (await invoke(DidsEndpoints.list, {})) as unknown[];

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ path: '/dids', method: 'GET' });
		expect(result).toHaveLength(1);
	});

	it('lists page with offset and limit', async () => {
		for (const [endpoint, path] of [
			[DidsEndpoints.list, '/dids'],
			[ProfilesEndpoints.list, '/profiles'],
			[SchemasEndpoints.list, '/schemas'],
			[RegistriesEndpoints.list, '/registries'],
		] as const) {
			respond([]);
			await invoke(endpoint, { offset: 64, limit: 10 });
			expect(lastRequest().path).toBe(path);
			expect(lastRequest().params).toEqual({ offset: '64', limit: '10' });
		}
	});

	it('dids.create POSTs the camelCase body', async () => {
		respond(createdDid);

		const result = (await invoke(DidsEndpoints.create, {
			type: 'cheqd',
			key_type: 'ed25519',
			include_didcomm_service: true,
		})) as { did?: string | null };

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toEqual({
			type: 'cheqd',
			keyType: 'ed25519',
			includeDidcommService: true,
		});
		expect(result.did).toBe(DID);
	});

	it('dids.get GETs the DID document', async () => {
		respond(getDidEnvelope);

		const result = (await invoke(DidsEndpoints.get, { did: DID })) as {
			didDocument?: { id?: string | null };
		};

		expectAuthenticated();
		expect(decodeURIComponent(lastRequest().path)).toBe(`/dids/${DID}`);
		expect(result.didDocument?.id).toBe(DID);
	});

	it('dids.getMetadata GETs the metadata route', async () => {
		respond(getDidEnvelope.didDocumentMetadata);

		await invoke(DidsEndpoints.getMetadata, { did: DID });

		expectAuthenticated();
		expect(decodeURIComponent(lastRequest().path)).toBe(
			`/dids/${DID}/metadata`,
		);
	});

	it('dids.delete DELETEs the DID', async () => {
		respond(deleted);

		await invoke(DidsEndpoints.delete, { did: DID });

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
		expect(decodeURIComponent(lastRequest().path)).toBe(`/dids/${DID}`);
	});

	it('dids.get rejects a value that is not a DID', async () => {
		const error = await captureError(
			invoke(DidsEndpoints.get, { did: 'short' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('profiles', () => {
	it('profiles.list GETs v1/profiles', async () => {
		respond([profile]);

		expect(await invoke(ProfilesEndpoints.list, {})).toHaveLength(1);

		expectAuthenticated();
		expect(lastRequest().path).toBe('/profiles');
	});

	it('profiles.create POSTs the DID and the name Truvera requires', async () => {
		respond(profile);

		await invoke(ProfilesEndpoints.create, { did: DID, name: 'Acme Issuer' });

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toEqual({ did: DID, name: 'Acme Issuer' });
	});

	it('profiles.get GETs one profile by DID', async () => {
		respond(profile);

		const result = (await invoke(ProfilesEndpoints.get, { did: DID })) as {
			did?: string | null;
		};

		expectAuthenticated();
		expect(lastRequest().method).toBe('GET');
		expect(decodeURIComponent(lastRequest().path)).toBe(`/profiles/${DID}`);
		expect(result.did).toBe(profile.did);
	});

	it('profiles.create and update refuse a call without a name', async () => {
		// Live: "did and name properties are required".
		for (const endpoint of [
			ProfilesEndpoints.create,
			ProfilesEndpoints.update,
		]) {
			const error = await captureError(invoke(endpoint, { did: DID }));
			expect((error as Error).name).toBe('ZodError');
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('profiles.update PATCHes the fields it was given', async () => {
		respond(profile);

		await invoke(ProfilesEndpoints.update, {
			did: DID,
			name: 'Truvera Issuer',
			email: 'issuer@acme.com',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PATCH');
		expect(decodeURIComponent(lastRequest().path)).toBe(`/profiles/${DID}`);
		expect(lastRequest().body).toEqual({
			did: DID,
			name: 'Truvera Issuer',
			email: 'issuer@acme.com',
		});
	});

	it('profiles.update rejects a non-email address', async () => {
		const error = await captureError(
			invoke(ProfilesEndpoints.update, { did: DID, email: 'nope' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('profiles.delete accepts the documented empty 200', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await expect(
			invoke(ProfilesEndpoints.delete, { did: DID }),
		).resolves.toBeUndefined();
		expect(lastRequest().method).toBe('DELETE');
	});

	it('profiles.delete DELETEs the profile', async () => {
		respond(deleted);

		await invoke(ProfilesEndpoints.delete, { did: DID });

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
	});
});

describe('credentials', () => {
	it('credentials.issue POSTs the credential and distribution fields', async () => {
		respond(signedCredential);

		const result = (await invoke(CredentialsEndpoints.issue, {
			credential: {
				name: 'Basic Credential',
				issuer: DID,
				type: ['BasicCredential'],
				subject: { id: 'did:key:z6Mkq...', name: 'A. Holder' },
			},
			revocable: true,
			format: 'jsonld',
			recipient_email: 'holder@acme.com',
			distribute: true,
		})) as { id?: string | null; type?: string[] | null };

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().path).toBe('/credentials');
		const body = lastRequest().body as Record<string, unknown>;
		expect(body.revocable).toBe(true);
		expect(body.format).toBe('jsonld');
		expect(body.recipientEmail).toBe('holder@acme.com');
		expect(body.distribute).toBe(true);
		expect((body.credential as Record<string, unknown>).issuer).toBe(DID);
		expect(result.id).toContain('creds.truvera.io');
	});

	it('credentials.issue rejects persist without a password', async () => {
		const error = await captureError(
			invoke(CredentialsEndpoints.issue, {
				credential: { issuer: DID },
				persist: true,
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('credentials.issue rejects distribute with no recipient', async () => {
		const error = await captureError(
			invoke(CredentialsEndpoints.issue, {
				credential: { issuer: DID },
				distribute: true,
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('credentials.issue accepts array claims and a holder DID in the subject for distribution', async () => {
		respond(signedCredential);

		await invoke(CredentialsEndpoints.issue, {
			credential: {
				issuer: DID,
				subject: { id: 'did:key:z6MkHolder', skills: ['TypeScript', 'Go'] },
			},
			distribute: true,
		});

		const body = lastRequest().body as {
			credential: { subject: { skills: string[] } };
		};
		expect(body.credential.subject.skills).toEqual(['TypeScript', 'Go']);
	});

	it('credentials.issue accepts persist with a password', async () => {
		respond(signedCredential);

		await invoke(CredentialsEndpoints.issue, {
			credential: { issuer: DID },
			persist: true,
			password: 'secret123',
		});

		expect((lastRequest().body as Record<string, unknown>).persist).toBe(true);
	});

	it('credentials.list GETs with paging and the subject filter', async () => {
		respond([credentialMetadata]);

		await invoke(CredentialsEndpoints.list, {
			offset: 0,
			limit: 64,
			subject_id: 'did:example:holder',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/credentials');
		expect(lastRequest().params).toEqual({
			offset: '0',
			limit: '64',
			subjectId: 'did:example:holder',
		});
	});

	it('credentials.list rejects a limit above the documented 100', async () => {
		const error = await captureError(
			invoke(CredentialsEndpoints.list, { limit: 101 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('credentials.get GETs one credential', async () => {
		respond(credentialMetadata);

		const result = (await invoke(CredentialsEndpoints.get, {
			credential_id: 'https://creds.truvera.io/1234',
		})) as { revoked?: boolean | null };

		expectAuthenticated();
		expect(decodeURIComponent(lastRequest().path)).toBe(
			'/credentials/https://creds.truvera.io/1234',
		);
		expect(result.revoked).toBe(false);
	});

	it('credentials.revoke POSTs to the revoke route', async () => {
		respond(deleted);

		await invoke(CredentialsEndpoints.revoke, {
			credential_id: 'https://creds.truvera.io/1234',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(decodeURIComponent(lastRequest().path)).toBe(
			'/credentials/https://creds.truvera.io/1234/revoke',
		);
	});

	it('credentials.unrevoke POSTs to the unrevoke route', async () => {
		respond(deleted);

		await invoke(CredentialsEndpoints.unrevoke, {
			credential_id: 'https://creds.truvera.io/1234',
		});

		expectAuthenticated();
		expect(decodeURIComponent(lastRequest().path)).toContain('/unrevoke');
	});

	it('credentials.delete accepts the empty 200 the API sends', async () => {
		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));

		await expect(
			invoke(CredentialsEndpoints.delete, {
				credential_id: 'https://creds.truvera.io/1234',
			}),
		).resolves.toBeUndefined();
	});

	it('credentials.delete DELETEs the metadata', async () => {
		respond(deleted);

		await invoke(CredentialsEndpoints.delete, {
			credential_id: 'https://creds.truvera.io/1234',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
	});
});

describe('schemas', () => {
	it('schemas.create POSTs the JSON schema', async () => {
		respond(createdSchema);

		const result = (await invoke(SchemasEndpoints.create, {
			name: 'Basic Credential',
			description: 'A name on a credential',
			type: 'object',
			properties: { name: { type: 'string' } },
			required: ['name'],
			additional_properties: false,
		})) as { id?: string | null; data?: { schema?: { $id?: string } } };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/schemas');
		const body = lastRequest().body as Record<string, unknown>;
		expect(body.name).toBe('Basic Credential');
		expect(body.additionalProperties).toBe(false);
		// The answer is the job plus the new schema, whose id is its $id.
		expect(result.id).toBe('0');
		expect(result.data?.schema?.$id).toContain('CorsairPluginTest');
	});

	it('schemas.list GETs the schema list', async () => {
		respond([schema]);

		expect(await invoke(SchemasEndpoints.list, {})).toHaveLength(1);

		expectAuthenticated();
		expect(lastRequest().path).toBe('/schemas');
	});

	it('schemas.get GETs one schema', async () => {
		respond(schema);

		await invoke(SchemasEndpoints.get, {
			schema_id: 'https://acme.com/schemas/basic-credential.json',
		});

		expectAuthenticated();
		expect(decodeURIComponent(lastRequest().path)).toContain('/schemas/');
	});

	it('schemas.delete DELETEs the schema', async () => {
		respond(deleted);

		await invoke(SchemasEndpoints.delete, { schema_id: 'schema-1' });

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
		expect(lastRequest().path).toBe('/schemas/schema-1');
	});
});

describe('registries', () => {
	it('registries.create POSTs the registry body', async () => {
		respond(createdRegistry);

		const result = (await invoke(RegistriesEndpoints.create, {
			type: 'dock',
			add_only: true,
		})) as { id?: string | null; data?: { id?: string } };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/registries');
		expect(lastRequest().body).toEqual({ type: 'dock', addOnly: true });
		// `id` is the job; the registry id is `data.id`.
		expect(result.id).toBe('75841');
		expect(result.data?.id).toBe(registry.id);
	});

	it('registries.get GETs one registry in the live shape', async () => {
		respond(registry);

		const result = (await invoke(RegistriesEndpoints.get, {
			registry_id: registry.id,
		})) as { registry_type?: string | null };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/registries/${registry.id}`,
		});
		expect(result.registry_type).toBe('StatusList2021Entry');
	});

	it('registries.list GETs the registry list', async () => {
		respond([registry]);

		expect(await invoke(RegistriesEndpoints.list, {})).toHaveLength(1);

		expectAuthenticated();
		expect(lastRequest().path).toBe('/registries');
	});

	it('registries.revoke POSTs the action and the credentials', async () => {
		respond(deleted);

		await invoke(RegistriesEndpoints.revoke, {
			registry_id: registry.id,
			credential_ids: ['index-1', 'index-2'],
			action: 'revoke',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().path).toBe(
			`/registries/${encodeURIComponent(registry.id)}`,
		);
		expect(lastRequest().body).toEqual({
			action: 'revoke',
			credentialIds: ['index-1', 'index-2'],
		});
	});

	it('registries.revoke rejects an unknown action', async () => {
		const error = await captureError(
			invoke(RegistriesEndpoints.revoke, {
				registry_id: registry.id,
				credential_ids: ['index-1'],
				action: 'suspend',
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('registries.revoke rejects an empty credential list', async () => {
		const error = await captureError(
			invoke(RegistriesEndpoints.revoke, {
				registry_id: registry.id,
				credential_ids: [],
				action: 'revoke',
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('registries.revocationStatus reads the boolean type the API answers', async () => {
		respond({ type: false });

		const result = (await invoke(RegistriesEndpoints.revocationStatus, {
			registry_id: 'reg-1',
			revocation_id: '0',
		})) as { type?: boolean | string | null };

		expect(result.type).toBe(false);
	});

	it('registries.revocationStatus GETs the status route', async () => {
		respond(revocationStatus);

		const result = (await invoke(RegistriesEndpoints.revocationStatus, {
			registry_id: 'reg-1',
			revocation_id: '42',
		})) as { revoked?: boolean | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/revocationStatus/reg-1/42');
		expect(result.revoked).toBe(true);
	});

	it('registries.delete DELETEs the registry', async () => {
		respond(deleted);

		await invoke(RegistriesEndpoints.delete, { registry_id: 'reg-1' });

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
	});
});

describe('verify and jobs', () => {
	it('verify POSTs the credential', async () => {
		respond(verificationResult);

		const result = (await invoke(VerifyEndpoints.verify, {
			credential: signedCredential,
		})) as { verified?: boolean | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/verify');
		expect(lastRequest().method).toBe('POST');
		expect(result.verified).toBe(true);
	});

	it('verify parses a failed verification as a successful call', async () => {
		respond({ verified: false, errors: [{ reason: 'expired' }] });

		const result = (await invoke(VerifyEndpoints.verify, {
			credential: signedCredential,
		})) as { verified?: boolean | null; errors?: unknown[] };

		expect(result.verified).toBe(false);
		expect(result.errors).toHaveLength(1);
	});

	it('jobs.get GETs the job', async () => {
		respond(job);

		const result = (await invoke(JobsEndpoints.get, { job_id: 'job-123' })) as {
			status?: string | null;
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/jobs/job-123');
		expect(result.status).toBe('succeeded');
	});
});
