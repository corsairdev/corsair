export type api_overview = {
    verifiable_password_authentication: boolean;
    ssh_key_fingerprints?: {
        SHA256_RSA?: string;
        SHA256_DSA?: string;
        SHA256_ECDSA?: string;
        SHA256_ED25519?: string;
    };
    ssh_keys?: Array<string>;
    hooks?: Array<string>;
    github_enterprise_importer?: Array<string>;
    web?: Array<string>;
    api?: Array<string>;
    git?: Array<string>;
    packages?: Array<string>;
    pages?: Array<string>;
    importer?: Array<string>;
    actions?: Array<string>;
    actions_macos?: Array<string>;
    codespaces?: Array<string>;
    dependabot?: Array<string>;
    copilot?: Array<string>;
    domains?: {
        website?: Array<string>;
        codespaces?: Array<string>;
        copilot?: Array<string>;
        packages?: Array<string>;
        actions?: Array<string>;
        actions_inbound?: {
            full_domains?: Array<string>;
            wildcard_domains?: Array<string>;
        };
        artifact_attestations?: {
            trust_domain?: string;
            services?: Array<string>;
        };
    };
};

export enum author_association {
    COLLABORATOR = 'COLLABORATOR',
    CONTRIBUTOR = 'CONTRIBUTOR',
    FIRST_TIMER = 'FIRST_TIMER',
    FIRST_TIME_CONTRIBUTOR = 'FIRST_TIME_CONTRIBUTOR',
    MANNEQUIN = 'MANNEQUIN',
    MEMBER = 'MEMBER',
    NONE = 'NONE',
    OWNER = 'OWNER',
}

export type code_frequency_stat = Array<number>;

export type code_of_conduct = {
    key: string;
    name: string;
    url: string;
    body?: string;
    html_url: string | null;
};

export type code_of_conduct_simple = {
    url: string;
    key: string;
    name: string;
    html_url: string | null;
};

export type content_directory = Array<{
    type: 'dir' | 'file' | 'submodule' | 'symlink';
    size: number;
    name: string;
    path: string;
    content?: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
}>;

export type content_file = {
    type: content_file.type;
    encoding: string;
    size: number;
    name: string;
    path: string;
    content: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
    target?: string;
    submodule_git_url?: string;
};
export namespace content_file {
    export enum type {
        FILE = 'file',
    }
}

export type content_submodule = {
    type: content_submodule.type;
    submodule_git_url: string;
    size: number;
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
};
export namespace content_submodule {
    export enum type {
        SUBMODULE = 'submodule',
    }
}

export type content_symlink = {
    type: content_symlink.type;
    target: string;
    size: number;
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string | null;
    html_url: string | null;
    download_url: string | null;
    _links: {
        git: string | null;
        html: string | null;
        self: string;
    };
};
export namespace content_symlink {
    export enum type {
        SYMLINK = 'symlink',
    }
}

export type content_traffic = {
    path: string;
    title: string;
    count: number;
    uniques: number;
};

export type diff_entry = {
    sha: string | null;
    filename: string;
    status: diff_entry.status;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
    previous_filename?: string;
};
export namespace diff_entry {
    export enum status {
        ADDED = 'added',
        REMOVED = 'removed',
        MODIFIED = 'modified',
        RENAMED = 'renamed',
        COPIED = 'copied',
        CHANGED = 'changed',
        UNCHANGED = 'unchanged',
    }
}

export type empty_object = {
};

export type enterprise = string;

export type file_commit = {
    content: {
        name?: string;
        path?: string;
        sha?: string;
        size?: number;
        url?: string;
        html_url?: string;
        git_url?: string;
        download_url?: string;
        type?: string;
        _links?: {
            self?: string;
            git?: string;
            html?: string;
        };
    } | null;
    commit: {
        sha?: string;
        node_id?: string;
        url?: string;
        html_url?: string;
        author?: {
            date?: string;
            name?: string;
            email?: string;
        };
        committer?: {
            date?: string;
            name?: string;
            email?: string;
        };
        message?: string;
        tree?: {
            url?: string;
            sha?: string;
        };
        parents?: Array<{
            url?: string;
            html_url?: string;
            sha?: string;
        }>;
        verification?: {
            verified?: boolean;
            reason?: string;
            signature?: string | null;
            payload?: string | null;
            verified_at?: string | null;
        };
    };
};

