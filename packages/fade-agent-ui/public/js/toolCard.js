import { scrollDown } from './chat.js';
import { state } from './state.js';

const ICONS = {
	get_timeline_state: '📋',
	place_clip: '📌',
	delete_clip: '🗑',
	move_clip: '↔️',
	trim_clip: '✂️',
	split_clip: '⚡',
	add_track: '➕',
	generate_tts: '🎙',
	generate_image: '🖼',
	download_videos: '⬇️',
	export_video: '📤',
	wait_for_export: '⏳',
	post_to_platform: '🚀',
	transcribe_asset: '📝',
	search_library: '🔍',
	add_effect: '✨',
	add_transition: '🎞',
	update_clip: '✏️',
	bulk_update_clips: '📦',
};

export function appendToolCard(body, toolCall) {
	const icon = ICONS[toolCall.name] ?? '🔧';
	const card = document.createElement('div');
	card.className = 'tool-card';
	card.innerHTML = `
		<div class="tool-card-header">
			<div class="tool-icon">${icon}</div>
			<span class="tool-name">${toolCall.name}</span>
			<span class="tool-status running">running</span>
		</div>
		<div class="tool-card-body">
			<pre class="tool-args">${JSON.stringify(toolCall.args, null, 2)}</pre>
			<div class="tool-result" style="display:none"></div>
		</div>
	`;
	card
		.querySelector('.tool-card-header')
		.addEventListener('click', () => card.classList.toggle('open'));
	body.appendChild(card);
	scrollDown();

	state.activeToolCards.set(toolCall.id, {
		statusEl: card.querySelector('.tool-status'),
		resultEl: card.querySelector('.tool-result'),
	});
}

export function resolveToolCard(toolResult) {
	const entry = state.activeToolCards.get(toolResult.tool_call_id);
	if (!entry) return;
	const { statusEl, resultEl } = entry;
	statusEl.className = 'tool-status done';
	statusEl.textContent = 'done';
	resultEl.style.display = 'block';
	const c = toolResult.content ?? '';
	resultEl.textContent = c.length > 800 ? c.slice(0, 800) + '…' : c;
}
