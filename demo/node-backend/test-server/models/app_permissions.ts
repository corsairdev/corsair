/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The permissions granted to the user access token.
 */
export type app_permissions = {
    /**
     * The level of permission to grant the access token for GitHub Actions workflows, workflow runs, and artifacts.
     */
    actions?: app_permissions.actions;
    /**
     * The level of permission to grant the access token for repository creation, deletion, settings, teams, and collaborators creation.
     */
    administration?: app_permissions.administration;
    /**
     * The level of permission to grant the access token to create and retrieve build artifact metadata records.
     */
    artifact_metadata?: app_permissions.artifact_metadata;
    /**
     * The level of permission to create and retrieve the access token for repository attestations.
     */
    attestations?: app_permissions.attestations;
    /**
     * The level of permission to grant the access token for checks on code.
     */
    checks?: app_permissions.checks;
    /**
     * The level of permission to grant the access token to create, edit, delete, and list Codespaces.
     */
    codespaces?: app_permissions.codespaces;
    /**
     * The level of permission to grant the access token for repository contents, commits, branches, downloads, releases, and merges.
     */
    contents?: app_permissions.contents;
    /**
     * The level of permission to grant the access token to manage Dependabot secrets.
     */
    dependabot_secrets?: app_permissions.dependabot_secrets;
    /**
     * The level of permission to grant the access token for deployments and deployment statuses.
     */
    deployments?: app_permissions.deployments;
    /**
     * The level of permission to grant the access token for discussions and related comments and labels.
     */
    discussions?: app_permissions.discussions;
    /**
     * The level of permission to grant the access token for managing repository environments.
     */
    environments?: app_permissions.environments;
    /**
     * The level of permission to grant the access token for issues and related comments, assignees, labels, and milestones.
     */
    issues?: app_permissions.issues;
    /**
     * The level of permission to grant the access token to manage the merge queues for a repository.
     */
    merge_queues?: app_permissions.merge_queues;
    /**
     * The level of permission to grant the access token to search repositories, list collaborators, and access repository metadata.
     */
    metadata?: app_permissions.metadata;
    /**
     * The level of permission to grant the access token for packages published to GitHub Packages.
     */
    packages?: app_permissions.packages;
    /**
     * The level of permission to grant the access token to retrieve Pages statuses, configuration, and builds, as well as create new builds.
     */
    pages?: app_permissions.pages;
    /**
     * The level of permission to grant the access token for pull requests and related comments, assignees, labels, milestones, and merges.
     */
    pull_requests?: app_permissions.pull_requests;
    /**
     * The level of permission to grant the access token to view and edit custom properties for a repository, when allowed by the property.
     */
    repository_custom_properties?: app_permissions.repository_custom_properties;
    /**
     * The level of permission to grant the access token to manage the post-receive hooks for a repository.
     */
    repository_hooks?: app_permissions.repository_hooks;
    /**
     * The level of permission to grant the access token to manage repository projects, columns, and cards.
     */
    repository_projects?: app_permissions.repository_projects;
    /**
     * The level of permission to grant the access token to view and manage secret scanning alerts.
     */
    secret_scanning_alerts?: app_permissions.secret_scanning_alerts;
    /**
     * The level of permission to grant the access token to manage repository secrets.
     */
    secrets?: app_permissions.secrets;
    /**
     * The level of permission to grant the access token to view and manage security events like code scanning alerts.
     */
    security_events?: app_permissions.security_events;
    /**
     * The level of permission to grant the access token to manage just a single file.
     */
    single_file?: app_permissions.single_file;
    /**
     * The level of permission to grant the access token for commit statuses.
     */
    statuses?: app_permissions.statuses;
    /**
     * The level of permission to grant the access token to manage Dependabot alerts.
     */
    vulnerability_alerts?: app_permissions.vulnerability_alerts;
    /**
     * The level of permission to grant the access token to update GitHub Actions workflow files.
     */
    workflows?: app_permissions.workflows;
    /**
     * The level of permission to grant the access token to view and edit custom properties for an organization, when allowed by the property.
     */
    custom_properties_for_organizations?: app_permissions.custom_properties_for_organizations;
    /**
     * The level of permission to grant the access token for organization teams and members.
     */
    members?: app_permissions.members;
    /**
     * The level of permission to grant the access token to manage access to an organization.
     */
    organization_administration?: app_permissions.organization_administration;
    /**
     * The level of permission to grant the access token for custom repository roles management.
     */
    organization_custom_roles?: app_permissions.organization_custom_roles;
    /**
     * The level of permission to grant the access token for custom organization roles management.
     */
    organization_custom_org_roles?: app_permissions.organization_custom_org_roles;
    /**
     * The level of permission to grant the access token for repository custom properties management at the organization level.
     */
    organization_custom_properties?: app_permissions.organization_custom_properties;
    /**
     * The level of permission to grant the access token for managing access to GitHub Copilot for members of an organization with a Copilot Business subscription. This property is in public preview and is subject to change.
     */
    organization_copilot_seat_management?: app_permissions.organization_copilot_seat_management;
    /**
     * The level of permission to grant the access token to view and manage announcement banners for an organization.
     */
    organization_announcement_banners?: app_permissions.organization_announcement_banners;
    /**
     * The level of permission to grant the access token to view events triggered by an activity in an organization.
     */
    organization_events?: app_permissions.organization_events;
    /**
     * The level of permission to grant the access token to manage the post-receive hooks for an organization.
     */
    organization_hooks?: app_permissions.organization_hooks;
    /**
     * The level of permission to grant the access token for viewing and managing fine-grained personal access token requests to an organization.
     */
    organization_personal_access_tokens?: app_permissions.organization_personal_access_tokens;
    /**
     * The level of permission to grant the access token for viewing and managing fine-grained personal access tokens that have been approved by an organization.
     */
    organization_personal_access_token_requests?: app_permissions.organization_personal_access_token_requests;
    /**
     * The level of permission to grant the access token for viewing an organization's plan.
     */
    organization_plan?: app_permissions.organization_plan;
    /**
     * The level of permission to grant the access token to manage organization projects and projects public preview (where available).
     */
    organization_projects?: app_permissions.organization_projects;
    /**
     * The level of permission to grant the access token for organization packages published to GitHub Packages.
     */
    organization_packages?: app_permissions.organization_packages;
    /**
     * The level of permission to grant the access token to manage organization secrets.
     */
    organization_secrets?: app_permissions.organization_secrets;
    /**
     * The level of permission to grant the access token to view and manage GitHub Actions self-hosted runners available to an organization.
     */
    organization_self_hosted_runners?: app_permissions.organization_self_hosted_runners;
    /**
     * The level of permission to grant the access token to view and manage users blocked by the organization.
     */
    organization_user_blocking?: app_permissions.organization_user_blocking;
    /**
     * The level of permission to grant the access token to manage team discussions and related comments.
     */
    team_discussions?: app_permissions.team_discussions;
    /**
     * The level of permission to grant the access token to manage the email addresses belonging to a user.
     */
    email_addresses?: app_permissions.email_addresses;
    /**
     * The level of permission to grant the access token to manage the followers belonging to a user.
     */
    followers?: app_permissions.followers;
    /**
     * The level of permission to grant the access token to manage git SSH keys.
     */
    git_ssh_keys?: app_permissions.git_ssh_keys;
    /**
     * The level of permission to grant the access token to view and manage GPG keys belonging to a user.
     */
    gpg_keys?: app_permissions.gpg_keys;
    /**
     * The level of permission to grant the access token to view and manage interaction limits on a repository.
     */
    interaction_limits?: app_permissions.interaction_limits;
    /**
     * The level of permission to grant the access token to manage the profile settings belonging to a user.
     */
    profile?: app_permissions.profile;
    /**
     * The level of permission to grant the access token to list and manage repositories a user is starring.
     */
    starring?: app_permissions.starring;
    /**
     * The level of permission to grant the access token for organization custom properties management at the enterprise level.
     */
    enterprise_custom_properties_for_organizations?: app_permissions.enterprise_custom_properties_for_organizations;
};
export namespace app_permissions {
    /**
     * The level of permission to grant the access token for GitHub Actions workflows, workflow runs, and artifacts.
     */
    export enum actions {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for repository creation, deletion, settings, teams, and collaborators creation.
     */
    export enum administration {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to create and retrieve build artifact metadata records.
     */
    export enum artifact_metadata {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to create and retrieve the access token for repository attestations.
     */
    export enum attestations {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for checks on code.
     */
    export enum checks {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to create, edit, delete, and list Codespaces.
     */
    export enum codespaces {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for repository contents, commits, branches, downloads, releases, and merges.
     */
    export enum contents {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage Dependabot secrets.
     */
    export enum dependabot_secrets {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for deployments and deployment statuses.
     */
    export enum deployments {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for discussions and related comments and labels.
     */
    export enum discussions {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for managing repository environments.
     */
    export enum environments {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for issues and related comments, assignees, labels, and milestones.
     */
    export enum issues {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage the merge queues for a repository.
     */
    export enum merge_queues {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to search repositories, list collaborators, and access repository metadata.
     */
    export enum metadata {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for packages published to GitHub Packages.
     */
    export enum packages {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to retrieve Pages statuses, configuration, and builds, as well as create new builds.
     */
    export enum pages {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for pull requests and related comments, assignees, labels, milestones, and merges.
     */
    export enum pull_requests {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view and edit custom properties for a repository, when allowed by the property.
     */
    export enum repository_custom_properties {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage the post-receive hooks for a repository.
     */
    export enum repository_hooks {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage repository projects, columns, and cards.
     */
    export enum repository_projects {
        READ = 'read',
        WRITE = 'write',
        ADMIN = 'admin',
    }
    /**
     * The level of permission to grant the access token to view and manage secret scanning alerts.
     */
    export enum secret_scanning_alerts {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage repository secrets.
     */
    export enum secrets {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view and manage security events like code scanning alerts.
     */
    export enum security_events {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage just a single file.
     */
    export enum single_file {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for commit statuses.
     */
    export enum statuses {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage Dependabot alerts.
     */
    export enum vulnerability_alerts {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to update GitHub Actions workflow files.
     */
    export enum workflows {
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view and edit custom properties for an organization, when allowed by the property.
     */
    export enum custom_properties_for_organizations {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for organization teams and members.
     */
    export enum members {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage access to an organization.
     */
    export enum organization_administration {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for custom repository roles management.
     */
    export enum organization_custom_roles {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for custom organization roles management.
     */
    export enum organization_custom_org_roles {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for repository custom properties management at the organization level.
     */
    export enum organization_custom_properties {
        READ = 'read',
        WRITE = 'write',
        ADMIN = 'admin',
    }
    /**
     * The level of permission to grant the access token for managing access to GitHub Copilot for members of an organization with a Copilot Business subscription. This property is in public preview and is subject to change.
     */
    export enum organization_copilot_seat_management {
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view and manage announcement banners for an organization.
     */
    export enum organization_announcement_banners {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view events triggered by an activity in an organization.
     */
    export enum organization_events {
        READ = 'read',
    }
    /**
     * The level of permission to grant the access token to manage the post-receive hooks for an organization.
     */
    export enum organization_hooks {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for viewing and managing fine-grained personal access token requests to an organization.
     */
    export enum organization_personal_access_tokens {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for viewing and managing fine-grained personal access tokens that have been approved by an organization.
     */
    export enum organization_personal_access_token_requests {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for viewing an organization's plan.
     */
    export enum organization_plan {
        READ = 'read',
    }
    /**
     * The level of permission to grant the access token to manage organization projects and projects public preview (where available).
     */
    export enum organization_projects {
        READ = 'read',
        WRITE = 'write',
        ADMIN = 'admin',
    }
    /**
     * The level of permission to grant the access token for organization packages published to GitHub Packages.
     */
    export enum organization_packages {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage organization secrets.
     */
    export enum organization_secrets {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view and manage GitHub Actions self-hosted runners available to an organization.
     */
    export enum organization_self_hosted_runners {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view and manage users blocked by the organization.
     */
    export enum organization_user_blocking {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage team discussions and related comments.
     */
    export enum team_discussions {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage the email addresses belonging to a user.
     */
    export enum email_addresses {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage the followers belonging to a user.
     */
    export enum followers {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage git SSH keys.
     */
    export enum git_ssh_keys {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view and manage GPG keys belonging to a user.
     */
    export enum gpg_keys {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to view and manage interaction limits on a repository.
     */
    export enum interaction_limits {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to manage the profile settings belonging to a user.
     */
    export enum profile {
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token to list and manage repositories a user is starring.
     */
    export enum starring {
        READ = 'read',
        WRITE = 'write',
    }
    /**
     * The level of permission to grant the access token for organization custom properties management at the enterprise level.
     */
    export enum enterprise_custom_properties_for_organizations {
        READ = 'read',
        WRITE = 'write',
        ADMIN = 'admin',
    }
}

