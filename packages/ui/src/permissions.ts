import type {
  PermissionActionCallback,
  PermissionLike,
  PermissionStatus,
} from './types';

type PermissionPatternKey =
  | 'base'
  | 'slack_message_post'
  | 'gmail_send'
  | 'linear_issue_create'
  | 'googlecalendar_event_create'
  | 'cal_event_create';

type PatternConfig = {
  title: string;
  subtitle?: string;
  emphasizeFields?: string[];
  fieldLabels?: Record<string, string>;
};

const pluginColors: Record<string, string> = {
  slack: '#4a154b',
  linear: '#5e6ad2',
  discord: '#5865f2',
  github: '#333333',
  resend: '#000000',
  gmail: '#ea4335',
  googlecalendar: '#0b8043',
  cal: '#111827',
};

const baseFieldLabels: Record<string, Record<string, string>> = {
  'slack:messages.post': {
    channel: 'Channel',
    text: 'Message',
    thread_ts: 'Thread',
    reply_broadcast: 'Also send to channel',
  },
  'gmail:messages.send': {
    to: 'To',
    from: 'From',
    subject: 'Subject',
    html: 'Body',
    text: 'Body',
    cc: 'CC',
    bcc: 'BCC',
  },
  'gmail:drafts.send': {
    to: 'To',
    from: 'From',
    subject: 'Subject',
    html: 'Body',
    text: 'Body',
    cc: 'CC',
    bcc: 'BCC',
  },
  'linear:issues.create': {
    title: 'Title',
    description: 'Description',
    teamId: 'Team',
    assigneeId: 'Assignee',
    priority: 'Priority',
    stateId: 'Status',
  },
  'googlecalendar:events.create': {
    summary: 'Title',
    description: 'Description',
    start: 'Start',
    end: 'End',
    attendees: 'Attendees',
    location: 'Location',
  },
  'cal:events.create': {
    title: 'Title',
    description: 'Description',
    startTime: 'Start',
    endTime: 'End',
    attendees: 'Attendees',
    location: 'Location',
  },
};

const patternConfigs: Record<PermissionPatternKey, PatternConfig> = {
  base: {
    title: 'Permission Request',
  },
  slack_message_post: {
    title: 'Approve Slack message',
    subtitle: 'Review the message details before sending.',
    emphasizeFields: ['channel', 'text'],
    fieldLabels: baseFieldLabels['slack:messages.post'],
  },
  gmail_send: {
    title: 'Approve email',
    subtitle: 'Review the recipients and content before sending.',
    emphasizeFields: ['to', 'cc', 'bcc', 'subject', 'html', 'text'],
    fieldLabels: {
      ...baseFieldLabels['gmail:messages.send'],
      ...baseFieldLabels['gmail:drafts.send'],
    },
  },
  linear_issue_create: {
    title: 'Approve Linear issue',
    subtitle: 'Review the issue details before creating it.',
    emphasizeFields: ['title', 'description'],
    fieldLabels: baseFieldLabels['linear:issues.create'],
  },
  googlecalendar_event_create: {
    title: 'Approve calendar event',
    subtitle: 'Review the event details before creating it.',
    emphasizeFields: ['summary', 'start', 'end', 'attendees'],
    fieldLabels: baseFieldLabels['googlecalendar:events.create'],
  },
  cal_event_create: {
    title: 'Approve Cal.com event',
    subtitle: 'Review the event details before creating it.',
    emphasizeFields: ['title', 'startTime', 'endTime', 'attendees'],
    fieldLabels: baseFieldLabels['cal:events.create'],
  },
};

function getPattern(perm: PermissionLike): PermissionPatternKey {
  const op = perm.operation || perm.endpoint;
  const key = `${perm.plugin}:${op}`;
  if (key === 'slack:messages.post') return 'slack_message_post';
  if (perm.plugin === 'gmail' && (op === 'messages.send' || op === 'drafts.send'))
    return 'gmail_send';
  if (perm.plugin === 'linear' && op === 'issues.create')
    return 'linear_issue_create';
  if (perm.plugin === 'googlecalendar' && op === 'events.create')
    return 'googlecalendar_event_create';
  if (perm.plugin === 'cal' && op === 'events.create') return 'cal_event_create';
  return 'base';
}

function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderArgValue(val: unknown): string {
  if (val === null || val === undefined) {
    return '<span style="color:#666666">—</span>';
  }
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'string') {
    if (val.length > 120 || val.includes('\n')) {
      return `<pre style="margin:0;background:#111111;border:1px solid #2a2a2a;border-radius:6px;padding:10px 12px;white-space:pre-wrap;word-break:break-word;font-size:13px;line-height:1.5">${escapeHtml(
        val,
      )}</pre>`;
    }
    return escapeHtml(val);
  }
  if (Array.isArray(val)) {
    return escapeHtml(val.join(', '));
  }
  return `<pre style="margin:0;background:#111111;border:1px solid #2a2a2a;border-radius:6px;padding:10px 12px;white-space:pre-wrap;word-break:break-word;font-size:12px;line-height:1.4">${escapeHtml(
    JSON.stringify(val, null, 2),
  )}</pre>`;
}

