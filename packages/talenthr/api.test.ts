import 'dotenv/config';
import { makeTalentHRRequest } from './client';
import { unwrapEnvelope } from './endpoints/call';
import {
	DirectoryResponseSchema,
	EmploymentStatusOptionsResponseSchema,
} from './endpoints/types';

/**
 * Live reads against a real TalentHR account. CI skips this file (it matches
 * `api.test.ts`); run it with `pnpm test:live` and TALENTHR_API_KEY set. Only
 * reads run here: every write on employees or time off emails real people.
 */
const API_KEY = process.env.TALENTHR_API_KEY;
const live = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	console.warn('TALENTHR_API_KEY is not set; skipping the TalentHR live suite');
}

live('TalentHR live reads', () => {
	it('lists the employment statuses', async () => {
		const raw = await makeTalentHRRequest(API_KEY!, {
			method: 'GET',
			path: '/employment-statuses',
		});
		EmploymentStatusOptionsResponseSchema.parse(unwrapEnvelope(raw));
	});

	it('reads one page of the directory', async () => {
		const raw = await makeTalentHRRequest(API_KEY!, {
			method: 'GET',
			path: '/directory',
			query: { limit: 1, offset: 0 },
		});
		const page = DirectoryResponseSchema.parse(unwrapEnvelope(raw));
		expect(Array.isArray(page.rows)).toBe(true);
	});
});
