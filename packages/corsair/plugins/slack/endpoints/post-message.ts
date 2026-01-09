import type { SlackEndpoints } from '../';

export const postMessage: SlackEndpoints['postMessage'] = async (
	ctx,
	input,
) => {
	return {
		channel: 'j',
		ok: true,
		ts: '1',
	};
};
