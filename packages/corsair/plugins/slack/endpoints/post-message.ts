import type { SlackEndpoints } from '../';

export const postMessage: SlackEndpoints['postMessage'] = async (
	_ctx,
	input,
) => {
	return {
		channel: 'j',
		ok: true,
		ts: '1',
	};
};
