const assetList = document.getElementById('asset-list');
const msgInput = document.getElementById('msg-input');

const TYPE_ICONS = { video: '🎬', image: '🖼', audio: '🎙' };

export async function loadAssets() {
	try {
		const res = await fetch('/api/assets');
		if (!res.ok) throw new Error(res.statusText);
		const list = await res.json();

		assetList.innerHTML = '';

		if (!Array.isArray(list) || list.length === 0) {
			assetList.innerHTML = '<div class="asset-empty">No assets yet</div>';
			return;
		}

		for (const a of list) {
			const type = a.mediaType ?? a.type ?? 'video';
			const dur = a.duration ? `${Number(a.duration).toFixed(1)}s` : '';
			const dim = a.width ? `${a.width}×${a.height}` : '';
			const meta = [dur, dim].filter(Boolean).join(' · ');

			const item = document.createElement('div');
			item.className = 'asset-item';
			item.innerHTML = `
				<div class="asset-thumb">${TYPE_ICONS[type] ?? '📁'}</div>
				<div class="asset-info">
					<div class="asset-name" title="${a.name ?? a.filename ?? ''}">${a.name ?? a.filename ?? 'Asset'}</div>
					${meta ? `<div class="asset-meta">${meta}</div>` : ''}
				</div>
				<span class="asset-tag tag-${type}">${type.toUpperCase()}</span>
			`;
			item.addEventListener('click', () => {
				msgInput.value = `Use asset "${a.name ?? a.filename}" (assetId: ${a.assetId}) and place it on the timeline`;
				msgInput.focus();
			});
			assetList.appendChild(item);
		}
	} catch {
		assetList.innerHTML =
			'<div class="asset-empty">Could not reach Fade backend</div>';
	}
}

// Auto-refresh: subscribe to server-sent events for asset changes
function subscribeToAssetChanges() {
	const es = new EventSource('/api/events');
	es.addEventListener('asset:changed', () => loadAssets());
	es.onerror = () => {
		es.close();
		setTimeout(subscribeToAssetChanges, 5_000);
	};
}

subscribeToAssetChanges();
