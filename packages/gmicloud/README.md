# @corsair-dev/gmicloud

GMI Cloud plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gmicloud
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.getCurrent` | `gmicloud.api.apiKeys.getCurrent` | `read` | Verify the configured API key and return its details, including the organization it belongs to |
| `baremetals.action` | `gmicloud.api.baremetals.action` | `write` | Start, stop, power-cycle, or reboot a bare-metal server |
| `baremetals.create` | `gmicloud.api.baremetals.create` | `write` | Provision bare-metal GPU servers (billed while they exist) |
| `baremetals.delete` | `gmicloud.api.baremetals.delete` | `destructive` | Delete a bare-metal server and release its resources |
| `baremetals.get` | `gmicloud.api.baremetals.get` | `read` | Get a bare-metal server by ID |
| `baremetals.list` | `gmicloud.api.baremetals.list` | `read` | List bare-metal GPU servers, optionally filtered by data center |
| `baremetals.listProducts` | `gmicloud.api.baremetals.listProducts` | `read` | List bare-metal server products (GPU types and specs) in a data center |
| `baremetals.update` | `gmicloud.api.baremetals.update` | `write` | Rename a bare-metal server |
| `chat.createCompletion` | `gmicloud.api.chat.createCompletion` | `write` | Generate a chat completion with an LLM through the OpenAI-compatible API (billed per token) |
| `containers.create` | `gmicloud.api.containers.create` | `write` | Launch GPU container workloads from a template (billed while they run) |
| `containers.createShell` | `gmicloud.api.containers.createShell` | `write` | Generate a web shell URL path for a running container |
| `containers.delete` | `gmicloud.api.containers.delete` | `destructive` | Delete a container workload; its local data is lost |
| `containers.get` | `gmicloud.api.containers.get` | `read` | Get a container workload by ID, including status and IP addresses |
| `containers.getLogs` | `gmicloud.api.containers.getLogs` | `read` | Download the logs of a container workload as text |
| `containers.list` | `gmicloud.api.containers.list` | `read` | List container workloads in the organization |
| `containers.listProducts` | `gmicloud.api.containers.listProducts` | `read` | List container products (GPU types and specs) in a data center |
| `containers.restart` | `gmicloud.api.containers.restart` | `write` | Restart a container workload |
| `containers.update` | `gmicloud.api.containers.update` | `write` | Update a container's name, image, environment, ports, or storage |
| `elasticIps.allocate` | `gmicloud.api.elasticIps.allocate` | `write` | Allocate a static public IPv4 address for the organization |
| `elasticIps.associate` | `gmicloud.api.elasticIps.associate` | `write` | Attach an elastic IP to a bare-metal server or container |
| `elasticIps.disassociate` | `gmicloud.api.elasticIps.disassociate` | `write` | Detach an elastic IP from its instance |
| `elasticIps.get` | `gmicloud.api.elasticIps.get` | `read` | Get an elastic IP by ID |
| `elasticIps.list` | `gmicloud.api.elasticIps.list` | `read` | List elastic IPs allocated to the organization |
| `elasticIps.listProducts` | `gmicloud.api.elasticIps.listProducts` | `read` | List elastic IP products in a data center |
| `elasticIps.release` | `gmicloud.api.elasticIps.release` | `destructive` | Release an elastic IP; the address cannot be reclaimed |
| `firewalls.associate` | `gmicloud.api.firewalls.associate` | `write` | Apply a firewall to bare-metal servers or containers |
| `firewalls.create` | `gmicloud.api.firewalls.create` | `write` | Create a firewall with inbound rules in a data center |
| `firewalls.delete` | `gmicloud.api.firewalls.delete` | `destructive` | Delete a firewall |
| `firewalls.disassociate` | `gmicloud.api.firewalls.disassociate` | `write` | Remove a firewall from bare-metal servers or containers |
| `firewalls.get` | `gmicloud.api.firewalls.get` | `read` | Get a firewall and its rules by ID |
| `firewalls.list` | `gmicloud.api.firewalls.list` | `read` | List firewalls, optionally filtered by data center |
| `firewalls.update` | `gmicloud.api.firewalls.update` | `write` | Replace a firewall's name, description, and inbound rules |
| `idcs.list` | `gmicloud.api.idcs.list` | `read` | List the data centers (IDCs) available for GPU compute resources |
| `images.get` | `gmicloud.api.images.get` | `read` | Get an OS image by ID |
| `images.list` | `gmicloud.api.images.list` | `read` | List OS images for bare-metal servers, optionally filtered by data center and product |
| `mediaModels.get` | `gmicloud.api.mediaModels.get` | `read` | Get a media model's description and the payload parameters its requests accept |
| `mediaModels.list` | `gmicloud.api.mediaModels.list` | `read` | List the video, image, and audio model IDs served by the GMI request queue |
| `mediaRequests.create` | `gmicloud.api.mediaRequests.create` | `write` | Queue a video, image, or audio generation request; poll mediaRequests.get for the outcome (billed) |
| `mediaRequests.get` | `gmicloud.api.mediaRequests.get` | `read` | Get the status of a queued media request and, once it succeeds, its output file URLs |
| `models.list` | `gmicloud.api.models.list` | `read` | List the LLMs available on GMI Cloud serverless inference |
| `router.autoroute` | `gmicloud.api.router.autoroute` | `write` | Let the GMI Router pick the best model for a conversation by cost, balance, or quality and return its completion |
| `sandboxes.connect` | `gmicloud.api.sandboxes.connect` | `write` | Connect to a running sandbox and return its data-plane domain and access token; a timeout extends its lifetime |
| `sandboxes.create` | `gmicloud.api.sandboxes.create` | `write` | Create a sandbox from a template; returns the data-plane host and access token used by sandboxExec and sandboxFiles |
| `sandboxes.delete` | `gmicloud.api.sandboxes.delete` | `destructive` | Kill a sandbox; it moves to deleting and then deleted once resources are released |
| `sandboxes.get` | `gmicloud.api.sandboxes.get` | `read` | Get sandbox details, including state, resources, and failure reason |
| `sandboxes.list` | `gmicloud.api.sandboxes.list` | `read` | List active sandboxes (provisioning, running, updating, checkpointing, failed) with pagination |
| `sandboxes.setTimeout` | `gmicloud.api.sandboxes.setTimeout` | `write` | Reset a running sandbox's time-to-live relative to now (300 seconds when omitted) |
| `sandboxes.updateMetadata` | `gmicloud.api.sandboxes.updateMetadata` | `write` | Replace a sandbox's metadata as a whole (an empty object clears it) |
| `sandboxExec.cancel` | `gmicloud.api.sandboxExec.cancel` | `write` | Cancel a running sandbox command |
| `sandboxExec.get` | `gmicloud.api.sandboxExec.get` | `read` | Get the status, exit code, and output of a sandbox command |
| `sandboxExec.run` | `gmicloud.api.sandboxExec.run` | `write` | Run a shell command inside a sandbox; with wait it returns the result, otherwise poll sandboxExec.get |
| `sandboxFiles.download` | `gmicloud.api.sandboxFiles.download` | `read` | Download a file from a sandbox by absolute path; returns base64 content |
| `sandboxFiles.upload` | `gmicloud.api.sandboxFiles.upload` | `write` | Write a file to an absolute path inside a sandbox, overwriting any existing file |
| `sandboxProducts.list` | `gmicloud.api.sandboxProducts.list` | `read` | List the sandbox product catalog (CPU, memory, disk) in a data center |
| `sandboxTemplates.create` | `gmicloud.api.sandboxTemplates.create` | `write` | Create a sandbox template from an image or another template and start its first build |
| `sandboxTemplates.delete` | `gmicloud.api.sandboxTemplates.delete` | `destructive` | Delete a sandbox template; existing sandboxes keep running |
| `sandboxTemplates.get` | `gmicloud.api.sandboxTemplates.get` | `read` | Get a sandbox template with its current and latest build |
| `sandboxTemplates.getBuild` | `gmicloud.api.sandboxTemplates.getBuild` | `read` | Get a sandbox template build status and artifact availability |
| `sandboxTemplates.getBuildLogs` | `gmicloud.api.sandboxTemplates.getBuildLogs` | `read` | Get build logs for a sandbox template build, paged by offset |
| `sandboxTemplates.list` | `gmicloud.api.sandboxTemplates.list` | `read` | List sandbox templates with pagination |
| `sandboxTemplates.listBuilds` | `gmicloud.api.sandboxTemplates.listBuilds` | `read` | List the builds of a sandbox template, newest first, with pagination |
| `sandboxTemplates.update` | `gmicloud.api.sandboxTemplates.update` | `write` | Update a sandbox template's name, description, or labels |
| `templates.create` | `gmicloud.api.templates.create` | `write` | Create a custom container template |
| `templates.delete` | `gmicloud.api.templates.delete` | `destructive` | Delete a custom container template |
| `templates.get` | `gmicloud.api.templates.get` | `read` | Get a container template by ID |
| `templates.list` | `gmicloud.api.templates.list` | `read` | List container templates (official and custom) used to launch containers |
| `templates.update` | `gmicloud.api.templates.update` | `write` | Update a custom container template |
| `uploads.createUrl` | `gmicloud.api.uploads.createUrl` | `write` | Get a pre-signed upload URL and the stable public URL to reference an image, video, or audio file in media requests |
| `vpcs.allocate` | `gmicloud.api.vpcs.allocate` | `write` | Allocate the default VPC for the organization in a data center |
| `vpcs.get` | `gmicloud.api.vpcs.get` | `read` | Get a VPC and its subnets by ID |
| `vpcs.list` | `gmicloud.api.vpcs.list` | `read` | List VPCs, optionally filtered by data center |
| `vpcs.release` | `gmicloud.api.vpcs.release` | `destructive` | Release the default VPC |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gmicloud

## License

Apache-2.0
