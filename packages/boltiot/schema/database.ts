import { z } from 'zod';

/**
 * Bolt Cloud command envelope.
 *
 * Official: https://cloud.boltiot.com/apiDoc
 * Official Python SDK examples: `{"success": "1", "value": "..."}`
 * Live Cloud API also returns numeric `success` (`1` / `0`).
 *
 * `isOnline` additionally returns `time` (Python SDK:
 * `{"success": "1", "value": "online", "time": "Sun 2018-05-06 08:14:43 UTC"}`).
 */
export const BoltIotCommand = z
	.object({
		success: z.union([
			z.literal('1'),
			z.literal('0'),
			z.literal(1),
			z.literal(0),
		]),
		value: z.union([z.string(), z.number(), z.record(z.string(), z.unknown())]),
		time: z.string().optional(),
	})
	.loose();

export type BoltIotCommand = z.infer<typeof BoltIotCommand>;

/**
 * Bolt device identifier used as `deviceName` on every remote command.
 *
 * Official request form:
 * `https://cloud.boltiot.com/remote/{api_key}/{command}?deviceName=BOLTXXXXXX`
 */
export const BoltIotDevice = z
	.object({
		deviceName: z.string(),
	})
	.loose();

export type BoltIotDevice = z.infer<typeof BoltIotDevice>;
