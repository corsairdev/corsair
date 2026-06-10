'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { updateIntegrationUrls } from '../../oss-integrations/actions';

type IntegrationUrls = {
	issueUrl: string | null;
	prUrl: string | null;
	docsUrl: string | null;
};

const fields = [
	{
		name: 'issueUrl' as const,
		label: 'Issue URL',
		placeholder: 'github.com/org/repo/issues/123',
	},
	{
		name: 'prUrl' as const,
		label: 'PR URL',
		placeholder: 'github.com/org/repo/pull/456',
	},
	{
		name: 'docsUrl' as const,
		label: 'Docs URL',
		placeholder: 'docs.example.com/integration',
	},
];

export function IntegrationUrlsForm({
	integrationId,
	urls,
}: {
	integrationId: string;
	urls: IntegrationUrls;
}) {
	const router = useRouter();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const formKey = [
		urls.issueUrl ?? '',
		urls.prUrl ?? '',
		urls.docsUrl ?? '',
	].join('|');

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
			setError(err instanceof Error ? err.message : 'Failed to save URLs');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form key={formKey} onSubmit={handleSubmit}>
			<input type="hidden" name="integrationId" value={integrationId} />
			<div className="grid gap-3">
				{fields.map((field) => (
					<label key={field.name}>
						<Badge variant="outline" className="mb-1.5 text-[10px] uppercase">
							{field.label}
						</Badge>
						<input
							type="text"
							name={field.name}
							defaultValue={urls[field.name] ?? ''}
							placeholder={field.placeholder}
							className="w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm shadow-sm transition-all focus:border-border focus:ring-2 focus:ring-foreground/5 focus:outline-none"
						/>
					</label>
				))}
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-3">
				<Button
					type="submit"
					disabled={loading}
					size="sm"
					className="rounded-lg"
				>
					{loading ? 'Saving...' : 'Save URLs'}
				</Button>
				{success ? <Badge variant="success">URLs saved</Badge> : null}
				{error ? (
					<span className="text-xs text-destructive">{error}</span>
				) : null}
			</div>
		</form>
	);
}