export type issue_dependencies_summary = {
    blocked_by: number;
    blocking: number;
    total_blocked_by: number;
    total_blocking: number;
};

export type issue_field_value = {
    issue_field_id: number;
    node_id: string;
    data_type: issue_field_value.data_type;
    value: (string | number) | null;
    single_select_option?: {
        id: number;
        name: string;
        color: string;
    } | null;
};
export namespace issue_field_value {
    export enum data_type {
        TEXT = 'text',
        SINGLE_SELECT = 'single_select',
        NUMBER = 'number',
        DATE = 'date',
    }
}

export type issue_type = {
    id: number;
    node_id: string;
    name: string;
    description: string | null;
    color?: issue_type.color | null;
    created_at?: string;
    updated_at?: string;
    is_enabled?: boolean;
};
export namespace issue_type {
    export enum color {
        GRAY = 'gray',
        BLUE = 'blue',
        GREEN = 'green',
        YELLOW = 'yellow',
        ORANGE = 'orange',
        RED = 'red',
        PINK = 'pink',
        PURPLE = 'purple',
    }
}

export type link = {
    href: string;
};

export type nullable_git_user = {
    name?: string;
    email?: string;
    date?: string;
};

export type nullable_license_simple = {
    key: string;
    name: string;
    url: string | null;
    spdx_id: string | null;
    node_id: string;
    html_url?: string;
};

export type nullable_simple_user = {
    name?: string | null;
    email?: string | null;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    starred_at?: string;
    user_view_type?: string;
};

export type nullable_simple_commit = {
    id: string;
    tree_id: string;
    message: string;
    timestamp: string;
    author: {
        name: string;
        email: string;
    } | null;
    committer: {
        name: string;
        email: string;
    } | null;
};

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
    advanced_security_enabled_for_new_repositories?: boolean;
    dependabot_alerts_enabled_for_new_repositories?: boolean;
    dependabot_security_updates_enabled_for_new_repositories?: boolean;
    dependency_graph_enabled_for_new_repositories?: boolean;
    secret_scanning_enabled_for_new_repositories?: boolean;
    secret_scanning_push_protection_enabled_for_new_repositories?: boolean;
    secret_scanning_push_protection_custom_link_enabled?: boolean;
    secret_scanning_push_protection_custom_link?: string | null;
    created_at: string;
    updated_at: string;
    archived_at: string | null;
    deploy_keys_enabled_for_repositories?: boolean;
};

export type private_user = {
    login: string;
    id: number;
    user_view_type?: string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    notification_email?: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username?: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    private_gists: number;
    total_private_repos: number;
    owned_private_repos: number;
    disk_usage: number;
    collaborators: number;
    two_factor_authentication: boolean;
    plan?: {
        collaborators: number;
        name: string;
        space: number;
        private_repos: number;
    };
    business_plus?: boolean;
    ldap_dn?: string;
};

export type protected_branch_admin_enforced = {
    url: string;
    enabled: boolean;
};

export type protected_branch_required_status_check = {
    url?: string;
    enforcement_level?: string;
    contexts: Array<string>;
    checks: Array<{
        context: string;
        app_id: number | null;
    }>;
    contexts_url?: string;
    strict?: boolean;
};

export type public_user = {
    login: string;
    id: number;
    user_view_type?: string;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string | null;
    company: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    notification_email?: string | null;
    hireable: boolean | null;
    bio: string | null;
    twitter_username?: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    plan?: {
        collaborators: number;
        name: string;
        space: number;
        private_repos: number;
    };
    private_gists?: number;
    total_private_repos?: number;
    owned_private_repos?: number;
    disk_usage?: number;
    collaborators?: number;
};

export type pull_request_minimal = {
    id: number;
    number: number;
    url: string;
    head: {
        ref: string;
        sha: string;
        repo: {
            id: number;
            url: string;
            name: string;
        };
    };
    base: {
        ref: string;
        sha: string;
        repo: {
            id: number;
            url: string;
            name: string;
        };
    };
};

export type reaction_rollup = {
    url: string;
    total_count: number;
    '+1': number;
    '-1': number;
    laugh: number;
    confused: number;
    heart: number;
    hooray: number;
    eyes: number;
    rocket: number;
};

export type referenced_workflow = {
    path: string;
    sha: string;
    ref?: string;
};

