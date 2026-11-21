# @corsair-dev/metabase

Metabase plugin for Corsair: 309 verified REST operations from the official v65 OpenAPI document. The REST API is unversioned, and route availability depends on the installed instance.

## Install and configure

```bash
pnpm add @corsair-dev/metabase
```

```ts
import { metabase } from '@corsair-dev/metabase';

const plugin = metabase({ baseUrl: process.env.METABASE_URL });
```

`baseUrl` is administrator-controlled, must be an HTTPS origin without path/query/fragment/userinfo, and cannot be supplied in endpoint inputs. HTTP is allowed only for localhost development. Requests use the documented `X-API-Key`, omit cookies, target fixed `/api/...` routes, and do not follow redirects. API keys inherit the permissions of their assigned group.

## Operations

All 309 operations below are selected from routes with an official 2xx schema. Inputs and outputs are validated with operation-specific Zod schemas; documented binary routes use a bounded binary artifact wrapper where appropriate. Unknown request fields are rejected except where the OpenAPI contract explicitly defines extensible maps.

| Operation | Method and path | Risk | Official contract |
| --- | --- | --- | --- |
| `action.get` | `GET /api/action` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `action.getByActionId` | `GET /api/action/{action-id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `action.getPublic` | `GET /api/action/public` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `action.post` | `POST /api/action` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `action.postByActionIdExecuteValues` | `POST /api/action/{action-id}/execute/values` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `action.postExecute` | `POST /api/action/execute` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.getV1Ping` | `GET /api/agent/v1/ping` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1Collection` | `POST /api/agent/v1/collection` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1ConstructNativeQuery` | `POST /api/agent/v1/construct-native-query` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1Dashboard` | `POST /api/agent/v1/dashboard` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1Execute` | `POST /api/agent/v1/execute` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1ExecuteSql` | `POST /api/agent/v1/execute-sql` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1Metric` | `POST /api/agent/v1/metric` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1Question` | `POST /api/agent/v1/question` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1QuestionByIdQuery` | `POST /api/agent/v1/question/{id}/query` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1ReadResource` | `POST /api/agent/v1/read-resource` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV1Search` | `POST /api/agent/v1/search` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV2ConstructQuery` | `POST /api/agent/v2/construct-query` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.postV2Query` | `POST /api/agent/v2/query` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.putV1DashboardById` | `PUT /api/agent/v1/dashboard/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.putV1MetricById` | `PUT /api/agent/v1/metric/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `agent.putV1QuestionById` | `PUT /api/agent/v1/question/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `analytics.postInternal` | `POST /api/analytics/internal` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `apiKey.putByIdRegenerate` | `PUT /api/api-key/{id}/regenerate` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `cache.delete` | `DELETE /api/cache` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `cache.get` | `GET /api/cache` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `cache.postInvalidate` | `POST /api/cache/invalidate` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `cache.put` | `PUT /api/cache` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collectionPermissions.graph.get` | `GET /api/collection/graph` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collectionPermissions.graph.update` | `PUT /api/collection/graph` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.candidates.list` | `GET /api/collection/{id}/dashboard-question-candidates` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.candidates.move` | `POST /api/collection/{id}/move-dashboard-question-candidates` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.create` | `POST /api/collection` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.delete` | `DELETE /api/collection/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.get` | `GET /api/collection/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.items.list` | `GET /api/collection/{id}/items` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.items.metadata` | `GET /api/collection/{id}/items/metadata` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.list` | `GET /api/collection` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.candidates.list` | `GET /api/collection/root/dashboard-question-candidates` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.candidates.move` | `POST /api/collection/root/move-dashboard-question-candidates` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.get` | `GET /api/collection/root` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.items.list` | `GET /api/collection/root/items` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.root.items.metadata` | `GET /api/collection/root/items/metadata` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.trash.get` | `GET /api/collection/trash` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.tree` | `GET /api/collection/tree` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `collections.update` | `PUT /api/collection/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dashboard.postByDashboardIdDashcardByDashcardIdExecuteValues` | `POST /api/dashboard/{dashboard-id}/dashcard/{dashcard-id}/execute/values` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dashboard.postByIdPdf` | `POST /api/dashboard/{id}/pdf` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `database.getByIdSchemas` | `GET /api/database/{id}/schemas` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `database.getByIdSettingsAvailable` | `GET /api/database/{id}/settings-available` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dataset.post` | `POST /api/dataset` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dataset.postByExportFormat` | `POST /api/dataset/{export-format}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dataset.postPivot` | `POST /api/dataset/pivot` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dataStudio.postTableDiscardValues` | `POST /api/data-studio/table/discard-values` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dataStudio.postTableEdit` | `POST /api/data-studio/table/edit` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dataStudio.postTableRescanValues` | `POST /api/data-studio/table/rescan-values` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dataStudio.postTableSelection` | `POST /api/data-studio/table/selection` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `dataStudio.postTableSyncSchema` | `POST /api/data-studio/table/sync-schema` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `document.getPublic` | `GET /api/document/public` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `document.postByDocumentIdPublicLink` | `POST /api/document/{document-id}/public-link` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `document.postByFromDocumentIdCopy` | `POST /api/document/{from-document-id}/copy` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.deleteAiControlsMcpPermissionsAdvanced` | `DELETE /api/ee/ai-controls/mcp-permissions/advanced` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.deleteAiControlsPermissionsAdvanced` | `DELETE /api/ee/ai-controls/permissions/advanced` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.deleteAppsBySlugGroupsByGroupId` | `DELETE /api/ee/apps/{slug}/groups/{group-id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.deleteCloudAddOnsByProductType` | `DELETE /api/ee/cloud-add-ons/{product-type}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.deleteCustomVizPluginById` | `DELETE /api/ee/custom-viz-plugin/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.deleteTransformTestById` | `DELETE /api/ee/transform-test/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAiControlsMcpPermissions` | `GET /api/ee/ai-controls/mcp-permissions` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAiControlsPermissions` | `GET /api/ee/ai-controls/permissions` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAiControlsUsageGroup` | `GET /api/ee/ai-controls/usage/group` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAiControlsUsageGroupByGroupId` | `GET /api/ee/ai-controls/usage/group/{group-id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAiControlsUsageInstance` | `GET /api/ee/ai-controls/usage/instance` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAiControlsUsageTenant` | `GET /api/ee/ai-controls/usage/tenant` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAiControlsUsageTenantByTenantId` | `GET /api/ee/ai-controls/usage/tenant/{tenant-id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getApps` | `GET /api/ee/apps` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAppsBySlug` | `GET /api/ee/apps/{slug}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAppsBySlugBundle` | `GET /api/ee/apps/{slug}/bundle` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAppsBySlugGroupPermissionWarnings` | `GET /api/ee/apps/{slug}/group-permission-warnings` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAppsBySlugGroups` | `GET /api/ee/apps/{slug}/groups` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAppsGenerateSchema` | `GET /api/ee/apps/generate/schema` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAppsRepoStatus` | `GET /api/ee/apps/repo-status` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getAppsSandboxHost` | `GET /api/ee/apps/sandbox-host` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getContentDiagnosticsDuplicated` | `GET /api/ee/content-diagnostics/duplicated` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getContentDiagnosticsImbalanced` | `GET /api/ee/content-diagnostics/imbalanced` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getContentDiagnosticsSlow` | `GET /api/ee/content-diagnostics/slow` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getContentDiagnosticsStale` | `GET /api/ee/content-diagnostics/stale` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getContentTranslationDictionary` | `GET /api/ee/content-translation/dictionary` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getCustomVizPlugin` | `GET /api/ee/custom-viz-plugin` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getCustomVizPluginByIdAsset` | `GET /api/ee/custom-viz-plugin/{id}/asset` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getCustomVizPluginByIdBundle` | `GET /api/ee/custom-viz-plugin/{id}/bundle` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getCustomVizPluginList` | `GET /api/ee/custom-viz-plugin/list` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getCustomVizPluginSandboxHost` | `GET /api/ee/custom-viz-plugin/sandbox-host` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getDataComplexityScoreComplexity` | `GET /api/ee/data-complexity-score/complexity` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getDataStudioTableByIdPublishingInfo` | `GET /api/ee/data-studio/table/{id}/publishing-info` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getDependenciesBackfillStatus` | `GET /api/ee/dependencies/backfill-status` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getDependenciesGraph` | `GET /api/ee/dependencies/graph` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getDependenciesGraphBreaking` | `GET /api/ee/dependencies/graph/breaking` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getDependenciesGraphBroken` | `GET /api/ee/dependencies/graph/broken` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getDependenciesGraphDependents` | `GET /api/ee/dependencies/graph/dependents` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getDependenciesGraphUnreferenced` | `GET /api/ee/dependencies/graph/unreferenced` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getErd` | `GET /api/ee/erd` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getGsheetsConnection` | `GET /api/ee/gsheets/connection` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getGsheetsServiceAccount` | `GET /api/ee/gsheets/service-account` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getLibrary` | `GET /api/ee/library` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getMetabotAnalyticsConversations` | `GET /api/ee/metabot-analytics/conversations` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getMetabotAnalyticsConversationsById` | `GET /api/ee/metabot-analytics/conversations/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getMetabotUsage` | `GET /api/ee/metabot/usage` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getMfaAdminEnrolledUsers` | `GET /api/ee/mfa/admin/enrolled-users` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getMfaAdminOverview` | `GET /api/ee/mfa/admin/overview` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getMfaAdminUnenrolledUsers` | `GET /api/ee/mfa/admin/unenrolled-users` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getMfaStatus` | `GET /api/ee/mfa/status` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getPermissionDebug` | `GET /api/ee/permission_debug` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getRemoteSyncBranches` | `GET /api/ee/remote-sync/branches` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getRemoteSyncCurrentTask` | `GET /api/ee/remote-sync/current-task` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getRemoteSyncDirty` | `GET /api/ee/remote-sync/dirty` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getRemoteSyncExportPreflight` | `GET /api/ee/remote-sync/export-preflight` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getRemoteSyncHasRemoteChanges` | `GET /api/ee/remote-sync/has-remote-changes` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getRemoteSyncIsDirty` | `GET /api/ee/remote-sync/is-dirty` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getReplacementRuns` | `GET /api/ee/replacement/runs` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getReplacementRunsById` | `GET /api/ee/replacement/runs/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getSecurityCenter` | `GET /api/ee/security-center` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getSessionManagement` | `GET /api/ee/session-management` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getSupportAccessGrant` | `GET /api/ee/support-access-grant` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getSupportAccessGrantCurrent` | `GET /api/ee/support-access-grant/current` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getTenant` | `GET /api/ee/tenant` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getTenantById` | `GET /api/ee/tenant/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getTransformsByIdInspect` | `GET /api/ee/transforms/{id}/inspect` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getTransformsByIdInspectByLensId` | `GET /api/ee/transforms/{id}/inspect/{lens-id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getTransformTest` | `GET /api/ee/transform-test` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getTransformTestById` | `GET /api/ee/transform-test/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.getTransformTestByIdRun` | `GET /api/ee/transform-test/{id}/run` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postAiControlsMcpPermissionsAdvanced` | `POST /api/ee/ai-controls/mcp-permissions/advanced` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postAiControlsPermissionsAdvanced` | `POST /api/ee/ai-controls/permissions/advanced` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postAppsBySlugGroups` | `POST /api/ee/apps/{slug}/groups` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postAppsGenerateActions` | `POST /api/ee/apps/generate/actions` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postAppsGenerateQueries` | `POST /api/ee/apps/generate/queries` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postAuditAppAnalyticsDevExport` | `POST /api/ee/audit-app/analytics-dev/export` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postContentDiagnosticsInvalidate` | `POST /api/ee/content-diagnostics/invalidate` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postCustomVizPlugin` | `POST /api/ee/custom-viz-plugin` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postCustomVizPluginByIdRefresh` | `POST /api/ee/custom-viz-plugin/{id}/refresh` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postCustomVizPluginDev` | `POST /api/ee/custom-viz-plugin/dev` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postDataStudioTablePublishTables` | `POST /api/ee/data-studio/table/publish-tables` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postDataStudioTableUnpublishTables` | `POST /api/ee/data-studio/table/unpublish-tables` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postGsheetsConnection` | `POST /api/ee/gsheets/connection` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postMfaEnroll` | `POST /api/ee/mfa/enroll` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postMfaEnrollConfirm` | `POST /api/ee/mfa/enroll/confirm` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postMfaRecoveryCodes` | `POST /api/ee/mfa/recovery-codes` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postRemoteSyncCreateBranch` | `POST /api/ee/remote-sync/create-branch` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postRemoteSyncCurrentTaskCancel` | `POST /api/ee/remote-sync/current-task/cancel` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postRemoteSyncExport` | `POST /api/ee/remote-sync/export` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postRemoteSyncImport` | `POST /api/ee/remote-sync/import` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postRemoteSyncStash` | `POST /api/ee/remote-sync/stash` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postRemoteSyncTestConnection` | `POST /api/ee/remote-sync/test-connection` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postReplacementCheckReplaceSource` | `POST /api/ee/replacement/check-replace-source` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postReplacementReplaceModelWithTransform` | `POST /api/ee/replacement/replace-model-with-transform` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postReplacementReplaceSource` | `POST /api/ee/replacement/replace-source` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postReplacementRunsByIdCancel` | `POST /api/ee/replacement/runs/{id}/cancel` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postSecurityCenterAcknowledge` | `POST /api/ee/security-center/acknowledge` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postSecurityCenterByAdvisoryIdAcknowledge` | `POST /api/ee/security-center/{advisory-id}/acknowledge` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postSecurityCenterSync` | `POST /api/ee/security-center/sync` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postSecurityCenterTestNotification` | `POST /api/ee/security-center/test-notification` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postSessionManagementRevoke` | `POST /api/ee/session-management/revoke` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postSupportAccessGrant` | `POST /api/ee/support-access-grant` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postTenant` | `POST /api/ee/tenant` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postTransformsByIdInspectByLensIdQuery` | `POST /api/ee/transforms/{id}/inspect/{lens-id}/query` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postTransformsPythonTestRun` | `POST /api/ee/transforms-python/test-run` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postTransformTest` | `POST /api/ee/transform-test` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.postTransformTestByIdRun` | `POST /api/ee/transform-test/{id}/run` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putAiControlsMcpPermissions` | `PUT /api/ee/ai-controls/mcp-permissions` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putAiControlsPermissions` | `PUT /api/ee/ai-controls/permissions` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putAiControlsUsageGroupByGroupId` | `PUT /api/ee/ai-controls/usage/group/{group-id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putAiControlsUsageInstance` | `PUT /api/ee/ai-controls/usage/instance` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putAiControlsUsageTenantByTenantId` | `PUT /api/ee/ai-controls/usage/tenant/{tenant-id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putAppsBySlug` | `PUT /api/ee/apps/{slug}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putCustomVizPluginById` | `PUT /api/ee/custom-viz-plugin/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putCustomVizPluginByIdBundle` | `PUT /api/ee/custom-viz-plugin/{id}/bundle` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putCustomVizPluginByIdDevUrl` | `PUT /api/ee/custom-viz-plugin/{id}/dev-url` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putRemoteSyncSettings` | `PUT /api/ee/remote-sync/settings` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putSupportAccessGrantByIdRevoke` | `PUT /api/ee/support-access-grant/{id}/revoke` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putTenantById` | `PUT /api/ee/tenant/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `ee.putTransformTestById` | `PUT /api/ee/transform-test/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embeddingHub.getChecklist` | `GET /api/embedding-hub/checklist` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embeddingSdk.getReact18Hosts` | `GET /api/embedding-sdk/react-18-hosts` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedMcp.getBootstrap` | `GET /api/embed-mcp/bootstrap` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedMcp.getQueriesByHandle` | `GET /api/embed-mcp/queries/{handle}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedMcp.postFeedback` | `POST /api/embed-mcp/feedback` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedTheme.deleteById` | `DELETE /api/embed-theme/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedTheme.get` | `GET /api/embed-theme` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedTheme.getById` | `GET /api/embed-theme/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedTheme.post` | `POST /api/embed-theme` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedTheme.postByIdCopy` | `POST /api/embed-theme/{id}/copy` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedTheme.postSeedDefaults` | `POST /api/embed-theme/seed-defaults` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `embedTheme.putById` | `PUT /api/embed-theme/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `evalTrace.getBySessionId` | `GET /api/eval-trace/{session-id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.deleteById` | `DELETE /api/exploration/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.getById` | `GET /api/exploration/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.getDimensions` | `GET /api/exploration/dimensions` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.getMine` | `GET /api/exploration/mine` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.getQueryById` | `GET /api/exploration/query/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.post` | `POST /api/exploration` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.postByIdExploreFurther` | `POST /api/exploration/{id}/explore-further` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.postByIdSummaryAppend` | `POST /api/exploration/{id}/summary/append` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.postThreadByThreadIdCancel` | `POST /api/exploration/thread/{thread-id}/cancel` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.postThreadByThreadIdRestart` | `POST /api/exploration/thread/{thread-id}/restart` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.putById` | `PUT /api/exploration/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.putPageByIdStarred` | `PUT /api/exploration/page/{id}/starred` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `exploration.putPagesHidden` | `PUT /api/exploration/pages/hidden` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `field.postTableIds` | `POST /api/field/table-ids` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `healthInspector.get` | `GET /api/health-inspector` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `index.get` | `GET /api/index` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `index.getRequestById` | `GET /api/index/request/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `index.postRequest` | `POST /api/index/request` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `index.putRequestById` | `PUT /api/index/request/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `llm.deleteProvidersByKey` | `DELETE /api/llm/providers/{key}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `llm.getModels` | `GET /api/llm/models` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `llm.getProviders` | `GET /api/llm/providers` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `llm.getProviderTypes` | `GET /api/llm/provider-types` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `llm.postExtractSources` | `POST /api/llm/extract-sources` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `llm.postProviders` | `POST /api/llm/providers` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `llm.putProvidersByKey` | `PUT /api/llm/providers/{key}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `logger.getPresets` | `GET /api/logger/presets` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `measure.get` | `GET /api/measure` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `measure.getById` | `GET /api/measure/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `measure.getByIdDimensionByDimensionKeyRemapping` | `GET /api/measure/{id}/dimension/{dimension-key}/remapping` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `measure.getByIdDimensionByDimensionKeySearch` | `GET /api/measure/{id}/dimension/{dimension-key}/search` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `measure.getByIdDimensionByDimensionKeyValues` | `GET /api/measure/{id}/dimension/{dimension-key}/values` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `measure.post` | `POST /api/measure` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `measure.putById` | `PUT /api/measure/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.getConversations` | `GET /api/metabot/conversations` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.getConversationsById` | `GET /api/metabot/conversations/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.getConversationsByIdTitle` | `GET /api/metabot/conversations/{id}/title` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.getPermissionsUserPermissions` | `GET /api/metabot/permissions/user-permissions` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.postConversationsByIdFork` | `POST /api/metabot/conversations/{id}/fork` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.postConversationsByIdSavedEntity` | `POST /api/metabot/conversations/{id}/saved-entity` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.postDocumentGenerateContent` | `POST /api/metabot/document/generate-content` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.postFeedback` | `POST /api/metabot/feedback` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.postMetabotByIdPromptSuggestionsRegenerate` | `POST /api/metabot/metabot/{id}/prompt-suggestions/regenerate` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.postSourceFeedback` | `POST /api/metabot/source-feedback` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metabot.putSlackSettings` | `PUT /api/metabot/slack/settings` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.get` | `GET /api/metric` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.getById` | `GET /api/metric/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.getByIdDimension` | `GET /api/metric/{id}/dimension` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.getByIdDimensionByDimensionKeyRemapping` | `GET /api/metric/{id}/dimension/{dimension-key}/remapping` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.getByIdDimensionByDimensionKeySearch` | `GET /api/metric/{id}/dimension/{dimension-key}/search` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.getByIdDimensionByDimensionKeyValues` | `GET /api/metric/{id}/dimension/{dimension-key}/values` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.postBreakoutValues` | `POST /api/metric/breakout-values` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.postByIdDimensionAdd` | `POST /api/metric/{id}/dimension/add` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.postByIdDimensionByDimensionKey` | `POST /api/metric/{id}/dimension/{dimension-key}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.postByIdDimensionRemove` | `POST /api/metric/{id}/dimension/remove` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.postByIdDimensionReorder` | `POST /api/metric/{id}/dimension/reorder` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.postByIdDimensionSetDefault` | `POST /api/metric/{id}/dimension/set-default` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `metric.postDataset` | `POST /api/metric/dataset` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `notification.getAdmin` | `GET /api/notification/admin` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `notification.getAdminById` | `GET /api/notification/admin/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `notification.post` | `POST /api/notification` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `notification.postAdminBulk` | `POST /api/notification/admin/bulk` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `oauth.getAuthorizations` | `GET /api/oauth/authorizations` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `osi.getAiContext` | `GET /api/osi/ai-context` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `osi.getAiContextByEntityTypeByEntityLocalId` | `GET /api/osi/ai-context/{entity-type}/{entity-local-id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `osi.postAiContextReconcile` | `POST /api/osi/ai-context/reconcile` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `osi.putAiContextByEntityTypeByEntityLocalId` | `PUT /api/osi/ai-context/{entity-type}/{entity-local-id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `permissions.getInviteGroupIds` | `GET /api/permissions/invite-group-ids` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `previewEmbed.getCardByTokenParamsByParamKeyValues` | `GET /api/preview_embed/card/{token}/params/{param-key}/values` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `public.postDashboardByUuidDashcardByDashcardIdExecuteValues` | `POST /api/public/dashboard/{uuid}/dashcard/{dashcard-id}/execute/values` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `session.getIllustrationByKey` | `GET /api/session/illustration/{key}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `session.postMfaEnroll` | `POST /api/session/mfa/enroll` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `session.postMfaSendEmailOtp` | `POST /api/session/mfa/send-email-otp` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `slack.getAppInfo` | `GET /api/slack/app-info` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `slack.getManifest` | `GET /api/slack/manifest` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `table.putByIdFieldsOrder` | `PUT /api/table/{id}/fields/order` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `task.getRuns` | `GET /api/task/runs` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `task.getRunsById` | `GET /api/task/runs/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `task.getRunsEntities` | `GET /api/task/runs/entities` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `timeline.get` | `GET /api/timeline` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `timeline.getById` | `GET /api/timeline/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `timeline.post` | `POST /api/timeline` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.deleteById` | `DELETE /api/transform/{id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.deleteByIdTable` | `DELETE /api/transform/{id}/table` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.get` | `GET /api/transform` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.getById` | `GET /api/transform/{id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.getByIdDagTransforms` | `GET /api/transform/{id}/dag-transforms` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.getByIdDependencies` | `GET /api/transform/{id}/dependencies` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.getRun` | `GET /api/transform/run` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.getRunByRunId` | `GET /api/transform/run/{run-id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.getRuns` | `GET /api/transform/runs` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.post` | `POST /api/transform` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.postByIdCancel` | `POST /api/transform/{id}/cancel` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.postByIdResetCheckpoint` | `POST /api/transform/{id}/reset-checkpoint` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.postByIdRun` | `POST /api/transform/{id}/run` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.postByIdRunDag` | `POST /api/transform/{id}/run-dag` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transform.putById` | `PUT /api/transform/{id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformDagRun.getByRunIdTransformRuns` | `GET /api/transform-dag-run/{run-id}/transform-runs` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformDagRun.postByRunIdCancel` | `POST /api/transform-dag-run/{run-id}/cancel` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.get` | `GET /api/transform-job` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.getByJobId` | `GET /api/transform-job/{job-id}` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.getByJobIdRuns` | `GET /api/transform-job/{job-id}/runs` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.getByJobIdRunsByRunIdTransformRuns` | `GET /api/transform-job/{job-id}/runs/{run-id}/transform-runs` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.getByJobIdTransforms` | `GET /api/transform-job/{job-id}/transforms` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.post` | `POST /api/transform-job` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.postByJobIdRun` | `POST /api/transform-job/{job-id}/run` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.postByJobIdRunsByRunIdCancel` | `POST /api/transform-job/{job-id}/runs/{run-id}/cancel` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.putActive` | `PUT /api/transform-job/active` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformJob.putByJobId` | `PUT /api/transform-job/{job-id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformTag.deleteByTagId` | `DELETE /api/transform-tag/{tag-id}` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformTag.get` | `GET /api/transform-tag` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformTag.post` | `POST /api/transform-tag` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `transformTag.putByTagId` | `PUT /api/transform-tag/{tag-id}` | write | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `user.getCurrent` | `GET /api/user/current` | read | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |
| `user.postByIdPasswordResetUrl` | `POST /api/user/{id}/password-reset-url` | destructive | [OpenAPI](https://www.metabase.com/docs/latest/api.json) |

## Request, response, and safety behavior

- Documented query filters, limits, offsets, and continuation tokens are forwarded with OpenAPI form-style serialization. No pagination inputs are invented where a route exposes only response metadata.
- Binary downloads return `{ kind: "binary", contentType, base64, size, headers }`; content disposition, CSP, cache control, and ETag headers are preserved. Downloads and multipart uploads default to a 20 MiB safety cap, configurable up to 100 MiB with `maxResponseBytes` / `maxUploadBytes`.
- Default request timeout is 20 seconds; synchronous query/download routes use a bounded 120-second timeout. The API docs publish no global rate-limit policy; the client retries 429 at most three times honoring `Retry-After` (capped at 60 seconds), and does not retry network/5xx failures.
- SQL, query payloads, response data, URL query strings, and credentials are excluded from logs and propagated error bodies. Raw SQL/query execution is marked destructive where it can mutate connected data; notifications, access changes, key regeneration, and transformation runs use appropriate write/destructive risk levels.
- Multipart custom-visualization bundle routes accept a Blob-backed file part. File size must match the supplied metadata size.

## Exclusions and source discrepancies

- `GET /api/ee/custom-viz-plugin/{id}/dev-sse` is excluded because Metabase documents it as a Server-Sent Events proxy; Corsair endpoints return one validated response and cannot preserve an open event stream.
- `POST /api/metabot/slack/events` is excluded as an inbound Slack Events API receiver, not an outbound Metabase operation. Metabase describes it as responding to Slack activity; its OpenAPI has no request parameters/body schema and its success schema is an HTTP response envelope. Slack documents Events API as Slack calling the app’s public endpoint. See [Metabot in Slack](https://www.metabase.com/docs/latest/ai/metabot-slack) and [Slack Events API](https://docs.slack.dev/apis/events-api/).
- The other 419 operations in the current OpenAPI document have no declared 2xx response schema. No response shape is invented for them; no separate first-party endpoint page with a complete alternative success contract was identified.
- Some binary operations have route descriptions that specify files while the generated OpenAPI media/schema is generic or JSON-shaped. Per-operation docs note the source discrepancy; the adapter follows the explicit route description and caps returned bytes.
- Metabase’s masked API-key schema contains an invalid ECMAScript regex; its description documents the prefix/masked-suffix shape, which the plugin validates instead.
- Webhook receiver support was not requested; `webhooks` is empty.

References: [Metabase REST API OpenAPI](https://www.metabase.com/docs/latest/api.json), [API keys](https://www.metabase.com/docs/latest/people-and-groups/api-keys), [documentation index](https://www.metabase.com/docs/llms.txt).

## Live test

The environment-gated live smoke test performs one read-only collection request when `METABASE_BASE_URL` and `METABASE_API_KEY` are set. No live call is claimed without credentials.

## License

Apache-2.0
