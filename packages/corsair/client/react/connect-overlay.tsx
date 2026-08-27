'use client';

import type { ReactElement } from 'react';
import type { ConnectState } from './connect-controller';

export type ConnectAppearance = {
	theme?: 'light' | 'dark';
};

// Full-screen overlay (max z-index, not an iframe) shown while a connect flow is
// active. The user clicks through to Hub's connect page in a popup — opening it
// from the click keeps the browser's popup blocker happy.
export function ConnectOverlay({
	state,
	appearance,
	onOpen,
	onClose,
}: {
	state: ConnectState;
	appearance?: ConnectAppearance;
	onOpen: () => void;
	onClose: () => void;
}): ReactElement {
	const dark = appearance?.theme === 'dark';
	const fg = dark ? '#f5f5f5' : '#111';
	const bg = dark ? '#1b1b1b' : '#fff';
	const accent = '#4f46e5';
	const plugin = state.plugin ?? 'this integration';
	const connected = state.phase === 'success';

	return (
		<div
			role="dialog"
			aria-modal="true"
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 2147483647,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'rgba(0,0,0,0.5)',
			}}
		>
			<div
				style={{
					width: 'min(92vw, 380px)',
					borderRadius: 12,
					background: bg,
					color: fg,
					padding: 24,
					boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
					fontFamily: 'system-ui, sans-serif',
				}}
			>
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					style={{
						float: 'right',
						border: 'none',
						background: 'transparent',
						color: fg,
						fontSize: 20,
						cursor: 'pointer',
					}}
				>
					×
				</button>
				{connected ? (
					<>
						<h2 style={{ margin: '0 0 8px', fontSize: 18 }}>Connected</h2>
						<p style={{ margin: 0, opacity: 0.8 }}>
							{plugin} is connected — you can continue.
						</p>
					</>
				) : (
					<>
						<h2 style={{ margin: '0 0 8px', fontSize: 18 }}>
							Connect {plugin}
						</h2>
						<p style={{ margin: '0 0 20px', opacity: 0.8 }}>
							Sign in to {plugin} to continue where you left off.
						</p>
						<button
							type="button"
							onClick={onOpen}
							style={{
								width: '100%',
								padding: '10px 16px',
								borderRadius: 8,
								border: 'none',
								background: accent,
								color: '#fff',
								fontSize: 15,
								fontWeight: 600,
								cursor: 'pointer',
							}}
						>
							Connect {plugin}
						</button>
					</>
				)}
			</div>
		</div>
	);
}
