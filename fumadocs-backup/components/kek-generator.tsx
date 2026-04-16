'use client';

import { useEffect, useState } from 'react';

function generateKek(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return btoa(String.fromCharCode(...array));
}

export function KekGenerator() {
	const [kek, setKek] = useState('');
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		setKek(generateKek());
	}, []);

	function handleGenerate() {
		setKek(generateKek());
		setCopied(false);
	}

	function handleCopy() {
		if (!kek) return;
		navigator.clipboard.writeText(`CORSAIR_KEK="${kek}"`);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<div className="my-4 rounded-lg border border-fd-border bg-fd-card overflow-hidden">
			<div className="flex items-center justify-between px-4 py-3 border-b border-fd-border bg-fd-muted/40">
				<span className="text-sm font-medium text-fd-muted-foreground">
					.env
				</span>
				<div className="flex items-center gap-2">
					<button
						onClick={handleCopy}
						className="text-xs px-2 py-1 rounded border border-fd-border bg-fd-muted hover:bg-fd-accent transition-colors text-fd-muted-foreground"
					>
						{copied ? 'Copied!' : 'Copy'}
					</button>
					<button
						onClick={handleGenerate}
						className="text-xs px-3 py-1.5 rounded-md bg-fd-primary text-fd-primary-foreground font-medium hover:opacity-90 transition-opacity"
					>
						Regenerate
					</button>
				</div>
			</div>
			<div className="px-4 py-3 font-mono text-sm text-fd-muted-foreground">
				{'CORSAIR_KEK='}
				<span className="text-fd-foreground">{`"${kek}"`}</span>
			</div>
		</div>
	);
}
