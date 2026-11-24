'use client';

import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useReducer,
	useRef,
	useState,
} from 'react';

import { handleProblem } from '@/lib/claim-handle';
import { buildHubUrl } from '@/lib/claim-hub-url';
import type { Blocker, Passage, PassageEvent } from '@/lib/claim-passage';
import {
	advance,
	blocker,
	claimLapsed,
	claimReady,
	prefill,
	restore,
	STEPS,
	save,
	start,
} from '@/lib/claim-passage';

import { useHandleAvailability } from './use-handle-availability';

const DRAFT_KEY = 'corsair:start-draft';
const FIRST_PAINT = start('');

type Action = PassageEvent | { type: 'load'; passage: Passage };

const stepIndex = (search: string) =>
	Math.max(
		0,
		STEPS.findIndex((s) => s === new URLSearchParams(search).get('step')),
	);

function readDraft(): string | null {
	try {
		return window.sessionStorage.getItem(DRAFT_KEY);
	} catch {
		return null;
	}
}

/**
 * The /start steps. The step lives in the URL so browser Back works; the draft
 * in sessionStorage so a refresh keeps it. Ported from lug.dev's
 * claim/use-passage.ts.
 */
export function usePassage(
	appIds: ReadonlySet<string>,
	skillSlugs: ReadonlySet<string>,
) {
	// null until the saved draft is read, so nothing is written back before it is.
	const [loaded, dispatch] = useReducer(
		(p: Passage | null, a: Action): Passage | null =>
			a.type === 'load' ? a.passage : p && advance(p, a, appIds),
		null,
	);
	// Arrived from the homepage form with a free name: that was the claim.
	const [claimedOnArrival, setClaimedOnArrival] = useState(false);
	// A load (first paint, browser Back) rewrites the URL in place; only a step forward adds history.
	const replaceNext = useRef(true);

	const load = useCallback(() => {
		replaceNext.current = true;
		const passage = restore(
			window.location.search,
			readDraft(),
			navigator.userAgent,
			appIds,
			skillSlugs,
		);
		dispatch({ type: 'load', passage });
		return passage;
	}, [appIds, skillSlugs]);

	useLayoutEffect(() => {
		const passage = load();
		const fromLink = prefill(window.location.search, appIds, skillSlugs).handle;
		setClaimedOnArrival(fromLink !== '' && passage.step !== 'claim');
	}, [load, appIds, skillSlugs]);

	useEffect(() => {
		const onPop = () => load();
		window.addEventListener('popstate', onPop);
		return () => window.removeEventListener('popstate', onPop);
	}, [load]);

	useEffect(() => {
		if (!loaded) return;
		const { search, saved } = save(loaded);
		try {
			window.sessionStorage.setItem(DRAFT_KEY, saved);
		} catch {
			// Storage blocked: the steps still work, a refresh starts over.
		}
		const replace = replaceNext.current;
		replaceNext.current = false;
		if (search === window.location.search) return;
		const forward =
			!replace &&
			STEPS.indexOf(loaded.step) > stepIndex(window.location.search);
		window.history[forward ? 'pushState' : 'replaceState'](
			null,
			'',
			(search || window.location.pathname) + window.location.hash,
		);
	}, [loaded]);

	const ready = loaded !== null;
	const p = loaded ?? FIRST_PAINT;
	const availability = useHandleAvailability(p.handle);

	// The handle is checked again on every step; one that can no longer be claimed goes back to the name step.
	const lapsed = loaded !== null && claimLapsed(loaded, availability);
	useEffect(() => {
		if (lapsed) dispatch({ type: 'goto', step: 'claim' });
	}, [lapsed]);

	const onNameStep = p.step === 'claim' && !handleProblem(p.handle);
	const unavailable =
		onNameStep &&
		availability.status === 'ready' &&
		!availability.data.available
			? availability.data
			: null;
	const checking =
		onNameStep &&
		p.handle !== '' &&
		(availability.status === 'checking' || availability.status === 'idle');
	const localProblem = blocker(p);
	const problem: Blocker | null =
		localProblem ?? unavailable?.reason ?? (checking ? 'checking' : null);
	const nameReady = claimReady(p.handle, availability);

	const send = useCallback(
		(e: PassageEvent) => {
			if (!loaded) return;
			if (e.type === 'next' && loaded.step === 'claim' && !nameReady) return;
			dispatch(e);
		},
		[loaded, nameReady],
	);

	const href = useMemo(() => {
		try {
			return buildHubUrl(p);
		} catch {
			return null;
		}
	}, [p]);

	return {
		p,
		send,
		ready,
		problem,
		claimReady: nameReady,
		checkFailed: onNameStep && availability.status === 'error',
		suggestion:
			unavailable?.reason === 'taken' ? unavailable.suggestion : undefined,
		claimedOnArrival,
		href,
	};
}

export type PassageApi = ReturnType<typeof usePassage>;
