import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Pushbullet identifies every object by an `iden` string and marks deletions
// with `active: false` rather than removing records, so list responses include
// inactive rows unless filtered. Objects are `.loose()` because Pushbullet adds
// fields without versioning.
// ─────────────────────────────────────────────────────────────────────────────

const CursorPaginationShape = {
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(500).optional(),
};

const PushSchema = z
	.object({
		iden: z.string(),
		active: z.boolean().optional(),
		type: z.string().optional(),
		title: z.string().optional(),
		body: z.string().optional(),
		url: z.string().optional(),
		dismissed: z.boolean().optional(),
		direction: z.string().optional(),
		sender_iden: z.string().optional(),
		sender_email: z.string().optional(),
		receiver_iden: z.string().optional(),
		receiver_email: z.string().optional(),
		target_device_iden: z.string().optional(),
		source_device_iden: z.string().optional(),
		file_name: z.string().optional(),
		file_type: z.string().optional(),
		file_url: z.string().optional(),
		created: z.number().optional(),
		modified: z.number().optional(),
	})
	.loose();

const DeviceSchema = z
	.object({
		iden: z.string(),
		active: z.boolean().optional(),
		nickname: z.string().optional(),
		manufacturer: z.string().optional(),
		model: z.string().optional(),
		icon: z.string().optional(),
		app_version: z.number().optional(),
		push_token: z.string().optional(),
		has_sms: z.boolean().optional(),
		created: z.number().optional(),
		modified: z.number().optional(),
	})
	.loose();

