import { z } from 'zod';

// Official field names from Humanitix Public API (GET /v1/events, GET /v1/tags).
// Extra properties stay allowed — the live payload is larger than the docs table.

export const HumanitixTicketType = z
	.object({
		_id: z.string().optional(),
		name: z.string().optional(),
		price: z.number().optional(),
		quantity: z.number().optional(),
		description: z.string().optional(),
		disabled: z.boolean().optional(),
		deleted: z.boolean().optional(),
		isDonation: z.boolean().optional(),
	})
	.loose();

export const HumanitixEventLocation = z
	.object({
		type: z.string().optional(),
		venueName: z.string().optional(),
		address: z.string().optional(),
		latLng: z.array(z.number()).optional(),
		city: z.string().optional(),
		region: z.string().optional(),
		country: z.string().optional(),
		onlineUrl: z.string().optional(),
		mapUrl: z.string().optional(),
	})
	.loose();

export const HumanitixEventDate = z
	.object({
		_id: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		scheduleId: z.string().optional(),
		disabled: z.boolean().optional(),
		deleted: z.boolean().optional(),
	})
	.loose();

export const HumanitixEvent = z
	.object({
		_id: z.string(),
		userId: z.string().optional(),
		organiserId: z.string().optional(),
		currency: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		sharingDescription: z.string().optional(),
		slug: z.string().optional(),
		url: z.string().optional(),
		tagIds: z.array(z.string()).optional(),
		category: z.string().optional(),
		// Official docs: OneOf(enum string | { category, subcategory, type }).
		classification: z
			.union([
				z.string(),
				z
					.object({
						category: z.string().optional(),
						subcategory: z.string().optional(),
						type: z.string().optional(),
					})
					.loose(),
			])
			.optional(),
		public: z.boolean().optional(),
		published: z.boolean().optional(),
		suspendSales: z.boolean().optional(),
		markedAsSoldOut: z.boolean().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		timezone: z.string().optional(),
		totalCapacity: z.number().optional(),
		ticketTypes: z.array(HumanitixTicketType).optional(),
		pricing: z
			.object({
				minimumPrice: z.number().optional(),
				maximumPrice: z.number().optional(),
			})
			.loose()
			.optional(),
		publishedAt: z.string().optional(),
		eventLocation: HumanitixEventLocation.optional(),
		dates: z.array(HumanitixEventDate).optional(),
		keywords: z.array(z.string()).optional(),
		location: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type HumanitixEvent = z.infer<typeof HumanitixEvent>;

export const HumanitixTag = z
	.object({
		_id: z.string(),
		name: z.string().optional(),
		userId: z.string().optional(),
		location: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type HumanitixTag = z.infer<typeof HumanitixTag>;
