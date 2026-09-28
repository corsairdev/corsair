function StorageColumn({
	label,
	where,
	detail,
	tone,
}: {
	label: string;
	where: string;
	detail: string;
	tone: 'neutral' | 'corsair';
}) {
	const isCorsair = tone === 'corsair';

	return (
		<div
			className={`flex flex-1 flex-col rounded-lg border px-4 py-5 ${
				isCorsair
					? 'border-[#bbf7d0] bg-[#f0fdf4]'
					: 'border-[#fecaca] bg-[#fef2f2]'
			}`}
		>
			<p
				className={`font-[family-name:var(--landing-font-mono)] text-[10px] font-semibold uppercase tracking-wider ${
					isCorsair ? 'text-[#166534]' : 'text-[#991b1b]'
				}`}
			>
				{label}
			</p>
			<p
				className={`mt-3 text-sm font-medium ${
					isCorsair ? 'text-[#166534]' : 'text-[#991b1b]'
				}`}
			>
				{where}
			</p>
			<p
				className={`mt-1 text-xs leading-relaxed ${
					isCorsair ? 'text-[#166534]/80' : 'text-[#991b1b]/80'
				}`}
			>
				{detail}
			</p>
		</div>
	);
}

export function CredentialStorageVisual() {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
			<StorageColumn
				label="Nango"
				where="Tokens on Nango"
				detail="Cloud stores OAuth tokens on their infrastructure. Self-hosting moves ops to you."
				tone="neutral"
			/>
			<StorageColumn
				label="Corsair Hub"
				where="Tokens in your DB"
				detail="User tokens encrypted under your KEK. Hub relays OAuth only — it stores zero tenant credentials."
				tone="corsair"
			/>
		</div>
	);
}
