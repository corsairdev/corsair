import type { SlackChannels } from "corsair/plugins/types";
import { z } from "zod";
import { procedure } from "@/corsair/procedure";
import type { Config } from "@/corsair.config";

/**
 * INPUT: { channel: SlackChannels<Config>, message: string }
 * OUTPUT: { success: boolean, error?: string }
 *
 * PSEUDO CODE:
 * 1. Accept channel and message as input parameters
 * 2. Attempt to send the message to the specified Slack channel using Slack plugin
 * 3. Return { success: true } if successful
 * 4. On error, return { success: false, error: errorMessage }
 *
 * USER INSTRUCTIONS: None
 */
export const sendSlackMessage = procedure
	.input(
		z.object({
			channel: z.string() as z.ZodType<SlackChannels<Config>>,
			message: z.string(),
		}),
	)
	.mutation(async ({ input, ctx }) => {
		const slack = ctx.plugins.slack.sendMessage({
			channelId: "general",
			content: "",
		});

		// return slack.sendMessage({
		//   channelId: input.channel,
		//   message: input.message,
		// })

		return true;
	});
