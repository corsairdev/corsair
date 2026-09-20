import 'server-only';

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveCombosDir } from '@/lib/combo-paths';
import type { ComboData, ComboWorksWithItem } from '@/lib/combo-types';
import { comboDataSchema, worksWithFor } from '@/lib/combo-types';

export type {
	AppDetail,
	ComboAction,
	ComboData,
	ComboFaq,
	ComboKbApp,
	ComboKbTool,
	ComboTrigger,
	ComboWorkflow,
	ComboWorksWithItem,
	ConnectStep,
} from '@/lib/combo-types';
export { comboCountsFor, worksWithFor } from '@/lib/combo-types';

const COMBOS_DIR = resolveCombosDir();

function loadCombos(): ComboData[] {
	const names = readdirSync(COMBOS_DIR).filter((name) =>
		name.endsWith('.json'),
	);
	const combos: ComboData[] = [];
	const keys = new Set<string>();

	for (const name of names) {
		const raw: unknown = JSON.parse(
			readFileSync(join(COMBOS_DIR, name), 'utf8'),
		);
		let combo: ComboData;
		try {
			combo = comboDataSchema.parse(raw);
		} catch (err) {
			const detail = err instanceof Error ? err.message : String(err);
			throw new Error(`invalid combo file ${name}: ${detail}`);
		}
		const key = `${combo.slugA}/and/${combo.slugB}`;
		if (keys.has(key)) {
			throw new Error(`duplicate combo ${key} in ${name}`);
		}
		keys.add(key);
		combos.push(combo);
	}

	return combos;
}

export const COMBO_INDEX: Record<string, ComboData> = Object.fromEntries(
	loadCombos().map((combo) => [`${combo.slugA}/and/${combo.slugB}`, combo]),
);

export function getComboData(slug: string, other: string): ComboData | null {
	const a = slug.toLowerCase().trim();
	const b = other.toLowerCase().trim();
	if (!a || !b || a === b) return null;
	return COMBO_INDEX[`${a}/and/${b}`] ?? COMBO_INDEX[`${b}/and/${a}`] ?? null;
}

export function getComboCanonical(slug: string, other: string): string {
	const combo = getComboData(slug, other);
	if (!combo) {
		const a = slug.toLowerCase().trim();
		const b = other.toLowerCase().trim();
		return `/integrations/${a}/and/${b}`;
	}
	return `/integrations/${combo.slugA}/and/${combo.slugB}`;
}

export function getComboCanonicalUrls(): string[] {
	return Object.keys(COMBO_INDEX).map((key) => `/integrations/${key}`);
}

export function getWorksWith(integrationId: string): ComboWorksWithItem[] {
	return worksWithFor({
		combos: Object.values(COMBO_INDEX),
		integrationId,
	});
}
