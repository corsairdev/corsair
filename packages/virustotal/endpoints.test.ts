import { logEventFromContext } from 'corsair/core';
import { urlId, VirustotalAPIError } from './client';
import { Analyses, Comments, Domains, Files, Urls } from './endpoints';
import {
	analysis,
	analysisDescriptor,
	analysisId,
	analysisQueued,
	comment,
	commentsLastPage,
	commentsPage,
	domain,
	file,
	fileId,
	invalidKey,
	ip,
	notFound,
	url,
	urlId as urlIdentifier,
	vote,
	votesPage,
} from './test-fixtures';
import {
	expectAuthenticated,
	installFetchMock,
	invoke,
	lastRequest,
	respond,
	respondEmpty,
} from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const fetchMock = installFetchMock();

beforeEach(() => {
	mockLog.mockClear();
});

describe('files', () => {
	it('reads a file report by hash', async () => {
		respond(fetchMock, file);

		const result = await invoke(Files.get, { id: fileId });

		expect(result).toEqual(file);
		expectAuthenticated(fetchMock);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(`/api/v3/files/${fileId}`);
	});

	it('exposes the engine tally, which is what a caller acts on', async () => {
		respond(fetchMock, file);

		const result = (await invoke(Files.get, { id: fileId })) as {
			data?: { attributes?: { last_analysis_stats?: { malicious?: number } } };
		};

		expect(result.data?.attributes?.last_analysis_stats?.malicious).toBe(47);
	});

	it('logs the malicious count and the size', async () => {
		respond(fetchMock, file);

		await invoke(Files.get, { id: fileId });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'virustotal.files.get',
			{ id: fileId, malicious: 47, size: 38_912 },
			'completed',
		);
	});

	it('asks for relationships', async () => {
		respond(fetchMock, file);

		await invoke(Files.get, { id: fileId, relationships: 'behaviours' });

		expect(lastRequest(fetchMock).query.relationships).toBe('behaviours');
	});

	it('rescans a file, answering an analysis id', async () => {
		respond(fetchMock, analysisDescriptor);

		const result = await invoke(Files.rescan, { id: fileId });

		expect(result).toEqual(analysisDescriptor);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/api/v3/files/${fileId}/analyse`);
		expect(sent.rawBody).toBeUndefined();
	});

	it('lists the comments on a file', async () => {
		respond(fetchMock, commentsPage);

		const result = await invoke(Files.comments, { id: fileId, limit: 10 });

		expect(result).toEqual(commentsPage);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe(`/api/v3/files/${fileId}/comments`);
		expect(sent.query.limit).toBe('10');
	});

	it('reports whether more comments remain from the cursor', async () => {
		respond(fetchMock, commentsLastPage);

		await invoke(Files.comments, { id: fileId });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'virustotal.files.comments',
			{ count: 1, hasMore: false },
			'completed',
		);
	});

	it('posts a comment in the JSON:API envelope the docs show', async () => {
		respond(fetchMock, comment);

		await invoke(Files.addComment, { id: fileId, text: '#malware seen today' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/api/v3/files/${fileId}/comments`);
		expect(sent.body).toEqual({
			data: { type: 'comment', attributes: { text: '#malware seen today' } },
		});
	});

	it('rejects an empty comment', async () => {
		await expect(
			invoke(Files.addComment, { id: fileId, text: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('lists votes on a file', async () => {
		respond(fetchMock, votesPage);

		const result = await invoke(Files.votes, { id: fileId });

		expect(result).toEqual(votesPage);
		expect(lastRequest(fetchMock).path).toBe(`/api/v3/files/${fileId}/votes`);
	});

	it('votes harmless, sending the verdict in the envelope', async () => {
		respond(fetchMock, vote);

		await invoke(Files.vote, { id: fileId, verdict: 'harmless' });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe(`/api/v3/files/${fileId}/votes`);
		expect(sent.body).toEqual({
			data: { type: 'vote', attributes: { verdict: 'harmless' } },
		});
	});

	it('rejects a verdict that is neither malicious nor harmless', async () => {
		await expect(
			invoke(Files.vote, { id: fileId, verdict: 'maybe' }),
		).rejects.toThrow();
	});

	it('surfaces a bad key as a VirustotalAPIError', async () => {
		respond(fetchMock, invalidKey, 401);

		await expect(invoke(Files.get, { id: fileId })).rejects.toBeInstanceOf(
			VirustotalAPIError,
		);
	});

	it('surfaces a missing file as not found', async () => {
		respond(fetchMock, notFound, 404);

		const error = (await invoke(Files.get, { id: 'unknown' }).catch(
			(thrown: unknown) => thrown,
		)) as VirustotalAPIError;

		expect(error.isNotFound).toBe(true);
	});
});

describe('urls', () => {
	it('scans a URL with a form body, the one route that is not JSON', async () => {
		respond(fetchMock, analysisDescriptor);

		const result = await invoke(Urls.scan, {
			url: 'https://acme.example/login',
		});

		expect(result).toEqual(analysisDescriptor);
		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/v3/urls');
		expect(sent.headers['content-type']).toContain(
			'application/x-www-form-urlencoded',
		);
		expect(sent.rawBody).toBe('url=https%3A%2F%2Facme.example%2Flogin');
	});

	it('reads a URL report by its base64url identifier', async () => {
		respond(fetchMock, url);

		await invoke(Urls.get, { id: urlIdentifier });

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe(`/api/v3/urls/${urlIdentifier}`);
	});

	it('builds that identifier from a raw URL', async () => {
		// The helper the docs describe: base64url, unpadded.
		expect(urlId('https://acme.example/login')).toBe(urlIdentifier);
	});

	it('rescans a URL', async () => {
		respond(fetchMock, analysisDescriptor);

		await invoke(Urls.rescan, { id: urlIdentifier });

		expect(lastRequest(fetchMock).path).toBe(
			`/api/v3/urls/${urlIdentifier}/analyse`,
		);
	});

	it('lists the comments on a URL', async () => {
		respond(fetchMock, commentsPage);

		await expect(invoke(Urls.comments, { id: urlIdentifier })).resolves.toEqual(
			commentsPage,
		);
		expect(lastRequest(fetchMock).path).toBe(
			`/api/v3/urls/${urlIdentifier}/comments`,
		);
	});

	it('comments on a URL', async () => {
		respond(fetchMock, comment);

		await invoke(Urls.addComment, {
			id: urlIdentifier,
			text: 'Reported to the host',
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			data: {
				type: 'comment',
				attributes: { text: 'Reported to the host' },
			},
		});
	});
});

describe('domains and IP addresses', () => {
	it('reads a domain report by name', async () => {
		respond(fetchMock, domain);

		const result = await invoke(Domains.get, { domain: 'acme.example' });

		expect(result).toEqual(domain);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v3/domains/acme.example');
	});

	it('logs the registrar and malicious count for a domain', async () => {
		respond(fetchMock, domain);

		await invoke(Domains.get, { domain: 'acme.example' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'virustotal.domains.get',
			{ id: 'acme.example', malicious: 0, registrar: 'Acme Registrar' },
			'completed',
		);
	});

	it('rescans a domain', async () => {
		respond(fetchMock, analysisDescriptor);

		await invoke(Domains.rescan, { id: 'acme.example' });

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v3/domains/acme.example/analyse',
		);
	});

	it('reads an IP report', async () => {
		respond(fetchMock, ip);

		const result = await invoke(Domains.ipGet, { ip: '203.0.113.10' });

		expect(result).toEqual(ip);
		expect(lastRequest(fetchMock).path).toBe(
			'/api/v3/ip_addresses/203.0.113.10',
		);
	});

	it('logs the AS owner and country for an IP', async () => {
		respond(fetchMock, ip);

		await invoke(Domains.ipGet, { ip: '203.0.113.10' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'virustotal.ipAddresses.get',
			{ id: '203.0.113.10', malicious: 2, country: 'NL' },
			'completed',
		);
	});

	it('rescans an IP address', async () => {
		respond(fetchMock, analysisDescriptor);

		await invoke(Domains.ipRescan, { id: '203.0.113.10' });

		expect(lastRequest(fetchMock).path).toBe(
			'/api/v3/ip_addresses/203.0.113.10/analyse',
		);
	});

	it('keeps an IPv6 address as one path segment', async () => {
		respond(fetchMock, { ...ip, data: { ...ip.data, id: '2001:db8::1' } });

		await invoke(Domains.ipGet, { ip: '2001:db8::1' });

		// The colons are percent-encoded so the address stays one segment.
		expect(lastRequest(fetchMock).path).toBe(
			'/api/v3/ip_addresses/2001%3Adb8%3A%3A1',
		);
	});
});

describe('analyses', () => {
	it('reads a completed analysis', async () => {
		respond(fetchMock, analysis);

		const result = await invoke(Analyses.get, { id: analysisId });

		expect(result).toEqual(analysis);
		// An analysis id is base64, so it ends in "==" — those are percent-encoded
		// to keep the id one path segment, which VirusTotal resolves the same way.
		expect(lastRequest(fetchMock).path).toBe(
			`/api/v3/analyses/${encodeURIComponent(analysisId)}`,
		);
	});

	it('reports a queued analysis as queued, not as a failure', async () => {
		respond(fetchMock, analysisQueued);

		await invoke(Analyses.get, { id: analysisId });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'virustotal.analyses.get',
			{ id: analysisId, status: 'queued' },
			'completed',
		);
	});
});

describe('comments', () => {
	it('lists comments across the account', async () => {
		respond(fetchMock, commentsPage);

		const result = await invoke(Comments.list, { limit: 20 });

		expect(result).toEqual(commentsPage);
		const sent = lastRequest(fetchMock);
		expect(sent.path).toBe('/api/v3/comments');
		expect(sent.query.limit).toBe('20');
	});

	it('reads one comment', async () => {
		respond(fetchMock, comment);

		await invoke(Comments.get, { id: comment.data.id });

		expect(lastRequest(fetchMock).path).toBe(
			`/api/v3/comments/${comment.data.id}`,
		);
	});

	it('states what a delete did, since the answer has no body', async () => {
		respondEmpty(fetchMock, 204);

		const result = await invoke(Comments.remove, { id: comment.data.id });

		expect(result).toEqual({ id: comment.data.id, deleted: true });
		expect(lastRequest(fetchMock).method).toBe('DELETE');
	});
});
