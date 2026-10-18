import { z } from 'zod';
import type { OrbitContext } from '../index';
import { callOrbit, omitUndefined } from './call';
import {
	CreateWatcherInput,
	DeleteResult,
	UpdateWatcherInput,
	Watcher,
	WatcherIdInput,
	WatcherList,
	WatcherRuns,
	WatcherRunsInput,
} from './types';

export const Watchers = {
	create: (ctx: OrbitContext, input: unknown) =>
		callOrbit(
			ctx,
			'watchers.create',
			CreateWatcherInput,
			Watcher,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/watchers',
				body: omitUndefined(validated),
			}),
			(validated) => ({ orbitId: validated.orbit_id }),
		),
	list: (ctx: OrbitContext, input: unknown) =>
		callOrbit(
			ctx,
			'watchers.list',
			z.object({}),
			WatcherList,
			input,
			() => ({ method: 'GET', url: '/v3/watchers' }),
			() => ({ list: 'watchers' }),
		),
	get: (ctx: OrbitContext, input: unknown) =>
		callOrbit(
			ctx,
			'watchers.get',
			WatcherIdInput,
			Watcher,
			input,
			(validated) => ({
				method: 'GET',
				url: '/v3/watchers/{watcher_id}',
				path: { watcher_id: validated.watcher_id },
			}),
			(validated) => ({ watcherId: validated.watcher_id }),
		),
	update: (ctx: OrbitContext, input: unknown) =>
		callOrbit(
			ctx,
			'watchers.update',
			UpdateWatcherInput,
			Watcher,
			input,
			(validated) => ({
				method: 'PATCH',
				url: '/v3/watchers/{watcher_id}',
				path: { watcher_id: validated.watcher_id },
				body: omitUndefined({
					enabled: validated.enabled,
					interval_seconds: validated.interval_seconds,
					phases: validated.phases,
				}),
			}),
			(validated) => ({ watcherId: validated.watcher_id }),
		),
	delete: (ctx: OrbitContext, input: unknown) =>
		callOrbit(
			ctx,
			'watchers.delete',
			WatcherIdInput,
			DeleteResult,
			input,
			(validated) => ({
				method: 'DELETE',
				url: '/v3/watchers/{watcher_id}',
				path: { watcher_id: validated.watcher_id },
			}),
			(validated) => ({ watcherId: validated.watcher_id }),
		),
	runs: (ctx: OrbitContext, input: unknown) =>
		callOrbit(
			ctx,
			'watchers.runs',
			WatcherRunsInput,
			WatcherRuns,
			input,
			(validated) => ({
				method: 'GET',
				url: '/v3/watchers/{watcher_id}/runs',
				path: { watcher_id: validated.watcher_id },
				query: { limit: validated.limit },
			}),
			(validated) => ({ watcherId: validated.watcher_id }),
		),
};
