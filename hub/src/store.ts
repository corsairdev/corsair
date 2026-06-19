import { createOpaqueToken, createShortId } from './tokens';
import type {
	AuditEvent,
	CreateProjectInput,
	HubKey,
	Project,
	TargetEnvironment,
	TenantHubKey,
} from './types';

export class InMemoryHubStore {
	#projects = new Map<string, Project>();
	#hubKeyIndex = new Map<string, string>();
	#webhookHubKeyIndex = new Map<string, string>();
	#tenantKeyIndex = new Map<string, { projectId: string; tenantId: string }>();
	#auditEvents: AuditEvent[] = [];

	createProject(input: CreateProjectInput): Project {
		const now = new Date().toISOString();
		const hubKey: HubKey = { key: createOpaqueToken('hk'), createdAt: now };
		const webhookHubKey: HubKey = {
			key: createOpaqueToken('hw'),
			createdAt: now,
		};
		const project: Project = {
			id: createShortId('proj'),
			name: input.name.trim() || 'Untitled project',
			apiKey: createOpaqueToken('ctk'),
			signingSecret: createOpaqueToken('csec'),
			targets: input.targets ?? {},
			preferredEnvironment: input.preferredEnvironment ?? 'production',
			hubKeys: [hubKey],
			webhookHubKeys: [webhookHubKey],
			tenantHubKeys: [],
			createdAt: now,
			updatedAt: now,
		};

		this.#projects.set(project.id, project);
		this.#hubKeyIndex.set(hubKey.key, project.id);
		this.#webhookHubKeyIndex.set(webhookHubKey.key, project.id);
		return project;
	}

	listProjects(): Project[] {
		return [...this.#projects.values()].map(cloneProject);
	}

	getProject(projectId: string): Project | undefined {
		const project = this.#projects.get(projectId);
		return project ? cloneProject(project) : undefined;
	}

	resolveProjectHubKey(hubKey: string): Project | undefined {
		const projectId = this.#hubKeyIndex.get(hubKey);
		return projectId ? this.getProject(projectId) : undefined;
	}

	resolveProjectWebhookHubKey(webhookHubKey: string): Project | undefined {
		const projectId = this.#webhookHubKeyIndex.get(webhookHubKey);
		return projectId ? this.getProject(projectId) : undefined;
	}

	resolveTenantHubKey(tenantHubKey: string):
		| {
				project: Project;
				tenantId: string;
		  }
		| undefined {
		const match = this.#tenantKeyIndex.get(tenantHubKey);
		if (!match) return undefined;
		const project = this.getProject(match.projectId);
		return project ? { project, tenantId: match.tenantId } : undefined;
	}

	updateTargets(
		projectId: string,
		input: {
			targets?: Partial<Project['targets']>;
			preferredEnvironment?: TargetEnvironment;
		},
	): Project | undefined {
		const project = this.#projects.get(projectId);
		if (!project) return undefined;

		project.targets = { ...project.targets, ...input.targets };
		if (input.preferredEnvironment) {
			project.preferredEnvironment = input.preferredEnvironment;
		}
		project.updatedAt = new Date().toISOString();
		return cloneProject(project);
	}

	registerTenant(
		projectId: string,
		tenantId: string,
	): TenantHubKey | undefined {
		const project = this.#projects.get(projectId);
		if (!project) return undefined;

		const existing = project.tenantHubKeys.find(
			(hubKey) => hubKey.tenantId === tenantId && !hubKey.revokedAt,
		);
		if (existing) return { ...existing };

		const now = new Date().toISOString();
		const tenantHubKey: TenantHubKey = {
			key: createOpaqueToken('ht'),
			tenantId,
			createdAt: now,
		};
		project.tenantHubKeys.push(tenantHubKey);
		project.updatedAt = now;
		this.#tenantKeyIndex.set(tenantHubKey.key, { projectId, tenantId });
		return { ...tenantHubKey };
	}

	recordAudit(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
		const auditEvent: AuditEvent = {
			id: createShortId('evt'),
			timestamp: new Date().toISOString(),
			...event,
		};
		this.#auditEvents.unshift(auditEvent);
		this.#auditEvents = this.#auditEvents.slice(0, 250);
		return auditEvent;
	}

	listAudit(projectId?: string): AuditEvent[] {
		const events = projectId
			? this.#auditEvents.filter((event) => event.projectId === projectId)
			: this.#auditEvents;
		return events.map((event) => ({ ...event }));
	}
}

function cloneProject(project: Project): Project {
	return {
		...project,
		targets: { ...project.targets },
		hubKeys: project.hubKeys.map((key) => ({ ...key })),
		webhookHubKeys: project.webhookHubKeys.map((key) => ({ ...key })),
		tenantHubKeys: project.tenantHubKeys.map((key) => ({ ...key })),
	};
}