export type referrer_traffic = {
    referrer: string;
    count: number;
    uniques: number;
};

export type root = {
    current_user_url: string;
    current_user_authorizations_html_url: string;
    authorizations_url: string;
    code_search_url: string;
    commit_search_url: string;
    emails_url: string;
    emojis_url: string;
    events_url: string;
    feeds_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    hub_url?: string;
    issue_search_url: string;
    issues_url: string;
    keys_url: string;
    label_search_url: string;
    notifications_url: string;
    organization_url: string;
    organization_repositories_url: string;
    organization_teams_url: string;
    public_gists_url: string;
    rate_limit_url: string;
    repository_url: string;
    repository_search_url: string;
    current_user_repositories_url: string;
    starred_url: string;
    starred_gists_url: string;
    topic_search_url?: string;
    user_url: string;
    user_organizations_url: string;
    user_repositories_url: string;
    user_search_url: string;
};

export type simple_user = {
    name?: string | null;
    email?: string | null;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    starred_at?: string;
    user_view_type?: string;
};

export type sub_issues_summary = {
    total: number;
    completed: number;
    percent_completed: number;
};

export type verification = {
    verified: boolean;
    reason: string;
    payload: string | null;
    signature: string | null;
    verified_at: string | null;
};

export type workflow = {
    id: number;
    node_id: string;
    name: string;
    path: string;
    state: workflow.state;
    created_at: string;
    updated_at: string;
    url: string;
    html_url: string;
    badge_url: string;
    deleted_at?: string;
};
export namespace workflow {
    export enum state {
        ACTIVE = 'active',
        DELETED = 'deleted',
        DISABLED_FORK = 'disabled_fork',
        DISABLED_INACTIVITY = 'disabled_inactivity',
        DISABLED_MANUALLY = 'disabled_manually',
    }
}

export type workflow_usage = {
    billable: {
        UBUNTU?: {
            total_ms?: number;
        };
        MACOS?: {
            total_ms?: number;
        };
        WINDOWS?: {
            total_ms?: number;
        };
    };
};

export type security_and_analysis = {
    advanced_security?: {
        status?: security_and_analysis.status;
    };
    code_security?: {
        status?: security_and_analysis.status;
    };
    dependabot_security_updates?: {
        status?: security_and_analysis.status;
    };
    secret_scanning?: {
        status?: security_and_analysis.status;
    };
    secret_scanning_push_protection?: {
        status?: security_and_analysis.status;
    };
    secret_scanning_non_provider_patterns?: {
        status?: security_and_analysis.status;
    };
    secret_scanning_ai_detection?: {
        status?: security_and_analysis.status;
    };
};
export namespace security_and_analysis {
    export enum status {
        ENABLED = 'enabled',
        DISABLED = 'disabled',
    }
}

export type nullable_team_simple = {
    id: number;
    node_id: string;
    url: string;
    members_url: string;
    name: string;
    description: string | null;
    permission: string;
    privacy?: string;
    notification_setting?: string;
    html_url: string;
    repositories_url: string;
    slug: string;
    ldap_dn?: string;
    type: nullable_team_simple.type;
    organization_id?: number;
    enterprise_id?: number;
};
export namespace nullable_team_simple {
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}

export type team_simple = {
    id: number;
    node_id: string;
    url: string;
    members_url: string;
    name: string;
    description: string | null;
    permission: string;
    privacy?: string;
    notification_setting?: string;
    html_url: string;
    repositories_url: string;
    slug: string;
    ldap_dn?: string;
    type: team_simple.type;
    organization_id?: number;
    enterprise_id?: number;
};
export namespace team_simple {
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}

export type auto_merge = {
    enabled_by: simple_user;
    merge_method: auto_merge.merge_method;
    commit_title: string;
    commit_message: string;
};
export namespace auto_merge {
    export enum merge_method {
        MERGE = 'merge',
        SQUASH = 'squash',
        REBASE = 'rebase',
    }
}

export type integration = {
    id: number;
    slug?: string;
    node_id: string;
    client_id?: string;
    owner: (simple_user | enterprise);
    name: string;
    description: string | null;
    external_url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    permissions: Record<string, string>;
    events: Array<string>;
    installations_count?: number;
};

export type nullable_integration = {
    id: number;
    slug?: string;
    node_id: string;
    client_id?: string;
    owner: (simple_user | enterprise);
    name: string;
    description: string | null;
    external_url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    permissions: Record<string, string>;
    events: Array<string>;
    installations_count?: number;
};

