const chatWindow = document.getElementById('chat-window');

export function scrollDown() {
	chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
}

export function clearWelcome() {
	chatWindow.querySelector('.welcome')?.remove();
}

export function appendMessage(role) {
	clearWelcome();
	const row = document.createElement('div');
	row.className = `msg ${role}`;
	row.innerHTML = `
		<div class="msg-avatar">${role === 'assistant' ? '🎬' : 'U'}</div>
		<div class="msg-body"></div>
	`;
	chatWindow.appendChild(row);
	scrollDown();
	return row.querySelector('.msg-body');
}

export function createBubble(body, text = '') {
	const b = document.createElement('div');
	b.className = 'msg-bubble';
	b.textContent = text;
	body.appendChild(b);
	return b;
}

export function appendTyping(body) {
	const el = document.createElement('div');
	el.className = 'msg-bubble typing';
	el.innerHTML = '<span></span><span></span><span></span>';
	body.appendChild(el);
	scrollDown();
	return el;
}
