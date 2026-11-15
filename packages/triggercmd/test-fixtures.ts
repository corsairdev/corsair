/**
 * Shapes from the live API and the provider's own client.
 *
 * The provider's Go CLI reads `records` from each list answer, then reads
 * `computer.name`, `name`, `allowParams` and `icon` from a command, and
 * `panel.name`, `name` and `params` from a panel button. The error bodies are
 * the ones a probe with a bogus token returned.
 */

export const command = {
	id: 101,
	name: 'notepad',
	allowParams: true,
	icon: 'notepad',
	voice: 'open notepad',
	ground: 'foreground',
	command: 'notepad.exe',
	computer: { id: 7, name: 'laptop' },
};

export const commandsEnvelope = {
	records: [
		command,
		{ ...command, id: 102, name: 'shutdown', allowParams: false },
	],
};

export const computer = {
	id: 7,
	name: 'laptop',
	connected: true,
	platform: 'win32',
};

export const computersEnvelope = {
	records: [
		computer,
		{ ...computer, id: 8, name: 'desktop', platform: 'linux' },
	],
};

export const panelButton = {
	id: 55,
	name: 'Lights off',
	params: 'off',
	panel: { id: 3, name: 'Living room' },
};

export const panelButtonsEnvelope = { records: [panelButton] };

export const commandRun = {
	id: 9001,
	status: 'success',
	createdAt: '2026-05-02T10:00:00Z',
	command: { id: 101, name: 'notepad' },
};

export const runsEnvelope = {
	records: [commandRun, { ...commandRun, id: 9002, status: 'failed' }],
};

/** An empty account: the key is present and the list is empty. */
export const emptyEnvelope = { records: [] };

/** A trigger acknowledgement. The provider does not document its wording. */
export const triggerAccepted = { result: 'success' };

// ---------------------------------------------------------------------------
// error bodies, copied from live probes
// ---------------------------------------------------------------------------

/** A bogus token, answered with 401 on every real route. */
export const invalidToken = { err: 'Invalid Token!' };

/** No Authorization header at all, answered with 401. */
export const noAuthHeader = { err: 'No Authorization header was found' };
