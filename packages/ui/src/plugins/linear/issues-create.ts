import type { PermissionActionCallback, PermissionLike } from '../../types';
import {
	actionsHtml,
	buildActionDescriptors,
	escapeHtml,
	formatTimestamp,
	parseArgs,
	statusBannerHtml,
} from '../../shared';
import type { LinearBoundEndpoints } from 'corsair/plugins';

type Args = Parameters<LinearBoundEndpoints['issues']['create']>[0];

const priorityLabels: Record<number, string> = {
	0: 'No priority',
	1: '&#x1f525; Urgent',
	2: '&#x2b06;&#xfe0f; High',
	3: '&#x27a1;&#xfe0f; Medium',
	4: '&#x2b07;&#xfe0f; Low',
};

function chip(label: string, value: string | undefined): string {
	if (!value) return '';
	return `<div style="display:inline-flex;align-items:center;gap:4px;background:#1e293b;border:1px solid #334155;border-radius:6px;padding:4px 10px;font-size:12px;color:#94a3b8">
    <span style="color:#64748b">${escapeHtml(label)}</span>
    <span style="color:#e2e8f0">${escapeHtml(value)}</span>
  </div>`;
}

export function renderLinearIssuesCreate(
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
): string {
	const actions = buildActionDescriptors(permission, onApproval, onDenial);
	const status = permission.status ?? 'pending';
	const args = parseArgs(permission) as Args;
	const ts = formatTimestamp(permission.created_at);

	const priorityLabel = args.priority != null ? priorityLabels[args.priority] : undefined;

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Approve Linear issue</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0d0e11; color: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 24px; }
  </style>
</head>
<body>
  <div style="width:100%;max-width:540px">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <div style="width:32px;height:32px;border-radius:8px;background:#5e6ad2;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;letter-spacing:-1px">L</div>
      <div>
        <div style="font-size:15px;font-weight:700;color:#f9fafb">Approve Linear issue</div>
        <div style="font-size:12px;color:#6b7280">Review the issue details before creating it</div>
      </div>
      <div style="margin-left:auto">
        <span style="background:#5e6ad2;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase">Linear</span>
      </div>
    </div>

    ${statusBannerHtml(status)}

    <!-- Issue card -->
    <div style="background:#141518;border:1px solid #1f2127;border-radius:10px;padding:20px;margin-bottom:20px">

      <!-- Status dot + title -->
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:14px">
        <div style="width:16px;height:16px;border-radius:50%;border:2px solid #5e6ad2;flex-shrink:0;margin-top:3px"></div>
        <h2 style="font-size:17px;font-weight:600;color:#f9fafb;line-height:1.4">${escapeHtml(args.title)}</h2>
      </div>

      <!-- Description -->
      ${
		args.description
			? `<div style="font-size:14px;color:#9ca3af;line-height:1.7;margin-bottom:16px;padding-left:26px;white-space:pre-wrap;word-break:break-word">${escapeHtml(args.description)}</div>`
			: ''
	}

      <!-- Meta chips -->
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding-left:26px">
        ${chip('Team', args.teamId)}
        ${chip('Assignee', args.assigneeId)}
        ${priorityLabel ? `<div style="display:inline-flex;align-items:center;gap:4px;background:#1e293b;border:1px solid #334155;border-radius:6px;padding:4px 10px;font-size:12px;color:#e2e8f0">${priorityLabel}</div>` : ''}
        ${chip('Status', args.stateId)}
        ${chip('Due', args.dueDate)}
      </div>
    </div>

    ${ts ? `<p style="font-size:11px;color:#475569;margin-bottom:16px">Requested ${escapeHtml(ts)}</p>` : ''}

    ${actionsHtml(status, actions)}
  </div>
</body>
</html>`;
}
