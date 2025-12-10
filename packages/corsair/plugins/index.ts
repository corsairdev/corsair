import type { BaseConfig } from '../config';
import type { SlackChannels } from './types';

const checkSlackDependency = async () => {
	try {
		await import('@slack/web-api');
	} catch (error) {
		throw new Error(
			'Slack functionality requires @slack/web-api. Install it with: npm install @slack/web-api',
		);
	}
};

export const createPlugins = <T extends BaseConfig>(config: T) => ({
	slack: {
		sendMessage: async (params: {
			channelId: SlackChannels<T>;
			content: string;
		}) => {
			await checkSlackDependency();
			const { sendMessage } = await import('./slack/operations/send-message');
			return sendMessage<T>({ config, ...params });
		},

		replyToThread: async (params: any) => {
			await checkSlackDependency();
			const { replyToThread } = await import(
				'./slack/operations/reply-to-thread'
			);
			return replyToThread<T>({ config, ...params });
		},

		getMessages: async (params: any) => {
			await checkSlackDependency();
			const { getMessages } = await import('./slack/operations/get-messages');
			return getMessages<T>({ config, ...params });
		},

		updateMessage: async (params: any) => {
			await checkSlackDependency();
			const { updateMessage } = await import(
				'./slack/operations/update-message'
			);
			return updateMessage<T>({ config, ...params });
		},

		addReaction: async (params: any) => {
			await checkSlackDependency();
			const { addReaction } = await import('./slack/operations/add-reaction');
			return addReaction<T>({ config, ...params });
		},

		getChannels: async (params: any) => {
			await checkSlackDependency();
			const { getChannels } = await import('./slack/operations/get-channels');
			return getChannels<T>({ config, ...params });
		},
	},
	discord: {
		test: () => {},
	},
	resend: {
		test: () => {},
	},
});
