# @corsair-dev/phantombuster

PhantomBuster plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/phantombuster
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agents.delete` | `phantombuster.api.agents.delete` | `destructive` | Delete a PhantomBuster agent by ID |
| `agents.fetch` | `phantombuster.api.agents.fetch` | `read` | Get details for a specific PhantomBuster agent by ID |
| `agents.fetchAll` | `phantombuster.api.agents.fetchAll` | `read` | Get all PhantomBuster agents (Phantoms) in the organization |
| `agents.fetchDeleted` | `phantombuster.api.agents.fetchDeleted` | `read` | Get all deleted agents in the organization |
| `agents.fetchOutput` | `phantombuster.api.agents.fetchOutput` | `read` | Get the output of the most recent container for an agent, including status, progress, console log, and result object |
| `agents.launch` | `phantombuster.api.agents.launch` | `write` | Add a PhantomBuster agent to the launch queue |
| `agents.launchSoon` | `phantombuster.api.agents.launchSoon` | `write` | Schedule a PhantomBuster agent to launch before a specific time |
| `agents.save` | `phantombuster.api.agents.save` | `write` | Create a new agent or update an existing one |
| `agents.stop` | `phantombuster.api.agents.stop` | `write` | Stop a currently running PhantomBuster agent |
| `agents.unscheduleAll` | `phantombuster.api.agents.unscheduleAll` | `write` | Disable automatic launch for all agents in the organization |
| `branches.create` | `phantombuster.api.branches.create` | `write` | Create a new branch |
| `branches.delete` | `phantombuster.api.branches.delete` | `destructive` | Delete a branch by ID |
| `branches.fetchAll` | `phantombuster.api.branches.fetchAll` | `read` | Fetch all branches in the organization |
| `branches.fetchDiff` | `phantombuster.api.branches.fetchDiff` | `read` | Get the staging/release diff for script branches |
| `branches.release` | `phantombuster.api.branches.release` | `write` | Release a script branch |
| `containers.fetch` | `phantombuster.api.containers.fetch` | `read` | Get details for a specific run container by ID |
| `containers.fetchAll` | `phantombuster.api.containers.fetchAll` | `read` | Get all run containers for a specific agent |
| `containers.fetchOutput` | `phantombuster.api.containers.fetchOutput` | `read` | Get the console output for a specific container |
| `containers.fetchResultObject` | `phantombuster.api.containers.fetchResultObject` | `read` | Get the result object (JSON data) from a specific container |
| `identities.generateToken` | `phantombuster.api.identities.generateToken` | `write` | Generate an identity token |
| `identities.saveEvent` | `phantombuster.api.identities.saveEvent` | `write` | Save an identity event |
| `leads.deleteMany` | `phantombuster.api.leads.deleteMany` | `destructive` | Delete multiple leads by their IDs |
| `leads.fetchByList` | `phantombuster.api.leads.fetchByList` | `read` | Fetch leads belonging to a specific lead list |
| `leads.save` | `phantombuster.api.leads.save` | `write` | Save a single lead to PhantomBuster org storage |
| `leads.saveMany` | `phantombuster.api.leads.saveMany` | `write` | Bulk-save multiple leads to PhantomBuster org storage |
| `lists.delete` | `phantombuster.api.lists.delete` | `destructive` | Delete a lead list by ID |
| `lists.fetch` | `phantombuster.api.lists.fetch` | `read` | Get details for a specific lead list by ID |
| `lists.fetchAll` | `phantombuster.api.lists.fetchAll` | `read` | Get all lead lists in the organization |
| `lists.save` | `phantombuster.api.lists.save` | `write` | Create a new lead list or update an existing one |
| `misc.fetchIpLocation` | `phantombuster.api.misc.fetchIpLocation` | `read` | Retrieve the country of an IP address |
| `misc.requestAiCompletion` | `phantombuster.api.misc.requestAiCompletion` | `write` | Request a text completion from the AI module |
| `misc.solveHCaptcha` | `phantombuster.api.misc.solveHCaptcha` | `write` | Solve an hCaptcha challenge |
| `misc.solveRecaptcha` | `phantombuster.api.misc.solveRecaptcha` | `write` | Solve a reCAPTCHA challenge (v2 or v3) |
| `orgs.exportAgentUsage` | `phantombuster.api.orgs.exportAgentUsage` | `read` | Export agent usage CSV for the organization |
| `orgs.exportContainerUsage` | `phantombuster.api.orgs.exportContainerUsage` | `read` | Export container usage CSV for the organization |
| `orgs.fetch` | `phantombuster.api.orgs.fetch` | `read` | Get the current organization info |
| `orgs.fetchAgentGroups` | `phantombuster.api.orgs.fetchAgentGroups` | `read` | Get agent groups and order for the organization |
| `orgs.fetchResources` | `phantombuster.api.orgs.fetchResources` | `read` | Get the organization resource usage (slots, limits) |
| `orgs.fetchRunningContainers` | `phantombuster.api.orgs.fetchRunningContainers` | `read` | Get the organization's running containers |
| `orgs.saveAgentGroups` | `phantombuster.api.orgs.saveAgentGroups` | `write` | Update agent groups and order for the organization |
| `scripts.delete` | `phantombuster.api.scripts.delete` | `destructive` | Delete a script by ID |
| `scripts.fetch` | `phantombuster.api.scripts.fetch` | `read` | Fetch a script by ID |
| `scripts.fetchAll` | `phantombuster.api.scripts.fetchAll` | `read` | Fetch all scripts for the current user |
| `scripts.fetchCode` | `phantombuster.api.scripts.fetchCode` | `read` | Get the code of a script |
| `scripts.save` | `phantombuster.api.scripts.save` | `write` | Create a new script or update an existing one |
| `scripts.updateAccessList` | `phantombuster.api.scripts.updateAccessList` | `write` | Update a script's access list |
| `scripts.updateVisibility` | `phantombuster.api.scripts.updateVisibility` | `write` | Update the visibility of a script |
| `storage.deleteLeadObjects` | `phantombuster.api.storage.deleteLeadObjects` | `destructive` | Delete lead objects from organization storage |
| `storage.saveCompanyObject` | `phantombuster.api.storage.saveCompanyObject` | `write` | Save a company object to organization storage |
| `storage.saveLeadObject` | `phantombuster.api.storage.saveLeadObject` | `write` | Save a lead object to organization storage |
| `storage.saveManyCompanyObjects` | `phantombuster.api.storage.saveManyCompanyObjects` | `write` | Bulk-save company objects to organization storage |
| `storage.saveManyLeadObjects` | `phantombuster.api.storage.saveManyLeadObjects` | `write` | Bulk-save lead objects to organization storage |
| `storage.searchCompanyObjects` | `phantombuster.api.storage.searchCompanyObjects` | `read` | Search company objects in organization storage |
| `storage.searchLeadObjects` | `phantombuster.api.storage.searchLeadObjects` | `read` | Search lead objects in organization storage |
| `users.fetchMe` | `phantombuster.api.users.fetchMe` | `read` | Get info about the currently authenticated PhantomBuster user |
| `users.updateMe` | `phantombuster.api.users.updateMe` | `write` | Update the current user's info |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/phantombuster

## License

Apache-2.0
