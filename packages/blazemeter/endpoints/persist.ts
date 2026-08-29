import type { z } from 'zod';
import {
	BlazemeterAccountEntity,
	BlazemeterAssetEntity,
	BlazemeterPackageEntity,
	BlazemeterProjectEntity,
	BlazemeterTestEntity,
	BlazemeterUserEntity,
	BlazemeterWorkspaceEntity,
	BlazemeterWorkspaceUserEntity,
} from '../schema/database';

type EntityStore<T> = {
	upsertByEntityId: (entityId: string, data: T) => Promise<unknown>;
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

async function safely(operation: () => Promise<unknown>, what: string) {
	try {
		await operation();
	} catch (error) {
		console.warn(`[BLAZEMETER] ${what}:`, error);
	}
}

function unwrap(response: unknown): unknown {
	if (response && typeof response === 'object' && 'result' in response) {
		return (response as { result: unknown }).result;
	}
	return response;
}

function asList(value: unknown): unknown[] {
	if (Array.isArray(value)) return value;
	if (value && typeof value === 'object') return [value];
	return [];
}

function entityId(value: { id?: unknown }): string | undefined {
	return typeof value.id === 'string' || typeof value.id === 'number'
		? String(value.id)
		: undefined;
}

async function cacheRows<T extends { id?: unknown }>(
	store: EntityStore<T> | undefined,
	schema: z.ZodType<T>,
	raw: unknown,
	label: string,
) {
	if (!store) return;
	for (const row of asList(raw)) {
		const parsed = schema.safeParse(row);
		if (!parsed.success) continue;
		const id = entityId(parsed.data);
		if (!id) continue;
		await safely(
			() => store.upsertByEntityId(id, parsed.data),
			`cache ${label} ${id}`,
		);
	}
}

type EntityEvictor = {
	deleteByEntityId?: (entityId: string) => Promise<unknown>;
};

async function evict(
	store: EntityEvictor | undefined,
	id: unknown,
	label: string,
) {
	if (!store?.deleteByEntityId || id == null || id === '') return;
	await safely(
		() => store.deleteByEntityId!(String(id)),
		`evict ${label} ${id}`,
	);
}

function numericId(value: unknown): number | undefined {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string' && value !== '') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return undefined;
}

async function cacheWorkspaceUsers(
	store: EntityStore<BlazemeterWorkspaceUserEntity> | undefined,
	workspaceId: unknown,
	raw: unknown,
) {
	const wsId = numericId(workspaceId);
	if (!store || wsId == null) return;
	for (const row of asList(raw)) {
		const parsed = BlazemeterWorkspaceUserEntity.safeParse(row);
		if (!parsed.success) continue;
		const id = entityId(parsed.data);
		if (!id) continue;
		const key = `${wsId}:${id}`;
		const record = { ...parsed.data, workspaceId: wsId };
		await safely(
			() => store.upsertByEntityId(key, record),
			`cache workspace user ${key}`,
		);
	}
}

export type BlazemeterStores = {
	accounts?: EntityStore<BlazemeterAccountEntity>;
	workspaces?: EntityStore<BlazemeterWorkspaceEntity>;
	projects?: EntityStore<BlazemeterProjectEntity>;
	tests?: EntityStore<BlazemeterTestEntity>;
	users?: EntityStore<BlazemeterUserEntity>;
	workspaceUsers?: EntityStore<BlazemeterWorkspaceUserEntity>;
	assets?: EntityStore<BlazemeterAssetEntity>;
	packages?: EntityStore<BlazemeterPackageEntity>;
};

export async function persistBlazemeterResult(
	db: BlazemeterStores | undefined,
	key: string,
	input: Record<string, unknown>,
	response: unknown,
) {
	if (!db) return;
	const result = unwrap(response);

	switch (key) {
		case 'accounts.list':
			return cacheRows(db.accounts, BlazemeterAccountEntity, result, 'account');
		case 'workspaces.get':
		case 'workspaces.list':
			return cacheRows(
				db.workspaces,
				BlazemeterWorkspaceEntity,
				result,
				'workspace',
			);
		case 'projects.create':
		case 'projects.get':
		case 'projects.list':
		case 'projects.update':
		case 'user.projects':
			return cacheRows(db.projects, BlazemeterProjectEntity, result, 'project');
		case 'tests.create':
		case 'tests.get':
		case 'tests.list':
		case 'tests.update':
		case 'tests.duplicate':
			return cacheRows(db.tests, BlazemeterTestEntity, result, 'test');
		case 'user.get':
			return cacheRows(db.users, BlazemeterUserEntity, result, 'user');
		case 'workspaces.users':
			return cacheWorkspaceUsers(db.workspaceUsers, input.workspaceId, result);
		case 'assets.create':
		case 'assets.get':
		case 'assets.list':
		case 'assets.update':
			return cacheRows(db.assets, BlazemeterAssetEntity, result, 'asset');
		case 'packages.create':
		case 'packages.get':
		case 'packages.list':
		case 'packages.update':
			return cacheRows(db.packages, BlazemeterPackageEntity, result, 'package');
		case 'projects.remove':
			return evict(db.projects, input.id, 'project');
		case 'tests.remove':
			return evict(db.tests, input.testId, 'test');
		case 'assets.remove':
			return evict(db.assets, input.aId ?? input.assetId, 'asset');
		case 'packages.remove':
			return evict(db.packages, input.pId, 'package');
		default:
			return;
	}
}
