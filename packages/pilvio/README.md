# @corsair-dev/pilvio

Pilvio is an Estonian cloud IaaS for compute and storage. This plugin manages the user profile, API tokens and SSH keys, creates and controls virtual machines, provisions block storage disks and S3 buckets, and manages private networks and firewalls across Pilvio locations.

## Install

```bash
pnpm add @corsair-dev/pilvio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.getUser` | `pilvio.api.account.getUser` | `read` | Read the authenticated user and profile |
| `account.sshKeys.create` | `pilvio.api.account.sshKeys.create` | `write` | Add an SSH public key |
| `account.sshKeys.delete` | `pilvio.api.account.sshKeys.delete` | `destructive` | Delete an SSH key |
| `account.sshKeys.list` | `pilvio.api.account.sshKeys.list` | `read` | List the SSH public keys of the user |
| `account.sshKeys.rename` | `pilvio.api.account.sshKeys.rename` | `write` | Rename an SSH key |
| `account.tokens.create` | `pilvio.api.account.tokens.create` | `write` | Create an API token, optionally restricted to one billing account |
| `account.tokens.delete` | `pilvio.api.account.tokens.delete` | `destructive` | Delete an API token |
| `account.tokens.list` | `pilvio.api.account.tokens.list` | `read` | List the API tokens of the user |
| `account.tokens.update` | `pilvio.api.account.tokens.update` | `write` | Update a token description or restriction |
| `account.updateProfile` | `pilvio.api.account.updateProfile` | `write` | Update the user profile fields |
| `config.getPricingPolicy` | `pilvio.api.config.getPricingPolicy` | `read` | Read the pricing policy lines |
| `config.listAppCatalogImages` | `pilvio.api.config.listAppCatalogImages` | `read` | List the app catalog images |
| `config.listBootImages` | `pilvio.api.config.listBootImages` | `read` | List bootable media images |
| `config.listLocations` | `pilvio.api.config.listLocations` | `read` | List the Pilvio data centre locations |
| `config.listPlainOsImages` | `pilvio.api.config.listPlainOsImages` | `read` | List the plain OS images |
| `config.listResourcePools` | `pilvio.api.config.listResourcePools` | `read` | List VM server classes (resource pools) |
| `config.listVmImages` | `pilvio.api.config.listVmImages` | `read` | List the VM image catalog |
| `network.firewalls.create` | `pilvio.api.network.firewalls.create` | `write` | Create a firewall with rules |
| `network.firewalls.delete` | `pilvio.api.network.firewalls.delete` | `destructive` | Delete a firewall |
| `network.firewalls.list` | `pilvio.api.network.firewalls.list` | `read` | List the firewalls and their rules |
| `network.networks.create` | `pilvio.api.network.networks.create` | `write` | Create a private network |
| `network.networks.delete` | `pilvio.api.network.networks.delete` | `destructive` | Delete an empty, non-default network |
| `network.networks.get` | `pilvio.api.network.networks.get` | `read` | Read one network by UUID |
| `network.networks.list` | `pilvio.api.network.networks.list` | `read` | List the private networks |
| `storage.buckets.create` | `pilvio.api.storage.buckets.create` | `write` | Create an S3 bucket with a globally unique name |
| `storage.buckets.delete` | `pilvio.api.storage.buckets.delete` | `destructive` | Delete a bucket |
| `storage.buckets.get` | `pilvio.api.storage.buckets.get` | `read` | Read one bucket by name |
| `storage.buckets.list` | `pilvio.api.storage.buckets.list` | `read` | List the object storage buckets |
| `storage.buckets.update` | `pilvio.api.storage.buckets.update` | `write` | Move a bucket to another billing account |
| `storage.disks.create` | `pilvio.api.storage.disks.create` | `write` | Create a disk from empty, an OS image, a disk or a snapshot |
| `storage.disks.delete` | `pilvio.api.storage.disks.delete` | `destructive` | Delete a disk |
| `storage.disks.get` | `pilvio.api.storage.disks.get` | `read` | Read one disk by UUID |
| `storage.disks.list` | `pilvio.api.storage.disks.list` | `read` | List the block storage disks |
| `storage.disks.update` | `pilvio.api.storage.disks.update` | `write` | Update disk metadata |
| `vm.create` | `pilvio.api.vm.create` | `write` | Create a virtual machine from an image or source |
| `vm.delete` | `pilvio.api.vm.delete` | `destructive` | Delete a virtual machine |
| `vm.get` | `pilvio.api.vm.get` | `read` | Read one VM by UUID |
| `vm.list` | `pilvio.api.vm.list` | `read` | List the virtual machines |
| `vm.reinstall` | `pilvio.api.vm.reinstall` | `destructive` | Reinstall a VM with a new OS; existing data is replaced |
| `vm.start` | `pilvio.api.vm.start` | `write` | Start a stopped VM |
| `vm.stop` | `pilvio.api.vm.stop` | `write` | Stop a running VM |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/pilvio

## License

Apache-2.0