export type nullable_milestone = {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    node_id: string;
    number: number;
    state: nullable_milestone.state;
    title: string;
    description: string | null;
    creator: nullable_simple_user;
    open_issues: number;
    closed_issues: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    due_on: string | null;
};
export namespace nullable_milestone {
    export enum state {
        OPEN = 'open',
        CLOSED = 'closed',
    }
}

export type team = {
    id: number;
    node_id: string;
    name: string;
    slug: string;
    description: string | null;
    privacy?: string;
    notification_setting?: string;
    permission: string;
    permissions?: {
        pull: boolean;
        triage: boolean;
        push: boolean;
        maintain: boolean;
        admin: boolean;
    };
    url: string;
    html_url: string;
    members_url: string;
    repositories_url: string;
    type: team.type;
    organization_id?: number;
    enterprise_id?: number;
    parent: nullable_team_simple;
};
export namespace team {
    export enum type {
        ENTERPRISE = 'enterprise',
        ORGANIZATION = 'organization',
    }
}

export type commit = {
    url: string;
    sha: string;
    node_id: string;
    html_url: string;
    comments_url: string;
    commit: {
        url: string;
        author: nullable_git_user;
        committer: nullable_git_user;
        message: string;
        comment_count: number;
        tree: {
            sha: string;
            url: string;
        };
        verification?: verification;
    };
    author: (simple_user | empty_object) | null;
    committer: (simple_user | empty_object) | null;
    parents: Array<{
        sha: string;
        url: string;
        html_url?: string;
    }>;
    stats?: {
        additions?: number;
        deletions?: number;
        total?: number;
    };
    files?: Array<diff_entry>;
};

export type repository = {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    license: nullable_license_simple;
    forks: number;
    permissions?: {
        admin: boolean;
        pull: boolean;
        triage?: boolean;
        push: boolean;
        maintain?: boolean;
    };
    owner: simple_user;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url: string;
    mirror_url: string | null;
    hooks_url: string;
    svn_url: string;
    homepage: string | null;
    language: string | null;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    size: number;
    default_branch: string;
    open_issues_count: number;
    is_template?: boolean;
    topics?: Array<string>;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads: boolean;
    has_discussions?: boolean;
    archived: boolean;
    disabled: boolean;
    visibility?: string;
    pushed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    allow_rebase_merge?: boolean;
    temp_clone_token?: string;
    allow_squash_merge?: boolean;
    allow_auto_merge?: boolean;
    delete_branch_on_merge?: boolean;
    allow_update_branch?: boolean;
    use_squash_pr_title_as_default?: boolean;
    squash_merge_commit_title?: repository.squash_merge_commit_title;
    squash_merge_commit_message?: repository.squash_merge_commit_message;
    merge_commit_title?: repository.merge_commit_title;
    merge_commit_message?: repository.merge_commit_message;
    allow_merge_commit?: boolean;
    allow_forking?: boolean;
    web_commit_signoff_required?: boolean;
    open_issues: number;
    watchers: number;
    master_branch?: string;
    starred_at?: string;
    anonymous_access_enabled?: boolean;
    code_search_index_status?: {
        lexical_search_ok?: boolean;
        lexical_commit_sha?: string;
    };
};
export namespace repository {
    export enum squash_merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        COMMIT_OR_PR_TITLE = 'COMMIT_OR_PR_TITLE',
    }
    export enum squash_merge_commit_message {
        PR_BODY = 'PR_BODY',
        COMMIT_MESSAGES = 'COMMIT_MESSAGES',
        BLANK = 'BLANK',
    }
    export enum merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        MERGE_MESSAGE = 'MERGE_MESSAGE',
    }
    export enum merge_commit_message {
        PR_BODY = 'PR_BODY',
        PR_TITLE = 'PR_TITLE',
        BLANK = 'BLANK',
    }
}

