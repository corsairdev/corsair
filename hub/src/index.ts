import type { Server } from 'node:http';
import type { CreateHubAppOptions } from './http';
import { createHubApp } from './http';
import { InMemoryHubStore } from './store';

export { createHubApp, InMemoryHubStore };
export type { CreateHubAppOptions };
export { deliverToProject, selectTarget } from './delivery';
export type {
	AuditEvent,
	CreateProjectInput,
	HubKey,
	Project,
	ProjectTargets,
	TargetEnvironment,
	TenantHubKey,
	TunnelAck,
	TunnelEnvelope,
	TunnelType,
} from './types';

export interface StartHubOptions extends CreateHubAppOptions {
	host?: string;
	port?: number;
}

export async function startHub(options: StartHubOptions = {}): Promise<Server> {
	const { app } = createHubApp(options);
	const host = options.host ?? process.env.HOST ?? '127.0.0.1';
	const port = options.port ?? Number(process.env.PORT ?? 4318);

	return new Promise((resolve, reject) => {
		const server = app.listen(port, host);
		server.once('listening', () => resolve(server));
		server.once('error', reject);
	});
}
