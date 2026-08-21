import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/* Shared                                                                      */
/* -------------------------------------------------------------------------- */

const EmptyInputSchema = z.object({});

const DirectionSchema = z.enum(['forwards', 'backwards']);

const PaginationSchema = z.object({
	limit: z.number().int().positive().max(1000).optional(),
});

const TimeRangeSchema = PaginationSchema.extend({
	start: z.number().int().optional(),
	end: z.number().int().optional(),
	direction: DirectionSchema.optional(),
});

const MessageSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		data: z.unknown().optional(),
		clientId: z.string().optional(),
		connectionId: z.string().optional(),
		timestamp: z.number().optional(),
		encoding: z.string().optional(),
		extras: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const PresenceMessageSchema = z
	.object({
		id: z.string().optional(),
		action: z.union([z.string(), z.number()]).optional(),
		clientId: z.string().optional(),
		connectionId: z.string().optional(),
		data: z.unknown().optional(),
		timestamp: z.number().optional(),
		encoding: z.string().optional(),
	})
	.loose();

const ChannelDetailsSchema = z
	.object({
		channelId: z.string().optional(),
		status: z
			.object({
				isActive: z.boolean().optional(),
				occupancy: z
					.object({
						metrics: z.record(z.string(), z.number()).optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const DeviceSchema = z
	.object({
		id: z.string(),
		clientId: z.string().optional(),
		platform: z.string().optional(),
		formFactor: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		updateToken: z.string().optional(),
		push: z
			.object({
				state: z.string().optional(),
				recipient: z.record(z.string(), z.unknown()).optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const DeviceRegistrationInputSchema = z.object({
	id: z.string().min(1),
	clientId: z.string().optional(),
	platform: z.enum(['ios', 'android', 'browser']),
	formFactor: z.enum([
		'phone',
		'tablet',
		'desktop',
		'tv',
		'watch',
		'car',
		'embedded',
	]),
	metadata: z.record(z.string(), z.unknown()).optional(),
	updateToken: z.string().optional(),
	push: z.object({
		recipient: z
			.object({
				transportType: z.enum(['fcm', 'apns', 'web']),
			})
			.loose(),
	}),
});

const SubscriptionSchema = z
	.object({
		channel: z.string(),
		deviceId: z.string().optional(),
		clientId: z.string().optional(),
	})
	.loose();

const EmptyResponseSchema = z.unknown().optional();

/* -------------------------------------------------------------------------- */
/* Inputs                                                                      */
/* -------------------------------------------------------------------------- */

export const AblyEndpointInputSchemas = {
	publishBatchMessages: z.object({
		messages: z.array(
			z.object({
				channels: z.array(z.string().min(1)).min(1),
				messages: z.array(MessageSchema).min(1),
			}),
		),
	}),

	getChannelDetails: z.object({
		channelId: z.string().min(1),
	}),

	getChannelHistory: z
		.object({
			channelId: z.string().min(1),
		})
		.extend(TimeRangeSchema.shape),

	getChannelPresence: z.object({
		channelId: z.string().min(1),
		clientId: z.string().optional(),
		connectionId: z.string().optional(),
	}),

	getPresenceHistory: z
		.object({
			channelId: z.string().min(1),
		})
		.extend(TimeRangeSchema.shape),

	getMessageVersions: z.object({
		channelId: z.string().min(1),
		serial: z.string().min(1),
	}),

	listChannels: PaginationSchema.extend({
		prefix: z.string().optional(),
		by: z.enum(['id', 'value']).optional(),
		next: z.record(z.string(), z.string()).optional(),
	}),

	publishMessageToChannel: z.object({
		channelId: z.string().min(1),
		name: z.string().optional(),
		data: z.unknown(),
		clientId: z.string().optional(),
		extras: z.record(z.string(), z.unknown()).optional(),
	}),

	batchPresence: z.object({
		channels: z.array(z.string().min(1)).min(1).max(100),
	}),

	batchPresenceHistory: z
		.object({
			channels: z.array(z.string().min(1)).min(1).max(100),
		})
		.extend(TimeRangeSchema.shape),

	getServiceTime: EmptyInputSchema,

	getStats: TimeRangeSchema.extend({
		unit: z.enum(['minute', 'hour', 'day', 'month']).optional(),
	}),

	requestAccessToken: z.object({
		keyName: z.string().min(1),
		clientId: z.string().optional(),
		ttl: z.number().int().positive().optional(),
		capability: z.string().optional(),
	}),

	publishPushNotificationsBatch: z.object({
		notifications: z.array(z.record(z.string(), z.unknown())).min(1).max(10000),
	}),

	deleteChannelSubscription: z.object({
		channel: z.string().min(1),
		deviceId: z.string().optional(),
		clientId: z.string().optional(),
	}),

	createPushChannelSubscription: z
		.object({
			channel: z.string().min(1),
			deviceId: z.string().min(1).optional(),
			clientId: z.string().min(1).optional(),
		})
		.refine(
			(value) =>
				Number(value.deviceId !== undefined) +
					Number(value.clientId !== undefined) ===
				1,
		),

	getPushDevice: z.object({
		deviceId: z.string().min(1),
	}),

	listPushChannelSubscriptions: PaginationSchema.extend({
		channel: z.string().optional(),
		deviceId: z.string().optional(),
		clientId: z.string().optional(),
		next: z.record(z.string(), z.string()).optional(),
	}),

	listPushChannels: PaginationSchema.extend({
		prefix: z.string().optional(),
		next: z.record(z.string(), z.string()).optional(),
	}),

	listRegisteredPushDevices: PaginationSchema.extend({
		deviceId: z.string().optional(),
		clientId: z.string().optional(),
		next: z.record(z.string(), z.string()).optional(),
	}),

	patchPushDeviceRegistration: z.object({
		deviceId: z.string().min(1),
		clientId: z.string().optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		push: z.record(z.string(), z.unknown()).optional(),
	}),

	publishPushNotification: z.object({
		recipient: z.record(z.string(), z.unknown()),
		data: z.record(z.string(), z.unknown()).optional(),
		notification: z.record(z.string(), z.unknown()).optional(),
	}),

	registerPushDevice: DeviceRegistrationInputSchema,

	unregisterAllPushDevices: z
		.object({
			deviceId: z.string().min(1).optional(),
			clientId: z.string().min(1).optional(),
		})
		.refine(
			(value) =>
				Number(value.deviceId !== undefined) +
					Number(value.clientId !== undefined) ===
				1,
		),

	unregisterPushDevice: z.object({
		deviceId: z.string().min(1),
	}),

	updatePushDevice: DeviceRegistrationInputSchema,
} as const;

/* -------------------------------------------------------------------------- */
/* Outputs                                                                     */
/* -------------------------------------------------------------------------- */

export const AblyEndpointOutputSchemas = {
	publishBatchMessages: z.array(z.unknown()),
	getChannelDetails: ChannelDetailsSchema,
	getChannelHistory: z.array(MessageSchema),
	getChannelPresence: z.array(PresenceMessageSchema),
	getPresenceHistory: z.array(PresenceMessageSchema),
	getMessageVersions: z.array(MessageSchema),
	listChannels: z.object({
		items: z.array(z.union([z.string(), ChannelDetailsSchema])),
		next: z.record(z.string(), z.string()).optional(),
	}),
	publishMessageToChannel: EmptyResponseSchema,
	batchPresence: z.array(z.unknown()),
	batchPresenceHistory: z.array(z.unknown()),

	getServiceTime: z.array(z.number()),
	getStats: z.array(z.record(z.string(), z.unknown())),
	requestAccessToken: z
		.object({
			token: z.string(),
			expires: z.number().optional(),
			issued: z.number().optional(),
			capability: z.string().optional(),
			clientId: z.string().optional(),
		})
		.loose(),

	publishPushNotificationsBatch: z.array(z.unknown()),
	deleteChannelSubscription: EmptyResponseSchema,
	createPushChannelSubscription: EmptyResponseSchema,
	getPushDevice: DeviceSchema,
	listPushChannelSubscriptions: z.object({
		items: z.array(SubscriptionSchema),
		next: z.record(z.string(), z.string()).optional(),
	}),
	listPushChannels: z.object({
		items: z.array(z.string()),
		next: z.record(z.string(), z.string()).optional(),
	}),
	listRegisteredPushDevices: z.object({
		items: z.array(DeviceSchema),
		next: z.record(z.string(), z.string()).optional(),
	}),
	patchPushDeviceRegistration: DeviceSchema,
	publishPushNotification: EmptyResponseSchema,
	registerPushDevice: DeviceSchema,
	unregisterAllPushDevices: EmptyResponseSchema,
	unregisterPushDevice: EmptyResponseSchema,
	updatePushDevice: DeviceSchema,
} as const;

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type AblyEndpointInputs = {
	[K in keyof typeof AblyEndpointInputSchemas]: z.infer<
		(typeof AblyEndpointInputSchemas)[K]
	>;
};

export type AblyEndpointOutputs = {
	[K in keyof typeof AblyEndpointOutputSchemas]: z.infer<
		(typeof AblyEndpointOutputSchemas)[K]
	>;
};

export type AblyMessage = z.infer<typeof MessageSchema>;
export type AblyPresenceMessage = z.infer<typeof PresenceMessageSchema>;
export type AblyDevice = z.infer<typeof DeviceSchema>;
