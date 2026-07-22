'use client';

import { X } from '@phosphor-icons/react';
import { TRPCClientError } from '@trpc/client';
import type { FormEvent } from 'react';
import { useEffect, useId, useState } from 'react';
import { FramedPanel } from '@/app/oss/framed-panel';
import { ENTERPRISE_CAL_URL } from '@/lib/site-links';
import { trpcBrowser } from '@/lib/trpc-browser';

const CTA_CLASS =
	'inline-flex w-full max-w-[140px] items-center justify-center rounded-full border border-[#1c1c1c] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#1c1c1c] transition-colors hover:bg-[#1c1c1c] hover:text-white font-[family-name:var(--landing-font-sans)]';

const INPUT_CLASS =
	'w-full rounded-sm border border-[#1c1c1c1a] bg-white px-3 py-2.5 text-sm text-[#1c1c1c] outline-none transition-colors placeholder:text-[#1c1c1c66] focus:border-[#1c1c1c33] font-[family-name:var(--landing-font-sans)]';

const LABEL_CLASS =
	'text-xs font-medium text-[#1c1c1c] font-[family-name:var(--landing-font-sans)]';

type FormState = {
	name: string;
	email: string;
	company: string;
	notes: string;
};

const INITIAL_FORM: FormState = {
	name: '',
	email: '',
	company: '',
	notes: '',
};

export function EnterpriseContactDialog() {
	const titleId = useId();
	const descriptionId = useId();
	const [open, setOpen] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [form, setForm] = useState<FormState>(INITIAL_FORM);

	const close = () => {
		setOpen(false);
	};

	const reset = () => {
		setSubmitted(false);
		setSubmitting(false);
		setError(null);
		setForm(INITIAL_FORM);
	};

	useEffect(() => {
		if (!open) {
			const timeoutId = window.setTimeout(reset, 200);
			return () => window.clearTimeout(timeoutId);
		}

		document.body.style.overflow = 'hidden';

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') close();
		};

		window.addEventListener('keydown', onKeyDown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [open]);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitting(true);
		setError(null);

		try {
			await trpcBrowser.contact.submitEnterpriseContact.mutate({
				name: form.name,
				email: form.email,
				company: form.company || undefined,
				notes: form.notes || undefined,
			});
			setSubmitted(true);
		} catch (submitError) {
			setError(
				submitError instanceof TRPCClientError
					? submitError.message
					: submitError instanceof Error
						? submitError.message
						: 'Failed to send your message. Please try again.',
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<button type="button" onClick={() => setOpen(true)} className={CTA_CLASS}>
				Contact us
			</button>

			{open ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
					role="dialog"
					aria-modal="true"
					aria-labelledby={titleId}
					aria-describedby={descriptionId}
				>
					<button
						type="button"
						aria-label="Close dialog"
						onClick={close}
						className="absolute inset-0 cursor-default bg-[#1c1c1c]/40 backdrop-blur-[2px]"
						tabIndex={-1}
					/>

					<FramedPanel className="relative w-full max-w-lg animate-in duration-300 fade-in zoom-in-95">
						<div className="px-6 py-6 sm:px-8 sm:py-8">
							<button
								type="button"
								onClick={close}
								aria-label="Close dialog"
								className="absolute top-4 right-4 p-1 text-[#1c1c1c40] transition-colors hover:text-[#1c1c1c]"
							>
								<X size={16} weight="bold" aria-hidden />
							</button>

							{submitted ? (
								<div className="flex flex-col gap-3 pr-6">
									<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
										Thank you!
									</p>
									<h2
										id={titleId}
										className="text-[clamp(1.5rem,3vw,1.875rem)] font-light leading-[1.15] tracking-[-0.01em] text-[#1c1c1c]"
									>
										<span className="font-[family-name:var(--landing-font-serif)]">
											We&apos;ll reach out to you probably in the next few
											hours.
										</span>
									</h2>
									<p
										id={descriptionId}
										className="text-sm leading-[1.65] text-[#1c1c1c99]"
									>
										Or{' '}
										<a
											href={ENTERPRISE_CAL_URL}
											target="_blank"
											rel="noopener noreferrer"
											className="font-medium text-[#1c1c1c] underline underline-offset-2 transition-colors hover:text-[#4a38f5]"
										>
											book a meeting here
										</a>
										.
									</p>
									<button
										type="button"
										onClick={close}
										className="mt-2 inline-flex w-fit items-center justify-center rounded-full border border-[#1c1c1c] bg-[#1c1c1c] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#2a2a2a] font-[family-name:var(--landing-font-sans)]"
									>
										Close
									</button>
								</div>
							) : (
								<>
									<p className="font-[family-name:var(--landing-font-mono)] text-xs font-medium uppercase tracking-[0.02em] text-[#1c1c1c99]">
										Enterprise
									</p>
									<h2
										id={titleId}
										className="mt-3 pr-6 text-[clamp(1.5rem,3vw,1.875rem)] font-light leading-[1.15] tracking-[-0.01em] text-[#1c1c1c]"
									>
										<span className="font-[family-name:var(--landing-font-serif)]">
											Contact us
										</span>
									</h2>
									<p
										id={descriptionId}
										className="mt-2 text-sm leading-[1.65] text-[#1c1c1c99]"
									>
										Share your info and we&apos;ll follow up shortly.
									</p>

									<form
										onSubmit={(event) => {
											void handleSubmit(event);
										}}
										className="mt-6 flex flex-col gap-4"
									>
										<div className="flex flex-col gap-1.5">
											<label htmlFor="enterprise-name" className={LABEL_CLASS}>
												Name
											</label>
											<input
												id="enterprise-name"
												name="name"
												type="text"
												required
												autoComplete="name"
												value={form.name}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														name: event.target.value,
													}))
												}
												className={INPUT_CLASS}
											/>
										</div>

										<div className="flex flex-col gap-1.5">
											<label htmlFor="enterprise-email" className={LABEL_CLASS}>
												Email address
											</label>
											<input
												id="enterprise-email"
												name="email"
												type="email"
												required
												autoComplete="email"
												value={form.email}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														email: event.target.value,
													}))
												}
												className={INPUT_CLASS}
											/>
										</div>

										<div className="flex flex-col gap-1.5">
											<label
												htmlFor="enterprise-company"
												className={LABEL_CLASS}
											>
												Company{' '}
												<span className="font-normal text-[#1c1c1c66]">
													(optional)
												</span>
											</label>
											<input
												id="enterprise-company"
												name="company"
												type="text"
												autoComplete="organization"
												value={form.company}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														company: event.target.value,
													}))
												}
												className={INPUT_CLASS}
											/>
										</div>

										<div className="flex flex-col gap-1.5">
											<label htmlFor="enterprise-notes" className={LABEL_CLASS}>
												Notes
											</label>
											<textarea
												id="enterprise-notes"
												name="notes"
												rows={4}
												value={form.notes}
												onChange={(event) =>
													setForm((current) => ({
														...current,
														notes: event.target.value,
													}))
												}
												className={`${INPUT_CLASS} resize-y`}
											/>
										</div>

										{error ? (
											<p className="text-sm text-[#b42318]" role="alert">
												{error}
											</p>
										) : null}

										<button
											type="submit"
											disabled={submitting}
											className="inline-flex w-full items-center justify-center rounded-full border border-[#1c1c1c] bg-[#1c1c1c] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-60 font-[family-name:var(--landing-font-sans)]"
										>
											{submitting ? 'Sending...' : 'Submit'}
										</button>
									</form>
								</>
							)}
						</div>
					</FramedPanel>
				</div>
			) : null}
		</>
	);
}
