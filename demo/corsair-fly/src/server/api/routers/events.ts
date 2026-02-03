import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { inngest } from '@/server/inngest/client';

export const eventsRouter = createTRPCRouter({
	trigger: publicProcedure
		.input(
			z.object({
				eventName: z.string(),
				data: z.any(),
			}),
		)
		.mutation(async ({ input }) => {
			const result = await inngest.send({
				name: input.eventName as any,
				data: input.data,
			});

			return {
				success: true,
				eventId: result.ids[0],
			};
		}),

	testEvent: publicProcedure
		.input(
			z.object({
				message: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const result = await inngest.send({
				name: 'test/event',
				data: {
					message: input.message,
					timestamp: new Date().toISOString(),
				},
			});

			return {
				success: true,
				eventId: result.ids[0],
				message: `Test event sent: ${input.message}`,
			};
		}),
});
