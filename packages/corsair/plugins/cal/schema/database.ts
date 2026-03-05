import { z } from 'zod';

export const CalBooking = z
	.object({
		id: z.number().optional(),
		bookingId: z.number().optional(),
		uid: z.string(),
		title: z.string().optional(),
		description: z.string().nullable().optional(),
		status: z.string().optional(),
		start: z.string().optional(),
		startTime: z.string().optional(),
		end: z.string().optional(),
		endTime: z.string().optional(),
		duration: z.number().optional(),
		length: z.number().optional(),
		eventTypeId: z.number().optional(),
		meetingUrl: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		createdAt: z.string().nullable().optional(),
		updatedAt: z.string().nullable().optional(),
		cancellationReason: z.string().nullable().optional(),
		reschedulingReason: z.string().nullable().optional(),
		attendees: z
			.array(
				z
					.object({
						name: z.string(),
						email: z.string(),
						timeZone: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		hosts: z
			.array(
				z
					.object({
						id: z.number(),
						name: z.string(),
						email: z.string().optional(),
						timeZone: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		// Custom metadata fields that can contain arbitrary data from Cal.com
		metadata: z.record(z.unknown()).nullable().optional(),
	})
	.passthrough();

export type CalBooking = z.infer<typeof CalBooking>;
