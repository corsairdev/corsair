import type { BaseConfig } from "../config";
import { addReaction } from "./slack/operations/add-reaction";
import { getChannels } from "./slack/operations/get-channels";
import { getMessages } from "./slack/operations/get-messages";
import { replyToThread } from "./slack/operations/reply-to-thread";
import { sendMessage } from "./slack/operations/send-message";
import { updateMessage } from "./slack/operations/update-message";

const slackDependencyCheck = <T extends any[], R>(fn: (...args: T) => R) => {
	return (...args: T): R => {
		try {
			require("@slack/web-api");
		} catch (error) {
			throw new Error(
				"Slack functionality requires @slack/web-api. Install it with: npm install @slack/web-api",
			);
		}
		return fn(...args);
	};
};

export const createPlugins = <T extends BaseConfig>(config: T) => ({
	slack: {
		sendMessage: slackDependencyCheck(
			(params: Omit<Parameters<typeof sendMessage<T>>[0], "config">) =>
				sendMessage<T>({ config, ...params }),
		),

		replyToThread: slackDependencyCheck(
			(params: Omit<Parameters<typeof replyToThread<T>>[0], "config">) =>
				replyToThread<T>({ config, ...params }),
		),

		getMessages: slackDependencyCheck(
			(params: Omit<Parameters<typeof getMessages<T>>[0], "config">) =>
				getMessages<T>({ config, ...params }),
		),

		updateMessage: slackDependencyCheck(
			(params: Omit<Parameters<typeof updateMessage<T>>[0], "config">) =>
				updateMessage<T>({ config, ...params }),
		),

		addReaction: slackDependencyCheck(
			(params: Omit<Parameters<typeof addReaction<T>>[0], "config">) =>
				addReaction<T>({ config, ...params }),
		),

		getChannels: slackDependencyCheck(
			(params: Omit<Parameters<typeof getChannels<T>>[0], "config">) =>
				getChannels<T>({ config, ...params }),
		),
	},
	discord: {
		test: () => {},
	},
	resend: {
		test: () => {},
	},
});
