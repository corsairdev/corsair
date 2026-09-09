export const state = {
	isThinking: false,
	activeToolCards: new Map(),
};

export function setThinking(val) {
	state.isThinking = val;
}
