'use client';

import type { CSSProperties, ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type {
	ConnectionStatus,
	PluginConnectionState,
} from '../../core/management/types';
import type { CorsairManagementClient } from '../types';
import type { ConnectState } from './connect-controller';
import { CORSAIR_MARK } from './corsair-mark';
import { PluginIcon, pluginToDomain, titleCasePlugin } from './plugin-icon';

export type ConnectTheme = 'light' | 'dark' | 'auto';

/**
 * How the connect dialog looks. Pass the shorthand string (`appearance="dark"`)
 * or the object form (`appearance={{ theme: 'dark' }}`) — both are accepted.
 * Defaults to `'auto'`, which follows the host's `prefers-color-scheme`.
 */
export type ConnectAppearance = ConnectTheme | { theme?: ConnectTheme };

function resolveTheme(
	a: ConnectAppearance | undefined,
): ConnectTheme | undefined {
	return typeof a === 'string' ? a : a?.theme;
}

// Resolve the effective dark flag: an explicit light/dark wins; otherwise follow
// the host app's color scheme and react to changes.
function useDark(theme: ConnectTheme | undefined): boolean {
	const [dark, setDark] = useState(theme === 'dark');
	useEffect(() => {
		if (theme === 'dark' || theme === 'light') {
			setDark(theme === 'dark');
			return;
		}
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		setDark(mq.matches);
		const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	}, [theme]);
	return dark;
}

const ACCENT = '#4a38f5';
const INK = '#1c1c1c';
const SUCCESS = '#1a7f4b';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const SANS =
	'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif';

const STYLES = `
@keyframes corsair-fade { from { opacity: 0 } to { opacity: 1 } }
@keyframes corsair-rise {
	from { opacity: 0; transform: translateY(8px) scale(0.985) }
	to { opacity: 1; transform: none }
}
.corsair-scrim { animation: corsair-fade 150ms ease-out }
.corsair-card { animation: corsair-rise 240ms cubic-bezier(0.2,0.8,0.2,1) }
.corsair-primary { transition: background 120ms ease, transform 90ms ease }
.corsair-primary:hover { background: var(--corsair-primary-hover, #000) }
.corsair-primary:active { transform: translateY(1px) }
.corsair-ghost { transition: color 120ms ease }
.corsair-roster { transition: background 120ms ease }
.corsair-roster:hover { background: #1c1c1c05 }
.corsair-primary:focus-visible, .corsair-ghost:focus-visible, .corsair-roster:focus-visible {
	outline: 2px solid ${ACCENT}; outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) { .corsair-scrim, .corsair-card { animation: none } }
`;

function isConnected(state: PluginConnectionState): boolean {
	return state === 'connected';
}

// The tenant's other integrations — read-only, collapsed by default.
function ConnectionsRoster({
	client,
	activePlugin,
	ink,
	muted,
	faint,
	border,
	hair,
}: {
	client: CorsairManagementClient;
	activePlugin: string | null;
	ink: string;
	muted: string;
	faint: string;
	border: string;
	hair: string;
}): ReactElement | null {
	const [statuses, setStatuses] = useState<ConnectionStatus | null>(null);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		let live = true;
		client.connectionStatus
			.get()
			.then((s) => {
				if (live) setStatuses(s);
			})
			.catch(() => {});
		return () => {
			live = false;
		};
	}, [client]);

	const others = statuses
		? Object.entries(statuses).filter(([id]) => id !== activePlugin)
		: [];
	if (others.length === 0) return null;

	const connectedCount = others.filter(([, s]) => isConnected(s)).length;

	return (
		<div
			style={{ marginTop: 12, borderTop: `1px solid ${hair}`, paddingTop: 12 }}
		>
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				className="corsair-roster"
				style={{
					display: 'flex',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 8,
					padding: '7px 8px',
					borderRadius: 8,
					border: 'none',
					background: 'transparent',
					cursor: 'pointer',
				}}
			>
				<span
					style={{
						fontFamily: MONO,
						fontSize: 10.5,
						fontWeight: 500,
						letterSpacing: '0.06em',
						textTransform: 'uppercase',
						color: faint,
					}}
				>
					Your connections
				</span>
				<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<span style={{ fontSize: 12, fontWeight: 500, color: muted }}>
						{connectedCount}/{others.length}
					</span>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						aria-hidden
						style={{
							transform: open ? 'rotate(180deg)' : 'none',
							transition: 'transform 160ms ease',
						}}
					>
						<path
							d="M3 4.5L6 7.5L9 4.5"
							stroke={faint}
							strokeWidth="1.3"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</button>

			{open ? (
				<ul style={{ listStyle: 'none', margin: '4px 0 0', padding: 0 }}>
					{others.map(([id, state]) => {
						const name = titleCasePlugin(id);
						const connected = isConnected(state);
						return (
							<li
								key={id}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: 10,
									padding: '7px 8px',
									borderRadius: 8,
								}}
							>
								<PluginIcon
									domain={pluginToDomain(id)}
									label={name}
									size={20}
								/>
								<span style={{ flex: 1, fontSize: 13, color: ink }}>
									{name}
								</span>
								<span
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 6,
										fontSize: 11.5,
										color: connected ? SUCCESS : faint,
									}}
								>
									<span
										style={{
											width: 6,
											height: 6,
											borderRadius: 999,
											background: connected ? SUCCESS : border,
										}}
									/>
									{connected ? 'Connected' : 'Not connected'}
								</span>
							</li>
						);
					})}
				</ul>
			) : null}
		</div>
	);
}

/**
 * Centered dialog shown while a connect flow is active. Deliberately minimal —
 * the provider mark, the action, and a trust line. The full consent screen (org,
 * scopes, credential fields) lives on the Hub connect page the button opens; this
 * overlay only gets the user there. Opening the popup from the click keeps the
 * popup blocker happy; the provider polls and resolves once connected.
 */
