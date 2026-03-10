export type WorkflowStoreInput = {
  type: 'workflow';
  workflowId: string;
  code: string;
  description?: string;
  cronSchedule?: string;
  webhookTrigger?: { plugin: string; action: string };
  notifyJid?: string;
};

export type WorkflowListItem = {
  id: string;
  name: string;
  description: string | null;
  triggerType: 'manual' | 'cron' | 'webhook';
  triggerConfig: Record<string, unknown>;
  status: string;
  nextRunAt: Date | null;
  lastRunAt: Date | null;
  createdAt: Date;
};

export type WorkflowStored = {
  id: string;
  name: string;
  triggerType: 'manual' | 'cron' | 'webhook';
  status: string;
  code?: string;
  triggerConfig?: Record<string, unknown>;
};

export type WorkflowUpdateFields = {
  code?: string;
  description?: string;
  cronSchedule?: string;
  webhookTrigger?: { plugin: string; action: string };
  status?: 'active' | 'paused' | 'archived';
};

export type WorkflowAdapter = {
  listWorkflows(triggerType?: 'cron' | 'webhook' | 'manual' | 'all'): Promise<WorkflowListItem[]>;
  storeWorkflow(input: WorkflowStoreInput): Promise<WorkflowStored | null>;
  updateWorkflowRecord(
    nameOrId: string,
    updates: WorkflowUpdateFields,
  ): Promise<WorkflowStored | null>;
  archiveWorkflow(nameOrId: string): Promise<WorkflowStored | null>;
};

export type CronAdapter = {
  registerCronWorkflow(
    dbId: string,
    name: string,
    code: string,
    schedule: string,
    notifyJid?: string,
  ): boolean;
  unregisterCronWorkflow(dbId: string): void;
};

export type PermissionAdapter = {
  createPermissionRequest(params: {
    endpoint: string;
    args: Record<string, unknown>;
    description: string;
    jid?: string;
  }): Promise<{ permissionId: string; approvalUrl: string }>;
};

export type BaseMcpOptions = {
  corsair: {
    list_operations: (opts?: { plugin?: string; type?: 'api' | 'webhooks' | 'db' }) => unknown;
    get_schema: (path: string) => unknown;
    [key: string]: unknown;
  };
  workflows: WorkflowAdapter;
  cron: CronAdapter;
  permissions?: PermissionAdapter;
  basePermissionUrl?: string;
};
