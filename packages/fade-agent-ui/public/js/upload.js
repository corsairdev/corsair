import { loadAssets } from './assets.js';

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const msgInput = document.getElementById('msg-input');

async function uploadFile(file) {
	const toast = document.createElement('div');
	toast.className = 'upload-toast';
	toast.textContent = `⬆ Uploading ${file.name}…`;
	document.body.appendChild(toast);

	const fd = new FormData();
	fd.append('file', file);

	try {
		const res = await fetch('/api/assets/upload', { method: 'POST', body: fd });
		const data = await res.json();

		if (!res.ok) throw new Error(data.error ?? res.statusText);

		toast.textContent = `✅ ${file.name} imported`;
		setTimeout(() => toast.remove(), 2500);

		// Immediately reload asset list — don't wait for SSE
		await loadAssets();

		if (data.assetId) {
			msgInput.value = `Asset "${file.name}" (assetId: ${data.assetId}) was just imported. Add it to the timeline.`;
		}
	} catch (e) {
		toast.textContent = `❌ Upload failed: ${e.message}`;
		setTimeout(() => toast.remove(), 3000);
	}
}

fileInput.addEventListener('change', () => {
	for (const f of fileInput.files ?? []) void uploadFile(f);
	fileInput.value = '';
});

dropZone.addEventListener('dragover', (e) => {
	e.preventDefault();
	dropZone.classList.add('drag-over');
});
dropZone.addEventListener('dragleave', () =>
	dropZone.classList.remove('drag-over'),
);
dropZone.addEventListener('drop', (e) => {
	e.preventDefault();
	dropZone.classList.remove('drag-over');
	for (const f of e.dataTransfer?.files ?? []) void uploadFile(f);
});