export function ConnectOverlay({
	state,
	client,
	appearance,
	onOpen,
	onClose,
}: {
	state: ConnectState;
	client: CorsairManagementClient;
	appearance?: ConnectAppearance;
	onOpen: () => void;
	onClose: () => void;
}): ReactElement {
	const connected = state.phase === 'success';

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onClose();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [onClose]);

	const dark = useDark(resolveTheme(appearance));
	const surface = dark ? '#141414' : '#fff';
	const ink = dark ? '#f5f5f5' : INK;
	const muted = dark ? '#f5f5f5cc' : `${INK}a6`;
	const faint = dark ? '#f5f5f599' : `${INK}80`;
	const border = dark ? '#ffffff1f' : `${INK}1a`;
	const hair = dark ? '#ffffff12' : `${INK}0d`;
	// CTA inverts with the theme so it reads against the surface: dark button on
	// a light card, light button on a dark card.
	const primaryBg = dark ? '#f5f5f5' : INK;
	const primaryFg = dark ? INK : '#fff';
	const primaryHover = dark ? '#ffffff' : '#000';

	const pluginId = state.plugin ?? '';
	const name = pluginId ? titleCasePlugin(pluginId) : 'your account';
	const domain = pluginToDomain(pluginId);
	const iconShadow = dark
		? 'drop-shadow(0 8px 18px rgba(0,0,0,0.55))'
		: 'drop-shadow(0 8px 16px rgba(20,18,40,0.22))';

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="corsair-connect-title"
			className="corsair-scrim"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 2147483647,
				display: 'flex',
				// Top-anchored (not centered) so the card grows downward when the
				// accordion opens — the top stays put. Scroll a tall card.
				alignItems: 'flex-start',
				justifyContent: 'center',
				padding: 16,
				overflowY: 'auto',
				background: 'rgba(20,20,22,0.5)',
				backdropFilter: 'blur(3px)',
				fontFamily: SANS,
			}}
		>
			<style>{STYLES}</style>
			<div
				style={{
					position: 'relative',
					width: 'min(94vw, 380px)',
					marginTop: 'clamp(40px, 20vh, 180px)',
					marginBottom: 16,
				}}
			>
				<div
					className="corsair-card"
					style={
						{
							overflow: 'hidden',
							borderRadius: 18,
							border: `1px solid ${border}`,
							background: surface,
							boxShadow:
								'0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 80px -12px rgba(20,18,40,0.34), 0 6px 18px -6px rgba(20,18,40,0.16)',
							'--corsair-primary-hover': primaryHover,
						} as CSSProperties
					}
				>
					{connected ? (
						<div style={{ padding: '40px 24px', textAlign: 'center' }}>
							<div
								style={{
									width: 48,
									height: 48,
									margin: '0 auto 14px',
									borderRadius: 999,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									background: dark ? '#0f3d26' : '#eafaf0',
								}}
							>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke={SUCCESS}
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden
								>
									<path d="M20 6L9 17l-5-5" />
								</svg>
							</div>
							<p
								id="corsair-connect-title"
								style={{
									margin: 0,
									fontSize: 15.5,
									fontWeight: 700,
									color: ink,
								}}
							>
								{name} connected
							</p>
							<p style={{ margin: '5px 0 0', fontSize: 13, color: muted }}>
								Taking you back.
							</p>
						</div>
					) : (
						<div style={{ padding: '32px 22px 18px' }}>
							{/* Provider hero — the mark, then the title */}
							<div
								style={{
									position: 'relative',
									textAlign: 'center',
								}}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<span style={{ filter: iconShadow }}>
										<PluginIcon
											domain={domain}
											label={name}
											size={52}
											radius={14}
										/>
									</span>
								</div>
								<h2
									id="corsair-connect-title"
									style={{
										position: 'relative',
										margin: '18px 0 0',
										fontSize: 20,
										fontWeight: 700,
										letterSpacing: '-0.03em',
										color: ink,
									}}
								>
									Connect {name}
								</h2>
							</div>

							<div
								style={{
									margin: '20px 0 0',
								}}
							>
								<button
									type="button"
									onClick={onOpen}
									className="corsair-primary"
									autoFocus
									style={{
										display: 'flex',
										width: '100%',
										alignItems: 'center',
										justifyContent: 'center',
										gap: 9,
										padding: '12px 16px',
										borderRadius: 11,
										border: 'none',
										background: primaryBg,
										color: primaryFg,
										fontSize: 13.5,
										fontWeight: 700,
										cursor: 'pointer',
									}}
								>
									Continue
								</button>

								<button
									type="button"
									onClick={onClose}
									className="corsair-ghost"
									style={{
										display: 'block',
										margin: '10px auto 0',
										padding: '4px 10px',
										border: 'none',
										background: 'transparent',
										color: faint,
										fontSize: 12.5,
										fontWeight: 500,
										cursor: 'pointer',
									}}
								>
									Not now
								</button>
							</div>

							<ConnectionsRoster
								client={client}
								activePlugin={state.plugin}
								ink={ink}
								muted={muted}
								faint={faint}
								border={border}
								hair={hair}
							/>
						</div>
					)}

					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 6,
							padding: '11px 18px',
							borderTop: `1px solid ${hair}`,
						}}
					>
						<span style={{ fontSize: 11, fontWeight: 500, color: faint }}>
							Secured by
						</span>
						<img
							src={CORSAIR_MARK}
							alt=""
							width={15}
							height={15}
							style={{ display: 'block' }}
						/>
						<span
							style={{
								fontSize: 12.5,
								fontWeight: 600,
								letterSpacing: '-0.02em',
								color: muted,
							}}
						>
							Corsair
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