const ChatSchema = z
	.object({
		iden: z.string(),
		active: z.boolean().optional(),
		muted: z.boolean().optional(),
		created: z.number().optional(),
		modified: z.number().optional(),
		with: z
			.object({
				iden: z.string().optional(),
				email: z.string().optional(),
				name: z.string().optional(),
				image_url: z.string().optional(),
				type: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const UserSchema = z
	.object({
		iden: z.string(),
		email: z.string().optional(),
		email_normalized: z.string().optional(),
		name: z.string().optional(),
		image_url: z.string().optional(),
		max_upload_size: z.number().optional(),
		created: z.number().optional(),
		modified: z.number().optional(),
	})
	.loose();

// ── Pushes ──────────────────────────────────────────────────────────────────

/**
 * A push targets at most one recipient. Pushbullet accepts several mutually
 * exclusive target fields; omitting all of them broadcasts to every device on
 * the account.
 */
const PushTargetShape = {
	device_iden: z.string().optional(),
	email: z.string().email().optional(),
	channel_tag: z.string().optional(),
	client_iden: z.string().optional(),
};

const PushesCreateInputSchema = z
	.object({
		type: z.enum(['note', 'link', 'file']),
		title: z.string().optional(),
		body: z.string().optional(),
		url: z.string().optional(),
		file_name: z.string().optional(),
		file_type: z.string().optional(),
		file_url: z.string().optional(),
		/** Client-side id; Pushbullet uses it to deduplicate retried sends. */
		guid: z.string().optional(),
		source_device_iden: z.string().optional(),
		...PushTargetShape,
	})
	.refine((v) => v.type !== 'link' || Boolean(v.url), {
		message: 'A link push requires url',
	})
	.refine((v) => v.type !== 'file' || Boolean(v.file_url && v.file_name), {
		message: 'A file push requires file_url and file_name',
	});

const PushesListInputSchema = z.object({
	/** Unix seconds; returns only pushes modified after this time. */
	modified_after: z.number().optional(),
	/** Pushbullet soft-deletes, so inactive pushes are excluded by default. */
	active: z.boolean().optional(),
	...CursorPaginationShape,
});

const PushesUpdateInputSchema = z.object({
	iden: z.string(),
	dismissed: z.boolean(),
});

const PushesDeleteInputSchema = z.object({ iden: z.string() });
const PushesDeleteAllInputSchema = z.object({});

// ── Devices ─────────────────────────────────────────────────────────────────

const DevicesRegisterInputSchema = z.object({
	nickname: z.string().optional(),
	model: z.string().optional(),
	manufacturer: z.string().optional(),
	push_token: z.string().optional(),
	app_version: z.number().int().optional(),
	icon: z.string().optional(),
	has_sms: z.boolean().optional(),
});

const DevicesListInputSchema = z.object({
	active: z.boolean().optional(),
	...CursorPaginationShape,
});

const DevicesUpdateInputSchema = z.object({
	iden: z.string(),
	nickname: z.string().optional(),
	model: z.string().optional(),
	manufacturer: z.string().optional(),
	push_token: z.string().optional(),
	app_version: z.number().int().optional(),
	icon: z.string().optional(),
	has_sms: z.boolean().optional(),
});

const DevicesDeleteInputSchema = z.object({ iden: z.string() });

// ── Chats ───────────────────────────────────────────────────────────────────

const ChatsCreateInputSchema = z.object({ email: z.string().email() });

const ChatsListInputSchema = z.object({
	active: z.boolean().optional(),
	...CursorPaginationShape,
});

const ChatsSetMutedInputSchema = z.object({
	iden: z.string(),
	muted: z.boolean(),
});

const ChatsDeleteInputSchema = z.object({ iden: z.string() });

// ── Users and files ─────────────────────────────────────────────────────────

const UsersMeInputSchema = z.object({});

const FilesUploadRequestInputSchema = z.object({
	file_name: z.string(),
	/** MIME type, e.g. `image/png`. */
	file_type: z.string(),
});

// ── Responses ───────────────────────────────────────────────────────────────

const PushesListResponseSchema = z
	.object({ pushes: z.array(PushSchema), cursor: z.string().optional() })
	.loose();

const DevicesListResponseSchema = z
	.object({ devices: z.array(DeviceSchema), cursor: z.string().optional() })
	.loose();

const ChatsListResponseSchema = z
	.object({ chats: z.array(ChatSchema), cursor: z.string().optional() })
	.loose();

/** Pushbullet answers deletes with an empty JSON object. */
const EmptyResponseSchema = z.object({}).loose();

const UploadRequestResponseSchema = z
	.object({
		file_name: z.string(),
		file_type: z.string(),
		/** Needed to POST the actual bytes to Pushbullet's S3 bucket. */
		upload_url: z.string(),
		/** Needed by any subsequent file push that references the upload. */
		file_url: z.string(),
	})
	.loose();

export const PushbulletEndpointInputSchemas = {
	pushesCreate: PushesCreateInputSchema,
	pushesList: PushesListInputSchema,
	pushesUpdate: PushesUpdateInputSchema,
	pushesDelete: PushesDeleteInputSchema,
	pushesDeleteAll: PushesDeleteAllInputSchema,
	devicesRegister: DevicesRegisterInputSchema,
	devicesList: DevicesListInputSchema,
	devicesUpdate: DevicesUpdateInputSchema,
	devicesDelete: DevicesDeleteInputSchema,
	chatsCreate: ChatsCreateInputSchema,
	chatsList: ChatsListInputSchema,
	chatsSetMuted: ChatsSetMutedInputSchema,
	chatsDelete: ChatsDeleteInputSchema,
	usersMe: UsersMeInputSchema,
	filesUploadRequest: FilesUploadRequestInputSchema,
} as const;

export const PushbulletEndpointOutputSchemas = {
	pushesCreate: PushSchema,
	pushesList: PushesListResponseSchema,
	pushesUpdate: PushSchema,
	pushesDelete: EmptyResponseSchema,
	pushesDeleteAll: EmptyResponseSchema,
	devicesRegister: DeviceSchema,
	devicesList: DevicesListResponseSchema,
	devicesUpdate: DeviceSchema,
	devicesDelete: EmptyResponseSchema,
	chatsCreate: ChatSchema,
	chatsList: ChatsListResponseSchema,
	chatsSetMuted: ChatSchema,
	chatsDelete: EmptyResponseSchema,
	usersMe: UserSchema,
	filesUploadRequest: UploadRequestResponseSchema,
} as const;

export type PushbulletEndpointInputs = {
	[K in keyof typeof PushbulletEndpointInputSchemas]: z.infer<
		(typeof PushbulletEndpointInputSchemas)[K]
	>;
};

export type PushbulletEndpointOutputs = {
	[K in keyof typeof PushbulletEndpointOutputSchemas]: z.infer<
		(typeof PushbulletEndpointOutputSchemas)[K]
	>;
};

export type PushbulletPush = z.infer<typeof PushSchema>;
export type PushbulletDevice = z.infer<typeof DeviceSchema>;
export type PushbulletChat = z.infer<typeof ChatSchema>;
export type PushbulletUser = z.infer<typeof UserSchema>;

export { PushSchema, DeviceSchema, ChatSchema, UserSchema };
