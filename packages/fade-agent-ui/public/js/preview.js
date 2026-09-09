import { appendMessage, scrollDown } from './chat.js';

export async function startPreview() {
	const body = appendMessage('assistant');
	const card = document.createElement('div');
	card.className = 'preview-card';
	card.innerHTML = `
		<div class="preview-card-header">
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
				<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
				<path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
			</svg>
			Preview Render
		</div>
		<div class="preview-progress">
			<div class="preview-progress-bar"><div class="preview-progress-fill" style="width:0%"></div></div>
			<div class="preview-progress-text">Starting render…</div>
		</div>
	`;
	body.appendChild(card);
	scrollDown();

	const fillEl = card.querySelector('.preview-progress-fill');
	const textEl = card.querySelector('.preview-progress-text');
	const progressDiv = card.querySelector('.preview-progress');

	let jobId;
	try {
		const res = await fetch('/api/preview', { method: 'POST' });
		const data = await res.json();
		jobId = data.jobId;
		if (!jobId) {
			textEl.textContent = `Error: ${data.error ?? 'no jobId'}`;
			return;
		}
	} catch (e) {
		textEl.textContent = `Failed to start: ${e.message}`;
		return;
	}

	while (true) {
		await new Promise((r) => setTimeout(r, 1500));
		try {
			const res = await fetch(`/api/preview/${jobId}/status`);
			const st = await res.json();
			const pct = Math.round((st.progress ?? 0) * 100);
			fillEl.style.width = pct + '%';
			textEl.textContent = `Rendering… ${pct}% (${st.currentFrame ?? 0}/${st.totalFrames ?? 0} frames)`;

			if (st.status === 'done') {
				progressDiv.remove();
				const video = document.createElement('video');
				video.controls = true;
				video.src = `/api/preview/video?t=${Date.now()}`;
				card.appendChild(video);
				scrollDown();
				break;
			}
			if (st.status === 'error' || st.status === 'cancelled') {
				textEl.textContent = `Render ${st.status}: ${st.errorMessage ?? ''}`;
				break;
			}
		} catch {
			break;
		}
	}
}