export type nullable_repository = {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    license: nullable_license_simple;
    forks: number;
    permissions?: {
        admin: boolean;
        pull: boolean;
        triage?: boolean;
        push: boolean;
        maintain?: boolean;
    };
    owner: simple_user;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url: string;
    mirror_url: string | null;
    hooks_url: string;
    svn_url: string;
    homepage: string | null;
    language: string | null;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    size: number;
    default_branch: string;
    open_issues_count: number;
    is_template?: boolean;
    topics?: Array<string>;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads: boolean;
    has_discussions?: boolean;
    archived: boolean;
    disabled: boolean;
    visibility?: string;
    pushed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    allow_rebase_merge?: boolean;
    temp_clone_token?: string;
    allow_squash_merge?: boolean;
    allow_auto_merge?: boolean;
    delete_branch_on_merge?: boolean;
    allow_update_branch?: boolean;
    use_squash_pr_title_as_default?: boolean;
    squash_merge_commit_title?: nullable_repository.squash_merge_commit_title;
    squash_merge_commit_message?: nullable_repository.squash_merge_commit_message;
    merge_commit_title?: nullable_repository.merge_commit_title;
    merge_commit_message?: nullable_repository.merge_commit_message;
    allow_merge_commit?: boolean;
    allow_forking?: boolean;
    web_commit_signoff_required?: boolean;
    open_issues: number;
    watchers: number;
    master_branch?: string;
    starred_at?: string;
    anonymous_access_enabled?: boolean;
    code_search_index_status?: {
        lexical_search_ok?: boolean;
        lexical_commit_sha?: string;
    };
};
export namespace nullable_repository {
    export enum squash_merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        COMMIT_OR_PR_TITLE = 'COMMIT_OR_PR_TITLE',
    }
    export enum squash_merge_commit_message {
        PR_BODY = 'PR_BODY',
        COMMIT_MESSAGES = 'COMMIT_MESSAGES',
        BLANK = 'BLANK',
    }
    export enum merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        MERGE_MESSAGE = 'MERGE_MESSAGE',
    }
    export enum merge_commit_message {
        PR_BODY = 'PR_BODY',
        PR_TITLE = 'PR_TITLE',
        BLANK = 'BLANK',
    }
}

export type branch_restriction_policy = {
    url: string;
    users_url: string;
    teams_url: string;
    apps_url: string;
    users: Array<{
        login?: string;
        id?: number;
        node_id?: string;
        avatar_url?: string;
        gravatar_id?: string;
        url?: string;
        html_url?: string;
        followers_url?: string;
        following_url?: string;
        gists_url?: string;
        starred_url?: string;
        subscriptions_url?: string;
        organizations_url?: string;
        repos_url?: string;
        events_url?: string;
        received_events_url?: string;
        type?: string;
        site_admin?: boolean;
        user_view_type?: string;
    }>;
    teams: Array<team>;
    apps: Array<{
        id?: number;
        slug?: string;
        node_id?: string;
        owner?: {
            login?: string;
            id?: number;
            node_id?: string;
            url?: string;
            repos_url?: string;
            events_url?: string;
            hooks_url?: string;
            issues_url?: string;
            members_url?: string;
            public_members_url?: string;
            avatar_url?: string;
            description?: string;
            gravatar_id?: string;
            html_url?: string;
            followers_url?: string;
            following_url?: string;
            gists_url?: string;
            starred_url?: string;
            subscriptions_url?: string;
            organizations_url?: string;
            received_events_url?: string;
            type?: string;
            site_admin?: boolean;
            user_view_type?: string;
        };
        name?: string;
        client_id?: string;
        description?: string;
        external_url?: string;
        html_url?: string;
        created_at?: string;
        updated_at?: string;
        permissions?: {
            metadata?: string;
            contents?: string;
            issues?: string;
            single_file?: string;
        };
        events?: Array<string>;
    }>;
};

export type protected_branch_pull_request_review = {
    url?: string;
    dismissal_restrictions?: {
        users?: Array<simple_user>;
        teams?: Array<team>;
        apps?: Array<integration>;
        url?: string;
        users_url?: string;
        teams_url?: string;
    };
    bypass_pull_request_allowances?: {
        users?: Array<simple_user>;
        teams?: Array<team>;
        apps?: Array<integration>;
    };
    dismiss_stale_reviews: boolean;
    require_code_owner_reviews: boolean;
    required_approving_review_count?: number;
    require_last_push_approval?: boolean;
};

