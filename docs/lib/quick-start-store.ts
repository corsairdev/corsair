type State = { db: string; framework: string };
type Listener = () => void;

let state: State = { db: 'SQLite', framework: 'Anthropic SDK' };
const listeners = new Set<Listener>();

export function getState(): State {
    return state;
}

export function setState(partial: Partial<State>) {
    state = { ...state, ...partial };
    listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
