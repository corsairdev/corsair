import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SIGNPATH_API_BASE, segment } from './client';
import {
	ArtifactConfigurations,
	AuditLog,
	Certificates,
	Organization,
	Projects,
	SigningPolicies,
	SigningRequests,
	Users,
} from './endpoints';
import {
	certificate,
	ORG_ID,
	project,
	projectDetail,
	signingPolicy,
	signingRequest,
	signingRequestListItem,
	signingRequestStatus,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'signpath-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

// unknown: negative cases pass values no schema accepts, so the input has no
// static type at this call boundary.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint(
		{ key: API_KEY, options: { organizationId: ORG_ID } } as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or XML, so the helper takes any.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'application/xml' : 'application/json',
			},
		}),
	);
}

function respondEmpty(status = 204) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

/** Flattens a FormData body so a test can assert on the fields SignPath reads. */
function formEntries(form: FormData): Record<string, string> {
	const entries: Record<string, string> = {};
	for (const [name, value] of form.entries()) {
		entries[name] =
			typeof value === 'string' ? value : `file:${(value as File).name}`;
	}
	return entries;
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		url: parsed.toString(),
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		allQuery: parsed.searchParams,
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized, either a
		// JSON string or a FormData instance for the multipart routes.
		body:
			init.body instanceof FormData
				? formEntries(init.body)
				: init.body
					? (JSON.parse(String(init.body)) as unknown) // unknown: parsed JSON
					: undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://app.signpath.io');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('organization.get', () => {
	it('GETs v1 Organizations path under the configured organization', async () => {
		respond({
			name: 'Acme GmbH',
			subscriptionType: 'Enterprise',
			quotas: {
				maxNumberOfActiveInteractiveUsers: { currentlyUsed: 3, quota: 10 },
				maxNumberOfActiveProjects: { currentlyUsed: 2, quota: 5 },
				maxNumberOfCertificates: { X509: { currentlyUsed: 1, quota: 2 } },
				yearlyMaxSizeOfArtifactsInBytes: { currentlyUsed: 1024 },
				yearlyMaxNumberOfIndividualSignatures: {
					currentlyUsed: 7,
					quota: 100,
				},
				releaseArtifactRetentionTime: '90.00:00:00',
				testArtifactRetentionTime: null,
				quotaPeriodStart: '2026-01-01',
				quotaPeriodEnd: '2026-12-31',
			},
		});

		const result = await invoke(Organization.get, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/Api/v1/${ORG_ID}/Organization`,
			body: undefined,
		});
		expect(result).toMatchObject({
			name: 'Acme GmbH',
			subscriptionType: 'Enterprise',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'signpath.organization.get',
			{ subscriptionType: 'Enterprise' },
			'completed',
		);
	});
});

describe('users.me', () => {
	it('GETs Users/Me and keeps the role and user type', async () => {
		respond({
			userId: '1a111111-1111-4111-8111-111111111111',
			name: 'CI',
			identity: null,
			accountEmailAddress: null,
			role: 'RegularUser',
			description: null,
			notificationEmailAddress: {
				unconfirmedEmail: null,
				confirmedEmail: 'ci@acme.test',
			},
			status: 'Active',
			isInvitationPending: null,
			isDirectorySynchronized: false,
			userType: 'CIUser',
		});

		const result = await invoke(Users.me, {});

		expect(lastRequest().path).toBe(`/Api/v1/${ORG_ID}/Users/Me`);
		expect(result).toMatchObject({ userType: 'CIUser', role: 'RegularUser' });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'signpath.users.me',
			{ userType: 'CIUser', role: 'RegularUser' },
			'completed',
		);
	});
});

describe('projects.list', () => {
	it('wraps the bare array SignPath returns', async () => {
		respond([project]);

		const result = await invoke(Projects.list, {});

		expect(lastRequest().path).toBe(`/Api/v1/${ORG_ID}/Projects`);
		expect(result).toEqual({ projects: [project] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'signpath.projects.list',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects a body that is not an array', async () => {
		respond({ projects: [] });

		await expect(invoke(Projects.list, {})).rejects.toThrow(
			'projects.list expected an array of projects from SignPath.',
		);
	});
});

describe('projects.get', () => {
	it('reads the project detail for the slug in the path', async () => {
		respond(projectDetail);

		const result = await invoke(Projects.get, { projectSlug: 'my-app' });

		expect(lastRequest().path).toBe(`/Api/v1/${ORG_ID}/Projects/my-app`);
		expect(result).toMatchObject({ slug: 'my-app', status: 'Valid' });
	});
});

describe('projects.create', () => {
	it('POSTs the JSON body and echoes the slug back', async () => {
		respondEmpty(201);

		const result = await invoke(Projects.create, {
			name: 'My App',
			slug: 'my-app',
			artifactConfigurationXml: '<artifact-configuration/>',
			repositoryUrls: ['https://github.com/acme/app'],
		});

		const sent = lastRequest();
		expect(sent).toMatchObject({
			method: 'POST',
			path: `/Api/v1/${ORG_ID}/Projects`,
		});
		expect(sent.headers.get('content-type')).toContain('application/json');
		expect(sent.body).toEqual({
			name: 'My App',
			slug: 'my-app',
			artifactConfigurationXml: '<artifact-configuration/>',
			repositoryUrls: ['https://github.com/acme/app'],
		});
		expect(result).toEqual({
			slug: 'my-app',
			created: true,
			artifactConfigurationXml: '<artifact-configuration/>',
		});
	});

	it('rejects a slug with characters SignPath does not allow', async () => {
		await expect(
			invoke(Projects.create, {
				name: 'My App',
				slug: 'my app!',
				artifactConfigurationXml: '<a/>',
			}),
		).rejects.toThrow(/Letters, digits, dot, underscore and hyphen/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('projects.update', () => {
	it('keeps projectSlug in the path and slug in the body', async () => {
		respondEmpty();

		await invoke(Projects.update, {
			projectSlug: 'old-slug',
			name: 'Renamed',
			slug: 'new-slug',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(`/Api/v1/${ORG_ID}/Projects/old-slug/Edit`);
		expect(sent.body).toEqual({ name: 'Renamed', slug: 'new-slug' });
	});

	it('throws when SignPath answers a body for a bodyless route', async () => {
		respond({ ok: true });

		await expect(
			invoke(Projects.update, {
				projectSlug: 'my-app',
				name: 'Renamed',
				slug: 'my-app',
			}),
		).rejects.toThrow(/documents this route as bodyless/);
	});
});

describe('projects.activate and projects.deactivate', () => {
	it('POSTs to the Activate route', async () => {
		respondEmpty();

		const result = await invoke(Projects.activate, { projectSlug: 'my-app' });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/Api/v1/${ORG_ID}/Projects/my-app/Activate`,
		});
		expect(result).toEqual({ projectSlug: 'my-app', success: true });
	});

	it('POSTs to the Deactivate route', async () => {
		respondEmpty();

		await invoke(Projects.deactivate, { projectSlug: 'my-app' });

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/Deactivate`,
		);
	});
});

describe('projects.setDefaultArtifactConfiguration', () => {
	it('POSTs the chosen configuration slug', async () => {
		respondEmpty();

		await invoke(Projects.setDefaultArtifactConfiguration, {
			projectSlug: 'my-app',
			artifactConfigurationSlug: 'v2',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/SetDefaultArtifactConfiguration`,
		);
		expect(sent.body).toEqual({ artifactConfigurationSlug: 'v2' });
	});
});

