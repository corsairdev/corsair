import 'dotenv/config';
import { makeKaggleRequest } from './client';
import type {
	KaggleEndpointInputs,
	KaggleEndpointOutputs,
} from './endpoints/types';
import {
	KaggleEndpointInputSchemas,
	KaggleEndpointOutputSchemas,
} from './endpoints/types';

const TEST_CREDENTIAL =
	process.env.KAGGLE_API_KEY ||
	(process.env.KAGGLE_USERNAME && process.env.KAGGLE_KEY
		? `${process.env.KAGGLE_USERNAME}:${process.env.KAGGLE_KEY}`
		: process.env.KAGGLE_API_TOKEN);

if (!TEST_CREDENTIAL) {
	console.warn(
		'Skipping Kaggle live smokes: set KAGGLE_USERNAME+KAGGLE_KEY, KAGGLE_API_KEY, or KAGGLE_API_TOKEN',
	);
}
const describeIfCreds = TEST_CREDENTIAL ? describe : describe.skip;

const binarySample = {
	contentType: 'application/zip',
	size: 4,
	dataBase64: 'dGVzdA==',
	fileName: 'sample.zip',
};

// Fixtures: valid input sample + response sample per endpoint. Every fixture is
// round-tripped through Zod input/output schemas below.
const FIXTURES: {
	[K in keyof KaggleEndpointInputs]: {
		input: KaggleEndpointInputs[K];
		// output envelope differs by endpoint and is asserted via each operation schema
		output: unknown;
	};
} = {
	datasetsList: {
		input: { page: 1, search: 'titanic' },
		output: [{ ref: 'owner/slug', title: 'Titanic' }],
	},
	datasetsCreate: {
		input: {
			ownerSlug: 'user',
			slug: 'my-dataset',
			title: 'My Dataset',
			isPrivate: true,
		},
		output: { status: 'ok', ref: 'user/my-dataset' },
	},
	datasetsCreateVersion: {
		input: {
			ownerSlug: 'user',
			datasetSlug: 'my-dataset',
			versionNotes: 'v2',
		},
		output: { status: 'ok' },
	},
	datasetsGetMetadata: {
		input: { ownerSlug: 'user', datasetSlug: 'my-dataset' },
		output: { title: 'My Dataset', owner: 'user' },
	},
	datasetsGetStatus: {
		input: { ownerSlug: 'user', datasetSlug: 'my-dataset' },
		output: { status: 'ready' },
	},
	datasetsListFiles: {
		input: { ownerSlug: 'user', datasetSlug: 'my-dataset', pageSize: 20 },
		output: { datasetFiles: [{ name: 'train.csv' }] },
	},
	datasetsDownload: {
		input: { ownerSlug: 'user', datasetSlug: 'my-dataset' },
		output: binarySample,
	},
	datasetsDownloadFile: {
		input: {
			ownerSlug: 'user',
			datasetSlug: 'my-dataset',
			fileName: 'train.csv',
		},
		output: binarySample,
	},

	competitionsList: {
		input: { page: 1, search: 'titanic' },
		output: [{ id: 'titanic', title: 'Titanic' }],
	},
	competitionsListFiles: {
		input: { id: 'titanic' },
		output: [{ name: 'train.csv', totalBytes: 100 }],
	},
	competitionsDownloadFiles: {
		input: { id: 'titanic' },
		output: binarySample,
	},
	competitionsDownloadFile: {
		input: { id: 'titanic', fileName: 'train.csv' },
		output: binarySample,
	},
	competitionsViewLeaderboard: {
		input: { id: 'titanic' },
		output: { submissions: [{ teamName: 'A', score: 0.9 }] },
	},
	competitionsDownloadLeaderboard: {
		input: { id: 'titanic' },
		output: binarySample,
	},
	competitionsGenerateSubmissionUrl: {
		input: {
			competitionName: 'titanic',
			contentLength: 1024,
			lastModifiedEpochSeconds: 1700000000,
			fileName: 'sub.csv',
		},
		output: { createUrl: 'https://example.com/upload', token: 'tok' },
	},
	competitionsSubmit: {
		input: {
			id: 'titanic',
			blobFileTokens: 'token',
			submissionDescription: 'baseline',
		},
		output: { message: 'submitted' },
	},

	kernelsList: {
		input: { page: 1, search: 'eda' },
		output: [{ ref: 'user/kernel', title: 'EDA' }],
	},
	kernelsPull: {
		input: { userName: 'user', kernelSlug: 'kernel', metadata: true },
		output: { code: '# notebook', metadata: {} },
	},
	kernelsGetStatus: {
		input: { userName: 'user', kernelSlug: 'kernel' },
		output: { status: 'complete' },
	},
	kernelsDownloadOutput: {
		input: { userName: 'user', kernelSlug: 'kernel' },
		output: {
			files: [
				{
					contentType: 'text/csv',
					size: 4,
					dataBase64: 'dGVzdA==',
					fileName: 'submission.csv',
				},
			],
			log: 'done',
		},
	},
	kernelsListOutputFiles: {
		input: { userName: 'user', kernelSlug: 'kernel' },
		output: { files: [{ name: 'out.csv' }] },
	},

	modelsList: {
		input: { pageSize: 10, search: 'bert' },
		output: [{ ref: 'org/model', title: 'BERT' }],
	},
	modelsGet: {
		input: { ownerSlug: 'org', modelSlug: 'model' },
		output: { title: 'BERT', owner: 'org' },
	},
	modelsGetInstance: {
		input: {
			ownerSlug: 'org',
			modelSlug: 'model',
			framework: 'pytorch',
			instanceSlug: 'base',
		},
		output: { framework: 'pytorch', slug: 'base' },
	},
	modelsListInstanceVersionFiles: {
		input: {
			ownerSlug: 'org',
			modelSlug: 'model',
			framework: 'pytorch',
			instanceSlug: 'base',
			versionNumber: 1,
		},
		output: { files: [{ name: 'weights.bin' }] },
	},
};

