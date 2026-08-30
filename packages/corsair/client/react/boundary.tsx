'use client';

import type { ReactNode } from 'react';
import { Component } from 'react';
import type { RequireConnectOutcome } from './provider';
import { useCorsair } from './provider';

type InnerProps = {
	requireConnect: () => Promise<RequireConnectOutcome>;
	// The provider's connectNonce — bumps on each successful connect so we can
	// reset and re-render the (now-refreshed) children.
	resetKey: number;
	fallback: ReactNode;
	children: ReactNode;
};

type InnerState = { errored: boolean; showFallback: boolean };

class ConnectErrorBoundary extends Component<InnerProps, InnerState> {
	state: InnerState = { errored: false, showFallback: false };

	static getDerivedStateFromError(): Partial<InnerState> {
		return { errored: true, showFallback: false };
	}

	componentDidCatch(): void {
		// A caught error reaches the browser redacted, so we can't tell a connect
		// failure from a real one here. Ask the provider: if a connect-request is
		// pending it opens the dialog (and resetKey bumps on connect → we retry);
		// otherwise it's a genuine error → show the fallback.
		this.props
			.requireConnect()
			.then((outcome) => {
				if (outcome !== 'connected') this.setState({ showFallback: true });
			})
			.catch(() => this.setState({ showFallback: true }));
	}

	componentDidUpdate(prev: InnerProps): void {
		if (prev.resetKey !== this.props.resetKey && this.state.errored) {
			this.setState({ errored: false, showFallback: false });
		}
	}

	render(): ReactNode {
		if (this.state.errored) {
			return this.state.showFallback ? this.props.fallback : null;
		}
		return this.props.children;
	}
}

/** Props for {@link CorsairBoundary}. */
export type CorsairBoundaryProps = {
	/**
	 * Rendered when the region fails for a reason that isn't a pending connect,
	 * or when the user dismisses the dialog without connecting. Defaults to
	 * `null` (render nothing).
	 */
	fallback?: ReactNode;
	children: ReactNode;
};

/**
 * Wrap a server-rendered read region so an auth-missing failure inside it opens
 * the connect dialog and, once connected, retries — instead of crashing the
 * tree. This is the read-side counterpart to {@link useConnect}'s `call` (which
 * covers mutations). Pair with
 * `<CorsairProvider onConnected={() => router.refresh()}>` so the refreshed read
 * re-runs on connect.
 */
export function CorsairBoundary({
	fallback = null,
	children,
}: CorsairBoundaryProps): ReactNode {
	const { requireConnect, connectNonce } = useCorsair();
	return (
		<ConnectErrorBoundary
			requireConnect={requireConnect}
			resetKey={connectNonce}
			fallback={fallback}
		>
			{children}
		</ConnectErrorBoundary>
	);
}
