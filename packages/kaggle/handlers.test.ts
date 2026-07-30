import * as CorsairCore from 'corsair/core';
import * as Client from './client';
import { Competitions, Datasets, Kernels, Models } from './endpoints';
import type { KaggleEndpoints } from './index';

const mockReq = jest.spyOn(Client, 'makeKaggleRequest');
const mockBin = jest.spyOn(Client, 'makeKaggleBinaryRequest');
const logSpy = jest.spyOn(CorsairCore, 'logEventFromContext');
logSpy.mockImplementation(async () => null);

type HandlerCtx = Parameters<KaggleEndpoints['datasetsList']>[0];

function ctx(key = 'user:key'): HandlerCtx {
	const partial = {
		key,
		db: {},
		authType: 'api_key' as const,
		options: { username: 'user' },
		keys: {
			get_api_key: async () => key,
			get_access_token: async () => key,
		},
	};
	// Handler unit tests only need key + options; cast through unknown
	// to avoid constructing a full CorsairPluginContext.
	return partial as unknown as HandlerCtx;
}

function lastJsonCall() {
	const call = mockReq.mock.calls.at(-1);
	if (!call) throw new Error('makeKaggleRequest was not called');
	return call;
}

beforeEach(() => {
	mockReq.mockReset();
	mockReq.mockResolvedValue({ ok: true });
	mockBin.mockReset();
	mockBin.mockResolvedValue({
		contentType: 'application/zip',
		size: 1,
		dataBase64: 'YQ==',
		fileName: 'a.zip',
	});
	logSpy.mockClear();
	logSpy.mockImplementation(async () => null);
});