describe('signingPolicies', () => {
	it('GETs one policy under the project', async () => {
		respond(signingPolicy);

		const result = await invoke(SigningPolicies.get, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/SigningPolicies/release`,
		);
		expect(result).toMatchObject({ slug: 'release-signed', status: 'Valid' });
	});

	it('POSTs a new policy with every required body field', async () => {
		respondEmpty(201);

		const result = await invoke(SigningPolicies.create, {
			projectSlug: 'my-app',
			name: 'Release',
			slug: 'release',
			certificateSlug: 'codesign',
			submitterIds: ['2a222222-2222-4222-8222-222222222222'],
			disableMalwareScanning: false,
			purpose: 'ReleaseSigning',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(`/Api/v1/${ORG_ID}/Projects/my-app/SigningPolicies`);
		expect(sent.body).toEqual({
			name: 'Release',
			slug: 'release',
			certificateSlug: 'codesign',
			submitterIds: ['2a222222-2222-4222-8222-222222222222'],
			disableMalwareScanning: false,
			purpose: 'ReleaseSigning',
		});
		expect(result).toEqual({
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			created: true,
		});
	});

	it('rejects a policy with no submitters before sending', async () => {
		await expect(
			invoke(SigningPolicies.create, {
				projectSlug: 'my-app',
				name: 'Release',
				slug: 'release',
				certificateSlug: 'codesign',
				submitterIds: [],
				disableMalwareScanning: false,
				purpose: 'ReleaseSigning',
			}),
		).rejects.toThrow(/submitterIds/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('POSTs to Edit with the policy slug in the path', async () => {
		respondEmpty();

		await invoke(SigningPolicies.update, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			name: 'Release',
			slug: 'release',
			certificateSlug: 'codesign',
			submitterIds: ['2a222222-2222-4222-8222-222222222222'],
			disableMalwareScanning: true,
			purpose: 'ReleaseSigning',
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/SigningPolicies/release/Edit`,
		);
	});

	it('activates and deactivates the policy', async () => {
		respondEmpty();
		await invoke(SigningPolicies.activate, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
		});
		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/SigningPolicies/release/Activate`,
		);

		respondEmpty();
		await invoke(SigningPolicies.deactivate, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
		});
		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/SigningPolicies/release/Deactivate`,
		);
	});
});

