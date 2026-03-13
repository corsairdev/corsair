import {
	actionsHtml,
	buildActionDescriptors,
	escapeHtml,
	formatTimestamp,
	parseArgs,
	statusBannerHtml,
} from '../shared';
import type { PermissionActionCallback, PermissionLike } from '../types';

export function renderBase(
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
): string {
	const actions = buildActionDescriptors(permission, onApproval, onDenial);
	const status = permission.status ?? 'pending';
	const args = parseArgs(permission);
	const ts = formatTimestamp(permission.created_at);

	const rowsHtml = Object.entries(args)
		.map(
			([k, v]) => `
		<div style="margin-bottom:12px">
			<div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:3px">${escapeHtml(k)}</div>
			<div style="font-size:13px;color:#e5e7eb">${escapeHtml(typeof v === 'string' ? v : JSON.stringify(v))}</div>
		</div>`,
		)
		.join('');

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Permission Request</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 24px; }
  </style>
</head>
<body>
  <div style="width:100%;max-width:520px;background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:24px">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
      <span style="font-size:20px">&#x1f512;</span>
      <div>
        <div style="font-size:16px;font-weight:600;color:#f9fafb">Permission Request</div>
        <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">${escapeHtml(permission.plugin)} &middot; ${escapeHtml(permission.endpoint)}</div>
      </div>
    </div>
    ${statusBannerHtml(status)}
    ${permission.description ? `<p style="font-size:14px;color:#d1d5db;margin-bottom:16px;line-height:1.6">${escapeHtml(permission.description)}</p>` : ''}
    ${rowsHtml ? `<div style="background:#020617;border:1px solid #1e293b;border-radius:8px;padding:16px;margin-bottom:16px">${rowsHtml}</div>` : ''}
    ${ts ? `<p style="font-size:11px;color:#475569;margin-bottom:16px">Requested ${escapeHtml(ts)}</p>` : ''}
    ${actionsHtml(status, actions)}
  </div>
</body>
</html>`;
}
