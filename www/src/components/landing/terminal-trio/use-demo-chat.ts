'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const CHAR_MS = 18;
const THINKING_DELAY_MS = 1400;

export type DemoChatPhase = 'input' | 'thinking' | 'assistant' | 'done';

export function useStreamText(text: string, active: boolean, charMs = CHAR_MS) {
	const [visible, setVisible] = useState('');
	const indexRef = useRef(0);

	useEffect(() => {
		indexRef.current = 0;
		setVisible('');
	}, [text]);

	useEffect(() => {
		if (!active) return;

		if (indexRef.current >= text.length) {
			setVisible(text);
			return;
		}

		const tick = () => {
			indexRef.current = Math.min(indexRef.current + 1, text.length);
			setVisible(text.slice(0, indexRef.current));
		};

		tick();
		const id = window.setInterval(tick, charMs);
		return () => window.clearInterval(id);
	}, [active, text, charMs]);

	return visible;
}

export function useDemoChatSend(userPrompt: string, assistantReply: string) {
	const [phase, setPhase] = useState<DemoChatPhase>('input');
	const [sentMessage, setSentMessage] = useState<string | null>(null);

	const assistantText = useStreamText(assistantReply, phase === 'assistant');
	const assistantComplete =
		(phase !== 'assistant' && phase !== 'thinking') ||
		assistantText.length >= assistantReply.length;

	const handleSend = useCallback(() => {
		if (phase !== 'input') return;
		setSentMessage(userPrompt);
		setPhase('thinking');
	}, [phase, userPrompt]);

	useEffect(() => {
		if (phase !== 'thinking') return;
		const id = window.setTimeout(() => setPhase('assistant'), THINKING_DELAY_MS);
		return () => window.clearTimeout(id);
	}, [phase]);

	useEffect(() => {
		if (phase !== 'assistant' || !assistantComplete) return;
		const id = window.setTimeout(() => setPhase('done'), 280);
		return () => window.clearTimeout(id);
	}, [phase, assistantComplete]);

	return {
		phase,
		sentMessage,
		assistantText,
		assistantComplete,
		handleSend,
		showInput: phase === 'input',
		hasSent: sentMessage !== null,
	};
}
