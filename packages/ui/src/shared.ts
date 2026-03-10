import type { PermissionActionCallback, PermissionLike, PermissionStatus } from './types';

export function escapeHtml(s: unknown): string {
	return String(s ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

export function formatTimestamp(value: Date | string): string {
	const d = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(d.getTime())) return '';
	return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
}

export function parseArgs(permission: PermissionLike): Record<string, unknown> {
	const raw = permission.args;
	if (raw && typeof raw === 'object') return raw as Record<string, unknown>;
	try {
		return JSON.parse(raw as string) as Record<string, unknown>;
	} catch {
		return {};
	}
}

export type ActionDescriptors = {
	approveUrl: string;
	approveMethod: 'GET' | 'POST';
	declineUrl: string;
	declineMethod: 'GET' | 'POST';
};

export function buildActionDescriptors(
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
): ActionDescriptors {
	const approve = onApproval(permission);
	const decline = onDenial(permission);
	return {
		approveUrl: approve.url,
		approveMethod: approve.method,
		declineUrl: decline.url,
		declineMethod: decline.method,
	};
}

export function actionsHtml(status: PermissionStatus, actions: ActionDescriptors): string {
	if (status !== 'pending') return '';
	return `<form id="corsair-permission-form" style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">
  <button type="button" data-action="decline" style="cursor:pointer;border:1px solid #2a2a2a;background:#141414;color:#e5e7eb;border-radius:6px;padding:10px 24px;font-size:14px;font-weight:600">Decline</button>
  <button type="button" data-action="approve" style="cursor:pointer;border:none;background:#22c55e;color:#ffffff;border-radius:6px;padding:10px 24px;font-size:14px;font-weight:600">Approve</button>
</form>
<div id="corsair-permission-message" style="display:none;text-align:center;margin-top:12px;font-size:13px;color:#666666"></div>
<script>
  (function () {
    var form = document.getElementById('corsair-permission-form');
    if (!form) return;
    var msg = document.getElementById('corsair-permission-message');
    function setDisabled(d) {
      var btns = form.querySelectorAll('button');
      for (var i = 0; i < btns.length; i++) btns[i].disabled = d;
    }
    function resolve(action) {
      setDisabled(true);
      var url = action === 'approve' ? ${JSON.stringify(actions.approveUrl)} : ${JSON.stringify(actions.declineUrl)};
      var method = action === 'approve' ? ${JSON.stringify(actions.approveMethod)} : ${JSON.stringify(actions.declineMethod)};
      if (method === 'GET') { window.location.href = url; return; }
      fetch(url, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: action }) })
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
          if (msg) { msg.style.display = 'block'; msg.textContent = 'Something went wrong.'; }
        });
    }
    form.addEventListener('click', function (e) {
      var t = e.target;
      if (!(t instanceof HTMLElement)) return;
      var action = t.getAttribute('data-action');
      if (!action) return;
      e.preventDefault();
      resolve(action);
    });
  })();
<\/script>`;
}

export function statusBannerHtml(status: PermissionStatus): string {
	if (status === 'approved' || status === 'completed') {
		return `<div style="padding:10px 14px;border-radius:6px;background:#14532d;color:#22c55e;font-size:13px;font-weight:600;margin-bottom:16px;text-align:center">This permission has been granted.</div>`;
	}
	if (status === 'denied') {
		return `<div style="padding:10px 14px;border-radius:6px;background:#7f1d1d;color:#ef4444;font-size:13px;font-weight:600;margin-bottom:16px;text-align:center">This permission has been denied.</div>`;
	}
	return '';
}
