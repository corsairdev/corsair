import type { CalBoundEndpoints } from '@corsair-dev/cal';
import {
	actionsHtml,
	buildActionDescriptors,
	escapeHtml,
	formatTimestamp,
	parseArgs,
	statusBannerHtml,
} from '../../shared';
import type { PermissionActionCallback, PermissionLike } from '../../types';

type Args = Parameters<CalBoundEndpoints['bookings']['create']>[0];

export function renderCalBookingsCreate(
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
): string {
	const actions = buildActionDescriptors(permission, onApproval, onDenial);
	const status = permission.status ?? 'pending';
	const args = parseArgs(permission) as Args;
	const ts = formatTimestamp(permission.created_at);

	const startDisplay = args.start ? formatTimestamp(args.start) : '';

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Approve Cal.com booking</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; color: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 24px; }
  </style>
</head>
<body>
  <div style="width:100%;max-width:500px">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <div style="width:32px;height:32px;border-radius:8px;background:#111827;border:1px solid #374151;display:flex;align-items:center;justify-content:center;font-size:18px">&#x1f4c5;</div>
      <div>
        <div style="font-size:15px;font-weight:700;color:#f9fafb">Approve Cal.com booking</div>
        <div style="font-size:12px;color:#6b7280">Review the booking details before creating it</div>
      </div>
      <div style="margin-left:auto">
        <span style="background:#111827;border:1px solid #374151;color:#e5e7eb;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase">Cal.com</span>
      </div>
    </div>

    ${statusBannerHtml(status)}

    <!-- Booking card -->
    <div style="background:#111111;border:1px solid #1f1f1f;border-radius:10px;overflow:hidden;margin-bottom:20px">

      <!-- Event type + time -->
      <div style="border-left:4px solid #6366f1;padding:16px 18px;border-bottom:1px solid #1f1f1f">
        <div style="font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Event type ID: ${escapeHtml(String(args.eventTypeId))}</div>
        ${startDisplay ? `<div style="font-size:18px;font-weight:700;color:#f9fafb">${escapeHtml(startDisplay)}</div>` : ''}
        ${args.lengthInMinutes ? `<div style="font-size:13px;color:#6b7280;margin-top:4px">${escapeHtml(String(args.lengthInMinutes))} minutes</div>` : ''}
      </div>

      <!-- Attendee -->
      <div style="padding:14px 18px;display:flex;flex-direction:column;gap:12px">

        <div style="display:flex;align-items:flex-start;gap:10px">
          <span style="font-size:16px;width:20px;flex-shrink:0">&#x1f464;</span>
          <div style="font-size:13px;color:#d1d5db">
            <div style="font-weight:600">${escapeHtml(args.attendee.name)}</div>
            <div style="color:#6b7280">${escapeHtml(args.attendee.email)}</div>
            <div style="color:#6b7280;font-size:12px">${escapeHtml(args.attendee.timeZone)}</div>
          </div>
        </div>

        ${
					args.meetingUrl
						? `<div style="display:flex;align-items:flex-start;gap:10px">
            <span style="font-size:16px;width:20px;flex-shrink:0">&#x1f4bb;</span>
            <div style="font-size:13px;color:#d1d5db">${escapeHtml(args.meetingUrl)}</div>
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
