import {
	AsyncInterviewInterviewEntity,
	AsyncInterviewJobEntity,
} from './schema/database';

/** Captured 2026-08-19 from GET /api/jobs */
const LIVE_JOB = {
	id: 1651,
	title: 'Quick Start',
	date: '2026-08-19',
	time: '00:26:04',
	datetime: '2026-08-19T00:26:04+00:00',
};

/** Captured 2026-08-19 from GET /api/interviews */
const LIVE_INTERVIEW = {
	id: 2141,
	title: 'Example Interview',
	url: 'https://app.asyncinterview.ai/i/VYFudF',
	job_id: 1651,
	job: 'Quick Start',
	date: '2026-08-19',
	time: '00:26:04',
	datetime: '2026-08-19T00:26:04+00:00',
	questions: [
		{
			id: 11217,
			stage_id: 2141,
			title: 'Introduction',
			created_at: '2026-08-19T00:26:04.000000Z',
			updated_at: '2026-08-19T00:26:04.000000Z',
			order: 1,
		},
	],
	contacts: [],
};

describe('AsyncInterview live payload schemas', () => {
	it('parses GET /jobs items with numeric id', () => {
		expect(AsyncInterviewJobEntity.parse(LIVE_JOB).id).toBe(1651);
	});

	it('rejects a string job id', () => {
		expect(() =>
			AsyncInterviewJobEntity.parse({ ...LIVE_JOB, id: '1651' }),
		).toThrow();
	});

	it('parses PUT /jobs/{id} payloads including 0/1 is_public', () => {
		const put = {
			id: 1651,
			team_id: 925,
			title: 'Quick Start',
			sub_title: null,
			description: null,
			is_public: 0,
			created_at: '2026-08-19T00:26:04.000000Z',
			updated_at: '2026-08-19T00:26:04.000000Z',
			slug: 'quick-start',
			public_job_url: 'https://app.asyncinterview.ai/job/quick-start',
		};
		expect(AsyncInterviewJobEntity.parse(put).is_public).toBe(0);
	});

	it('parses GET /interviews items including questions', () => {
		const parsed = AsyncInterviewInterviewEntity.parse(LIVE_INTERVIEW);
		expect(parsed.job_id).toBe(1651);
		expect(parsed.questions?.[0]?.id).toBe(11217);
	});
});