export type minimal_repository = {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: simple_user;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url?: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url?: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url?: string;
    mirror_url?: string | null;
    hooks_url: string;
    svn_url?: string;
    homepage?: string | null;
    language?: string | null;
    forks_count?: number;
    stargazers_count?: number;
    watchers_count?: number;
    size?: number;
    default_branch?: string;
    open_issues_count?: number;
    is_template?: boolean;
    topics?: Array<string>;
    has_issues?: boolean;
    has_projects?: boolean;
    has_wiki?: boolean;
    has_pages?: boolean;
    has_downloads?: boolean;
    has_discussions?: boolean;
    archived?: boolean;
    disabled?: boolean;
    visibility?: string;
    pushed_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    permissions?: {
        admin?: boolean;
        maintain?: boolean;
        push?: boolean;
        triage?: boolean;
        pull?: boolean;
    };
    role_name?: string;
    temp_clone_token?: string;
    delete_branch_on_merge?: boolean;
    subscribers_count?: number;
    network_count?: number;
    code_of_conduct?: code_of_conduct;
    license?: {
        key?: string;
        name?: string;
        spdx_id?: string;
        url?: string;
        node_id?: string;
    } | null;
    forks?: number;
    open_issues?: number;
    watchers?: number;
    allow_forking?: boolean;
    web_commit_signoff_required?: boolean;
    security_and_analysis?: security_and_analysis;
    custom_properties?: Record<string, any>;
};

export type full_repository = {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    owner: simple_user;
    private: boolean;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    archive_url: string;
    assignees_url: string;
    blobs_url: string;
    branches_url: string;
    collaborators_url: string;
    comments_url: string;
    commits_url: string;
    compare_url: string;
    contents_url: string;
    contributors_url: string;
    deployments_url: string;
    downloads_url: string;
    events_url: string;
    forks_url: string;
    git_commits_url: string;
    git_refs_url: string;
    git_tags_url: string;
    git_url: string;
    issue_comment_url: string;
    issue_events_url: string;
    issues_url: string;
    keys_url: string;
    labels_url: string;
    languages_url: string;
    merges_url: string;
    milestones_url: string;
    notifications_url: string;
    pulls_url: string;
    releases_url: string;
    ssh_url: string;
    stargazers_url: string;
    statuses_url: string;
    subscribers_url: string;
    subscription_url: string;
    tags_url: string;
    teams_url: string;
    trees_url: string;
    clone_url: string;
    mirror_url: string | null;
    hooks_url: string;
    svn_url: string;
    homepage: string | null;
    language: string | null;
    forks_count: number;
    stargazers_count: number;
    watchers_count: number;
    size: number;
    default_branch: string;
    open_issues_count: number;
    is_template?: boolean;
    topics?: Array<string>;
    has_issues: boolean;
    has_projects: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_downloads?: boolean;
    has_discussions: boolean;
    archived: boolean;
    disabled: boolean;
    visibility?: string;
    pushed_at: string;
    created_at: string;
    updated_at: string;
    permissions?: {
        admin: boolean;
        maintain?: boolean;
        push: boolean;
        triage?: boolean;
        pull: boolean;
    };
    allow_rebase_merge?: boolean;
    template_repository?: nullable_repository;
    temp_clone_token?: string | null;
    allow_squash_merge?: boolean;
    allow_auto_merge?: boolean;
    delete_branch_on_merge?: boolean;
    allow_merge_commit?: boolean;
    allow_update_branch?: boolean;
    use_squash_pr_title_as_default?: boolean;
    squash_merge_commit_title?: full_repository.squash_merge_commit_title;
    squash_merge_commit_message?: full_repository.squash_merge_commit_message;
    merge_commit_title?: full_repository.merge_commit_title;
    merge_commit_message?: full_repository.merge_commit_message;
    allow_forking?: boolean;
    web_commit_signoff_required?: boolean;
    subscribers_count: number;
    network_count: number;
    license: nullable_license_simple;
    organization?: nullable_simple_user;
    parent?: repository;
    source?: repository;
    forks: number;
    master_branch?: string;
    open_issues: number;
    watchers: number;
    anonymous_access_enabled?: boolean;
    code_of_conduct?: code_of_conduct_simple;
    security_and_analysis?: security_and_analysis;
    custom_properties?: Record<string, any>;
};
export namespace full_repository {
    export enum squash_merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        COMMIT_OR_PR_TITLE = 'COMMIT_OR_PR_TITLE',
    }
    export enum squash_merge_commit_message {
        PR_BODY = 'PR_BODY',
        COMMIT_MESSAGES = 'COMMIT_MESSAGES',
        BLANK = 'BLANK',
    }
    export enum merge_commit_title {
        PR_TITLE = 'PR_TITLE',
        MERGE_MESSAGE = 'MERGE_MESSAGE',
    }
    export enum merge_commit_message {
        PR_BODY = 'PR_BODY',
        PR_TITLE = 'PR_TITLE',
        BLANK = 'BLANK',
    }
}

