# @corsair-dev/dnsfilter

DNSFilter integration for Corsair - DNS security, content filtering, and network management.

## Install

```bash
pnpm add @corsair-dev/dnsfilter
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agentLocalUserBulkDeletes.counts` | `dnsfilter.api.agentLocalUserBulkDeletes.counts` | `read` | Counts for agent local user bulk deletes |
| `agentLocalUserBulkDeletes.create` | `dnsfilter.api.agentLocalUserBulkDeletes.create` | `write` | Bulk delete agent local user |
| `agentLocalUserBulkDeletes.get` | `dnsfilter.api.agentLocalUserBulkDeletes.get` | `read` | Get an agent local user bulk delete |
| `agentLocalUsers.delete` | `dnsfilter.api.agentLocalUsers.delete` | `destructive` | Delete an agent local user |
| `agentLocalUsers.get` | `dnsfilter.api.agentLocalUsers.get` | `read` | Get an agent local user |
| `agentLocalUsers.list` | `dnsfilter.api.agentLocalUsers.list` | `read` | List agent local users |
| `agentLocalUsers.listAll` | `dnsfilter.api.agentLocalUsers.listAll` | `read` | List all agent local users |
| `agentLocalUsers.update` | `dnsfilter.api.agentLocalUsers.update` | `write` | Update an agent local user |
| `agentLocalUsersV2.counts` | `dnsfilter.api.agentLocalUsersV2.counts` | `read` | Counts for agent local users V2 |
| `apiKeys.create` | `dnsfilter.api.apiKeys.create` | `write` | Create an API key |
| `apiKeys.delete` | `dnsfilter.api.apiKeys.delete` | `destructive` | Delete an API key |
| `apiKeys.get` | `dnsfilter.api.apiKeys.get` | `read` | Get an API key |
| `apiKeys.list` | `dnsfilter.api.apiKeys.list` | `read` | List API keys |
| `apiKeys.revoke` | `dnsfilter.api.apiKeys.revoke` | `destructive` | Revoke for API keys |
| `applicationCategories.get` | `dnsfilter.api.applicationCategories.get` | `read` | Get an application category |
| `applicationCategories.list` | `dnsfilter.api.applicationCategories.list` | `read` | List application categories |
| `applications.get` | `dnsfilter.api.applications.get` | `read` | Get an application |
| `applications.list` | `dnsfilter.api.applications.list` | `read` | List applications |
| `applications.listAll` | `dnsfilter.api.applications.listAll` | `read` | List all applications |
| `billings.addressShow` | `dnsfilter.api.billings.addressShow` | `read` | Address show for billings |
| `billings.addressUpdate` | `dnsfilter.api.billings.addressUpdate` | `write` | Address update for billings |
| `billings.create` | `dnsfilter.api.billings.create` | `write` | Create a billing |
| `billings.get` | `dnsfilter.api.billings.get` | `read` | Get a billing |
| `blockPages.create` | `dnsfilter.api.blockPages.create` | `write` | Create a block page |
| `blockPages.delete` | `dnsfilter.api.blockPages.delete` | `destructive` | Delete a block page |
| `blockPages.get` | `dnsfilter.api.blockPages.get` | `read` | Get a block page |
| `blockPages.list` | `dnsfilter.api.blockPages.list` | `read` | List block pages |
| `blockPages.listAll` | `dnsfilter.api.blockPages.listAll` | `read` | List all block pages |
| `blockPages.update` | `dnsfilter.api.blockPages.update` | `write` | Update a block page |
| `categories.get` | `dnsfilter.api.categories.get` | `read` | Get a category |
| `categories.list` | `dnsfilter.api.categories.list` | `read` | List categories |
| `categories.listAll` | `dnsfilter.api.categories.listAll` | `read` | List all categories |
| `collectionUsers.create` | `dnsfilter.api.collectionUsers.create` | `write` | Create a collection user |
| `collectionUsers.delete` | `dnsfilter.api.collectionUsers.delete` | `destructive` | Delete a collection user |
| `collectionUsers.get` | `dnsfilter.api.collectionUsers.get` | `read` | Get a collection user |
| `collectionUsers.list` | `dnsfilter.api.collectionUsers.list` | `read` | List collection users |
| `currentUserOrgUiSettings.suppressLicenseWarning` | `dnsfilter.api.currentUserOrgUiSettings.suppressLicenseWarning` | `write` | Suppress license warning for current user org UI settings |
| `currentUsers.get` | `dnsfilter.api.currentUsers.get` | `read` | Get a current user |
| `currentUsers.update` | `dnsfilter.api.currentUsers.update` | `write` | Update a current user |
| `currentUserUiSettings.get` | `dnsfilter.api.currentUserUiSettings.get` | `read` | Get a current user UI setting |
| `currentUserUiSettings.update` | `dnsfilter.api.currentUserUiSettings.update` | `write` | Update a current user UI setting |
| `dashboards.available` | `dnsfilter.api.dashboards.available` | `read` | Available for dashboards |
| `dashboards.create` | `dnsfilter.api.dashboards.create` | `write` | Create a dashboard |
| `dashboards.delete` | `dnsfilter.api.dashboards.delete` | `destructive` | Delete a dashboard |
| `dashboards.link` | `dnsfilter.api.dashboards.link` | `write` | Link for dashboards |
| `dashboards.list` | `dnsfilter.api.dashboards.list` | `read` | List dashboards |
| `dashboards.makePrivate` | `dnsfilter.api.dashboards.makePrivate` | `write` | Make private for dashboards |
| `dashboards.makePublic` | `dnsfilter.api.dashboards.makePublic` | `write` | Make public for dashboards |
| `dashboards.owned` | `dnsfilter.api.dashboards.owned` | `read` | Owned for dashboards |
| `dashboards.unlink` | `dnsfilter.api.dashboards.unlink` | `write` | Unlink for dashboards |
| `dashboards.update` | `dnsfilter.api.dashboards.update` | `write` | Update a dashboard |
| `dictionary.qpMethods` | `dnsfilter.api.dictionary.qpMethods` | `read` | Qp methods for dictionary |
| `dictionaryV2.aiApplications` | `dnsfilter.api.dictionaryV2.aiApplications` | `read` | Ai applications for dictionary V2 |
| `dictionaryV2.cyberSightActivityTypes` | `dnsfilter.api.dictionaryV2.cyberSightActivityTypes` | `read` | Cyber sight activity types for dictionary V2 |
| `dictionaryV2.vpnSettingsStateTypes` | `dnsfilter.api.dictionaryV2.vpnSettingsStateTypes` | `read` | Vpn settings state types for dictionary V2 |
| `domainNotes.batchDestroy` | `dnsfilter.api.domainNotes.batchDestroy` | `destructive` | Batch destroy for domain notes |
| `domainNotes.batchUpdate` | `dnsfilter.api.domainNotes.batchUpdate` | `write` | Batch update for domain notes |
| `domainNotes.delete` | `dnsfilter.api.domainNotes.delete` | `destructive` | Delete a domain note |
| `domainNotes.get` | `dnsfilter.api.domainNotes.get` | `read` | Get a domain note |
| `domainNotes.update` | `dnsfilter.api.domainNotes.update` | `write` | Update a domain note |
| `domains.bulkLookup` | `dnsfilter.api.domains.bulkLookup` | `read` | Bulk lookup for domains |
| `domains.suggestThreat` | `dnsfilter.api.domains.suggestThreat` | `write` | Suggest threat for domains |
| `domains.userLookup` | `dnsfilter.api.domains.userLookup` | `read` | User lookup for domains |
| `enterpriseConnections.create` | `dnsfilter.api.enterpriseConnections.create` | `write` | Create an enterprise connection |
| `enterpriseConnections.delete` | `dnsfilter.api.enterpriseConnections.delete` | `destructive` | Delete an enterprise connection |
| `enterpriseConnections.get` | `dnsfilter.api.enterpriseConnections.get` | `read` | Get an enterprise connection |
| `enterpriseConnections.list` | `dnsfilter.api.enterpriseConnections.list` | `read` | List enterprise connections |
| `enterpriseConnections.update` | `dnsfilter.api.enterpriseConnections.update` | `write` | Update an enterprise connection |
| `invoices.current` | `dnsfilter.api.invoices.current` | `read` | Current for invoices |
| `invoices.get` | `dnsfilter.api.invoices.get` | `read` | Get an invoice |
| `invoices.list` | `dnsfilter.api.invoices.list` | `read` | List invoices |
| `ipAddresses.create` | `dnsfilter.api.ipAddresses.create` | `write` | Create an IP address |
| `ipAddresses.delete` | `dnsfilter.api.ipAddresses.delete` | `destructive` | Delete an IP address |
| `ipAddresses.get` | `dnsfilter.api.ipAddresses.get` | `read` | Get an IP address |
| `ipAddresses.list` | `dnsfilter.api.ipAddresses.list` | `read` | List IP addresses |
| `ipAddresses.listAll` | `dnsfilter.api.ipAddresses.listAll` | `read` | List all IP addresses |
| `ipAddresses.myip` | `dnsfilter.api.ipAddresses.myip` | `read` | Myip for IP addresses |
| `ipAddresses.update` | `dnsfilter.api.ipAddresses.update` | `write` | Update an IP address |
| `ipAddresses.verify` | `dnsfilter.api.ipAddresses.verify` | `read` | Verify for IP addresses |
| `macAddresses.create` | `dnsfilter.api.macAddresses.create` | `write` | Create a MAC address |
| `macAddresses.delete` | `dnsfilter.api.macAddresses.delete` | `destructive` | Delete a MAC address |
| `macAddresses.get` | `dnsfilter.api.macAddresses.get` | `read` | Get a MAC address |
| `macAddresses.list` | `dnsfilter.api.macAddresses.list` | `read` | List MAC addresses |
| `macAddresses.listAll` | `dnsfilter.api.macAddresses.listAll` | `read` | List all MAC addresses |
| `macAddresses.update` | `dnsfilter.api.macAddresses.update` | `write` | Update a MAC address |
| `metrics.organizationUsage` | `dnsfilter.api.metrics.organizationUsage` | `read` | Organization usage for metrics |
| `metrics.organizationUsageDetailed` | `dnsfilter.api.metrics.organizationUsageDetailed` | `read` | Organization usage detailed for metrics |
| `networkLanIps.get` | `dnsfilter.api.networkLanIps.get` | `read` | Get a network LAN IPS |
| `networkLanIps.list` | `dnsfilter.api.networkLanIps.list` | `read` | List network LAN IPS |
| `networkLanIps.update` | `dnsfilter.api.networkLanIps.update` | `write` | Update a network LAN IPS |
| `networks.bulkCreate` | `dnsfilter.api.networks.bulkCreate` | `write` | Bulk create for networks |
| `networks.bulkCreateStatus` | `dnsfilter.api.networks.bulkCreateStatus` | `read` | Bulk create status for networks |
| `networks.bulkDestroy` | `dnsfilter.api.networks.bulkDestroy` | `destructive` | Bulk destroy for networks |
| `networks.bulkDestroyStatus` | `dnsfilter.api.networks.bulkDestroyStatus` | `read` | Bulk destroy status for networks |
| `networks.bulkUpdate` | `dnsfilter.api.networks.bulkUpdate` | `write` | Bulk update for networks |
| `networks.bulkUpdateStatus` | `dnsfilter.api.networks.bulkUpdateStatus` | `read` | Bulk update status for networks |
| `networks.counts` | `dnsfilter.api.networks.counts` | `read` | Counts for networks |
| `networks.create` | `dnsfilter.api.networks.create` | `write` | Create a network |
| `networks.delete` | `dnsfilter.api.networks.delete` | `destructive` | Delete a network |
| `networks.generateSecretKey` | `dnsfilter.api.networks.generateSecretKey` | `write` | Generate secret key for networks |
| `networks.geo` | `dnsfilter.api.networks.geo` | `read` | Geo for networks |
| `networks.get` | `dnsfilter.api.networks.get` | `read` | Get a network |
| `networks.list` | `dnsfilter.api.networks.list` | `read` | List networks |
| `networks.listAll` | `dnsfilter.api.networks.listAll` | `read` | List all networks |
| `networks.lookup` | `dnsfilter.api.networks.lookup` | `read` | Lookup for networks |
| `networks.msp` | `dnsfilter.api.networks.msp` | `read` | List MSP networks |
| `networks.mspAll` | `dnsfilter.api.networks.mspAll` | `read` | List all MSP networks |
| `networks.revokeSecretKey` | `dnsfilter.api.networks.revokeSecretKey` | `destructive` | Revoke secret key for networks |
| `networks.rotateSecretKey` | `dnsfilter.api.networks.rotateSecretKey` | `write` | Rotate secret key for networks |
| `networks.update` | `dnsfilter.api.networks.update` | `write` | Update a network |
| `networkSubnets.create` | `dnsfilter.api.networkSubnets.create` | `write` | Create a network subnet |
| `networkSubnets.delete` | `dnsfilter.api.networkSubnets.delete` | `destructive` | Delete a network subnet |
| `networkSubnets.get` | `dnsfilter.api.networkSubnets.get` | `read` | Get a network subnet |
| `networkSubnets.list` | `dnsfilter.api.networkSubnets.list` | `read` | List network subnets |
| `networkSubnets.listAll` | `dnsfilter.api.networkSubnets.listAll` | `read` | List all network subnets |
| `networkSubnets.update` | `dnsfilter.api.networkSubnets.update` | `write` | Update a network subnet |
| `organizations.bulkUpdate` | `dnsfilter.api.organizations.bulkUpdate` | `write` | Bulk update for organizations |
| `organizations.cancel` | `dnsfilter.api.organizations.cancel` | `destructive` | Cancel for organizations |
| `organizations.create` | `dnsfilter.api.organizations.create` | `write` | Create an organization |
| `organizations.delete` | `dnsfilter.api.organizations.delete` | `destructive` | Delete an organization |
| `organizations.get` | `dnsfilter.api.organizations.get` | `read` | Get an organization |
| `organizations.list` | `dnsfilter.api.organizations.list` | `read` | List organizations |
| `organizations.listAll` | `dnsfilter.api.organizations.listAll` | `read` | List all organizations |
| `organizations.promoteToMsp` | `dnsfilter.api.organizations.promoteToMsp` | `write` | Promote to MSP for organizations |
| `organizations.settings` | `dnsfilter.api.organizations.settings` | `read` | Settings for organizations |
| `organizations.update` | `dnsfilter.api.organizations.update` | `write` | Update an organization |
| `organizationUsers.create` | `dnsfilter.api.organizationUsers.create` | `write` | Create an organization user |
| `organizationUsers.delete` | `dnsfilter.api.organizationUsers.delete` | `destructive` | Delete an organization user |
| `organizationUsers.get` | `dnsfilter.api.organizationUsers.get` | `read` | Get an organization user |
| `organizationUsers.list` | `dnsfilter.api.organizationUsers.list` | `read` | List organization users |
| `organizationUsers.resendInvite` | `dnsfilter.api.organizationUsers.resendInvite` | `write` | Resend invite for organization users |
| `organizationUsers.update` | `dnsfilter.api.organizationUsers.update` | `write` | Update an organization user |
| `policies.addAllowedApplication` | `dnsfilter.api.policies.addAllowedApplication` | `write` | Add allowed application for policies |
| `policies.addBlacklistCategory` | `dnsfilter.api.policies.addBlacklistCategory` | `write` | Add blacklist category for policies |
| `policies.addBlacklistDomain` | `dnsfilter.api.policies.addBlacklistDomain` | `write` | Add blacklist domain for policies |
| `policies.addBlockedApplication` | `dnsfilter.api.policies.addBlockedApplication` | `write` | Add blocked application for policies |
| `policies.addWhitelistDomain` | `dnsfilter.api.policies.addWhitelistDomain` | `write` | Add whitelist domain for policies |
| `policies.application` | `dnsfilter.api.policies.application` | `read` | Application for policies |
| `policies.applicationUpdate` | `dnsfilter.api.policies.applicationUpdate` | `write` | Application update for policies |
| `policies.create` | `dnsfilter.api.policies.create` | `write` | Create a policy |
| `policies.delete` | `dnsfilter.api.policies.delete` | `destructive` | Delete a policy |
| `policies.get` | `dnsfilter.api.policies.get` | `read` | Get a policy |
| `policies.getPermissiveMode` | `dnsfilter.api.policies.getPermissiveMode` | `read` | Get permissive mode for policies |
| `policies.list` | `dnsfilter.api.policies.list` | `read` | List policies |
| `policies.listAll` | `dnsfilter.api.policies.listAll` | `read` | List all policies |
| `policies.removeAllowedApplication` | `dnsfilter.api.policies.removeAllowedApplication` | `write` | Remove allowed application for policies |
| `policies.removeBlacklistCategory` | `dnsfilter.api.policies.removeBlacklistCategory` | `write` | Remove blacklist category for policies |
| `policies.removeBlacklistDomain` | `dnsfilter.api.policies.removeBlacklistDomain` | `write` | Remove blacklist domain for policies |
| `policies.removeBlockedApplication` | `dnsfilter.api.policies.removeBlockedApplication` | `write` | Remove blocked application for policies |
| `policies.removeWhitelistDomain` | `dnsfilter.api.policies.removeWhitelistDomain` | `write` | Remove whitelist domain for policies |
| `policies.update` | `dnsfilter.api.policies.update` | `write` | Update a policy |
| `policies.updatePermissiveMode` | `dnsfilter.api.policies.updatePermissiveMode` | `write` | Update permissive mode for policies |
| `policiesBulkActions.addAllowlistDomains` | `dnsfilter.api.policiesBulkActions.addAllowlistDomains` | `write` | Add allowlist domains for policies bulk actions |
| `policiesBulkActions.addBlocklistDomains` | `dnsfilter.api.policiesBulkActions.addBlocklistDomains` | `write` | Add blocklist domains for policies bulk actions |
| `policiesBulkActions.removeAllowlistDomains` | `dnsfilter.api.policiesBulkActions.removeAllowlistDomains` | `write` | Remove allowlist domains for policies bulk actions |
| `policiesBulkActions.removeBlocklistDomains` | `dnsfilter.api.policiesBulkActions.removeBlocklistDomains` | `write` | Remove blocklist domains for policies bulk actions |
| `policyIps.get` | `dnsfilter.api.policyIps.get` | `read` | Get a policy IPS |
| `policyIps.list` | `dnsfilter.api.policyIps.list` | `read` | List policy IPS |
| `psaIntegrations.redirectLink` | `dnsfilter.api.psaIntegrations.redirectLink` | `read` | Redirect link for PSA integrations |
| `scheduledPolicies.create` | `dnsfilter.api.scheduledPolicies.create` | `write` | Create a scheduled policy |
| `scheduledPolicies.delete` | `dnsfilter.api.scheduledPolicies.delete` | `destructive` | Delete a scheduled policy |
| `scheduledPolicies.get` | `dnsfilter.api.scheduledPolicies.get` | `read` | Get a scheduled policy |
| `scheduledPolicies.list` | `dnsfilter.api.scheduledPolicies.list` | `read` | List scheduled policies |
| `scheduledPolicies.listAll` | `dnsfilter.api.scheduledPolicies.listAll` | `read` | List all scheduled policies |
| `scheduledPolicies.update` | `dnsfilter.api.scheduledPolicies.update` | `write` | Update a scheduled policy |
| `scheduledReportPreviews.create` | `dnsfilter.api.scheduledReportPreviews.create` | `write` | Create a scheduled report preview |
| `scheduledReportPreviews.get` | `dnsfilter.api.scheduledReportPreviews.get` | `read` | Get a scheduled report preview |
| `scheduledReports.create` | `dnsfilter.api.scheduledReports.create` | `write` | Create a scheduled report |
| `scheduledReports.delete` | `dnsfilter.api.scheduledReports.delete` | `destructive` | Delete a scheduled report |
| `scheduledReports.get` | `dnsfilter.api.scheduledReports.get` | `read` | Get a scheduled report |
| `scheduledReports.list` | `dnsfilter.api.scheduledReports.list` | `read` | List scheduled reports |
| `scheduledReports.update` | `dnsfilter.api.scheduledReports.update` | `write` | Update a scheduled report |
| `scheduledReportsV2.bulkUpdate` | `dnsfilter.api.scheduledReportsV2.bulkUpdate` | `write` | Bulk update for scheduled reports V2 |
| `scheduledReportsV2.create` | `dnsfilter.api.scheduledReportsV2.create` | `write` | Create a scheduled reports V2 |
| `scheduledReportsV2.delete` | `dnsfilter.api.scheduledReportsV2.delete` | `destructive` | Delete a scheduled reports V2 |
| `scheduledReportsV2.get` | `dnsfilter.api.scheduledReportsV2.get` | `read` | Get a scheduled reports V2 |
| `scheduledReportsV2.list` | `dnsfilter.api.scheduledReportsV2.list` | `read` | List scheduled reports V2 |
| `scheduledReportsV2.update` | `dnsfilter.api.scheduledReportsV2.update` | `write` | Update a scheduled reports V2 |
| `trafficReports.qps` | `dnsfilter.api.trafficReports.qps` | `read` | QPS for traffic reports |
| `trafficReports.qpsActiveAgents` | `dnsfilter.api.trafficReports.qpsActiveAgents` | `read` | QPS active agents for traffic reports |
| `trafficReports.qpsActiveOrganizations` | `dnsfilter.api.trafficReports.qpsActiveOrganizations` | `read` | QPS active organizations for traffic reports |
| `trafficReports.queryLogs` | `dnsfilter.api.trafficReports.queryLogs` | `read` | Query logs for traffic reports |
| `trafficReports.topAgents` | `dnsfilter.api.trafficReports.topAgents` | `read` | Top agents for traffic reports |
| `trafficReports.topApplicationCategories` | `dnsfilter.api.trafficReports.topApplicationCategories` | `read` | Top application categories for traffic reports |
| `trafficReports.topCategories` | `dnsfilter.api.trafficReports.topCategories` | `read` | Top categories for traffic reports |
| `trafficReports.topCollections` | `dnsfilter.api.trafficReports.topCollections` | `read` | Top collections for traffic reports |
| `trafficReports.topDomains` | `dnsfilter.api.trafficReports.topDomains` | `read` | Top domains for traffic reports |
| `trafficReports.topNetworks` | `dnsfilter.api.trafficReports.topNetworks` | `read` | Top networks for traffic reports |
| `trafficReports.topOrganizationsRequests` | `dnsfilter.api.trafficReports.topOrganizationsRequests` | `read` | Top organizations requests for traffic reports |
| `trafficReports.topUsers` | `dnsfilter.api.trafficReports.topUsers` | `read` | Top users for traffic reports |
| `trafficReports.totalApplicationsAgentsStats` | `dnsfilter.api.trafficReports.totalApplicationsAgentsStats` | `read` | Total applications agents stats for traffic reports |
| `trafficReports.totalApplicationsCollectionsStats` | `dnsfilter.api.trafficReports.totalApplicationsCollectionsStats` | `read` | Total applications collections stats for traffic reports |
| `trafficReports.totalApplicationsNetworksStats` | `dnsfilter.api.trafficReports.totalApplicationsNetworksStats` | `read` | Total applications networks stats for traffic reports |
| `trafficReports.totalApplicationsStats` | `dnsfilter.api.trafficReports.totalApplicationsStats` | `read` | Total applications stats for traffic reports |
| `trafficReports.totalApplicationsUsersStats` | `dnsfilter.api.trafficReports.totalApplicationsUsersStats` | `read` | Total applications users stats for traffic reports |
| `trafficReports.totalCategories` | `dnsfilter.api.trafficReports.totalCategories` | `read` | Total categories for traffic reports |
| `trafficReports.totalCategoriesOrganizations` | `dnsfilter.api.trafficReports.totalCategoriesOrganizations` | `read` | Total categories organizations for traffic reports |
| `trafficReports.totalCategoryStats` | `dnsfilter.api.trafficReports.totalCategoryStats` | `read` | Total category stats for traffic reports |
| `trafficReports.totalClientStats` | `dnsfilter.api.trafficReports.totalClientStats` | `read` | Total client stats for traffic reports |
| `trafficReports.totalDeployments` | `dnsfilter.api.trafficReports.totalDeployments` | `read` | Total deployments for traffic reports |
| `trafficReports.totalDomains` | `dnsfilter.api.trafficReports.totalDomains` | `read` | Total domains for traffic reports |
| `trafficReports.totalDomainsOrganizations` | `dnsfilter.api.trafficReports.totalDomainsOrganizations` | `read` | Total domains organizations for traffic reports |
| `trafficReports.totalDomainStats` | `dnsfilter.api.trafficReports.totalDomainStats` | `read` | Total domain stats for traffic reports |
| `trafficReports.totalDomainsUsers` | `dnsfilter.api.trafficReports.totalDomainsUsers` | `read` | Total domains users for traffic reports |
| `trafficReports.totalOrganizationsRequests` | `dnsfilter.api.trafficReports.totalOrganizationsRequests` | `read` | Total organizations requests for traffic reports |
| `trafficReports.totalOrganizationsStats` | `dnsfilter.api.trafficReports.totalOrganizationsStats` | `read` | Total organizations stats for traffic reports |
| `trafficReports.totalRequests` | `dnsfilter.api.trafficReports.totalRequests` | `read` | Total requests for traffic reports |
| `trafficReports.totalRequestsAgents` | `dnsfilter.api.trafficReports.totalRequestsAgents` | `read` | Total requests agents for traffic reports |
| `trafficReports.totalRequestsCollections` | `dnsfilter.api.trafficReports.totalRequestsCollections` | `read` | Total requests collections for traffic reports |
| `trafficReports.totalRequestsGeo` | `dnsfilter.api.trafficReports.totalRequestsGeo` | `read` | Total requests geo for traffic reports |
| `trafficReports.totalRequestsOrganizations` | `dnsfilter.api.trafficReports.totalRequestsOrganizations` | `read` | Total requests organizations for traffic reports |
| `trafficReports.totalRequestsUsers` | `dnsfilter.api.trafficReports.totalRequestsUsers` | `read` | Total requests users for traffic reports |
| `trafficReports.totalRoamingClients` | `dnsfilter.api.trafficReports.totalRoamingClients` | `read` | Total roaming clients for traffic reports |
| `trafficReports.totalThreats` | `dnsfilter.api.trafficReports.totalThreats` | `read` | Total threats for traffic reports |
| `trafficReports.totalThreatsOrganizations` | `dnsfilter.api.trafficReports.totalThreatsOrganizations` | `read` | Total threats organizations for traffic reports |
| `trafficReports.totalThreatsUsers` | `dnsfilter.api.trafficReports.totalThreatsUsers` | `read` | Total threats users for traffic reports |
| `trials.create` | `dnsfilter.api.trials.create` | `write` | Create a trial |
| `unblockRequests.counts` | `dnsfilter.api.unblockRequests.counts` | `read` | Counts for unblock requests |
| `unblockRequests.decision` | `dnsfilter.api.unblockRequests.decision` | `write` | Decision for unblock requests |
| `unblockRequests.get` | `dnsfilter.api.unblockRequests.get` | `read` | Get an unblock request |
| `unblockRequests.list` | `dnsfilter.api.unblockRequests.list` | `read` | List unblock requests |
| `unblockRequests.pendingCount` | `dnsfilter.api.unblockRequests.pendingCount` | `read` | Pending count for unblock requests |
| `userAgentBulkDeletes.counts` | `dnsfilter.api.userAgentBulkDeletes.counts` | `read` | Counts for user agent bulk deletes |
| `userAgentBulkDeletes.create` | `dnsfilter.api.userAgentBulkDeletes.create` | `write` | Bulk delete user agent |
| `userAgentBulkDeletes.get` | `dnsfilter.api.userAgentBulkDeletes.get` | `read` | Get an user agent bulk delete |
| `userAgentBulkUpdates.counts` | `dnsfilter.api.userAgentBulkUpdates.counts` | `read` | Counts for user agent bulk updates |
| `userAgentBulkUpdates.create` | `dnsfilter.api.userAgentBulkUpdates.create` | `write` | Bulk update user agent |
| `userAgentBulkUpdates.get` | `dnsfilter.api.userAgentBulkUpdates.get` | `read` | Get an user agent bulk update |
| `userAgentBulkUpdates.hasMixed` | `dnsfilter.api.userAgentBulkUpdates.hasMixed` | `write` | Has mixed for user agent bulk updates |
| `userAgentCleanups.create` | `dnsfilter.api.userAgentCleanups.create` | `write` | Clean up user agent |
| `userAgentCleanups.get` | `dnsfilter.api.userAgentCleanups.get` | `read` | Get an user agent cleanup |
| `userAgentCleanups.update` | `dnsfilter.api.userAgentCleanups.update` | `write` | Update an user agent cleanup |
| `userAgentReleases.list` | `dnsfilter.api.userAgentReleases.list` | `read` | List user agent releases |
| `userAgentReleases.relay` | `dnsfilter.api.userAgentReleases.relay` | `read` | Relay for user agent releases |
| `userAgents.counts` | `dnsfilter.api.userAgents.counts` | `read` | Counts for user agents |
| `userAgents.csv` | `dnsfilter.api.userAgents.csv` | `read` | CSV for user agents |
| `userAgents.delete` | `dnsfilter.api.userAgents.delete` | `destructive` | Delete an user agent |
| `userAgents.dequeueUninstall` | `dnsfilter.api.userAgents.dequeueUninstall` | `write` | Dequeue uninstall for user agents |
| `userAgents.get` | `dnsfilter.api.userAgents.get` | `read` | Get an user agent |
| `userAgents.list` | `dnsfilter.api.userAgents.list` | `read` | List user agents |
| `userAgents.listAll` | `dnsfilter.api.userAgents.listAll` | `read` | List all user agents |
| `userAgents.tags` | `dnsfilter.api.userAgents.tags` | `read` | Tags for user agents |
| `userAgents.uninstallPin` | `dnsfilter.api.userAgents.uninstallPin` | `read` | Uninstall pin for user agents |
| `userAgents.update` | `dnsfilter.api.userAgents.update` | `write` | Update an user agent |
| `userAgentsV2.updateSettings` | `dnsfilter.api.userAgentsV2.updateSettings` | `write` | Update settings for user agents V2 |
| `users.changePassword` | `dnsfilter.api.users.changePassword` | `write` | Change password for users |
| `users.get` | `dnsfilter.api.users.get` | `read` | Get an user |
| `users.list` | `dnsfilter.api.users.list` | `read` | List users |
| `users.listAll` | `dnsfilter.api.users.listAll` | `read` | List all users |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/dnsfilter

## License

Apache-2.0
