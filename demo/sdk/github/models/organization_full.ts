/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Organization Full
 */
export type organization_full = {
    login: string;
    id: number;
    node_id: string;
    url: string;
    repos_url: string;
    events_url: string;
    hooks_url: string;
    issues_url: string;
    members_url: string;
    public_members_url: string;
    avatar_url: string;
    description: string | null;
    name?: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
    twitter_username?: string | null;
    is_verified?: boolean;
    has_organization_projects: boolean;
    has_repository_projects: boolean;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    html_url: string;
    type: string;
    total_private_repos?: number;
    owned_private_repos?: number;
    private_gists?: number | null;
    disk_usage?: number | null;
    /**
     * The number of collaborators on private repositories.
     *
     * This field may be null if the number of private repositories is over 50,000.
     */
    collaborators?: number | null;
    billing_email?: string | null;
    plan?: {
        name: string;
        space: number;
        private_repos: number;
        filled_seats?: number;
        seats?: number;
    };
    default_repository_permission?: string | null;
    /**
     * The default branch for repositories created in this organization.
     */
    default_repository_branch?: string | null;
    members_can_create_repositories?: boolean | null;
    two_factor_requirement_enabled?: boolean | null;
    members_allowed_repository_creation_type?: string;
    members_can_create_public_repositories?: boolean;
    members_can_create_private_repositories?: boolean;
    members_can_create_internal_repositories?: boolean;
    members_can_create_pages?: boolean;
    members_can_create_public_pages?: boolean;
    members_can_create_private_pages?: boolean;
    members_can_delete_repositories?: boolean;
    members_can_change_repo_visibility?: boolean;
    members_can_invite_outside_collaborators?: boolean;
    members_can_delete_issues?: boolean;
    display_commenter_full_name_setting_enabled?: boolean;
    readers_can_create_discussions?: boolean;
    members_can_create_teams?: boolean;
    members_can_view_dependency_insights?: boolean;
    members_can_fork_private_repositories?: boolean | null;
    web_commit_signoff_required?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether GitHub Advanced Security is enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    advanced_security_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether Dependabot alerts are automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    dependabot_alerts_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether Dependabot security updates are automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    dependabot_security_updates_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether dependency graph is automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    dependency_graph_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether secret scanning is automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    secret_scanning_enabled_for_new_repositories?: boolean;
    /**
     * **Endpoint closing down notice.** Please use [code security configurations](https://docs.github.com/rest/code-security/configurations) instead.
     *
     * Whether secret scanning push protection is automatically enabled for new repositories and repositories transferred to this organization.
     *
     * This field is only visible to organization owners or members of a team with the security manager role.
     * @deprecated
     */
    secret_scanning_push_protection_enabled_for_new_repositories?: boolean;
    /**
     * Whether a custom link is shown to contributors who are blocked from pushing a secret by push protection.
     */
    secret_scanning_push_protection_custom_link_enabled?: boolean;
    /**
     * An optional URL string to display to contributors who are blocked from pushing a secret.
     */
    secret_scanning_push_protection_custom_link?: string | null;
    created_at: string;
    updated_at: string;
    archived_at: string | null;
    /**
     * Controls whether or not deploy keys may be added and used for repositories in the organization.
     */
    deploy_keys_enabled_for_repositories?: boolean;
};