describe('artifactConfigurations', () => {
	it('reads the XML as text', async () => {
		respond('<artifact-configuration/>');

		const result = await invoke(ArtifactConfigurations.getXml, {
			projectSlug: 'my-app',
			artifactConfigurationSlug: 'default',
		});

		expect(lastRequest()).toMatchObject({
			path: `/Api/v1/${ORG_ID}/Projects/my-app/ArtifactConfigurations/default/Xml`,
		});
		expect(lastRequest().headers.get('accept')).toContain('application/xml');
		expect(result).toEqual({
			projectSlug: 'my-app',
			artifactConfigurationSlug: 'default',
			xml: '<artifact-configuration/>',
		});
	});

	it('rejects an empty XML body rather than returning a blank document', async () => {
		respond('');

		await expect(
			invoke(ArtifactConfigurations.getXml, {
				projectSlug: 'my-app',
				artifactConfigurationSlug: 'default',
			}),
		).rejects.toThrow(/expected an XML document/);
	});

	it('POSTs the replacement XML', async () => {
		respondEmpty();

		await invoke(ArtifactConfigurations.updateXml, {
			projectSlug: 'my-app',
			artifactConfigurationSlug: 'default',
			artifactConfigurationXml: '<updated/>',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/ArtifactConfigurations/default/EditXml`,
		);
		expect(sent.body).toEqual({ artifactConfigurationXml: '<updated/>' });
	});

	it('activates and deactivates the configuration', async () => {
		respondEmpty();
		await invoke(ArtifactConfigurations.activate, {
			projectSlug: 'my-app',
			artifactConfigurationSlug: 'default',
		});
		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/ArtifactConfigurations/default/Activate`,
		);

		respondEmpty();
		await invoke(ArtifactConfigurations.deactivate, {
			projectSlug: 'my-app',
			artifactConfigurationSlug: 'default',
		});
		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/Projects/my-app/ArtifactConfigurations/default/Deactivate`,
		);
	});
});

describe('certificates', () => {
	it('wraps the bare certificate array', async () => {
		respond([certificate]);

		const result = await invoke(Certificates.list, {});

		expect(lastRequest().path).toBe(`/Api/v1/${ORG_ID}/Certificates`);
		expect(result).toEqual({ certificates: [certificate] });
	});

	it('rejects a body that is not an array', async () => {
		respond({ certificates: [] });

		await expect(invoke(Certificates.list, {})).rejects.toThrow(
			'certificates.list expected an array of certificates from SignPath.',
		);
	});

	it('reads one certificate by slug', async () => {
		respond(certificate);

		const result = await invoke(Certificates.get, {
			certificateSlug: 'codesign',
		});

		expect(lastRequest().path).toBe(`/Api/v1/${ORG_ID}/Certificates/codesign`);
		expect(result).toMatchObject({ slug: 'codesign', status: 'Valid' });
	});
});

describe('signingRequests.list', () => {
	it('sends every filter and keeps nextLink', async () => {
		respond({
			signingRequests: [signingRequestListItem],
			pagination: { nextLink: null },
		});

		const result = await invoke(SigningRequests.list, {
			projectSlug: 'my-app',
			signingRequestStatus: ['Completed', 'Failed'],
			submittedAfter: '2026-01-01T00:00:00Z',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(`/Api/v1/${ORG_ID}/SigningRequests`);
		expect(sent.allQuery.getAll('signingRequestStatus')).toEqual([
			'Completed',
			'Failed',
		]);
		expect(sent.query).toMatchObject({
			projectSlug: 'my-app',
			submittedAfter: '2026-01-01T00:00:00Z',
		});
		expect(result).toMatchObject({ pagination: { nextLink: null } });
	});

	it('follows a nextLink without resending the other filters', async () => {
		const nextLink = `${SIGNPATH_API_BASE}/v1/${ORG_ID}/SigningRequests?projectSlug=my-app&page=2`;
		respond({ signingRequests: [], pagination: { nextLink: null } });

		await invoke(SigningRequests.list, {
			projectSlug: 'other',
			nextLink,
		});

		const sent = lastRequest();
		expect(sent.path).toBe(`/Api/v1/${ORG_ID}/SigningRequests`);
		expect(sent.query).toEqual({ projectSlug: 'my-app', page: '2' });
	});

	it('rejects a nextLink for another organization', async () => {
		await expect(
			invoke(SigningRequests.list, {
				nextLink: `${SIGNPATH_API_BASE}/v1/other-org/SigningRequests?page=2`,
			}),
		).rejects.toThrow(/for this organization/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a nextLink that is not a SignPath API URL', async () => {
		await expect(
			invoke(SigningRequests.list, { nextLink: 'https://example.com/next' }),
		).rejects.toThrow(/needs the nextLink SignPath returned/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('signingRequests.get and getStatus', () => {
	it('reads the full request', async () => {
		respond(signingRequest);

		const result = await invoke(SigningRequests.get, {
			signingRequestId: signingRequest.signingRequestId,
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/${signingRequest.signingRequestId}`,
		);
		expect(result).toMatchObject({ status: 'Completed', isFinalStatus: true });
	});

	it('reads only the status', async () => {
		respond(signingRequestStatus);

		const result = await invoke(SigningRequests.getStatus, {
			signingRequestId: signingRequest.signingRequestId,
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/${signingRequest.signingRequestId}/Status`,
		);
		expect(result).toEqual(signingRequestStatus);
	});
});

describe('signingRequests.submitWithArtifact', () => {
	it('POSTs multipart fields with the artifact as a file part', async () => {
		respond(signingRequest);

		const artifact = Buffer.from('MZ signed payload');
		await invoke(SigningRequests.submitWithArtifact, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			artifactBase64: artifact.toString('base64'),
			artifactFileName: 'app.exe',
			description: 'v1.2.0',
			parameters: { productVersion: '1.2.0' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/SubmitWithArtifact`,
		);
		// The client sends no Content-Type: fetch adds multipart/form-data with
		// the boundary itself, and setting one here would omit the boundary.
		expect(sent.headers.get('content-type')).toBeNull();
		expect(sent.body).toEqual({
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			description: 'v1.2.0',
			'parameters.productVersion': '1.2.0',
			artifact: 'file:app.exe',
		});
	});

	it('rejects an empty artifact before sending', async () => {
		await expect(
			invoke(SigningRequests.submitWithArtifact, {
				projectSlug: 'my-app',
				signingPolicySlug: 'release',
				artifactBase64: '',
				artifactFileName: 'app.exe',
			}),
		).rejects.toThrow(/artifactBase64/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('signingRequests.submitWithArtifactRetrievalLink', () => {
	it('POSTs the retrieval link fields', async () => {
		respond(signingRequest);

		await invoke(SigningRequests.submitWithArtifactRetrievalLink, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			artifactUrl: 'https://builds.acme.test/app.exe',
			artifactFileName: 'app.exe',
			artifactSha256: 'a'.repeat(64),
			httpHeaders: { 'x-build-token': 'abc' },
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/SubmitWithArtifactRetrievalLink`,
		);
		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBeNull();
		expect(sent.body).toEqual({
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			'artifactRetrievalLink.url': 'https://builds.acme.test/app.exe',
			'artifactRetrievalLink.fileName': 'app.exe',
			'artifactRetrievalLink.sha256Hash': 'a'.repeat(64),
			'artifactRetrievalLink.httpHeaders.x-build-token': 'abc',
		});
	});

	it('rejects a hash that is not 64 characters', async () => {
		await expect(
			invoke(SigningRequests.submitWithArtifactRetrievalLink, {
				projectSlug: 'my-app',
				signingPolicySlug: 'release',
				artifactUrl: 'https://builds.acme.test/app.exe',
				artifactFileName: 'app.exe',
				artifactSha256: 'abc',
			}),
		).rejects.toThrow(/artifactSha256/);
	});
});

describe('signingRequests.submitWithoutArtifact', () => {
	it('POSTs the artifact metadata and returns the upload link', async () => {
		respond({
			...signingRequest,
			status: 'WaitingForArtifactUpload',
			isFinalStatus: false,
			uploadLink: 'https://app.signpath.io/upload/abc',
		});

		const result = await invoke(SigningRequests.submitWithoutArtifact, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			artifactId: 'app.exe',
			artifactSha256: 'b'.repeat(64),
		});

		const sent = lastRequest();
		expect(sent.path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/SubmitWithoutArtifact`,
		);
		expect(sent.body).toEqual({
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			'unsignedArtifactMetadata.fileName': 'app.exe',
			'unsignedArtifactMetadata.sha256Hash': 'b'.repeat(64),
		});
		expect(result).toMatchObject({
			status: 'WaitingForArtifactUpload',
			uploadLink: 'https://app.signpath.io/upload/abc',
		});
	});

	it('fails the parse when SignPath omits uploadLink', async () => {
		respond(signingRequest);

		await expect(
			invoke(SigningRequests.submitWithoutArtifact, {
				projectSlug: 'my-app',
				signingPolicySlug: 'release',
				artifactId: 'app.exe',
				artifactSha256: 'b'.repeat(64),
			}),
		).rejects.toThrow(/uploadLink/);
	});
});

describe('signingRequests.signHash', () => {
	it('POSTs hashSigningData and returns the signature', async () => {
		respond({
			signingRequestId: signingRequest.signingRequestId,
			hashSigningData: { hash: 'aGFzaA==' },
			hashSigningResult: { signature: 'c2ln' },
			webLink: 'https://app.signpath.io/Web/abc',
		});

		const result = await invoke(SigningRequests.signHash, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			hash: 'aGFzaA==',
			signatureAlgorithm: 'Rsa',
			rsaOptions: { paddingMode: 'Pkcs1', hashAlgorithmName: 'Sha256' },
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/SignHash`,
		);
		expect(lastRequest().body).toEqual({
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			hashSigningData: {
				hash: 'aGFzaA==',
				signatureAlgorithm: 'Rsa',
				rsaOptions: { paddingMode: 'Pkcs1', hashAlgorithmName: 'Sha256' },
			},
		});
		expect(result).toMatchObject({ hashSigningResult: { signature: 'c2ln' } });
	});

	it('rejects Rsa without rsaOptions before sending', async () => {
		await expect(
			invoke(SigningRequests.signHash, {
				projectSlug: 'my-app',
				signingPolicySlug: 'release',
				hash: 'aGFzaA==',
				signatureAlgorithm: 'Rsa',
			}),
		).rejects.toThrow(/rsaOptions is required/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('signingRequests.signMessage', () => {
	it('POSTs signingData for PureMldsa', async () => {
		respond({
			signingRequestId: signingRequest.signingRequestId,
			signingData: { message: 'aGVsbG8=' },
			signingResult: { signature: 'c2ln' },
			webLink: 'https://app.signpath.io/Web/abc',
		});

		await invoke(SigningRequests.signMessage, {
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			message: 'aGVsbG8=',
			signatureAlgorithm: 'PureMldsa',
		});

		expect(lastRequest().body).toEqual({
			projectSlug: 'my-app',
			signingPolicySlug: 'release',
			signingData: { message: 'aGVsbG8=', signatureAlgorithm: 'PureMldsa' },
		});
	});

	it('rejects any algorithm other than PureMldsa', async () => {
		await expect(
			invoke(SigningRequests.signMessage, {
				projectSlug: 'my-app',
				signingPolicySlug: 'release',
				message: 'aGVsbG8=',
				signatureAlgorithm: 'Rsa',
			}),
		).rejects.toThrow(/signatureAlgorithm/);
	});
});

describe('signingRequests.resubmit', () => {
	const NEW_ID = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

	it('POSTs the resubmit body and returns the new id from Location', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(null, {
				status: 201,
				headers: {
					Location: `${SIGNPATH_API_BASE}/v1/${ORG_ID}/SigningRequests/${NEW_ID}`,
				},
			}),
		);

		const result = await invoke(SigningRequests.resubmit, {
			originalSigningRequestId: signingRequest.signingRequestId,
			signingPolicySlug: 'release',
			description: 'promote to release',
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/Resubmit`,
		);
		expect(lastRequest().body).toEqual({
			originalSigningRequestId: signingRequest.signingRequestId,
			signingPolicySlug: 'release',
			description: 'promote to release',
		});
		expect(result).toEqual({
			signingRequestId: NEW_ID,
			originalSigningRequestId: signingRequest.signingRequestId,
			signingPolicySlug: 'release',
			resubmitted: true,
		});
	});

	it('returns a null id when SignPath sends no Location', async () => {
		respondEmpty(201);

		const result = await invoke(SigningRequests.resubmit, {
			originalSigningRequestId: signingRequest.signingRequestId,
			signingPolicySlug: 'release',
		});

		expect(result).toMatchObject({ signingRequestId: null, resubmitted: true });
	});
});

describe('signingRequests.cancel, approve and deny', () => {
	it('POSTs Cancel', async () => {
		respondEmpty();

		const result = await invoke(SigningRequests.cancel, {
			signingRequestId: signingRequest.signingRequestId,
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/${signingRequest.signingRequestId}/Cancel`,
		);
		expect(result).toEqual({
			signingRequestId: signingRequest.signingRequestId,
			success: true,
		});
	});

	it('POSTs Approve', async () => {
		respondEmpty();

		await invoke(SigningRequests.approve, {
			signingRequestId: signingRequest.signingRequestId,
		});

		expect(lastRequest().path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/${signingRequest.signingRequestId}/Approve`,
		);
	});

	it('POSTs Deny with the reason', async () => {
		respondEmpty();

		await invoke(SigningRequests.deny, {
			signingRequestId: signingRequest.signingRequestId,
			denyReason: 'wrong build',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(
			`/Api/v1/${ORG_ID}/SigningRequests/${signingRequest.signingRequestId}/Deny`,
		);
		expect(sent.body).toEqual({ denyReason: 'wrong build' });
	});
});

describe('auditLog', () => {
	it('GETs the v1-pre events route', async () => {
		respond({
			auditLogEvents: [
				{
					metadata: {
						eventName: 'SigningRequestSubmitted',
						eventVersion: 1,
						organizationId: ORG_ID,
						entityId: signingRequest.signingRequestId,
						timestamp: '2026-02-01T10:00:00Z',
						actor: {
							id: '1a111111-1111-4111-8111-111111111111',
							type: 'CIUser',
							identity: null,
							name: 'CI',
						},
					},
					entityMetadata: {},
					data: {},
				},
			],
			pagination: { nextCursor: 'next', nextLink: null },
		});

		const result = await invoke(AuditLog.listEvents, {
			startTime: '2026-01-01T00:00:00Z',
		});

		const sent = lastRequest();
		expect(sent.path).toBe(`/Api/v1-pre/${ORG_ID}/AuditLog/Events`);
		expect(sent.query).toEqual({ startTime: '2026-01-01T00:00:00Z' });
		expect(result).toMatchObject({
			pagination: { nextCursor: 'next' },
		});
	});

	it('GETs the v1-pre signing request events route', async () => {
		respond({
			auditLogEvents: [],
			pagination: { nextCursor: null, nextLink: null },
		});

		await invoke(AuditLog.listSigningRequestEvents, { cursor: 'abc' });

		expect(lastRequest().path).toBe(
			`/Api/v1-pre/${ORG_ID}/AuditLog/SigningRequestEvents`,
		);
		expect(lastRequest().query).toEqual({ cursor: 'abc' });
	});
});

describe('client', () => {
	it('lets core ApiError through with the problem body and status', async () => {
		respond(
			{
				type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
				title: 'Bad Request',
				status: 400,
				detail: "Project 'my-app' already exists.",
				traceId: 'trace-1',
			},
			400,
		);

		const error = await invoke(Projects.list, {}).catch(
			(caught: unknown) => caught, // unknown: rejection reason, narrowed below
		);

		expect(error).toBeInstanceOf(ApiError);
		const failure = error as ApiError;
		expect(failure.status).toBe(400);
		expect(failure.body).toMatchObject({
			detail: "Project 'my-app' already exists.",
			traceId: 'trace-1',
		});
		expect(JSON.stringify(failure.request)).not.toContain(API_KEY);
	});

	it('rejects a keyless call before any request', async () => {
		const { AuthMissingError } = jest.requireActual('corsair/core');

		await expect(
			Projects.list({ key: '', options: {} } as never, {} as never),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('encodes a path segment', () => {
		expect(segment('a b/c')).toBe('a%20b%2Fc');
	});
});