describe('handler path construction', () => {
	it('datasets.list → GET /datasets/list', async () => {
		await Datasets.list(ctx(), { page: 1, search: 'titanic' });
		expect(mockReq).toHaveBeenCalledWith(
			'/datasets/list',
			'user:key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({ page: 1, search: 'titanic' }),
			}),
		);
	});

	it('datasets.getMetadata → GET /datasets/{owner}/{slug}', async () => {
		await Datasets.getMetadata(ctx(), {
			ownerSlug: 'owner',
			datasetSlug: 'slug',
		});
		expect(lastJsonCall()[0]).toBe('/datasets/owner/slug');
	});

	it('datasets.create → POST /datasets/create/new', async () => {
		await Datasets.create(ctx(), {
			id: 'owner/slug',
			title: 'Dataset',
			isPrivate: true,
		});
		expect(lastJsonCall()[0]).toBe('/datasets/create/new');
	});

	it('datasets.createVersion → POST /datasets/create/version/{owner}/{slug}', async () => {
		await Datasets.createVersion(ctx(), {
			ownerSlug: 'owner',
			datasetSlug: 'slug',
			versionNotes: 'v1',
		});
		expect(lastJsonCall()[0]).toBe('/datasets/create/version/owner/slug');
	});

	it('datasets.getStatus → GET /datasets/status/{owner}/{slug}', async () => {
		await Datasets.getStatus(ctx(), {
			ownerSlug: 'owner',
			datasetSlug: 'slug',
		});
		expect(lastJsonCall()[0]).toBe('/datasets/status/owner/slug');
	});

	it('datasets.listFiles → GET /datasets/{owner}/{slug}/files', async () => {
		await Datasets.listFiles(ctx(), {
			ownerSlug: 'owner',
			datasetSlug: 'slug',
		});
		expect(lastJsonCall()[0]).toBe('/datasets/owner/slug/files');
	});

	it('competitions.list → GET /competitions/list', async () => {
		await Competitions.list(ctx(), { page: 1 });
		expect(lastJsonCall()[0]).toBe('/competitions/list');
	});

	it('competitions.listFiles → GET /competitions/data/list/{id}', async () => {
		await Competitions.listFiles(ctx(), { id: 'titanic' });
		expect(lastJsonCall()[0]).toBe('/competitions/data/list/titanic');
	});

	it('competitions.viewLeaderboard → GET /competitions/leaderboard/view/{id}', async () => {
		await Competitions.viewLeaderboard(ctx(), { id: 'titanic' });
		expect(lastJsonCall()[0]).toBe('/competitions/leaderboard/view/titanic');
	});

	it('competitions.downloadFile uses binary client', async () => {
		await Competitions.downloadFile(ctx(), {
			id: 'titanic',
			fileName: 'submission.csv',
		});
		expect(mockBin).toHaveBeenCalledWith(
			'/competitions/data/download/titanic/submission.csv',
			'user:key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('competitions.generateSubmissionUrl path + competitionName body', async () => {
		await Competitions.generateSubmissionUrl(ctx(), {
			id: 'titanic',
			contentLength: 1024,
			lastModifiedDateUtc: 1700000000,
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/competitions/submissions/url/1024/1700000000',
			'user:key',
			expect.objectContaining({
				method: 'POST',
				body: { competitionName: 'titanic' },
			}),
		);
	});

	it('competitions.submit → POST /competitions/submissions/submit/{id}', async () => {
		await Competitions.submit(ctx(), {
			id: 'titanic',
			blobFileTokens: 'tok',
		});
		expect(lastJsonCall()[0]).toBe('/competitions/submissions/submit/titanic');
	});

	it('kernels.list → GET /kernels/list', async () => {
		await Kernels.list(ctx(), { page: 1 });
		expect(lastJsonCall()[0]).toBe('/kernels/list');
	});

	it('kernels.pull → GET /kernels/pull', async () => {
		await Kernels.pull(ctx(), {
			userName: 'u',
			kernelSlug: 'k',
		});
		expect(mockReq).toHaveBeenCalledWith(
			'/kernels/pull',
			'user:key',
			expect.objectContaining({
				method: 'GET',
				query: expect.objectContaining({
					userName: 'u',
					kernelSlug: 'k',
				}),
			}),
		);
	});

	it('kernels.getStatus → GET /kernels/status', async () => {
		await Kernels.getStatus(ctx(), { userName: 'u', kernelSlug: 'k' });
		expect(lastJsonCall()[0]).toBe('/kernels/status');
	});

	it('kernels.downloadOutput → JSON /kernels/output', async () => {
		await Kernels.downloadOutput(ctx(), { userName: 'u', kernelSlug: 'k' });
		expect(lastJsonCall()[0]).toBe('/kernels/output');
	});

	it('kernels.listOutputFiles → GET /kernels/files', async () => {
		await Kernels.listOutputFiles(ctx(), { userName: 'u', kernelSlug: 'k' });
		expect(lastJsonCall()[0]).toBe('/kernels/files');
	});

	it('models.list → GET /models', async () => {
		await Models.list(ctx(), { search: 'bert' });
		expect(lastJsonCall()[0]).toBe('/models');
	});

	it('models.get → GET /models/{owner}/{slug}', async () => {
		await Models.get(ctx(), {
			ownerSlug: 'google',
			modelSlug: 'bert',
		});
		expect(lastJsonCall()[0]).toBe('/models/google/bert');
	});

	it('models.getInstance → GET /models/{owner}/{slug}/{fw}/{instance}', async () => {
		await Models.getInstance(ctx(), {
			ownerSlug: 'google',
			modelSlug: 'bert',
			framework: 'tf',
			instanceSlug: 'base',
		});
		expect(lastJsonCall()[0]).toBe('/models/google/bert/tf/base');
	});

	it('competitions.downloadFiles uses binary client', async () => {
		await Competitions.downloadFiles(ctx(), { id: 'titanic' });
		expect(mockBin).toHaveBeenCalledWith(
			'/competitions/data/download-all/titanic',
			'user:key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('datasets.download uses binary client', async () => {
		await Datasets.download(ctx(), {
			ownerSlug: 'owner',
			datasetSlug: 'slug',
			datasetVersionNumber: 2,
		});
		expect(mockBin).toHaveBeenCalledWith(
			'/datasets/download/owner/slug',
			'user:key',
			expect.objectContaining({
				method: 'GET',
				query: { datasetVersionNumber: 2 },
			}),
		);
	});

	it('datasets.downloadFile uses binary client', async () => {
		await Datasets.downloadFile(ctx(), {
			ownerSlug: 'owner',
			datasetSlug: 'slug',
			fileName: 'data.csv',
		});
		expect(mockBin).toHaveBeenCalledWith(
			'/datasets/download/owner/slug/data.csv',
			'user:key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('competitions.downloadLeaderboard uses binary client', async () => {
		await Competitions.downloadLeaderboard(ctx(), { id: 'titanic' });
		expect(mockBin).toHaveBeenCalledWith(
			'/competitions/leaderboard/download/titanic',
			'user:key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('models.listInstanceVersionFiles → files path', async () => {
		await Models.listInstanceVersionFiles(ctx(), {
			ownerSlug: 'google',
			modelSlug: 'bert',
			framework: 'tf',
			instanceSlug: 'base',
			versionNumber: 1,
		});
		expect(lastJsonCall()[0]).toBe('/models/google/bert/tf/base/1/files');
	});
});
