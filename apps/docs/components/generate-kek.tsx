'use client';

import { useEffect, useState } from 'react';

type CopyState = 'idle' | 'copied' | 'failed';

function copyLabel(state: CopyState) {
	if (state === 'copied') return '✓ Copied';
	if (state === 'failed') return 'Copy failed: select the text';
	return 'Copy';
}

export function GenerateKEK() {
	const [key, setKey] = useState('');
	const [copiedCmd, setCopiedCmd] = useState<CopyState>('idle');
	const [copiedEnv, setCopiedEnv] = useState<CopyState>('idle');

	const generate = () => {
		const bytes = new Uint8Array(32);
		crypto.getRandomValues(bytes);
		setKey(btoa(String.fromCharCode(...bytes)));
	};

	useEffect(() => {
		generate();
	}, []);

	// "Copied" only once the write succeeds: it rejects when clipboard access
	// is denied, and the text stays on screen to copy by hand.
	const copy = async (text: string, setter: (value: CopyState) => void) => {
		try {
			await navigator.clipboard.writeText(text);
			setter('copied');
		} catch {
			setter('failed');
		}
		setTimeout(() => setter('idle'), 2000);
	};

	const envValue = `CORSAIR_KEK="${key || 'loading...'}"`;

	const blockStyle = {
		borderRadius: '0.5rem',
		overflow: 'hidden',
		border: '1px solid var(--border, rgba(255,255,255,0.1))',
		backgroundColor: 'var(--code-background, #0d1117)',
		fontFamily: 'var(--font-mono, ui-monospace, monospace)',
		fontSize: '0.8125rem',
		lineHeight: '1.6',
	};
	const headerStyle = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '0.375rem 0.75rem',
		borderBottom: '1px solid var(--border, rgba(255,255,255,0.1))',
	};
	const labelStyle = {
		fontSize: '0.75rem',
		color: 'var(--muted-foreground, rgba(255,255,255,0.4))',
	};
	const btnGroupStyle = {
		display: 'flex',
		alignItems: 'center',
		gap: '0.375rem',
	};
	const btnStyle = {
		display: 'inline-flex',
		alignItems: 'center',
		gap: '0.3rem',
		padding: '0.2rem 0.6rem',
		borderRadius: '0.375rem',
		fontSize: '0.7rem',
		fontWeight: 500,
		cursor: 'pointer',
		transition: 'opacity 0.15s',
		border: '1px solid var(--border, rgba(255,255,255,0.15))',
		backgroundColor: 'var(--muted, rgba(255,255,255,0.06))',
		color: 'var(--foreground, rgba(255,255,255,0.75))',
		fontFamily: 'var(--font-sans, sans-serif)',
	};
	const generateBtnStyle = {
		...btnStyle,
		backgroundColor: 'var(--primary, #2d7387)',
		border: '1px solid transparent',
		color: '#fff',
	};
	const codeStyle = {
		display: 'block',
		padding: '0.75rem 1rem',
		color: 'var(--code-foreground, rgba(255,255,255,0.85))',
		whiteSpace: 'pre' as const,
		overflowX: 'auto' as const,
		margin: 0,
		background: 'none',
	};

	return (
		<div
			className="not-prose"
			style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}
		>
			<div style={blockStyle}>
				<div style={headerStyle}>
					<span style={labelStyle}>bash</span>
					<button
						type="button"
						style={btnStyle}
						onClick={() => copy('openssl rand -base64 32', setCopiedCmd)}
					>
						{copyLabel(copiedCmd)}
					</button>
				</div>
				<pre style={{ margin: 0 }}>
					<code style={codeStyle}>openssl rand -base64 32</code>
				</pre>
			</div>
			<div style={blockStyle}>
				<div style={headerStyle}>
					<span style={labelStyle}>.env</span>
					<div style={btnGroupStyle}>
						<button type="button" style={generateBtnStyle} onClick={generate}>
							Regenerate
						</button>
						<button
							type="button"
							style={btnStyle}
							onClick={() => copy(envValue, setCopiedEnv)}
						>
							{copyLabel(copiedEnv)}
						</button>
					</div>
				</div>
				<pre style={{ margin: 0 }}>
					<code style={codeStyle}>{envValue}</code>
				</pre>
			</div>
		</div>
	);
}
