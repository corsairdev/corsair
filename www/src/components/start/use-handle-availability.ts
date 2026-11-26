'use client';

import { useEffect, useState } from 'react';

import { handleProblem } from '@/lib/claim-handle';
import type { HandleAvailabilityState } from '@/lib/claim-passage';
import { readLugHandleAnswer } from '@/lib/lug-handle';

const SETTLE_MS = 400;
const IDLE: HandleAvailabilityState = { status: 'idle' };

/**
 * Hub's answer for a handle, asked once typing settles. A handle that breaks
 * the local rules isn't asked about. An answer counts only for the handle it
 * was asked for, so a fast edit never inherits the last name's "free".
 */
export function useHandleAvailability(handle: string): HandleAvailabilityState {
	const asked = handle && !handleProblem(handle) ? handle : '';
	const [answer, setAnswer] = useState<{
		handle: string;
		state: HandleAvailabilityState;
	} | null>(null);

	useEffect(() => {
		if (!asked) return;
		const controller = new AbortController();
		const timer = window.setTimeout(async () => {
			setAnswer({ handle: asked, state: { status: 'checking' } });
			try {
				const res = await fetch(
					`/api/lug-handle?${new URLSearchParams({ handle: asked })}`,
					{ signal: controller.signal },
				);
				const body = res.ok
					? readLugHandleAnswer(await res.json().catch(() => null))
					: null;
				if (controller.signal.aborted) return;
				setAnswer({
					handle: asked,
					state: body ? { status: 'ready', data: body } : { status: 'error' },
				});
			} catch {
				if (!controller.signal.aborted) {
					setAnswer({ handle: asked, state: { status: 'error' } });
				}
			}
		}, SETTLE_MS);
		return () => {
			window.clearTimeout(timer);
			controller.abort();
		};
	}, [asked]);

	return asked && answer?.handle === asked ? answer.state : IDLE;
}
