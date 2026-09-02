'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { resolveBoundaryAction } from './connect-controller';
import { useCorsair } from './provider';

/** Props Next.js passes to an `error.tsx` segment boundary. */
export type CorsairErrorBoundaryProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

/**
 * Drop-in `error.tsx` for a Corsair read region. When a Server Component throws
 * because the tenant hasn't connected, Next routes the error to the segment's
 * `error.tsx` (a client boundary nested in the page can't catch a Server
 * Component's render error). This boundary asks the provider whether a
 * connect-request is pending: if so it opens the dialog and, once connected,
 * calls `reset()` to re-run the now-connected read. A genuine error is rethrown
 * so your own error handling still sees it.
 *
 * ```tsx
 * // app/inbox/error.tsx
 * 'use client';
 * export { CorsairErrorBoundary as default } from 'corsair/client/react';
 * ```
 *
 * Must render under a {@link CorsairProvider} — put the provider in your root
 * layout so it wraps every segment's `error.tsx`.
 */
export function CorsairErrorBoundary({
	error,
	reset,
}: CorsairErrorBoundaryProps): ReactNode {
	const { requireConnect } = useCorsair();
	const [dismissed, setDismissed] = useState(false);
	const [fatal, setFatal] = useState(false);
	// One prompt per error instance: requireConnect resolves only when the user
	// finishes, so re-running it (StrictMode, re-render) would stack dialogs.
	const started = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		let active = true;
		requireConnect()
			.then((outcome) => {
				if (!active) return;
				const action = resolveBoundaryAction(outcome);
				if (action === 'retry') reset();
				else if (action === 'rethrow') setFatal(true);
				else setDismissed(true);
			})
			.catch(() => {
				if (active) setFatal(true);
			});
		return () => {
			active = false;
		};
	}, [requireConnect, reset]);

	// Not a connect failure — surface the real error to the next boundary up so
	// nothing gets swallowed.
	if (fatal) throw error;
	// User closed the dialog without connecting — offer a manual retry.
	if (dismissed) {
		return (
			<button type="button" onClick={reset}>
				Try again
			</button>
		);
	}
	// Deciding, or the dialog is open — the provider's overlay is what's on screen.
	return null;
}
