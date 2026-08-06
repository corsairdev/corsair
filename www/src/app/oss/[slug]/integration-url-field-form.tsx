'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { updateIntegrationUrls } from '@/server/actions/update-integration-urls';

type UrlField = 'issueUrl' | 'prUrl' | 'docsUrl';

type IntegrationUrls = {
	issueUrl: string | null;
	prUrl: string | null;
	docsUrl: string | null;
};

const fieldConfig: Record<
	UrlField,
	{ label: string; placeholder: string; submitLabel: string }
> = {
	issueUrl: {
		label: 'Issue URL',
		placeholder: 'github.com/org/repo/issues/123',
		submitLabel: 'Save issue link',
	},
	prUrl: {
		label: 'PR URL',
		placeholder: 'github.com/org/repo/pull/456',
		submitLabel: 'Save PR link',
	},
	docsUrl: {
		label: 'Docs URL',
		placeholder: 'docs.example.com/integration',
		submitLabel: 'Save docs link',
	},
};

export function IntegrationUrlFieldForm({
	integrationId,
	urls,
	field,
	disabled = false,
}: {
	integrationId: string;
	urls: IntegrationUrls;
	field: UrlField;
	disabled?: boolean;
}) {
	const router = useRouter();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const config = fieldConfig[field];
	const savedValue = urls[field];
	const formKey = savedValue ?? '';

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError('');
		setSuccess(false);

		try {
			const formData = new FormData(event.currentTarget);
			await updateIntegrationUrls(formData);
			setSuccess(true);
			router.refresh();
		} catch (err) {
			setSuccess(false);
			setError(err instanceof Error ? err.message : 'Failed to save URL');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form key={formKey} onSubmit={handleSubmit} className="mt-4">
			<input type="hidden" name="integrationId" value={integrationId} />
			{field !== 'issueUrl' ? (
				<input type="hidden" name="issueUrl" value={urls.issueUrl ?? ''} />
			) : null}
			{field !== 'prUrl' ? (
				<input type="hidden" name="prUrl" value={urls.prUrl ?? ''} />
			) : null}
			{field !== 'docsUrl' ? (
				<input type="hidden" name="docsUrl" value={urls.docsUrl ?? ''} />
			) : null}

			<label className="block">
				<span className="font-[family-name:var(--font-landing-mono)] text-[11px] font-medium tracking-[0.02em] text-[#1c1c1c99] uppercase">
					{config.label}
				</span>
				<input
					type="text"
					name={field}
					defaultValue={savedValue ?? ''}
					placeholder={config.placeholder}
					disabled={disabled}
					className="mt-1.5 w-full rounded-lg border border-[#1c1c1c]/15 bg-white px-3 py-2 text-sm text-[#1c1c1c] shadow-sm transition-all focus:border-[#1c1c1c]/30 focus:ring-2 focus:ring-[#1c1c1c]/5 focus:outline-none disabled:opacity-60"
				/>
			</label>

			<div className="mt-3 flex flex-wrap items-center gap-3">
				<Button
					type="submit"
					disabled={loading || disabled}
					size="sm"
					className="rounded-lg"
				>
					{loading ? 'Saving...' : config.submitLabel}
				</Button>
				{success ? <Badge variant="success">Saved</Badge> : null}
				{error ? (
					<span className="text-xs text-destructive">{error}</span>
				) : null}
			</div>
		</form>
	);
}
