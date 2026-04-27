import { parseRawEmail } from './plugins/gmail/messages-send.js';
import { escapeHtml } from './shared.js';

// Light-themed inline snippet for embedding in dashboards / permission lists.

function gmailSendSnippet(rawArgs: unknown): string {
	const args = rawArgs as Record<string, unknown> | null;
	if (!args || typeof args.raw !== 'string') return baseSnippet(rawArgs);

	const email = parseRawEmail(args.raw);
	if (!email.to && !email.subject && !email.body) return baseSnippet(rawArgs);

	const subjectLine = escapeHtml(email.subject ?? '(no subject)');
	const toLine = email.to
		? `<div style="font-size:.75rem;color:#64748b;margin-top:3px">To: ${escapeHtml(email.to)}</div>`
		: '';
	const bodyPreview = email.body
		? `<div style="padding:8px 12px;font-size:.8125rem;color:#64748b;white-space:pre-wrap;word-break:break-word;max-height:72px;overflow:hidden;line-height:1.5;border-top:1px solid #e2e8f0">${escapeHtml(email.body)}</div>`
		: '';

	return `<div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:.875rem">
  <div style="padding:9px 12px;background:#f8fafc">
    <div style="font-weight:600;color:#1e293b">${subjectLine}</div>
    ${toLine}
  </div>
  ${bodyPreview}
</div>`;
}

function baseSnippet(rawArgs: unknown): string {
	let text: string;
	try {
		text = JSON.stringify(rawArgs, null, 2);
	} catch {
		text = String(rawArgs);
	}
	return `<pre style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:.625rem .75rem;font-size:.75rem;white-space:pre-wrap;word-break:break-all;max-height:120px;overflow-y:auto;margin:0">${escapeHtml(text)}</pre>`;
}

/**
 * Returns a compact, embeddable HTML snippet for displaying permission args
 * inline — e.g. inside a permissions dashboard card. Light-themed.
 *
 * Plugin-specific renderers show rich previews (email layout for Gmail, etc.)
 * and fall back to pretty-printed JSON for unknown plugins.
 */
export function renderArgsSnippet(
	plugin: string,
	endpoint: string,
	rawArgs: unknown,
): string {
	if (
		plugin === 'gmail' &&
		(endpoint === 'messages.send' || endpoint === 'drafts.send')
	) {
		return gmailSendSnippet(rawArgs);
	}
	return baseSnippet(rawArgs);
}
