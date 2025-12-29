import {
    ActionsService,
    IssuesService,
    MetaService,
    OrgsService,
    PullsService,
    ReposService,
    UsersService,
} from './services';

export const Github = {
    Workflows: {
        list: ActionsService.actionsListRepoWorkflows,
        get: ActionsService.actionsGetWorkflow,
        listRuns: ActionsService.actionsListWorkflowRunsForRepo,
        getUsage: ActionsService.actionsGetWorkflowUsage,
        enable: ActionsService.actionsEnableWorkflow,
        disable: ActionsService.actionsDisableWorkflow,
        dispatch: ActionsService.actionsCreateWorkflowDispatch,
    },

    Issues: {
        list: IssuesService.issuesListForRepo,
        listForUser: IssuesService.issuesListForAuthenticatedUser,
        get: IssuesService.issuesGet,
        create: IssuesService.issuesCreate,
        update: IssuesService.issuesUpdate,
        lock: IssuesService.issuesLock,
        createComment: IssuesService.issuesCreateComment,
    },

    Meta: {
        root: MetaService.metaRoot,
        get: MetaService.metaGet,
        getOctocat: MetaService.metaGetOctocat,
        getZen: MetaService.metaGetZen,
    },

    Orgs: {
        get: OrgsService.orgsGet,
        listPublicMembers: OrgsService.orgsListPublicMembers,
    },

    PullRequests: {
        list: PullsService.pullsList,
        get: PullsService.pullsGet,
        listReviews: PullsService.pullsListReviews,
        getReview: PullsService.pullsGetReview,
        createReview: PullsService.pullsCreateReview,
        updateReview: PullsService.pullsUpdateReview,
    },

    Repos: {
        get: ReposService.reposGet,
        listForOrg: ReposService.reposListForOrg,
        listForUser: ReposService.reposListForUser,
        listForAuthenticatedUser: ReposService.reposListForAuthenticatedUser,
        listBranches: ReposService.reposListBranches,
        listCommits: ReposService.reposListCommits,
        getContent: ReposService.reposGetContent,
        getReadme: ReposService.reposGetReadme,
        createOrUpdateFile: ReposService.reposCreateOrUpdateFileContents,
        deleteFile: ReposService.reposDeleteFile,
        getCodeFrequencyStats: ReposService.reposGetCodeFrequencyStats,
        getTopPaths: ReposService.reposGetTopPaths,
        getTopReferrers: ReposService.reposGetTopReferrers,
    },

    Releases: {
        list: ReposService.reposListReleases,
        get: ReposService.reposGetRelease,
        getByTag: ReposService.reposGetReleaseByTag,
        create: ReposService.reposCreateRelease,
        update: ReposService.reposUpdateRelease,
        delete: ReposService.reposDeleteRelease,
    },

    Users: {
        getAuthenticated: UsersService.usersGetAuthenticated,
        list: UsersService.usersList,
        getByUsername: UsersService.usersGetByUsername,
        listFollowers: UsersService.usersListFollowersForUser,
        listFollowing: UsersService.usersListFollowingForUser,
    },
};