function normalizeStatus(status: PermissionStatus): PermissionStatus {
  return status;
}

function getStatusColors(status: PermissionStatus): {
  barBackground?: string;
  textColor: string;
  label?: string;
} {
  if (status === 'granted' || status === 'completed') {
    return {
      barBackground: '#14532d',
      textColor: '#22c55e',
      label: 'This permission has been granted.',
    };
  }
  if (status === 'declined') {
    return {
      barBackground: '#7f1d1d',
      textColor: '#ef4444',
      label: 'This permission has been declined.',
    };
  }
  if (status === 'pending') {
    return {
      textColor: '#f59e0b',
    };
  }
  return {
    textColor: '#9ca3af',
  };
}

function formatTimestamp(value: Date | string): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getFieldLabel(
  perm: PermissionLike,
  key: string,
  pattern: PatternConfig,
): string {
  const op = perm.operation || perm.endpoint;
  const patternSpecific = pattern.fieldLabels ?? {};
  const pluginKey = `${perm.plugin}:${op}`;
  const base = baseFieldLabels[pluginKey] ?? {};
  return patternSpecific[key] ?? base[key] ?? key;
}

type ActionDescriptors = {
  approveUrl: string;
  approveMethod: 'GET' | 'POST';
  declineUrl: string;
  declineMethod: 'GET' | 'POST';
};

function buildActionDescriptors(
  perm: PermissionLike,
  onApproval: PermissionActionCallback,
  onDenial: PermissionActionCallback,
): ActionDescriptors {
  const approve = onApproval(perm);
  const decline = onDenial(perm);
  return {
    approveUrl: approve.url,
    approveMethod: approve.method,
    declineUrl: decline.url,
    declineMethod: decline.method,
  };
}

