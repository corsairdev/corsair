import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ALL_SETTING_KEYS = [
	'provider',
	'model',
	'googleApiKey',
	'openaiApiKey',
	'anthropicApiKey',
	'groqApiKey',
	'tabiApiKey',
	'tabiBaseUrl',
	'stabilityApiKey',
	'phantomBusterApiKey',
	'youtubeClientId',
	'youtubeClientSecret',
] as const;
type SettingKey = (typeof ALL_SETTING_KEYS)[number];

function makeRuntimeConfig(): Record<SettingKey, string> {
	return Object.fromEntries(ALL_SETTING_KEYS.map((k) => [k, ''])) as Record<
		SettingKey,
		string
	>;
}

function loadPersistedSettings(
	filePath: string,
	config: Record<SettingKey, string>,
): void {
	try {
		if (!fs.existsSync(filePath)) return;
		const saved = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Partial<
			Record<SettingKey, string>
		>;
		for (const k of ALL_SETTING_KEYS) {
			if (saved[k] !== undefined && saved[k] !== '') config[k] = saved[k]!;
		}
	} catch {
		/* ignore corrupt file */
	}
}

function saveSettings(
	filePath: string,
	config: Record<SettingKey, string>,
): void {
	fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf8');
}

//   Job queue helpers

function makeQueue() {
	const q: string[] = [];
	return {
		push: (item: string) => q.push(item),
		shift: () => q.shift(),
		length: () => q.length,
		toArray: () => [...q],
	};
}

//   Tests

describe('settings key list', () => {
	it('contains all expected keys', () => {
		expect(ALL_SETTING_KEYS).toContain('provider');
		expect(ALL_SETTING_KEYS).toContain('model');
		expect(ALL_SETTING_KEYS).toContain('googleApiKey');
		expect(ALL_SETTING_KEYS).toContain('tabiApiKey');
		expect(ALL_SETTING_KEYS).toContain('tabiBaseUrl');
		expect(ALL_SETTING_KEYS).toContain('phantomBusterApiKey');
		expect(ALL_SETTING_KEYS).toContain('youtubeClientId');
		expect(ALL_SETTING_KEYS).toContain('stabilityApiKey');
	});

	it('has exactly 12 keys', () => {
		expect(ALL_SETTING_KEYS.length).toBe(12);
	});
});

describe('runtimeConfig initialises empty', () => {
	it('all values default to empty string', () => {
		const config = makeRuntimeConfig();
		for (const k of ALL_SETTING_KEYS) {
			expect(config[k]).toBe('');
		}
	});
});

describe('settings persistence', () => {
	let tmpFile: string;

	beforeEach(() => {
		tmpFile = path.join(os.tmpdir(), `.settings-test-${Date.now()}.json`);
	});

	afterEach(() => {
		if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
	});

	it('saves and reloads settings correctly', () => {
		const written = makeRuntimeConfig();
		written.provider = 'google';
		written.model = 'gemini-1.5-flash';
		written.googleApiKey = 'test-key-123';
		saveSettings(tmpFile, written);

		const loaded = makeRuntimeConfig();
		loadPersistedSettings(tmpFile, loaded);

		expect(loaded.provider).toBe('google');
		expect(loaded.model).toBe('gemini-1.5-flash');
		expect(loaded.googleApiKey).toBe('test-key-123');
	});

	it('does not overwrite existing values with empty strings', () => {
		// Save file with only some keys set
		fs.writeFileSync(
			tmpFile,
			JSON.stringify({ provider: 'openai', model: '' }),
		);

		const config = makeRuntimeConfig();
		config.provider = 'google';
		config.model = 'gemini-1.5-flash';

		loadPersistedSettings(tmpFile, config);

		expect(config.provider).toBe('openai'); // overwritten by file
		expect(config.model).toBe('gemini-1.5-flash'); // kept — file value is ''
	});

	it('handles corrupt JSON gracefully', () => {
		fs.writeFileSync(tmpFile, 'NOT_VALID_JSON');
		const config = makeRuntimeConfig();
		config.model = 'gemini-1.5-flash';

		expect(() => loadPersistedSettings(tmpFile, config)).not.toThrow();
		expect(config.model).toBe('gemini-1.5-flash'); // unchanged
	});

	it('is a no-op when file does not exist', () => {
		const config = makeRuntimeConfig();
		config.model = 'gpt-4o';
		expect(() =>
			loadPersistedSettings('/nonexistent/path.json', config),
		).not.toThrow();
		expect(config.model).toBe('gpt-4o');
	});
});

describe('job queue', () => {
	it('enqueues and dequeues in FIFO order', () => {
		const q = makeQueue();
		q.push('job-1');
		q.push('job-2');
		q.push('job-3');

		expect(q.length()).toBe(3);
		expect(q.shift()).toBe('job-1');
		expect(q.shift()).toBe('job-2');
		expect(q.length()).toBe(1);
	});

	it('returns undefined when empty', () => {
		const q = makeQueue();
		expect(q.shift()).toBeUndefined();
	});

	it('tracks queue contents accurately', () => {
		const q = makeQueue();
		q.push('a');
		q.push('b');
		expect(q.toArray()).toEqual(['a', 'b']);
	});
});

describe('webhook lead schema', () => {
	type Lead = {
		name?: string;
		firstName?: string;
		company?: string;
		topic?: string;
		[k: string]: unknown;
	};

	function leadToPrompt(lead: Lead): string {
		const name = lead.name ?? lead.firstName ?? 'Unknown';
		const company = lead.company ?? '';
		const topic = lead.topic ?? '';
		return [
			`Create a short promotional video for a lead.`,
			`Name: ${name}`,
			company && `Company: ${company}`,
			topic && `Topic: ${topic}`,
		]
			.filter(Boolean)
			.join('\n');
	}

	it('builds a prompt from a full lead', () => {
		const prompt = leadToPrompt({
			name: 'Alice',
			company: 'Acme',
			topic: 'AI tools',
		});
		expect(prompt).toContain('Alice');
		expect(prompt).toContain('Acme');
		expect(prompt).toContain('AI tools');
	});

	it('falls back to firstName when name is absent', () => {
		const prompt = leadToPrompt({ firstName: 'Bob' });
		expect(prompt).toContain('Bob');
	});

	it('falls back to Unknown when no name fields present', () => {
		const prompt = leadToPrompt({ company: 'Corp' });
		expect(prompt).toContain('Unknown');
	});

	it('omits empty optional fields from prompt', () => {
		const prompt = leadToPrompt({ name: 'Carol' });
		expect(prompt).not.toContain('Company:');
		expect(prompt).not.toContain('Topic:');
	});
});
