# Security policy

## Reporting a vulnerability

Please do not open a public issue for a security vulnerability.

Report it privately through GitHub: open the repository's **Security** tab and
choose **Report a vulnerability** (GitHub private vulnerability reporting). That
routes the report to the maintainers without disclosing it publicly.

Include what you need to reproduce it: affected version, a proof of concept or
steps, and the impact you observed. If you have a suggested fix, send it along.

We aim to acknowledge a report within a few business days and will keep you
updated on the fix and any coordinated disclosure.

## Supported versions

Fixes land on the latest published release of each package. Upgrade to the
current version before reporting, in case the issue is already resolved.

## Scope

This repository is the Corsair SDK and its integration plugins. Your KEK stays
in your environment and encrypts each credential at rest in your own database.
Hub runs managed OAuth and delivers the resulting credentials to your backend's
signed delivery endpoint (and through the dev tunnel in local development).
Reports that involve credential handling, the delivery and signature path, or
the dev tunnel are especially welcome.
