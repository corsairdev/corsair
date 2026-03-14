import type { SlackBoundEndpoints } from 'corsair/plugins';
import {
	actionsHtml,
	buildActionDescriptors,
	escapeHtml,
	formatTimestamp,
	parseArgs,
	statusBannerHtml,
} from '../../shared';
import type { PermissionActionCallback, PermissionLike } from '../../types';

type Args = Parameters<SlackBoundEndpoints['messages']['post']>[0];

export function renderSlackMessagesPost(
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
): string {
	const actions = buildActionDescriptors(permission, onApproval, onDenial);
	const status = permission.status ?? 'pending';
	const args = parseArgs(permission) as Args;
	const ts = formatTimestamp(permission.created_at);

	const channel = args.channel ? `#${args.channel.replace(/^#/, '')}` : null;
	const text = args.text ?? null;
	const threadTs = args.thread_ts ?? null;
	const replyBroadcast = args.reply_broadcast;

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Approve Slack message</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #1a1d21; color: #d1d2d3; font-family: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 24px; }
  </style>
</head>
<body>
  <div style="width:100%;max-width:540px">

    <!-- Header -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px">
      <div style="width:32px;height:32px;border-radius:8px;background:#4a154b;display:flex;align-items:center;justify-content:center;font-size:18px">&#x1f4ac;</div>
      <div>
        <div style="font-size:15px;font-weight:700;color:#f9fafb">Approve Slack message</div>
        <div style="font-size:12px;color:#6b7280">Review before sending</div>
      </div>
      <div style="margin-left:auto">
        <span style="background:#4a154b;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:999px;text-transform:uppercase">Slack</span>
      </div>
    </div>

    ${statusBannerHtml(status)}

    <!-- Channel pill -->
    ${channel ? `<div style="display:inline-flex;align-items:center;gap:6px;background:#1e1f22;border:1px solid #2e3035;border-radius:6px;padding:6px 12px;margin-bottom:16px;font-size:13px;color:#d1d2d3;font-weight:600">${escapeHtml(channel)}</div>` : ''}

    <!-- Message bubble -->
    ${
			text
				? `<div style="background:#222529;border:1px solid #2e3035;border-radius:8px;padding:16px;margin-bottom:12px">
      <div style="display:flex;align-items:flex-start;gap:10px">
        <div style="width:36px;height:36px;border-radius:4px;background:#4a154b;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:16px">&#x1f916;</div>
        <div>
          <div style="font-size:13px;font-weight:700;color:#f9fafb;margin-bottom:4px">Agent</div>
          <div style="font-size:14px;color:#d1d2d3;line-height:1.6;white-space:pre-wrap;word-break:break-word">${escapeHtml(text)}</div>
        </div>
      </div>
    </div>`
				: ''
		}

    <!-- Thread info -->
    ${threadTs ? `<div style="font-size:12px;color:#6b7280;margin-bottom:12px;padding-left:4px">&#x21b3; Reply in thread${replyBroadcast ? ' &middot; also sending to channel' : ''}</div>` : ''}

    ${ts ? `<p style="font-size:11px;color:#4b5563;margin-bottom:16px">Requested ${escapeHtml(ts)}</p>` : ''}

    ${actionsHtml(status, actions)}
  </div>
</body>
</html>`;
}
