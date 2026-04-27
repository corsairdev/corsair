import type { GmailBoundEndpoints } from '@corsair-dev/gmail';
import {
	actionsHtml,
	buildActionDescriptors,
	escapeHtml,
	formatTimestamp,
	parseArgs,
	statusBannerHtml,
} from '../../shared.js';
import type { PermissionActionCallback, PermissionLike } from '../../types.js';

type Args = Parameters<GmailBoundEndpoints['messages']['send']>[0];

export type ParsedEmail = {
	to?: string;
	from?: string;
	subject?: string;
	body?: string;
};

// Decodes RFC 2047 encoded-words: =?UTF-8?B?...?= or =?UTF-8?Q?...?=
function decodeMimeWord(str: string): string {
	return str.replace(
		/=\?([^?]+)\?([BQbq])\?([^?]*)\?=/g,
		(_full, _charset, encoding: string, text: string) => {
			try {
				if (encoding.toUpperCase() === 'B') {
					return Buffer.from(text, 'base64').toString('utf-8');
				}
				// Quoted-printable encoded word: _ is space, =XX is hex byte
				return text
					.replace(/_/g, ' ')
					.replace(/=([0-9A-Fa-f]{2})/g, (_m, hex: string) =>
						String.fromCharCode(parseInt(hex, 16)),
					);
			} catch {
				return text;
			}
		},
	);
}

function decodeTransferEncoding(body: string, encoding: string): string {
	const enc = encoding.toLowerCase().trim();
	if (enc === 'base64') {
		try {
			return Buffer.from(body.replace(/\s/g, ''), 'base64').toString('utf-8');
		} catch {
			return body;
		}
	}
	if (enc === 'quoted-printable') {
		return body
			.replace(/=\r?\n/g, '') // soft line breaks
			.replace(/=([0-9A-Fa-f]{2})/g, (_m, hex: string) =>
				String.fromCharCode(parseInt(hex, 16)),
			);
	}
	return body;
}

function stripHtml(html: string): string {
	return html
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/\s+/g, ' ')
		.trim();
}

function extractFromMultipart(body: string, boundary: string): string {
	const escaped = boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const parts = body.split(new RegExp(`--${escaped}(?:--)?`));

	// Prefer text/plain; fall back to text/html
	for (const preferred of ['text/plain', 'text/html']) {
		for (const part of parts) {
			const sep = part.search(/\r?\n\r?\n/);
			if (sep === -1) continue;
			const partHeaders = part.slice(0, sep).toLowerCase();
			if (!partHeaders.includes(preferred)) continue;
			const partBody = part.slice(sep).replace(/^\r?\n\r?\n?/, '');
			const encMatch = partHeaders.match(
				/content-transfer-encoding:\s*([^\r\n]+)/,
			);
			const text = decodeTransferEncoding(
				partBody,
				encMatch ? (encMatch?.[1] || '').trim() : '',
			);
			return preferred === 'text/html' ? stripHtml(text) : text;
		}
	}
	return body;
}

export function parseRawEmail(raw: string): ParsedEmail {
	try {
		const decoded = Buffer.from(raw, 'base64url').toString('utf-8');
		const sep = decoded.indexOf('\r\n\r\n') >= 0 ? '\r\n\r\n' : '\n\n';
		const sepIdx = decoded.indexOf(sep);
		const headerSection = sepIdx >= 0 ? decoded.slice(0, sepIdx) : decoded;
		const bodyRaw = sepIdx >= 0 ? decoded.slice(sepIdx + sep.length) : '';

		// Unfold header continuation lines, then parse
		const unfolded = headerSection.replace(/\r?\n[ \t]+/g, ' ');
		const headers: Record<string, string> = {};
		for (const line of unfolded.split(/\r?\n/)) {
			const colon = line.indexOf(':');
			if (colon < 1) continue;
			const key = line.slice(0, colon).trim().toLowerCase();
			if (!headers[key]) {
				headers[key] = decodeMimeWord(line.slice(colon + 1).trim());
			}
		}

		// Decode body based on content-type
		const contentType = headers['content-type'] || '';
		let body: string | undefined;

		if (contentType.startsWith('multipart/')) {
			const bm = contentType.match(/boundary="?([^";]+)"?/i);
			if (bm) body = extractFromMultipart(bodyRaw, (bm?.[1] || '').trim());
		} else {
			const enc = headers['content-transfer-encoding'] || '';
			const text = decodeTransferEncoding(bodyRaw, enc);
			body = contentType.includes('text/html') ? stripHtml(text) : text;
		}

		return {
			to: headers['to'],
			from: headers['from'],
			subject: headers['subject'],
			body: body?.trim() || undefined,
		};
	} catch {
		return {};
	}
}

function headerRow(label: string, value: string | undefined): string {
	if (!value) return '';
	return `<div style="display:flex;gap:8px;padding:8px 0;border-bottom:1px solid #1e293b">
    <span style="font-size:12px;color:#64748b;width:56px;flex-shrink:0;padding-top:1px">${escapeHtml(label)}</span>
    <span style="font-size:13px;color:#e2e8f0;line-height:1.5">${escapeHtml(value)}</span>
  </div>`;
}

export function renderGmailMessagesSend(
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
): string {
	const actions = buildActionDescriptors(permission, onApproval, onDenial);
	const status = permission.status ?? 'pending';
	const args = parseArgs(permission) as Args;
	const ts = formatTimestamp(permission.created_at);

	const email = parseRawEmail(args.raw);

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Approve email</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #e2e8f0; font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 24px; }
  </style>
</head>
<body>
  <div style="width:100%;max-width:580px">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <div style="width:32px;height:32px;border-radius:8px;background:#ea4335;display:flex;align-items:center;justify-content:center;font-size:18px">&#x2709;&#xfe0f;</div>
      <div>
        <div style="font-size:15px;font-weight:700;color:#f9fafb">Approve email</div>
        <div style="font-size:12px;color:#6b7280">Review recipients and content before sending</div>
      </div>
      <div style="margin-left:auto">
        <span style="background:#ea4335;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase">Gmail</span>
      </div>
    </div>

    ${statusBannerHtml(status)}

    <!-- Email card -->
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;overflow:hidden;margin-bottom:20px">

      <!-- Subject -->
      <div style="padding:14px 16px;border-bottom:1px solid #1e293b">
        <div style="font-size:16px;font-weight:700;color:#f9fafb">${escapeHtml(email.subject ?? '(no subject)')}</div>
      </div>

      <!-- Headers -->
      <div style="padding:4px 16px">
        ${headerRow('From', email.from)}
        ${headerRow('To', email.to)}
      </div>

      <!-- Body -->
      ${
				email.body
					? `<div style="padding:16px;border-top:1px solid #1e293b">
          <div style="font-size:14px;color:#cbd5e1;line-height:1.7;white-space:pre-wrap;word-break:break-word">${escapeHtml(email.body)}</div>
        </div>`
					: ''
			}
    </div>

    ${ts ? `<p style="font-size:11px;color:#475569;margin-bottom:16px">Requested ${escapeHtml(ts)}</p>` : ''}

    ${actionsHtml(status, actions)}
  </div>
</body>
</html>`;
}