export type issue = {
    id: number;
    node_id: string;
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    number: number;
    state: string;
    state_reason?: issue.state_reason | null;
    title: string;
    body?: string | null;
    user: nullable_simple_user;
    labels: Array<(string | {
        id?: number;
        node_id?: string;
        url?: string;
        name?: string;
        description?: string | null;
        color?: string | null;
        default?: boolean;
    })>;
    assignee: nullable_simple_user;
    assignees?: Array<simple_user> | null;
    milestone: nullable_milestone;
    locked: boolean;
    active_lock_reason?: string | null;
    comments: number;
    pull_request?: {
        merged_at?: string | null;
        diff_url: string | null;
        html_url: string | null;
        patch_url: string | null;
        url: string | null;
    };
    closed_at: string | null;
    created_at: string;
    updated_at: string;
    draft?: boolean;
    closed_by?: nullable_simple_user;
    body_html?: string;
    body_text?: string;
    timeline_url?: string;
    type?: issue_type;
    repository?: repository;
    performed_via_github_app?: nullable_integration;
    author_association?: author_association;
    reactions?: reaction_rollup;
    sub_issues_summary?: sub_issues_summary;
    parent_issue_url?: string | null;
    issue_dependencies_summary?: issue_dependencies_summary;
    issue_field_values?: Array<issue_field_value>;
};
export namespace issue {
    export enum state_reason {
        COMPLETED = 'completed',
        REOPENED = 'reopened',
        NOT_PLANNED = 'not_planned',
        DUPLICATE = 'duplicate',
    }
}

export type issue_comment = {
    id: number;
    node_id: string;
    url: string;
    body?: string;
    body_text?: string;
    body_html?: string;
    html_url: string;
    user: nullable_simple_user;
    created_at: string;
    updated_at: string;
    issue_url: string;
    author_association?: author_association;
    performed_via_github_app?: nullable_integration;
    reactions?: reaction_rollup;
};

export type pull_request_review = {
    id: number;
    node_id: string;
    user: nullable_simple_user;
    body: string;
    state: string;
    html_url: string;
    pull_request_url: string;
    _links: {
        html: {
            href: string;
        };
        pull_request: {
            href: string;
        };
    };
    submitted_at?: string;
    commit_id: string | null;
    body_html?: string;
    body_text?: string;
    author_association: author_association;
};

export type release_asset = {
    url: string;
    browser_download_url: string;
    id: number;
    node_id: string;
    name: string;
    label: string | null;
    state: release_asset.state;
    content_type: string;
    size: number;
    digest: string | null;
    download_count: number;
    created_at: string;
    updated_at: string;
    uploader: nullable_simple_user;
};
export namespace release_asset {
    export enum state {
        UPLOADED = 'uploaded',
        OPEN = 'open',
    }
}

export type release = {
    url: string;
    html_url: string;
    assets_url: string;
    upload_url: string;
    tarball_url: string | null;
    zipball_url: string | null;
    id: number;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string | null;
    body?: string | null;
    draft: boolean;
    prerelease: boolean;
    immutable?: boolean;
    created_at: string;
    published_at: string | null;
    updated_at?: string | null;
    author: simple_user;
    assets: Array<release_asset>;
    body_html?: string;
    body_text?: string;
    mentions_count?: number;
    discussion_url?: string;
    reactions?: reaction_rollup;
};

export type branch_protection = {
    url?: string;
    enabled?: boolean;
    required_status_checks?: protected_branch_required_status_check;
    enforce_admins?: protected_branch_admin_enforced;
    required_pull_request_reviews?: protected_branch_pull_request_review;
    restrictions?: branch_restriction_policy;
    required_linear_history?: {
        enabled?: boolean;
    };
    allow_force_pushes?: {
        enabled?: boolean;
    };
    allow_deletions?: {
        enabled?: boolean;
    };
    block_creations?: {
        enabled?: boolean;
    };
    required_conversation_resolution?: {
        enabled?: boolean;
    };
    name?: string;
    protection_url?: string;
    required_signatures?: {
        url: string;
        enabled: boolean;
    };
    lock_branch?: {
        enabled?: boolean;
    };
    allow_fork_syncing?: {
        enabled?: boolean;
    };
};

