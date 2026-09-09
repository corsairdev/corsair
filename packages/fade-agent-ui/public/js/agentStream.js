import {
	appendMessage,
	appendTyping,
	createBubble,
	scrollDown,
} from './chat.js';
import { setThinking, state } from './state.js';
import { appendToolCard, resolveToolCard } from './toolCard.js';

const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const msgInput = document.getElementById('msg-input');
const btnSend = document.getElementById('btn-send');

function setStatus(dot, text) {
	statusDot.className = `dot ${dot}`;
	statusText.textContent = text;
}

export async function sendMessage(text) {
	if (state.isThinking || !text.trim()) return;
	setThinking(true);
	btnSend.disabled = true;
	msgInput.value = '';
	msgInput.style.height = 'auto';
	state.activeToolCards.clear();

	const userBody = appendMessage('user');
	createBubble(userBody, text);

	const assistantBody = appendMessage('assistant');
	const typing = appendTyping(assistantBody);
	let bubble = null;

	setStatus('thinking', 'Thinking…');

	try {
		const res = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: text }),
		});

		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		let buf = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			buf += decoder.decode(value, { stream: true });
			const lines = buf.split('\n');
			buf = lines.pop();

			let event = null;
			for (const line of lines) {
				if (line.startsWith('event: ')) {
					event = line.slice(7).trim();
					continue;
				}
				if (line.startsWith('data: ') && event) {
					try {
						const data = JSON.parse(line.slice(6));
						if (event === 'text') {
							if (!bubble) {
								typing.remove();
								bubble = createBubble(assistantBody);
							}
							bubble.textContent += data.delta;
							scrollDown();
						} else if (event === 'tool_call') {
							setStatus('thinking', `Calling ${data.name}…`);
							appendToolCard(assistantBody, data);
						} else if (event === 'tool_result') {
							resolveToolCard(data);
							setStatus('thinking', 'Processing…');
						} else if (event === 'error') {
							const b = createBubble(assistantBody);
							b.textContent = `Error: ${data.message}`;
							b.style.color = '#f87171';
						}
					} catch {}
					event = null;
				}
			}
		}
	} catch (e) {
		typing.remove();
		const b = createBubble(assistantBody);
		b.textContent = `Error: ${e.message}`;
		b.style.color = '#f87171';
	}

	typing.parentNode && typing.remove();
	setStatus('done', 'Ready');
	setThinking(false);
	btnSend.disabled = false;
	scrollDown();
}
