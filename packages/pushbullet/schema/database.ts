import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Only what a caller re-reads is cached. Devices are cached because every push
// targets one and their list is small and near-static. Pushes are cached
// because they are the account's message history and Pushbullet expires them
// from `list` after a retention window. Chats are not cached: they are few and
// change often (mute state), so a live read is cheaper than reconciling.
// ─────────────────────────────────────────────────────────────────────────────

export const PushbulletPush = z.object({
	/** Pushbullet `iden`. */
	id: z.string(),
	type: z.string().optional(),
	title: z.string().optional(),
	body: z.string().optional(),
	url: z.string().optional(),
	active: z.boolean().optional(),
	dismissed: z.boolean().optional(),
	direction: z.string().optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const PushbulletDevice = z.object({
	id: z.string(),
	nickname: z.string().optional(),
	manufacturer: z.string().optional(),
	model: z.string().optional(),
	icon: z.string().optional(),
	active: z.boolean().optional(),
	has_sms: z.boolean().optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type PushbulletPush = z.infer<typeof PushbulletPush>;
export type PushbulletDevice = z.infer<typeof PushbulletDevice>;
