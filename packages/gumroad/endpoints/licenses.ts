import type { GumroadEndpoints } from '..';
import { call } from './call';

// The licenses endpoints take form-encoded bodies and need no access token
// ("The Verify License API endpoint does not require an OAuth application").
export const verify: GumroadEndpoints['licensesVerify'] = (ctx, input) =>
	call(ctx, 'licensesVerify', 'licenses.verify', '/licenses/verify', input, {
		method: 'POST',
		toForm: (parsed) => ({
			product_id: parsed.product_id,
			license_key: parsed.license_key,
			increment_uses_count: parsed.increment_uses_count,
		}),
	});
