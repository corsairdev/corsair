import 'dotenv/config';
import { makeTaveRequest } from './client';
import {
	ProductsListResponseSchema,
	StudioResponseSchema,
} from './endpoints/types';

/**
 * Live reads against a real VSCO Workspace studio. CI skips this file (it
 * matches `api.test.ts`); run it with `pnpm test:live` and TAVE_API_KEY set.
 * Only reads run here, so nothing in the studio changes.
 */
const API_KEY = process.env.TAVE_API_KEY;
const live = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	console.warn(
		'TAVE_API_KEY is not set; skipping the VSCO Workspace live suite',
	);
}

live('VSCO Workspace live reads', () => {
	it('reads the studio profile', async () => {
		const raw = await makeTaveRequest(API_KEY!, {
			method: 'GET',
			path: '/studio/me',
		});
		StudioResponseSchema.parse(raw);
	});

	it('lists the price list', async () => {
		const raw = await makeTaveRequest(API_KEY!, {
			method: 'GET',
			path: '/product',
		});
		ProductsListResponseSchema.parse(raw);
	});
});
