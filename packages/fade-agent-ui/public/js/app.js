import { sendMessage } from './agentStream.js';
import { loadAssets } from './assets.js';
import { startPreview } from './preview.js';
import './upload.js';
import './settings.js';
import './webhook.js';

const msgInput = document.getElementById('msg-input');
const btnSend = document.getElementById('btn-send');
const btnPreview = document.getElementById('btn-preview');
const btnClear = document.getElementById('btn-clear');
const btnRefresh = document.getElementById('btn-refresh-assets');
const chatWindow = document.getElementById('chat-window');
const offlineBanner = document.getElementById('offline-banner');

// Auto-size textarea
msgInput.addEventListener('input', () => {
	msgInput.style.height = 'auto';
	msgInput.style.height = Math.min(msgInput.scrollHeight, 180) + 'px';
});

btnSend.addEventListener('click', () => sendMessage(msgInput.value));
msgInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault();
		sendMessage(msgInput.value);
	}
});

btnPreview.addEventListener('click', async () => {
	btnPreview.classList.add('active');
	await startPreview();
	btnPreview.classList.remove('active');
});

btnClear.addEventListener('click', async () => {
	await fetch('/api/chat/clear', { method: 'POST' });
	chatWindow.innerHTML = '';
});

btnRefresh.addEventListener('click', loadAssets);

document.querySelectorAll('.chip').forEach((chip) => {
	chip.addEventListener('click', () => sendMessage(chip.dataset.prompt));
});

async function checkHealth() {
	try {
		const r = await fetch('/api/health');
		const d = await r.json();
		offlineBanner.style.display = d.fadeOnline ? 'none' : 'flex';
	} catch {
		offlineBanner.style.display = 'flex';
	}
}
checkHealth();
setInterval(checkHealth, 8_000);

loadAssets();
