const assetList = document.getElementById('asset-list');
const msgInput = document.getElementById('msg-input');

const TYPE_ICONS = { video: '🎬', image: '🖼', audio: '🎙' };

export async function loadAssets() {
	try {
		const res = await fetch('/api/assets');
		const data = await res.json();
		const list = Array.isArray(data) ? data : (data.assets ?? []);
		assetList.innerHTML = '';

		if (!list.length) {
			assetList.innerHTML = '<div class="asset-empty">No assets yet</div>';
			return;
		}

		list.forEach((a) => {
			const type = a.mediaType ?? a.type ?? 'video';
			const dur = a.duration ? `${Number(a.duration).toFixed(1)}s` : '';
			const item = document.createElement('div');
			item.className = 'asset-item';
			item.innerHTML = `
				<div class="asset-thumb">${TYPE_ICONS[type] ?? '📁'}</div>
				<div class="asset-info">
					<div class="asset-name" title="${a.name ?? a.filename ?? ''}">${a.name ?? a.filename ?? 'Asset'}</div>
					<div class="asset-meta">${[dur, a.width ? `${a.width}×${a.height}` : ''].filter(Boolean).join(' · ')}</div>
				</div>
				<span class="asset-tag tag-${type}">${type.toUpperCase()}</span>
			`;
			item.addEventListener('click', () => {
				msgInput.value = `Use asset "${a.name ?? a.filename}" (assetId: ${a.assetId}) and place it on the timeline`;
				msgInput.focus();
			});
			assetList.appendChild(item);
		});
	} catch {
		assetList.innerHTML =
			'<div class="asset-empty">Could not load assets</div>';
	}
}
