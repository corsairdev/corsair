import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Button({
	children,
	variant = 'default',
	className = '',
	...rest
}: PropsWithChildren<
	ButtonHTMLAttributes<HTMLButtonElement> & {
		variant?: 'default' | 'primary' | 'ghost' | 'danger';
	}
>) {
	const base =
		'inline-flex items-center gap-2 px-3 h-8 rounded-md text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed border';
	const styles = {
		default:
			'bg-[var(--color-bg-elevated)] hover:bg-[var(--color-bg-hover)] border-[var(--color-border)] text-[var(--color-text)]',
		primary:
			'bg-[var(--color-accent)] hover:brightness-95 border-transparent text-black',
		ghost:
			'bg-transparent hover:bg-[var(--color-bg-hover)] border-transparent text-[var(--color-text-muted)]',
		danger:
			'bg-transparent hover:bg-[var(--color-err)]/10 border-[var(--color-err)]/40 text-[var(--color-err)]',
	}[variant];
	return (
		<button className={`${base} ${styles} ${className}`} {...rest}>
			{children}
		</button>
	);
}

export function Input(
	props: React.InputHTMLAttributes<HTMLInputElement>,
): React.ReactElement {
	const { className = '', ...rest } = props;
	return (
		<input
			className={`w-full h-8 px-2 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-dim)] ${className}`}
			{...rest}
		/>
	);
}

export function Textarea(
	props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
): React.ReactElement {
	const { className = '', ...rest } = props;
	return (
		<textarea
			className={`w-full px-2 py-1.5 rounded-md text-xs bg-[var(--color-bg)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent-dim)] font-mono leading-relaxed ${className}`}
			{...rest}
		/>
	);
}

export function Card({
	children,
	className = '',
}: PropsWithChildren<{ className?: string }>) {
	return (
		<div
			className={`border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-elevated)] ${className}`}
		>
			{children}
		</div>
	);
}

export function Badge({
	children,
	tone = 'default',
}: PropsWithChildren<{ tone?: 'default' | 'ok' | 'warn' | 'err' }>) {
	const toneClass = {
		default:
			'bg-[var(--color-bg-hover)] text-[var(--color-text-muted)] border-[var(--color-border)]',
		ok: 'bg-[var(--color-ok)]/10 text-[var(--color-ok)] border-[var(--color-ok)]/30',
		warn: 'bg-[var(--color-warn)]/10 text-[var(--color-warn)] border-[var(--color-warn)]/30',
		err: 'bg-[var(--color-err)]/10 text-[var(--color-err)] border-[var(--color-err)]/30',
	}[tone];
	return (
		<span
			className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded border ${toneClass}`}
		>
			{children}
		</span>
	);
}

export function JsonView({ value }: { value: unknown }) {
	let text: string;
	try {
		text = JSON.stringify(value, null, 2);
	} catch {
		text = String(value);
	}
	return (
		<pre className="rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] p-3 overflow-auto max-h-[600px] text-xs leading-relaxed">
			{text}
		</pre>
	);
}

export function Section({
	title,
	action,
	children,
}: PropsWithChildren<{ title: string; action?: React.ReactNode }>) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-semibold tracking-wide text-[var(--color-text-muted)] uppercase">
					{title}
				</h2>
				{action}
			</div>
			{children}
		</div>
	);
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
	return (
		<div className="border border-dashed border-[var(--color-border)] rounded-lg p-8 text-center">
			<div className="text-sm text-[var(--color-text)]">{title}</div>
			{hint ? (
				<div className="text-xs text-[var(--color-text-muted)] mt-1">
					{hint}
				</div>
			) : null}
		</div>
	);
}
