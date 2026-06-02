import type { GoogleCalendarBoundEndpoints } from '@corsair-dev/googlecalendar';
import {
	actionsHtml,
	buildActionDescriptors,
	escapeHtml,
	formatTimestamp,
	parseArgs,
	statusBannerHtml,
} from '../../shared.js';
import type { PermissionActionCallback, PermissionLike } from '../../types.js';

type Args = Parameters<GoogleCalendarBoundEndpoints['events']['create']>[0];

function formatEventDateTime(dt: Args['event']['start']): string {
	if (!dt) return '';
	const raw = dt.dateTime ?? dt.date;
	if (!raw) return '';
	return formatTimestamp(raw);
}

function formatAttendees(attendees: Args['event']['attendees']): string {
	if (!attendees?.length) return '';
	return attendees
		.map((a) =>
			a.displayName ? `${a.displayName} <${a.email ?? ''}>` : (a.email ?? ''),
		)
		.join(', ');
}

export function renderGoogleCalendarEventsCreate(
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
): string {
	const actions = buildActionDescriptors(permission, onApproval, onDenial);
	const status = permission.status ?? 'pending';
	const args = parseArgs(permission) as Args;
	const ts = formatTimestamp(permission.created_at);

	const event = args.event;
	const startDisplay = formatEventDateTime(event.start);
	const endDisplay = formatEventDateTime(event.end);
	const attendees = formatAttendees(event.attendees);

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Approve calendar event</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #e2e8f0; font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 24px; }
  </style>
</head>
<body>
  <div style="width:100%;max-width:500px">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <div style="width:32px;height:32px;border-radius:8px;background:#0b8043;display:flex;align-items:center;justify-content:center;font-size:18px">&#x1f4c5;</div>
      <div>
        <div style="font-size:15px;font-weight:700;color:#f9fafb">Approve calendar event</div>
        <div style="font-size:12px;color:#6b7280">Review the event details before creating it</div>
      </div>
      <div style="margin-left:auto">
        <span style="background:#0b8043;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase">Google Calendar</span>
      </div>
    </div>

    ${statusBannerHtml(status)}

    <!-- Event card -->
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;overflow:hidden;margin-bottom:20px">

      <!-- Color bar + title -->
      <div style="border-left:4px solid #0b8043;padding:16px 18px;border-bottom:1px solid #1e293b">
        <div style="font-size:18px;font-weight:700;color:#f9fafb;margin-bottom:4px">${escapeHtml(event.summary ?? '(untitled event)')}</div>
        ${event.description ? `<div style="font-size:13px;color:#94a3b8;line-height:1.5;margin-top:6px">${escapeHtml(event.description)}</div>` : ''}
      </div>

      <!-- Details -->
      <div style="padding:14px 18px;display:flex;flex-direction:column;gap:12px">

        ${
					startDisplay || endDisplay
						? `<div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:16px;width:20px;flex-shrink:0">&#x1f550;</span>
            <div style="font-size:13px;color:#cbd5e1">
              ${startDisplay ? `<div>${escapeHtml(startDisplay)}</div>` : ''}
              ${endDisplay ? `<div style="color:#64748b">&#x2192; ${escapeHtml(endDisplay)}</div>` : ''}
            </div>
          </div>`
						: ''
				}

        ${
					event.location
						? `<div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:16px;width:20px;flex-shrink:0">&#x1f4cd;</span>
            <div style="font-size:13px;color:#cbd5e1">${escapeHtml(event.location)}</div>
          </div>`
						: ''
				}

        ${
					attendees
						? `<div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:16px;width:20px;flex-shrink:0">&#x1f465;</span>
            <div style="font-size:13px;color:#cbd5e1">${escapeHtml(attendees)}</div>
          </div>`
						: ''
				}

      </div>
    </div>

    ${ts ? `<p style="font-size:11px;color:#475569;margin-bottom:16px">Requested ${escapeHtml(ts)}</p>` : ''}

    ${actionsHtml(status, actions)}
  </div>
</body>
</html>`;
}