export type workflow_run = {
    id: number;
    name?: string | null;
    node_id: string;
    check_suite_id?: number;
    check_suite_node_id?: string;
    head_branch: string | null;
    head_sha: string;
    path: string;
    run_number: number;
    run_attempt?: number;
    referenced_workflows?: Array<referenced_workflow> | null;
    event: string;
    status: string | null;
    conclusion: string | null;
    workflow_id: number;
    url: string;
    html_url: string;
    pull_requests: Array<pull_request_minimal> | null;
    created_at: string;
    updated_at: string;
    actor?: simple_user;
    triggering_actor?: simple_user;
    run_started_at?: string;
    jobs_url: string;
    logs_url: string;
    check_suite_url: string;
    artifacts_url: string;
    cancel_url: string;
    rerun_url: string;
    previous_attempt_url?: string | null;
    workflow_url: string;
    head_commit: nullable_simple_commit;
    repository: minimal_repository;
    head_repository: minimal_repository;
    head_repository_id?: number;
    display_title: string;
};

export type pull_request = {
    url: string;
    id: number;
    node_id: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    issue_url: string;
    commits_url: string;
    review_comments_url: string;
    review_comment_url: string;
    comments_url: string;
    statuses_url: string;
    number: number;
    state: pull_request.state;
    locked: boolean;
    title: string;
    user: simple_user;
    body: string | null;
    labels: Array<{
        id: number;
        node_id: string;
        url: string;
        name: string;
        description: string | null;
        color: string;
        default: boolean;
    }>;
    milestone: nullable_milestone;
    active_lock_reason?: string | null;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    merged_at: string | null;
    merge_commit_sha: string | null;
    assignee: nullable_simple_user;
    assignees?: Array<simple_user> | null;
    requested_reviewers?: Array<simple_user> | null;
    requested_teams?: Array<team_simple> | null;
    head: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: simple_user;
    };
    base: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: simple_user;
    };
    _links: {
        comments: link;
        commits: link;
        statuses: link;
        html: link;
        issue: link;
        review_comments: link;
        review_comment: link;
        self: link;
    };
    author_association: author_association;
    auto_merge: auto_merge;
    draft?: boolean;
    merged: boolean;
    mergeable: boolean | null;
    rebaseable?: boolean | null;
    mergeable_state: string;
    merged_by: nullable_simple_user;
    comments: number;
    review_comments: number;
    maintainer_can_modify: boolean;
    commits: number;
    additions: number;
    deletions: number;
    changed_files: number;
};
export namespace pull_request {
    export enum state {
        OPEN = 'open',
        CLOSED = 'closed',
    }
}

export type pull_request_simple = {
    url: string;
    id: number;
    node_id: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    issue_url: string;
    commits_url: string;
    review_comments_url: string;
    review_comment_url: string;
    comments_url: string;
    statuses_url: string;
    number: number;
    state: string;
    locked: boolean;
    title: string;
    user: nullable_simple_user;
    body: string | null;
    labels: Array<{
        id: number;
        node_id: string;
        url: string;
        name: string;
        description: string;
        color: string;
        default: boolean;
    }>;
    milestone: nullable_milestone;
    active_lock_reason?: string | null;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    merged_at: string | null;
    merge_commit_sha: string | null;
    assignee: nullable_simple_user;
    assignees?: Array<simple_user> | null;
    requested_reviewers?: Array<simple_user> | null;
    requested_teams?: Array<team> | null;
    head: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: nullable_simple_user;
    };
    base: {
        label: string;
        ref: string;
        repo: repository;
        sha: string;
        user: nullable_simple_user;
    };
    _links: {
        comments: link;
        commits: link;
        statuses: link;
        html: link;
        issue: link;
        review_comments: link;
        review_comment: link;
        self: link;
    };
    author_association: author_association;
    auto_merge: auto_merge;
    draft?: boolean;
};

export type short_branch = {
    name: string;
    commit: {
        sha: string;
        url: string;
    };
    protected: boolean;
    protection?: branch_protection;
    protection_url?: string;
};