export function corsairPermissions(
  perm: PermissionLike,
  onApproval: PermissionActionCallback,
  onDenial: PermissionActionCallback,
): string {
  const patternKey = getPattern(perm);
  const pattern = patternConfigs[patternKey];
  const actions = buildActionDescriptors(perm, onApproval, onDenial);
  const status = normalizeStatus(perm.status);
  const isPending = status === 'pending';
  const statusColors = getStatusColors(status);
  const pluginBadgeColor = pluginColors[perm.plugin] ?? '#141414';
  const args =
    perm.args && typeof perm.args === 'object' ? perm.args : ({} as Record<
      string,
      unknown
    >);
  const argEntries = Object.entries(args);
  const ts = formatTimestamp(perm.createdAt);

  let statusBar = '';
  if (status !== 'pending' && statusColors.barBackground && statusColors.label) {
    statusBar = `<div style="padding:10px 14px;border-radius:6px;background:${statusColors.barBackground};color:${statusColors.textColor};font-size:13px;font-weight:600;margin-bottom:16px;text-align:center">${escapeHtml(
      statusColors.label,
    )}</div>`;
  }

  let argsHtml = '';
  if (argEntries.length > 0) {
    const rows = argEntries
      .map(([k, v]) => {
        const label = getFieldLabel(perm, k, pattern);
        const valueHtml = renderArgValue(v);
        const emphasize =
          pattern.emphasizeFields && pattern.emphasizeFields.includes(k);
        const labelStyle =
          'font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px';
        const valueStyle = emphasize
          ? 'font-size:14px;color:#f9fafb;font-weight:500'
          : 'font-size:14px;color:#e5e7eb';
        return `<div style="margin-bottom:14px"><div style="${labelStyle}">${escapeHtml(
          label,
        )}</div><div style="${valueStyle}">${valueHtml}</div></div>`;
      })
      .join('');
    argsHtml = `<div style="background:#0a0a0a;border:1px solid #2a2a2a;border-radius:6px;padding:16px;margin-bottom:24px"><div style="font-size:11px;color:#666666;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:12px;font-weight:600">Request details</div>${rows}</div>`;
  }

  const actionsHtml = isPending
    ? `<form id="corsair-permission-form" style="display:flex;gap:10px;justify-content:flex-end">
  <button type="button" data-action="decline" style="cursor:pointer;border:1px solid #2a2a2a;background:#141414;color:#e5e7eb;border-radius:6px;padding:10px 24px;font-size:14px;font-weight:600">Decline</button>
  <button type="button" data-action="approve" style="cursor:pointer;border:none;background:#22c55e;color:#ffffff;border-radius:6px;padding:10px 24px;font-size:14px;font-weight:600">Approve</button>
</form>
<div id="corsair-permission-message" style="display:none;text-align:center;margin-top:12px;font-size:13px;color:#666666"></div>
<script>
  (function () {
    var form = document.getElementById('corsair-permission-form');
    if (!form) return;
    var msg = document.getElementById('corsair-permission-message');
    function setDisabled(disabled) {
      var buttons = form.querySelectorAll('button');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = disabled;
      }
    }
    function resolve(action) {
      setDisabled(true);
      var url = action === 'approve' ? ${JSON.stringify(
        actions.approveUrl,
      )} : ${JSON.stringify(actions.declineUrl)};
      var method = action === 'approve' ? ${JSON.stringify(
        actions.approveMethod,
      )} : ${JSON.stringify(actions.declineMethod)};
      if (method === 'GET') {
        window.location.href = url;
        return;
      }
      fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (form) form.style.display = 'none';
          if (msg) {
            msg.style.display = 'block';
            msg.style.color = action === 'approve' ? '#22c55e' : '#ef4444';
            msg.textContent = d.message || (action === 'approve' ? 'Approved.' : 'Declined.');
          }
        })
        .catch(function () {
          if (msg) {
            msg.style.display = 'block';
            msg.textContent = 'Something went wrong.';
          }
        });
    }
    form.addEventListener('click', function (e) {
      var target = e.target;
      if (!(target instanceof HTMLElement)) return;
      var action = target.getAttribute('data-action');
      if (!action) return;
      e.preventDefault();
      resolve(action);
    });
  })();
<\/script>`
    : '';

  const tsHtml = ts
    ? `<p style="font-size:11px;color:#666666;margin-bottom:20px">Requested ${escapeHtml(
        ts,
      )}</p>`
    : '';

  const subtitleHtml = pattern.subtitle
    ? `<p style="font-size:14px;color:#9ca3af;margin-bottom:16px">${escapeHtml(
        pattern.subtitle,
      )}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(pattern.title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020617; color: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 24px; }
    .corsair-card { width: 100%; max-width: 520px; background: #020617; border-radius: 16px; padding: 1px; position: relative; overflow: hidden; }
    .corsair-card::before { content: ''; position: absolute; inset: -40%; background: conic-gradient(from 180deg at 50% 50%, rgba(59, 130, 246, 0.7), rgba(16, 185, 129, 0.7), rgba(147, 51, 234, 0.7), rgba(59, 130, 246, 0.7)); opacity: 0.6; filter: blur(24px); transform: translate3d(0,0,0); }
    .corsair-card-inner { position: relative; background: radial-gradient(circle at top, rgba(15, 23, 42, 0.9), #020617 55%); border-radius: 15px; padding: 24px 22px 22px 22px; border: 1px solid rgba(15, 23, 42, 0.9); box-shadow: 0 18px 45px rgba(0, 0, 0, 0.65); }
  </style>
</head>
<body>
  <div class="corsair-card">
    <div class="corsair-card-inner">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <div style="width:28px;height:28px;border-radius:999px;display:flex;align-items:center;justify-content:center;background:rgba(15,23,42,0.9);border:1px solid rgba(55,65,81,0.9);box-shadow:0 0 0 1px rgba(15,23,42,0.9),0 10px 30px rgba(0,0,0,0.7);">
            <span style="font-size:18px;transform:translateY(1px)">&#x1f512;</span>
          </div>
          <div>
            <h1 style="font-size:17px;font-weight:600;letter-spacing:0.01em;color:#f9fafb;margin-bottom:1px">${escapeHtml(
              pattern.title,
            )}</h1>
            <div style="font-size:12px;color:#9ca3af;letter-spacing:0.04em;text-transform:uppercase">Corsair permission request</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
          <span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:600;background:${pluginBadgeColor};color:#ffffff;text-transform:capitalize;box-shadow:0 10px 25px rgba(0,0,0,0.5)">${escapeHtml(
            perm.plugin,
          )}</span>
          <code style="font-size:11px;color:#9ca3af;background:#020617;padding:2px 8px;border-radius:999px;border:1px solid #111827;">${escapeHtml(
            perm.operation || perm.endpoint,
          )}</code>
        </div>
      </div>
      ${subtitleHtml}
      ${statusBar}
      <p style="font-size:14px;line-height:1.6;margin-bottom:18px;color:#d1d5db">${escapeHtml(
        perm.description,
      )}</p>
      ${argsHtml}
      ${tsHtml}
      ${actionsHtml}
    </div>
  </div>
</body>
</html>`;
}

