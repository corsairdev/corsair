import type { SlackWebhooks } from '..';

export const added: SlackWebhooks['reactionAdded'] = async (ctx, request) => {
	return {
		success: true,
		data: {},
	};
};
