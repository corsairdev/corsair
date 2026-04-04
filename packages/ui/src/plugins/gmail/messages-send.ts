import type { GmailBoundEndpoints } from '@corsair-dev/gmail';
import {
	actionsHtml,
	buildActionDescriptors,
	escapeHtml,
	formatTimestamp,
	parseArgs,
	statusBannerHtml,
} from '../../shared';
import type { PermissionActionCallback, PermissionLike } from '../../types';

type Args = Parameters<GmailBoundEndpoints['messages']['send']>[0];

type ParsedEmail = {
	to?: string;
	from?: string;
	subject?: string;
	body?: string;
};

function parseRawEmail(raw: string): ParsedEmail {
	try {
		const decoded = Buffer.from(raw, 'base64url').toString('utf-8');
		const sep = decoded.indexOf('\r\n\r\n') >= 0 ? '\r\n\r\n' : '\n\n';
		const sepIdx = decoded.indexOf(sep);
		const headerSection = sepIdx >= 0 ? decoded.slice(0, sepIdx) : decoded;
		const body = sepIdx >= 0 ? decoded.slice(sepIdx + sep.length) : undefined;

		const headers: Record<string, string> = {};
		const rawLines = headerSection.split(/\r?\n/);
		let current = '';
		for (const line of rawLines) {
			if (/^[ \t]/.test(line)) {
				current += ' ' + line.trim();
			} else {
				if (current) {
					const colon = current.indexOf(':');
					if (colon > 0)
						headers[current.slice(0, colon).toLowerCase().trim()] = current
							.slice(colon + 1)
							.trim();
				}
				current = line;
			}
		}
		if (current) {
			const colon = current.indexOf(':');
			if (colon > 0)
				headers[current.slice(0, colon).toLowerCase().trim()] = current
					.slice(colon + 1)
					.trim();
		}

		return {
			to: headers['to'],
			from: headers['from'],
			subject: headers['subject'],
			body,
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
