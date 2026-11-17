# @corsair-dev/signpath

SignPath plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/signpath
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `artifactConfigurations.activate` | `signpath.api.artifactConfigurations.activate` | `write` | Activate an artifact configuration; safe to repeat |
| `artifactConfigurations.deactivate` | `signpath.api.artifactConfigurations.deactivate` | `write` | Deactivate an artifact configuration; safe to repeat |
| `artifactConfigurations.getXml` | `signpath.api.artifactConfigurations.getXml` | `read` | Read an artifact configuration as XML, which is how SignPath stores and version-controls it |
| `artifactConfigurations.updateXml` | `signpath.api.artifactConfigurations.updateXml` | `write` | Replace an artifact configuration's XML; SignPath does not merge it, and existing signing requests keep the version they captured |
| `auditLog.listEvents` | `signpath.api.auditLog.listEvents` | `read` | Read organization audit log events from a cursor or a start time; this route is under the v1-pre preview path |
| `auditLog.listSigningRequestEvents` | `signpath.api.auditLog.listSigningRequestEvents` | `read` | Read only the signing request audit log events from a cursor or a start time; this route is under the v1-pre preview path |
| `certificates.get` | `signpath.api.certificates.get` | `read` | Read one certificate: its status, key algorithm, subject and X509 validity or GPG fingerprint |
| `certificates.list` | `signpath.api.certificates.list` | `read` | List the organization's X509 and GPG certificates with status, algorithm and validity; this route does not page |
| `organization.get` | `signpath.api.organization.get` | `read` | Read the organization name, subscription type and quota usage: active users, active projects, certificates, yearly signatures and artifact bytes |
| `projects.activate` | `signpath.api.projects.activate` | `write` | Activate a project so it accepts signing requests; safe to repeat |
| `projects.create` | `signpath.api.projects.create` | `write` | Create a project with an artifact configuration; the project starts inactive, so activate it before submitting signing requests |
| `projects.deactivate` | `signpath.api.projects.deactivate` | `write` | Deactivate a project, which blocks new signing requests until it is activated again; safe to repeat |
| `projects.get` | `signpath.api.projects.get` | `read` | Read one project with its artifact configurations, signing policies, trusted build system links, readers and configurators |
| `projects.list` | `signpath.api.projects.list` | `read` | List every project in the organization with its status and signing policies; this route does not page |
| `projects.setDefaultArtifactConfiguration` | `signpath.api.projects.setDefaultArtifactConfiguration` | `write` | Choose which artifact configuration a signing request uses when it names none |
| `projects.update` | `signpath.api.projects.update` | `write` | Change a project name, description, repository URLs, readers or configurators; the body requires the slug, so pass the project's own slug to keep it |
| `signingPolicies.activate` | `signpath.api.signingPolicies.activate` | `write` | Activate a signing policy so it accepts submissions; safe to repeat |
| `signingPolicies.create` | `signpath.api.signingPolicies.create` | `write` | Add a signing policy to a project; it is created inactive, so activate it before it accepts submissions |
| `signingPolicies.deactivate` | `signpath.api.signingPolicies.deactivate` | `write` | Deactivate a signing policy, which blocks new submissions under it; safe to repeat |
| `signingPolicies.get` | `signpath.api.signingPolicies.get` | `read` | Read one signing policy: its certificate, submitters, approvers, required approval count and build system verification |
| `signingPolicies.update` | `signpath.api.signingPolicies.update` | `write` | Replace a signing policy's certificate, submitters, approvals and verification settings; the body requires the slug, so pass the policy's own slug to keep it |
| `signingRequests.approve` | `signpath.api.signingRequests.approve` | `destructive` | Approve a signing request waiting for approval; SignPath accepts it once the policy's required approval count is reached |
| `signingRequests.cancel` | `signpath.api.signingRequests.cancel` | `destructive` | Cancel a signing request that has not finished; a cancelled request cannot be resumed, so a new one has to be submitted |
| `signingRequests.deny` | `signpath.api.signingRequests.deny` | `destructive` | Deny a signing request, which immediately marks it rejected; a denied request cannot be approved afterwards |
| `signingRequests.get` | `signpath.api.signingRequests.get` | `read` | Read one signing request with its status, workflow status, artifact links and verified origin when the build system provided one |
| `signingRequests.getStatus` | `signpath.api.signingRequests.getStatus` | `read` | Read only a signing request's status and workflow status, which is the cheap poll while it waits for approval or processing |
| `signingRequests.list` | `signpath.api.signingRequests.list` | `read` | List signing requests with filters for project, policy, configuration, certificate, status and submission time; follow pagination.nextLink for the next page |
| `signingRequests.resubmit` | `signpath.api.signingRequests.resubmit` | `destructive` | Resubmit a completed signing request under another policy, which is how a test-signed artifact is promoted to release signing; returns the new request id from the Location header |
| `signingRequests.signHash` | `signpath.api.signingRequests.signHash` | `destructive` | Sign a hash with the policy's key and return the signature in the response, without an artifact or a waiting period |
| `signingRequests.signMessage` | `signpath.api.signingRequests.signMessage` | `destructive` | Sign a message with ML-DSA and return the signature in the response; PureMldsa is the only algorithm SignPath offers here |
| `signingRequests.submitWithArtifact` | `signpath.api.signingRequests.submitWithArtifact` | `destructive` | Submit an artifact for signing, uploading the bytes in the same call; the request then waits for approval and processing |
| `signingRequests.submitWithArtifactRetrievalLink` | `signpath.api.signingRequests.submitWithArtifactRetrievalLink` | `destructive` | Submit a signing request that points at an artifact SignPath downloads itself, which is the route for artifacts too large to upload |
| `signingRequests.submitWithoutArtifact` | `signpath.api.signingRequests.submitWithoutArtifact` | `destructive` | Submit a signing request before the artifact exists, returning the upload link the artifact must be delivered to |
| `users.me` | `signpath.api.users.me` | `read` | Read the authenticated user: their id, role, status and whether they are a CI user or an interactive user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/signpath

## License

Apache-2.0
