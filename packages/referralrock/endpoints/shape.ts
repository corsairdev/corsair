import { asRecord } from 'corsair/core';
import { ReferralrockAPIError } from '../client';

/**
 * A body that is not the envelope an operation expects is a broken assumption
 * about the API, so it fails loudly instead of parsing as an empty success.
 */
function unexpected(operation: string): ReferralrockAPIError {
	return new ReferralrockAPIError(
		`Referral Rock answered ${operation} with a body that is not the documented shape`,
	);
}

/**
 * Referral Rock answers a collection as `{ offset, total, message, <key>: [] }`.
 * The array key differs per resource, so it is passed in.
 *
 * `next_offset` is derived from `offset` plus the rows returned, and is null once
 * they have reached `total`. It is derived here rather than in a zod transform
 * because the docs generator reads a transform's input side and would omit it.
 */
export function setShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		const rows = record?.[key];
		const offset = record?.offset;
		const total = record?.total;
		const returned = Array.isArray(rows) ? rows.length : 0;
		const hasNext =
			typeof offset === 'number' &&
			typeof total === 'number' &&
			returned > 0 &&
			offset + returned < total;
		return {
			[key]: rows,
			offset: typeof offset === 'number' ? offset : null,
			total: typeof total === 'number' ? total : null,
			next_offset: hasNext ? (offset as number) + returned : null,
			message: record?.message,
		};
	};
}

/**
 * A single record answer names it beside a `message`, so the named key is
 * lifted and the message kept. An explicit refusal such as
 * `{ member: null, message: '...' }` is still returned; a body with neither
 * field (an array, text, another object) throws.
 */
export function singleShape(key: string) {
	return (
		raw: unknown,
		// unknown: the operation input, unused by this shaper.
		_parsed: unknown,
	) => {
		const record = asRecord(raw);
		if (!record || !(key in record || 'message' in record)) {
			throw unexpected(`a ${key} create`);
		}
		return {
			[key]: record[key],
			message: record.message,
		};
	};
}

/**
 * `POST /api/rewards` answers an **array** of results, one per reward info sent,
 * each `{ memberQuery, referralQuery, reward, resultInfo: { Status, Message } }`.
 * The plugin sends one reward info, so the first result is lifted. A refused
 * create still answers 200, with `reward: null` and `resultInfo.Status` of
 * `Failed`, so that is thrown with Referral Rock's message.
 */
export function rewardResultShape(
	raw: unknown,
	// unknown: the operation input, unused by this shaper.
	_parsed: unknown,
) {
	const first = Array.isArray(raw) ? raw[0] : undefined;
	const record = asRecord(first);
	if (!record) throw unexpected('a reward create');
	const resultInfo = asRecord(record.resultInfo);
	const status = resultInfo?.Status;
	if (typeof status === 'string' && status.toLowerCase() === 'failed') {
		const message = resultInfo?.Message;
		throw new ReferralrockAPIError(
			`Referral Rock refused the reward: ${typeof message === 'string' ? message : 'no reason given'}`,
			{
				status: 200,
				detail: typeof message === 'string' ? message : undefined,
			},
		);
	}
	return {
		reward: record.reward,
		status: resultInfo?.Status,
		message: resultInfo?.Message,
	};
}