describe('Kaggle endpoint schemas', () => {
	it('defines fixtures for every endpoint', () => {
		const keys = Object.keys(FIXTURES);
		expect(keys.length).toBe(Object.keys(KaggleEndpointInputSchemas).length);
		expect(keys.length).toBe(25);
	});

	for (const [name, fixture] of Object.entries(FIXTURES) as [
		keyof KaggleEndpointInputs,
		(typeof FIXTURES)[keyof KaggleEndpointInputs],
	][]) {
		it(`parses ${name} input and output`, () => {
			const inputParsed = KaggleEndpointInputSchemas[name].safeParse(
				fixture.input,
			);
			expect(inputParsed.success).toBe(true);

			const outputParsed = KaggleEndpointOutputSchemas[name].safeParse(
				fixture.output,
			);
			expect(outputParsed.success).toBe(true);
		});
	}

	it('rejects invalid required inputs', () => {
		for (const schema of [
			KaggleEndpointInputSchemas.datasetsGetMetadata,
			KaggleEndpointInputSchemas.datasetsCreate,
			KaggleEndpointInputSchemas.competitionsGenerateSubmissionUrl,
			KaggleEndpointInputSchemas.modelsGetInstance,
		]) {
			expect(schema.safeParse({}).success).toBe(false);
		}
	});

	it('strips unknown fields from dataset createVersion input', () => {
		const parsed = KaggleEndpointInputSchemas.datasetsCreateVersion.safeParse({
			ownerSlug: 'user',
			datasetSlug: 'my-dataset',
			versionNotes: 'v2',
			unexpected: true,
		});
		expect(parsed.success).toBe(true);
		if (!parsed.success) return;
		expect(parsed.data).not.toHaveProperty('unexpected');
	});
});

// LIVE SMOKE TESTS — list-only routes (no fixture entity IDs that would 404).
describeIfCreds('Kaggle API live smoke tests (list endpoints only)', () => {
	it('lists competitions (GET /competitions/list)', async () => {
		const response = await makeKaggleRequest<
			KaggleEndpointOutputs['competitionsList']
		>('/competitions/list', TEST_CREDENTIAL!, {
			method: 'GET',
			query: { page: 1 },
		});
		const parsed =
			KaggleEndpointOutputSchemas.competitionsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('lists datasets (GET /datasets/list)', async () => {
		const response = await makeKaggleRequest<
			KaggleEndpointOutputs['datasetsList']
		>('/datasets/list', TEST_CREDENTIAL!, {
			method: 'GET',
			query: { page: 1 },
		});
		const parsed = KaggleEndpointOutputSchemas.datasetsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('lists kernels (GET /kernels/list)', async () => {
		const response = await makeKaggleRequest<
			KaggleEndpointOutputs['kernelsList']
		>('/kernels/list', TEST_CREDENTIAL!, {
			method: 'GET',
			query: { page: 1, pageSize: 5 },
		});
		const parsed = KaggleEndpointOutputSchemas.kernelsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});

	it('lists models (GET /models/list)', async () => {
		const response = await makeKaggleRequest<
			KaggleEndpointOutputs['modelsList']
		>('/models/list', TEST_CREDENTIAL!, {
			method: 'GET',
			query: { pageSize: 5 },
		});
		const parsed = KaggleEndpointOutputSchemas.modelsList.safeParse(response);
		expect(parsed.success).toBe(true);
	});
});
