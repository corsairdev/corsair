// Generated with endpoints/operation-types.ts from Gitea's swagger:
// one entry per operation in gitea-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { giteaSchemaEntry } from './openapi-schema';
import { createGiteaOperation as op } from './operations';

export const giteaEndpointsNested = {
	actions: {
		artifacts: {
			delete: op('actions.artifacts.delete'),
			download: op('actions.artifacts.download'),
			get: op('actions.artifacts.get'),
			list: op('actions.artifacts.list'),
		},
		jobs: {
			downloadLogs: op('actions.jobs.downloadLogs'),
			get: op('actions.jobs.get'),
			list: op('actions.jobs.list'),
		},
		runners: {
			createRegistrationToken: op('actions.runners.createRegistrationToken'),
			delete: op('actions.runners.delete'),
			get: op('actions.runners.get'),
			list: op('actions.runners.list'),
			update: op('actions.runners.update'),
		},
		runs: {
			approve: op('actions.runs.approve'),
			artifacts: {
				list: op('actions.runs.artifacts.list'),
			},
			attempts: {
				get: op('actions.runs.attempts.get'),
				jobs: {
					list: op('actions.runs.attempts.jobs.list'),
				},
			},
			cancel: op('actions.runs.cancel'),
			delete: op('actions.runs.delete'),
			downloadLogs: op('actions.runs.downloadLogs'),
			forceCancel: op('actions.runs.forceCancel'),
			get: op('actions.runs.get'),
			jobs: {
				list: op('actions.runs.jobs.list'),
				rerun: op('actions.runs.jobs.rerun'),
			},
			list: op('actions.runs.list'),
			rerun: op('actions.runs.rerun'),
			rerunFailed: op('actions.runs.rerunFailed'),
		},
		secrets: {
			delete: op('actions.secrets.delete'),
			list: op('actions.secrets.list'),
			set: op('actions.secrets.set'),
		},
		tasks: {
			list: op('actions.tasks.list'),
		},
		variables: {
			create: op('actions.variables.create'),
			delete: op('actions.variables.delete'),
			get: op('actions.variables.get'),
			list: op('actions.variables.list'),
			update: op('actions.variables.update'),
		},
		workflows: {
			disable: op('actions.workflows.disable'),
			dispatch: op('actions.workflows.dispatch'),
			enable: op('actions.workflows.enable'),
			get: op('actions.workflows.get'),
			list: op('actions.workflows.list'),
			runs: {
				list: op('actions.workflows.runs.list'),
			},
		},
	},
	admin: {
		actions: {
			jobs: {
				list: op('admin.actions.jobs.list'),
			},
			runners: {
				createRegistrationToken: op(
					'admin.actions.runners.createRegistrationToken',
				),
				delete: op('admin.actions.runners.delete'),
				get: op('admin.actions.runners.get'),
				list: op('admin.actions.runners.list'),
				update: op('admin.actions.runners.update'),
			},
			runs: {
				list: op('admin.actions.runs.list'),
			},
		},
		cron: {
			list: op('admin.cron.list'),
			run: op('admin.cron.run'),
		},
		emails: {
			list: op('admin.emails.list'),
			search: op('admin.emails.search'),
		},
		hooks: {
			create: op('admin.hooks.create'),
			delete: op('admin.hooks.delete'),
			get: op('admin.hooks.get'),
			list: op('admin.hooks.list'),
			update: op('admin.hooks.update'),
		},
		orgs: {
			list: op('admin.orgs.list'),
		},
		packages: {
			list: op('admin.packages.list'),
		},
		unadopted: {
			adopt: op('admin.unadopted.adopt'),
			delete: op('admin.unadopted.delete'),
			list: op('admin.unadopted.list'),
		},
		users: {
			badges: {
				add: op('admin.users.badges.add'),
				delete: op('admin.users.badges.delete'),
				list: op('admin.users.badges.list'),
			},
			create: op('admin.users.create'),
			delete: op('admin.users.delete'),
			keys: {
				create: op('admin.users.keys.create'),
				delete: op('admin.users.keys.delete'),
			},
			list: op('admin.users.list'),
			orgs: {
				create: op('admin.users.orgs.create'),
			},
			rename: op('admin.users.rename'),
			repos: {
				create: op('admin.users.repos.create'),
			},
			update: op('admin.users.update'),
		},
	},
	branchProtections: {
		create: op('branchProtections.create'),
		delete: op('branchProtections.delete'),
		get: op('branchProtections.get'),
		list: op('branchProtections.list'),
		setPriority: op('branchProtections.setPriority'),
		update: op('branchProtections.update'),
	},
	branches: {
		create: op('branches.create'),
		delete: op('branches.delete'),
		get: op('branches.get'),
		list: op('branches.list'),
		rename: op('branches.rename'),
		setCommit: op('branches.setCommit'),
	},
	comments: {
		attachments: {
			create: op('comments.attachments.create'),
			delete: op('comments.attachments.delete'),
			get: op('comments.attachments.get'),
			list: op('comments.attachments.list'),
			update: op('comments.attachments.update'),
		},
		create: op('comments.create'),
		delete: op('comments.delete'),
		get: op('comments.get'),
		list: op('comments.list'),
		listForRepo: op('comments.listForRepo'),
		reactions: {
			add: op('comments.reactions.add'),
			list: op('comments.reactions.list'),
			remove: op('comments.reactions.remove'),
		},
		update: op('comments.update'),
	},
	commits: {
		compare: op('commits.compare'),
		downloadDiff: op('commits.downloadDiff'),
		get: op('commits.get'),
		list: op('commits.list'),
		pullRequest: op('commits.pullRequest'),
		statuses: {
			combined: op('commits.statuses.combined'),
			create: op('commits.statuses.create'),
			list: op('commits.statuses.list'),
			listByRef: op('commits.statuses.listByRef'),
		},
	},
	contents: {
		applyPatch: op('contents.applyPatch'),
		changeFiles: op('contents.changeFiles'),
		create: op('contents.create'),
		delete: op('contents.delete'),
		editorConfig: op('contents.editorConfig'),
		get: op('contents.get'),
		getExt: op('contents.getExt'),
		getMany: op('contents.getMany'),
		getManyByPost: op('contents.getManyByPost'),
		list: op('contents.list'),
		media: op('contents.media'),
		raw: op('contents.raw'),
		update: op('contents.update'),
	},
	git: {
		blobs: {
			get: op('git.blobs.get'),
		},
		notes: {
			get: op('git.notes.get'),
		},
		refs: {
			list: op('git.refs.list'),
			listMatching: op('git.refs.listMatching'),
		},
		tags: {
			get: op('git.tags.get'),
		},
		trees: {
			get: op('git.trees.get'),
		},
	},
	issues: {
		assignees: {
			add: op('issues.assignees.add'),
			check: op('issues.assignees.check'),
			remove: op('issues.assignees.remove'),
		},
		attachments: {
			create: op('issues.attachments.create'),
			delete: op('issues.attachments.delete'),
			get: op('issues.attachments.get'),
			list: op('issues.attachments.list'),
			update: op('issues.attachments.update'),
		},
		blocks: {
			add: op('issues.blocks.add'),
			list: op('issues.blocks.list'),
			remove: op('issues.blocks.remove'),
		},
		config: {
			get: op('issues.config.get'),
			validate: op('issues.config.validate'),
		},
		create: op('issues.create'),
		delete: op('issues.delete'),
		dependencies: {
			add: op('issues.dependencies.add'),
			list: op('issues.dependencies.list'),
			remove: op('issues.dependencies.remove'),
		},
		get: op('issues.get'),
		labels: {
			add: op('issues.labels.add'),
			clear: op('issues.labels.clear'),
			list: op('issues.labels.list'),
			remove: op('issues.labels.remove'),
			replace: op('issues.labels.replace'),
		},
		list: op('issues.list'),
		listPinned: op('issues.listPinned'),
		lock: op('issues.lock'),
		movePin: op('issues.movePin'),
		pin: op('issues.pin'),
		reactions: {
			add: op('issues.reactions.add'),
			list: op('issues.reactions.list'),
			remove: op('issues.reactions.remove'),
		},
		search: op('issues.search'),
		setDeadline: op('issues.setDeadline'),
		stopwatch: {
			delete: op('issues.stopwatch.delete'),
			start: op('issues.stopwatch.start'),
			stop: op('issues.stopwatch.stop'),
		},
		subscriptions: {
			add: op('issues.subscriptions.add'),
			check: op('issues.subscriptions.check'),
			list: op('issues.subscriptions.list'),
			remove: op('issues.subscriptions.remove'),
		},
		templates: {
			list: op('issues.templates.list'),
		},
		timeline: op('issues.timeline'),
		times: {
			add: op('issues.times.add'),
			delete: op('issues.times.delete'),
			list: op('issues.times.list'),
			reset: op('issues.times.reset'),
		},
		unlock: op('issues.unlock'),
		unpin: op('issues.unpin'),
		update: op('issues.update'),
	},
	labels: {
		create: op('labels.create'),
		delete: op('labels.delete'),
		get: op('labels.get'),
		list: op('labels.list'),
		update: op('labels.update'),
	},
	milestones: {
		create: op('milestones.create'),
		delete: op('milestones.delete'),
		get: op('milestones.get'),
		list: op('milestones.list'),
		update: op('milestones.update'),
	},
	misc: {
		gitignoreTemplates: {
			get: op('misc.gitignoreTemplates.get'),
			list: op('misc.gitignoreTemplates.list'),
		},
		labelTemplates: {
			get: op('misc.labelTemplates.get'),
			list: op('misc.labelTemplates.list'),
		},
		licenseTemplates: {
			get: op('misc.licenseTemplates.get'),
			list: op('misc.licenseTemplates.list'),
		},
		markdown: {
			render: op('misc.markdown.render'),
			renderRaw: op('misc.markdown.renderRaw'),
		},
		markup: {
			render: op('misc.markup.render'),
		},
		signingKey: {
			gpg: op('misc.signingKey.gpg'),
			ssh: op('misc.signingKey.ssh'),
		},
		topics: {
			search: op('misc.topics.search'),
		},
		version: op('misc.version'),
	},
	notifications: {
		countNew: op('notifications.countNew'),
		list: op('notifications.list'),
		listForRepo: op('notifications.listForRepo'),
		markRead: op('notifications.markRead'),
		markReadForRepo: op('notifications.markReadForRepo'),
		threads: {
			get: op('notifications.threads.get'),
			markRead: op('notifications.threads.markRead'),
		},
	},
	orgs: {
		actions: {
			jobs: {
				list: op('orgs.actions.jobs.list'),
			},
			runners: {
				createRegistrationToken: op(
					'orgs.actions.runners.createRegistrationToken',
				),
				delete: op('orgs.actions.runners.delete'),
				get: op('orgs.actions.runners.get'),
				list: op('orgs.actions.runners.list'),
				update: op('orgs.actions.runners.update'),
			},
			runs: {
				list: op('orgs.actions.runs.list'),
			},
			secrets: {
				delete: op('orgs.actions.secrets.delete'),
				list: op('orgs.actions.secrets.list'),
				set: op('orgs.actions.secrets.set'),
			},
			variables: {
				create: op('orgs.actions.variables.create'),
				delete: op('orgs.actions.variables.delete'),
				get: op('orgs.actions.variables.get'),
				list: op('orgs.actions.variables.list'),
				update: op('orgs.actions.variables.update'),
			},
		},
		activityFeeds: {
			list: op('orgs.activityFeeds.list'),
		},
		avatar: {
			delete: op('orgs.avatar.delete'),
			update: op('orgs.avatar.update'),
		},
		blocks: {
			add: op('orgs.blocks.add'),
			check: op('orgs.blocks.check'),
			list: op('orgs.blocks.list'),
			remove: op('orgs.blocks.remove'),
		},
		create: op('orgs.create'),
		delete: op('orgs.delete'),
		get: op('orgs.get'),
		hooks: {
			create: op('orgs.hooks.create'),
			delete: op('orgs.hooks.delete'),
			get: op('orgs.hooks.get'),
			list: op('orgs.hooks.list'),
			update: op('orgs.hooks.update'),
		},
		labels: {
			create: op('orgs.labels.create'),
			delete: op('orgs.labels.delete'),
			get: op('orgs.labels.get'),
			list: op('orgs.labels.list'),
			update: op('orgs.labels.update'),
		},
		list: op('orgs.list'),
		members: {
			check: op('orgs.members.check'),
			list: op('orgs.members.list'),
			remove: op('orgs.members.remove'),
		},
		projects: {
			columns: {
				create: op('orgs.projects.columns.create'),
				delete: op('orgs.projects.columns.delete'),
				get: op('orgs.projects.columns.get'),
				issues: {
					add: op('orgs.projects.columns.issues.add'),
					list: op('orgs.projects.columns.issues.list'),
					remove: op('orgs.projects.columns.issues.remove'),
				},
				list: op('orgs.projects.columns.list'),
				move: op('orgs.projects.columns.move'),
				setDefault: op('orgs.projects.columns.setDefault'),
				update: op('orgs.projects.columns.update'),
			},
			create: op('orgs.projects.create'),
			delete: op('orgs.projects.delete'),
			get: op('orgs.projects.get'),
			issues: {
				move: op('orgs.projects.issues.move'),
			},
			list: op('orgs.projects.list'),
			update: op('orgs.projects.update'),
		},
		publicMembers: {
			check: op('orgs.publicMembers.check'),
			conceal: op('orgs.publicMembers.conceal'),
			list: op('orgs.publicMembers.list'),
			publicize: op('orgs.publicMembers.publicize'),
		},
		rename: op('orgs.rename'),
		repos: {
			create: op('orgs.repos.create'),
			deleteAll: op('orgs.repos.deleteAll'),
			list: op('orgs.repos.list'),
		},
		teams: {
			create: op('orgs.teams.create'),
			list: op('orgs.teams.list'),
			search: op('orgs.teams.search'),
		},
		update: op('orgs.update'),
	},
	packages: {
		delete: op('packages.delete'),
		link: op('packages.link'),
		list: op('packages.list'),
		unlink: op('packages.unlink'),
		versions: {
			delete: op('packages.versions.delete'),
			files: {
				list: op('packages.versions.files.list'),
			},
			get: op('packages.versions.get'),
			getLatest: op('packages.versions.getLatest'),
			list: op('packages.versions.list'),
		},
	},
	projects: {
		columns: {
			create: op('projects.columns.create'),
			delete: op('projects.columns.delete'),
			get: op('projects.columns.get'),
			issues: {
				add: op('projects.columns.issues.add'),
				list: op('projects.columns.issues.list'),
				remove: op('projects.columns.issues.remove'),
			},
			list: op('projects.columns.list'),
			move: op('projects.columns.move'),
			setDefault: op('projects.columns.setDefault'),
			update: op('projects.columns.update'),
		},
		create: op('projects.create'),
		delete: op('projects.delete'),
		get: op('projects.get'),
		issues: {
			move: op('projects.issues.move'),
		},
		list: op('projects.list'),
		update: op('projects.update'),
	},
	pulls: {
		cancelAutoMerge: op('pulls.cancelAutoMerge'),
		commits: op('pulls.commits'),
		create: op('pulls.create'),
		downloadDiff: op('pulls.downloadDiff'),
		files: op('pulls.files'),
		get: op('pulls.get'),
		getByBaseHead: op('pulls.getByBaseHead'),
		isMerged: op('pulls.isMerged'),
		list: op('pulls.list'),
		listPinned: op('pulls.listPinned'),
		merge: op('pulls.merge'),
		requestedReviewers: {
			add: op('pulls.requestedReviewers.add'),
			remove: op('pulls.requestedReviewers.remove'),
		},
		reviewComments: {
			reply: op('pulls.reviewComments.reply'),
			resolve: op('pulls.reviewComments.resolve'),
			unresolve: op('pulls.reviewComments.unresolve'),
		},
		reviews: {
			comments: op('pulls.reviews.comments'),
			create: op('pulls.reviews.create'),
			delete: op('pulls.reviews.delete'),
			dismiss: op('pulls.reviews.dismiss'),
			get: op('pulls.reviews.get'),
			list: op('pulls.reviews.list'),
			submit: op('pulls.reviews.submit'),
			undismiss: op('pulls.reviews.undismiss'),
		},
		update: op('pulls.update'),
		updateBranch: op('pulls.updateBranch'),
	},
	releases: {
		assets: {
			create: op('releases.assets.create'),
			delete: op('releases.assets.delete'),
			get: op('releases.assets.get'),
			list: op('releases.assets.list'),
			update: op('releases.assets.update'),
		},
		create: op('releases.create'),
		delete: op('releases.delete'),
		deleteByTag: op('releases.deleteByTag'),
		get: op('releases.get'),
		getByTag: op('releases.getByTag'),
		getLatest: op('releases.getLatest'),
		list: op('releases.list'),
		update: op('releases.update'),
	},
	repos: {
		acceptTransfer: op('repos.acceptTransfer'),
		activityFeeds: {
			list: op('repos.activityFeeds.list'),
		},
		assignees: {
			check: op('repos.assignees.check'),
			list: op('repos.assignees.list'),
		},
		avatar: {
			delete: op('repos.avatar.delete'),
			update: op('repos.avatar.update'),
		},
		collaborators: {
			add: op('repos.collaborators.add'),
			check: op('repos.collaborators.check'),
			list: op('repos.collaborators.list'),
			permission: op('repos.collaborators.permission'),
			remove: op('repos.collaborators.remove'),
		},
		create: op('repos.create'),
		delete: op('repos.delete'),
		deployKeys: {
			create: op('repos.deployKeys.create'),
			createToken: op('repos.deployKeys.createToken'),
			delete: op('repos.deployKeys.delete'),
			get: op('repos.deployKeys.get'),
			list: op('repos.deployKeys.list'),
		},
		downloadArchive: op('repos.downloadArchive'),
		forks: {
			create: op('repos.forks.create'),
			list: op('repos.forks.list'),
		},
		generateFromTemplate: op('repos.generateFromTemplate'),
		get: op('repos.get'),
		getById: op('repos.getById'),
		gitHooks: {
			delete: op('repos.gitHooks.delete'),
			get: op('repos.gitHooks.get'),
			list: op('repos.gitHooks.list'),
			update: op('repos.gitHooks.update'),
		},
		languages: op('repos.languages'),
		licenses: op('repos.licenses'),
		list: op('repos.list'),
		mergeUpstream: op('repos.mergeUpstream'),
		migrate: op('repos.migrate'),
		mirrorSync: op('repos.mirrorSync'),
		newPinAllowed: op('repos.newPinAllowed'),
		pushMirrors: {
			add: op('repos.pushMirrors.add'),
			delete: op('repos.pushMirrors.delete'),
			get: op('repos.pushMirrors.get'),
			list: op('repos.pushMirrors.list'),
			sync: op('repos.pushMirrors.sync'),
		},
		rejectTransfer: op('repos.rejectTransfer'),
		reviewers: op('repos.reviewers'),
		search: op('repos.search'),
		signingKey: {
			gpg: op('repos.signingKey.gpg'),
			ssh: op('repos.signingKey.ssh'),
		},
		stargazers: op('repos.stargazers'),
		subscribers: op('repos.subscribers'),
		subscription: {
			get: op('repos.subscription.get'),
			unwatch: op('repos.subscription.unwatch'),
			watch: op('repos.subscription.watch'),
		},
		teams: {
			add: op('repos.teams.add'),
			check: op('repos.teams.check'),
			list: op('repos.teams.list'),
			remove: op('repos.teams.remove'),
		},
		topics: {
			add: op('repos.topics.add'),
			list: op('repos.topics.list'),
			remove: op('repos.topics.remove'),
			replace: op('repos.topics.replace'),
		},
		trackedTimes: op('repos.trackedTimes'),
		transfer: op('repos.transfer'),
		update: op('repos.update'),
	},
	settings: {
		api: op('settings.api'),
		attachment: op('settings.attachment'),
		repository: op('settings.repository'),
		ui: op('settings.ui'),
	},
	tagProtections: {
		create: op('tagProtections.create'),
		delete: op('tagProtections.delete'),
		get: op('tagProtections.get'),
		list: op('tagProtections.list'),
		update: op('tagProtections.update'),
	},
	tags: {
		create: op('tags.create'),
		delete: op('tags.delete'),
		get: op('tags.get'),
		list: op('tags.list'),
	},
	teams: {
		activityFeeds: {
			list: op('teams.activityFeeds.list'),
		},
		delete: op('teams.delete'),
		get: op('teams.get'),
		members: {
			add: op('teams.members.add'),
			get: op('teams.members.get'),
			list: op('teams.members.list'),
			remove: op('teams.members.remove'),
		},
		repos: {
			add: op('teams.repos.add'),
			get: op('teams.repos.get'),
			list: op('teams.repos.list'),
			remove: op('teams.repos.remove'),
		},
		update: op('teams.update'),
	},
	user: {
		actions: {
			jobs: {
				list: op('user.actions.jobs.list'),
			},
			runners: {
				createRegistrationToken: op(
					'user.actions.runners.createRegistrationToken',
				),
				delete: op('user.actions.runners.delete'),
				get: op('user.actions.runners.get'),
				list: op('user.actions.runners.list'),
				update: op('user.actions.runners.update'),
			},
			runs: {
				list: op('user.actions.runs.list'),
			},
			secrets: {
				delete: op('user.actions.secrets.delete'),
				set: op('user.actions.secrets.set'),
			},
			variables: {
				create: op('user.actions.variables.create'),
				delete: op('user.actions.variables.delete'),
				get: op('user.actions.variables.get'),
				list: op('user.actions.variables.list'),
				update: op('user.actions.variables.update'),
			},
		},
		avatar: {
			delete: op('user.avatar.delete'),
			update: op('user.avatar.update'),
		},
		blocks: {
			add: op('user.blocks.add'),
			check: op('user.blocks.check'),
			list: op('user.blocks.list'),
			remove: op('user.blocks.remove'),
		},
		emails: {
			add: op('user.emails.add'),
			list: op('user.emails.list'),
			remove: op('user.emails.remove'),
		},
		followers: {
			list: op('user.followers.list'),
		},
		following: {
			check: op('user.following.check'),
			follow: op('user.following.follow'),
			list: op('user.following.list'),
			unfollow: op('user.following.unfollow'),
		},
		gpgKeys: {
			create: op('user.gpgKeys.create'),
			delete: op('user.gpgKeys.delete'),
			get: op('user.gpgKeys.get'),
			list: op('user.gpgKeys.list'),
			verificationToken: op('user.gpgKeys.verificationToken'),
			verify: op('user.gpgKeys.verify'),
		},
		hooks: {
			create: op('user.hooks.create'),
			delete: op('user.hooks.delete'),
			get: op('user.hooks.get'),
			list: op('user.hooks.list'),
			update: op('user.hooks.update'),
		},
		keys: {
			create: op('user.keys.create'),
			delete: op('user.keys.delete'),
			get: op('user.keys.get'),
			list: op('user.keys.list'),
		},
		me: op('user.me'),
		oauth2Apps: {
			create: op('user.oauth2Apps.create'),
			delete: op('user.oauth2Apps.delete'),
			get: op('user.oauth2Apps.get'),
			list: op('user.oauth2Apps.list'),
			update: op('user.oauth2Apps.update'),
		},
		orgs: {
			list: op('user.orgs.list'),
		},
		projects: {
			columns: {
				create: op('user.projects.columns.create'),
				delete: op('user.projects.columns.delete'),
				get: op('user.projects.columns.get'),
				issues: {
					add: op('user.projects.columns.issues.add'),
					list: op('user.projects.columns.issues.list'),
					remove: op('user.projects.columns.issues.remove'),
				},
				list: op('user.projects.columns.list'),
				move: op('user.projects.columns.move'),
				setDefault: op('user.projects.columns.setDefault'),
				update: op('user.projects.columns.update'),
			},
			create: op('user.projects.create'),
			delete: op('user.projects.delete'),
			get: op('user.projects.get'),
			issues: {
				move: op('user.projects.issues.move'),
			},
			list: op('user.projects.list'),
			update: op('user.projects.update'),
		},
		settings: {
			get: op('user.settings.get'),
			update: op('user.settings.update'),
		},
		starred: {
			check: op('user.starred.check'),
			list: op('user.starred.list'),
			star: op('user.starred.star'),
			unstar: op('user.starred.unstar'),
		},
		stopwatches: {
			list: op('user.stopwatches.list'),
		},
		subscriptions: {
			list: op('user.subscriptions.list'),
		},
		teams: {
			list: op('user.teams.list'),
		},
		token: {
			delete: op('user.token.delete'),
			get: op('user.token.get'),
		},
		trackedTimes: {
			list: op('user.trackedTimes.list'),
		},
	},
	users: {
		activityFeeds: {
			list: op('users.activityFeeds.list'),
		},
		followers: {
			list: op('users.followers.list'),
		},
		following: {
			check: op('users.following.check'),
			list: op('users.following.list'),
		},
		get: op('users.get'),
		gpgKeys: {
			list: op('users.gpgKeys.list'),
		},
		heatmap: op('users.heatmap'),
		keys: {
			list: op('users.keys.list'),
		},
		orgs: {
			list: op('users.orgs.list'),
			permissions: op('users.orgs.permissions'),
		},
		projects: {
			list: op('users.projects.list'),
		},
		repos: {
			list: op('users.repos.list'),
		},
		search: op('users.search'),
		starred: {
			list: op('users.starred.list'),
		},
		subscriptions: {
			list: op('users.subscriptions.list'),
		},
	},
	webhooks: {
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		get: op('webhooks.get'),
		list: op('webhooks.list'),
		test: op('webhooks.test'),
		update: op('webhooks.update'),
	},
	wiki: {
		create: op('wiki.create'),
		delete: op('wiki.delete'),
		get: op('wiki.get'),
		list: op('wiki.list'),
		revisions: op('wiki.revisions'),
		update: op('wiki.update'),
	},
} as const;

export const giteaEndpointSchemas = {
	'actions.artifacts.delete': giteaSchemaEntry('actions.artifacts.delete'),
	'actions.artifacts.download': giteaSchemaEntry('actions.artifacts.download'),
	'actions.artifacts.get': giteaSchemaEntry('actions.artifacts.get'),
	'actions.artifacts.list': giteaSchemaEntry('actions.artifacts.list'),
	'actions.jobs.downloadLogs': giteaSchemaEntry('actions.jobs.downloadLogs'),
	'actions.jobs.get': giteaSchemaEntry('actions.jobs.get'),
	'actions.jobs.list': giteaSchemaEntry('actions.jobs.list'),
	'actions.runners.createRegistrationToken': giteaSchemaEntry(
		'actions.runners.createRegistrationToken',
	),
	'actions.runners.delete': giteaSchemaEntry('actions.runners.delete'),
	'actions.runners.get': giteaSchemaEntry('actions.runners.get'),
	'actions.runners.list': giteaSchemaEntry('actions.runners.list'),
	'actions.runners.update': giteaSchemaEntry('actions.runners.update'),
	'actions.runs.approve': giteaSchemaEntry('actions.runs.approve'),
	'actions.runs.artifacts.list': giteaSchemaEntry(
		'actions.runs.artifacts.list',
	),
	'actions.runs.attempts.get': giteaSchemaEntry('actions.runs.attempts.get'),
	'actions.runs.attempts.jobs.list': giteaSchemaEntry(
		'actions.runs.attempts.jobs.list',
	),
	'actions.runs.cancel': giteaSchemaEntry('actions.runs.cancel'),
	'actions.runs.delete': giteaSchemaEntry('actions.runs.delete'),
	'actions.runs.downloadLogs': giteaSchemaEntry('actions.runs.downloadLogs'),
	'actions.runs.forceCancel': giteaSchemaEntry('actions.runs.forceCancel'),
	'actions.runs.get': giteaSchemaEntry('actions.runs.get'),
	'actions.runs.jobs.list': giteaSchemaEntry('actions.runs.jobs.list'),
	'actions.runs.jobs.rerun': giteaSchemaEntry('actions.runs.jobs.rerun'),
	'actions.runs.list': giteaSchemaEntry('actions.runs.list'),
	'actions.runs.rerun': giteaSchemaEntry('actions.runs.rerun'),
	'actions.runs.rerunFailed': giteaSchemaEntry('actions.runs.rerunFailed'),
	'actions.secrets.delete': giteaSchemaEntry('actions.secrets.delete'),
	'actions.secrets.list': giteaSchemaEntry('actions.secrets.list'),
	'actions.secrets.set': giteaSchemaEntry('actions.secrets.set'),
	'actions.tasks.list': giteaSchemaEntry('actions.tasks.list'),
	'actions.variables.create': giteaSchemaEntry('actions.variables.create'),
	'actions.variables.delete': giteaSchemaEntry('actions.variables.delete'),
	'actions.variables.get': giteaSchemaEntry('actions.variables.get'),
	'actions.variables.list': giteaSchemaEntry('actions.variables.list'),
	'actions.variables.update': giteaSchemaEntry('actions.variables.update'),
	'actions.workflows.disable': giteaSchemaEntry('actions.workflows.disable'),
	'actions.workflows.dispatch': giteaSchemaEntry('actions.workflows.dispatch'),
	'actions.workflows.enable': giteaSchemaEntry('actions.workflows.enable'),
	'actions.workflows.get': giteaSchemaEntry('actions.workflows.get'),
	'actions.workflows.list': giteaSchemaEntry('actions.workflows.list'),
	'actions.workflows.runs.list': giteaSchemaEntry(
		'actions.workflows.runs.list',
	),
	'admin.actions.jobs.list': giteaSchemaEntry('admin.actions.jobs.list'),
	'admin.actions.runners.createRegistrationToken': giteaSchemaEntry(
		'admin.actions.runners.createRegistrationToken',
	),
	'admin.actions.runners.delete': giteaSchemaEntry(
		'admin.actions.runners.delete',
	),
	'admin.actions.runners.get': giteaSchemaEntry('admin.actions.runners.get'),
	'admin.actions.runners.list': giteaSchemaEntry('admin.actions.runners.list'),
	'admin.actions.runners.update': giteaSchemaEntry(
		'admin.actions.runners.update',
	),
	'admin.actions.runs.list': giteaSchemaEntry('admin.actions.runs.list'),
	'admin.cron.list': giteaSchemaEntry('admin.cron.list'),
	'admin.cron.run': giteaSchemaEntry('admin.cron.run'),
	'admin.emails.list': giteaSchemaEntry('admin.emails.list'),
	'admin.emails.search': giteaSchemaEntry('admin.emails.search'),
	'admin.hooks.create': giteaSchemaEntry('admin.hooks.create'),
	'admin.hooks.delete': giteaSchemaEntry('admin.hooks.delete'),
	'admin.hooks.get': giteaSchemaEntry('admin.hooks.get'),
	'admin.hooks.list': giteaSchemaEntry('admin.hooks.list'),
	'admin.hooks.update': giteaSchemaEntry('admin.hooks.update'),
	'admin.orgs.list': giteaSchemaEntry('admin.orgs.list'),
	'admin.packages.list': giteaSchemaEntry('admin.packages.list'),
	'admin.unadopted.adopt': giteaSchemaEntry('admin.unadopted.adopt'),
	'admin.unadopted.delete': giteaSchemaEntry('admin.unadopted.delete'),
	'admin.unadopted.list': giteaSchemaEntry('admin.unadopted.list'),
	'admin.users.badges.add': giteaSchemaEntry('admin.users.badges.add'),
	'admin.users.badges.delete': giteaSchemaEntry('admin.users.badges.delete'),
	'admin.users.badges.list': giteaSchemaEntry('admin.users.badges.list'),
	'admin.users.create': giteaSchemaEntry('admin.users.create'),
	'admin.users.delete': giteaSchemaEntry('admin.users.delete'),
	'admin.users.keys.create': giteaSchemaEntry('admin.users.keys.create'),
	'admin.users.keys.delete': giteaSchemaEntry('admin.users.keys.delete'),
	'admin.users.list': giteaSchemaEntry('admin.users.list'),
	'admin.users.orgs.create': giteaSchemaEntry('admin.users.orgs.create'),
	'admin.users.rename': giteaSchemaEntry('admin.users.rename'),
	'admin.users.repos.create': giteaSchemaEntry('admin.users.repos.create'),
	'admin.users.update': giteaSchemaEntry('admin.users.update'),
	'branchProtections.create': giteaSchemaEntry('branchProtections.create'),
	'branchProtections.delete': giteaSchemaEntry('branchProtections.delete'),
	'branchProtections.get': giteaSchemaEntry('branchProtections.get'),
	'branchProtections.list': giteaSchemaEntry('branchProtections.list'),
	'branchProtections.setPriority': giteaSchemaEntry(
		'branchProtections.setPriority',
	),
	'branchProtections.update': giteaSchemaEntry('branchProtections.update'),
	'branches.create': giteaSchemaEntry('branches.create'),
	'branches.delete': giteaSchemaEntry('branches.delete'),
	'branches.get': giteaSchemaEntry('branches.get'),
	'branches.list': giteaSchemaEntry('branches.list'),
	'branches.rename': giteaSchemaEntry('branches.rename'),
	'branches.setCommit': giteaSchemaEntry('branches.setCommit'),
	'comments.attachments.create': giteaSchemaEntry(
		'comments.attachments.create',
	),
	'comments.attachments.delete': giteaSchemaEntry(
		'comments.attachments.delete',
	),
	'comments.attachments.get': giteaSchemaEntry('comments.attachments.get'),
	'comments.attachments.list': giteaSchemaEntry('comments.attachments.list'),
	'comments.attachments.update': giteaSchemaEntry(
		'comments.attachments.update',
	),
	'comments.create': giteaSchemaEntry('comments.create'),
	'comments.delete': giteaSchemaEntry('comments.delete'),
	'comments.get': giteaSchemaEntry('comments.get'),
	'comments.list': giteaSchemaEntry('comments.list'),
	'comments.listForRepo': giteaSchemaEntry('comments.listForRepo'),
	'comments.reactions.add': giteaSchemaEntry('comments.reactions.add'),
	'comments.reactions.list': giteaSchemaEntry('comments.reactions.list'),
	'comments.reactions.remove': giteaSchemaEntry('comments.reactions.remove'),
	'comments.update': giteaSchemaEntry('comments.update'),
	'commits.compare': giteaSchemaEntry('commits.compare'),
	'commits.downloadDiff': giteaSchemaEntry('commits.downloadDiff'),
	'commits.get': giteaSchemaEntry('commits.get'),
	'commits.list': giteaSchemaEntry('commits.list'),
	'commits.pullRequest': giteaSchemaEntry('commits.pullRequest'),
	'commits.statuses.combined': giteaSchemaEntry('commits.statuses.combined'),
	'commits.statuses.create': giteaSchemaEntry('commits.statuses.create'),
	'commits.statuses.list': giteaSchemaEntry('commits.statuses.list'),
	'commits.statuses.listByRef': giteaSchemaEntry('commits.statuses.listByRef'),
	'contents.applyPatch': giteaSchemaEntry('contents.applyPatch'),
	'contents.changeFiles': giteaSchemaEntry('contents.changeFiles'),
	'contents.create': giteaSchemaEntry('contents.create'),
	'contents.delete': giteaSchemaEntry('contents.delete'),
	'contents.editorConfig': giteaSchemaEntry('contents.editorConfig'),
	'contents.get': giteaSchemaEntry('contents.get'),
	'contents.getExt': giteaSchemaEntry('contents.getExt'),
	'contents.getMany': giteaSchemaEntry('contents.getMany'),
	'contents.getManyByPost': giteaSchemaEntry('contents.getManyByPost'),
	'contents.list': giteaSchemaEntry('contents.list'),
	'contents.media': giteaSchemaEntry('contents.media'),
	'contents.raw': giteaSchemaEntry('contents.raw'),
	'contents.update': giteaSchemaEntry('contents.update'),
	'git.blobs.get': giteaSchemaEntry('git.blobs.get'),
	'git.notes.get': giteaSchemaEntry('git.notes.get'),
	'git.refs.list': giteaSchemaEntry('git.refs.list'),
	'git.refs.listMatching': giteaSchemaEntry('git.refs.listMatching'),
	'git.tags.get': giteaSchemaEntry('git.tags.get'),
	'git.trees.get': giteaSchemaEntry('git.trees.get'),
	'issues.assignees.add': giteaSchemaEntry('issues.assignees.add'),
	'issues.assignees.check': giteaSchemaEntry('issues.assignees.check'),
	'issues.assignees.remove': giteaSchemaEntry('issues.assignees.remove'),
	'issues.attachments.create': giteaSchemaEntry('issues.attachments.create'),
	'issues.attachments.delete': giteaSchemaEntry('issues.attachments.delete'),
	'issues.attachments.get': giteaSchemaEntry('issues.attachments.get'),
	'issues.attachments.list': giteaSchemaEntry('issues.attachments.list'),
	'issues.attachments.update': giteaSchemaEntry('issues.attachments.update'),
	'issues.blocks.add': giteaSchemaEntry('issues.blocks.add'),
	'issues.blocks.list': giteaSchemaEntry('issues.blocks.list'),
	'issues.blocks.remove': giteaSchemaEntry('issues.blocks.remove'),
	'issues.config.get': giteaSchemaEntry('issues.config.get'),
	'issues.config.validate': giteaSchemaEntry('issues.config.validate'),
	'issues.create': giteaSchemaEntry('issues.create'),
	'issues.delete': giteaSchemaEntry('issues.delete'),
	'issues.dependencies.add': giteaSchemaEntry('issues.dependencies.add'),
	'issues.dependencies.list': giteaSchemaEntry('issues.dependencies.list'),
	'issues.dependencies.remove': giteaSchemaEntry('issues.dependencies.remove'),
	'issues.get': giteaSchemaEntry('issues.get'),
	'issues.labels.add': giteaSchemaEntry('issues.labels.add'),
	'issues.labels.clear': giteaSchemaEntry('issues.labels.clear'),
	'issues.labels.list': giteaSchemaEntry('issues.labels.list'),
	'issues.labels.remove': giteaSchemaEntry('issues.labels.remove'),
	'issues.labels.replace': giteaSchemaEntry('issues.labels.replace'),
	'issues.list': giteaSchemaEntry('issues.list'),
	'issues.listPinned': giteaSchemaEntry('issues.listPinned'),
	'issues.lock': giteaSchemaEntry('issues.lock'),
	'issues.movePin': giteaSchemaEntry('issues.movePin'),
	'issues.pin': giteaSchemaEntry('issues.pin'),
	'issues.reactions.add': giteaSchemaEntry('issues.reactions.add'),
	'issues.reactions.list': giteaSchemaEntry('issues.reactions.list'),
	'issues.reactions.remove': giteaSchemaEntry('issues.reactions.remove'),
	'issues.search': giteaSchemaEntry('issues.search'),
	'issues.setDeadline': giteaSchemaEntry('issues.setDeadline'),
	'issues.stopwatch.delete': giteaSchemaEntry('issues.stopwatch.delete'),
	'issues.stopwatch.start': giteaSchemaEntry('issues.stopwatch.start'),
	'issues.stopwatch.stop': giteaSchemaEntry('issues.stopwatch.stop'),
	'issues.subscriptions.add': giteaSchemaEntry('issues.subscriptions.add'),
	'issues.subscriptions.check': giteaSchemaEntry('issues.subscriptions.check'),
	'issues.subscriptions.list': giteaSchemaEntry('issues.subscriptions.list'),
	'issues.subscriptions.remove': giteaSchemaEntry(
		'issues.subscriptions.remove',
	),
	'issues.templates.list': giteaSchemaEntry('issues.templates.list'),
	'issues.timeline': giteaSchemaEntry('issues.timeline'),
	'issues.times.add': giteaSchemaEntry('issues.times.add'),
	'issues.times.delete': giteaSchemaEntry('issues.times.delete'),
	'issues.times.list': giteaSchemaEntry('issues.times.list'),
	'issues.times.reset': giteaSchemaEntry('issues.times.reset'),
	'issues.unlock': giteaSchemaEntry('issues.unlock'),
	'issues.unpin': giteaSchemaEntry('issues.unpin'),
	'issues.update': giteaSchemaEntry('issues.update'),
	'labels.create': giteaSchemaEntry('labels.create'),
	'labels.delete': giteaSchemaEntry('labels.delete'),
	'labels.get': giteaSchemaEntry('labels.get'),
	'labels.list': giteaSchemaEntry('labels.list'),
	'labels.update': giteaSchemaEntry('labels.update'),
	'milestones.create': giteaSchemaEntry('milestones.create'),
	'milestones.delete': giteaSchemaEntry('milestones.delete'),
	'milestones.get': giteaSchemaEntry('milestones.get'),
	'milestones.list': giteaSchemaEntry('milestones.list'),
	'milestones.update': giteaSchemaEntry('milestones.update'),
	'misc.gitignoreTemplates.get': giteaSchemaEntry(
		'misc.gitignoreTemplates.get',
	),
	'misc.gitignoreTemplates.list': giteaSchemaEntry(
		'misc.gitignoreTemplates.list',
	),
	'misc.labelTemplates.get': giteaSchemaEntry('misc.labelTemplates.get'),
	'misc.labelTemplates.list': giteaSchemaEntry('misc.labelTemplates.list'),
	'misc.licenseTemplates.get': giteaSchemaEntry('misc.licenseTemplates.get'),
	'misc.licenseTemplates.list': giteaSchemaEntry('misc.licenseTemplates.list'),
	'misc.markdown.render': giteaSchemaEntry('misc.markdown.render'),
	'misc.markdown.renderRaw': giteaSchemaEntry('misc.markdown.renderRaw'),
	'misc.markup.render': giteaSchemaEntry('misc.markup.render'),
	'misc.signingKey.gpg': giteaSchemaEntry('misc.signingKey.gpg'),
	'misc.signingKey.ssh': giteaSchemaEntry('misc.signingKey.ssh'),
	'misc.topics.search': giteaSchemaEntry('misc.topics.search'),
	'misc.version': giteaSchemaEntry('misc.version'),
	'notifications.countNew': giteaSchemaEntry('notifications.countNew'),
	'notifications.list': giteaSchemaEntry('notifications.list'),
	'notifications.listForRepo': giteaSchemaEntry('notifications.listForRepo'),
	'notifications.markRead': giteaSchemaEntry('notifications.markRead'),
	'notifications.markReadForRepo': giteaSchemaEntry(
		'notifications.markReadForRepo',
	),
	'notifications.threads.get': giteaSchemaEntry('notifications.threads.get'),
	'notifications.threads.markRead': giteaSchemaEntry(
		'notifications.threads.markRead',
	),
	'orgs.actions.jobs.list': giteaSchemaEntry('orgs.actions.jobs.list'),
	'orgs.actions.runners.createRegistrationToken': giteaSchemaEntry(
		'orgs.actions.runners.createRegistrationToken',
	),
	'orgs.actions.runners.delete': giteaSchemaEntry(
		'orgs.actions.runners.delete',
	),
	'orgs.actions.runners.get': giteaSchemaEntry('orgs.actions.runners.get'),
	'orgs.actions.runners.list': giteaSchemaEntry('orgs.actions.runners.list'),
	'orgs.actions.runners.update': giteaSchemaEntry(
		'orgs.actions.runners.update',
	),
	'orgs.actions.runs.list': giteaSchemaEntry('orgs.actions.runs.list'),
	'orgs.actions.secrets.delete': giteaSchemaEntry(
		'orgs.actions.secrets.delete',
	),
	'orgs.actions.secrets.list': giteaSchemaEntry('orgs.actions.secrets.list'),
	'orgs.actions.secrets.set': giteaSchemaEntry('orgs.actions.secrets.set'),
	'orgs.actions.variables.create': giteaSchemaEntry(
		'orgs.actions.variables.create',
	),
	'orgs.actions.variables.delete': giteaSchemaEntry(
		'orgs.actions.variables.delete',
	),
	'orgs.actions.variables.get': giteaSchemaEntry('orgs.actions.variables.get'),
	'orgs.actions.variables.list': giteaSchemaEntry(
		'orgs.actions.variables.list',
	),
	'orgs.actions.variables.update': giteaSchemaEntry(
		'orgs.actions.variables.update',
	),
	'orgs.activityFeeds.list': giteaSchemaEntry('orgs.activityFeeds.list'),
	'orgs.avatar.delete': giteaSchemaEntry('orgs.avatar.delete'),
	'orgs.avatar.update': giteaSchemaEntry('orgs.avatar.update'),
	'orgs.blocks.add': giteaSchemaEntry('orgs.blocks.add'),
	'orgs.blocks.check': giteaSchemaEntry('orgs.blocks.check'),
	'orgs.blocks.list': giteaSchemaEntry('orgs.blocks.list'),
	'orgs.blocks.remove': giteaSchemaEntry('orgs.blocks.remove'),
	'orgs.create': giteaSchemaEntry('orgs.create'),
	'orgs.delete': giteaSchemaEntry('orgs.delete'),
	'orgs.get': giteaSchemaEntry('orgs.get'),
	'orgs.hooks.create': giteaSchemaEntry('orgs.hooks.create'),
	'orgs.hooks.delete': giteaSchemaEntry('orgs.hooks.delete'),
	'orgs.hooks.get': giteaSchemaEntry('orgs.hooks.get'),
	'orgs.hooks.list': giteaSchemaEntry('orgs.hooks.list'),
	'orgs.hooks.update': giteaSchemaEntry('orgs.hooks.update'),
	'orgs.labels.create': giteaSchemaEntry('orgs.labels.create'),
	'orgs.labels.delete': giteaSchemaEntry('orgs.labels.delete'),
	'orgs.labels.get': giteaSchemaEntry('orgs.labels.get'),
	'orgs.labels.list': giteaSchemaEntry('orgs.labels.list'),
	'orgs.labels.update': giteaSchemaEntry('orgs.labels.update'),
	'orgs.list': giteaSchemaEntry('orgs.list'),
	'orgs.members.check': giteaSchemaEntry('orgs.members.check'),
	'orgs.members.list': giteaSchemaEntry('orgs.members.list'),
	'orgs.members.remove': giteaSchemaEntry('orgs.members.remove'),
	'orgs.projects.columns.create': giteaSchemaEntry(
		'orgs.projects.columns.create',
	),
	'orgs.projects.columns.delete': giteaSchemaEntry(
		'orgs.projects.columns.delete',
	),
	'orgs.projects.columns.get': giteaSchemaEntry('orgs.projects.columns.get'),
	'orgs.projects.columns.issues.add': giteaSchemaEntry(
		'orgs.projects.columns.issues.add',
	),
	'orgs.projects.columns.issues.list': giteaSchemaEntry(
		'orgs.projects.columns.issues.list',
	),
	'orgs.projects.columns.issues.remove': giteaSchemaEntry(
		'orgs.projects.columns.issues.remove',
	),
	'orgs.projects.columns.list': giteaSchemaEntry('orgs.projects.columns.list'),
	'orgs.projects.columns.move': giteaSchemaEntry('orgs.projects.columns.move'),
	'orgs.projects.columns.setDefault': giteaSchemaEntry(
		'orgs.projects.columns.setDefault',
	),
	'orgs.projects.columns.update': giteaSchemaEntry(
		'orgs.projects.columns.update',
	),
	'orgs.projects.create': giteaSchemaEntry('orgs.projects.create'),
	'orgs.projects.delete': giteaSchemaEntry('orgs.projects.delete'),
	'orgs.projects.get': giteaSchemaEntry('orgs.projects.get'),
	'orgs.projects.issues.move': giteaSchemaEntry('orgs.projects.issues.move'),
	'orgs.projects.list': giteaSchemaEntry('orgs.projects.list'),
	'orgs.projects.update': giteaSchemaEntry('orgs.projects.update'),
	'orgs.publicMembers.check': giteaSchemaEntry('orgs.publicMembers.check'),
	'orgs.publicMembers.conceal': giteaSchemaEntry('orgs.publicMembers.conceal'),
	'orgs.publicMembers.list': giteaSchemaEntry('orgs.publicMembers.list'),
	'orgs.publicMembers.publicize': giteaSchemaEntry(
		'orgs.publicMembers.publicize',
	),
	'orgs.rename': giteaSchemaEntry('orgs.rename'),
	'orgs.repos.create': giteaSchemaEntry('orgs.repos.create'),
	'orgs.repos.deleteAll': giteaSchemaEntry('orgs.repos.deleteAll'),
	'orgs.repos.list': giteaSchemaEntry('orgs.repos.list'),
	'orgs.teams.create': giteaSchemaEntry('orgs.teams.create'),
	'orgs.teams.list': giteaSchemaEntry('orgs.teams.list'),
	'orgs.teams.search': giteaSchemaEntry('orgs.teams.search'),
	'orgs.update': giteaSchemaEntry('orgs.update'),
	'packages.delete': giteaSchemaEntry('packages.delete'),
	'packages.link': giteaSchemaEntry('packages.link'),
	'packages.list': giteaSchemaEntry('packages.list'),
	'packages.unlink': giteaSchemaEntry('packages.unlink'),
	'packages.versions.delete': giteaSchemaEntry('packages.versions.delete'),
	'packages.versions.files.list': giteaSchemaEntry(
		'packages.versions.files.list',
	),
	'packages.versions.get': giteaSchemaEntry('packages.versions.get'),
	'packages.versions.getLatest': giteaSchemaEntry(
		'packages.versions.getLatest',
	),
	'packages.versions.list': giteaSchemaEntry('packages.versions.list'),
	'projects.columns.create': giteaSchemaEntry('projects.columns.create'),
	'projects.columns.delete': giteaSchemaEntry('projects.columns.delete'),
	'projects.columns.get': giteaSchemaEntry('projects.columns.get'),
	'projects.columns.issues.add': giteaSchemaEntry(
		'projects.columns.issues.add',
	),
	'projects.columns.issues.list': giteaSchemaEntry(
		'projects.columns.issues.list',
	),
	'projects.columns.issues.remove': giteaSchemaEntry(
		'projects.columns.issues.remove',
	),
	'projects.columns.list': giteaSchemaEntry('projects.columns.list'),
	'projects.columns.move': giteaSchemaEntry('projects.columns.move'),
	'projects.columns.setDefault': giteaSchemaEntry(
		'projects.columns.setDefault',
	),
	'projects.columns.update': giteaSchemaEntry('projects.columns.update'),
	'projects.create': giteaSchemaEntry('projects.create'),
	'projects.delete': giteaSchemaEntry('projects.delete'),
	'projects.get': giteaSchemaEntry('projects.get'),
	'projects.issues.move': giteaSchemaEntry('projects.issues.move'),
	'projects.list': giteaSchemaEntry('projects.list'),
	'projects.update': giteaSchemaEntry('projects.update'),
	'pulls.cancelAutoMerge': giteaSchemaEntry('pulls.cancelAutoMerge'),
	'pulls.commits': giteaSchemaEntry('pulls.commits'),
	'pulls.create': giteaSchemaEntry('pulls.create'),
	'pulls.downloadDiff': giteaSchemaEntry('pulls.downloadDiff'),
	'pulls.files': giteaSchemaEntry('pulls.files'),
	'pulls.get': giteaSchemaEntry('pulls.get'),
	'pulls.getByBaseHead': giteaSchemaEntry('pulls.getByBaseHead'),
	'pulls.isMerged': giteaSchemaEntry('pulls.isMerged'),
	'pulls.list': giteaSchemaEntry('pulls.list'),
	'pulls.listPinned': giteaSchemaEntry('pulls.listPinned'),
	'pulls.merge': giteaSchemaEntry('pulls.merge'),
	'pulls.requestedReviewers.add': giteaSchemaEntry(
		'pulls.requestedReviewers.add',
	),
	'pulls.requestedReviewers.remove': giteaSchemaEntry(
		'pulls.requestedReviewers.remove',
	),
	'pulls.reviewComments.reply': giteaSchemaEntry('pulls.reviewComments.reply'),
	'pulls.reviewComments.resolve': giteaSchemaEntry(
		'pulls.reviewComments.resolve',
	),
	'pulls.reviewComments.unresolve': giteaSchemaEntry(
		'pulls.reviewComments.unresolve',
	),
	'pulls.reviews.comments': giteaSchemaEntry('pulls.reviews.comments'),
	'pulls.reviews.create': giteaSchemaEntry('pulls.reviews.create'),
	'pulls.reviews.delete': giteaSchemaEntry('pulls.reviews.delete'),
	'pulls.reviews.dismiss': giteaSchemaEntry('pulls.reviews.dismiss'),
	'pulls.reviews.get': giteaSchemaEntry('pulls.reviews.get'),
	'pulls.reviews.list': giteaSchemaEntry('pulls.reviews.list'),
	'pulls.reviews.submit': giteaSchemaEntry('pulls.reviews.submit'),
	'pulls.reviews.undismiss': giteaSchemaEntry('pulls.reviews.undismiss'),
	'pulls.update': giteaSchemaEntry('pulls.update'),
	'pulls.updateBranch': giteaSchemaEntry('pulls.updateBranch'),
	'releases.assets.create': giteaSchemaEntry('releases.assets.create'),
	'releases.assets.delete': giteaSchemaEntry('releases.assets.delete'),
	'releases.assets.get': giteaSchemaEntry('releases.assets.get'),
	'releases.assets.list': giteaSchemaEntry('releases.assets.list'),
	'releases.assets.update': giteaSchemaEntry('releases.assets.update'),
	'releases.create': giteaSchemaEntry('releases.create'),
	'releases.delete': giteaSchemaEntry('releases.delete'),
	'releases.deleteByTag': giteaSchemaEntry('releases.deleteByTag'),
	'releases.get': giteaSchemaEntry('releases.get'),
	'releases.getByTag': giteaSchemaEntry('releases.getByTag'),
	'releases.getLatest': giteaSchemaEntry('releases.getLatest'),
	'releases.list': giteaSchemaEntry('releases.list'),
	'releases.update': giteaSchemaEntry('releases.update'),
	'repos.acceptTransfer': giteaSchemaEntry('repos.acceptTransfer'),
	'repos.activityFeeds.list': giteaSchemaEntry('repos.activityFeeds.list'),
	'repos.assignees.check': giteaSchemaEntry('repos.assignees.check'),
	'repos.assignees.list': giteaSchemaEntry('repos.assignees.list'),
	'repos.avatar.delete': giteaSchemaEntry('repos.avatar.delete'),
	'repos.avatar.update': giteaSchemaEntry('repos.avatar.update'),
	'repos.collaborators.add': giteaSchemaEntry('repos.collaborators.add'),
	'repos.collaborators.check': giteaSchemaEntry('repos.collaborators.check'),
	'repos.collaborators.list': giteaSchemaEntry('repos.collaborators.list'),
	'repos.collaborators.permission': giteaSchemaEntry(
		'repos.collaborators.permission',
	),
	'repos.collaborators.remove': giteaSchemaEntry('repos.collaborators.remove'),
	'repos.create': giteaSchemaEntry('repos.create'),
	'repos.delete': giteaSchemaEntry('repos.delete'),
	'repos.deployKeys.create': giteaSchemaEntry('repos.deployKeys.create'),
	'repos.deployKeys.createToken': giteaSchemaEntry(
		'repos.deployKeys.createToken',
	),
	'repos.deployKeys.delete': giteaSchemaEntry('repos.deployKeys.delete'),
	'repos.deployKeys.get': giteaSchemaEntry('repos.deployKeys.get'),
	'repos.deployKeys.list': giteaSchemaEntry('repos.deployKeys.list'),
	'repos.downloadArchive': giteaSchemaEntry('repos.downloadArchive'),
	'repos.forks.create': giteaSchemaEntry('repos.forks.create'),
	'repos.forks.list': giteaSchemaEntry('repos.forks.list'),
	'repos.generateFromTemplate': giteaSchemaEntry('repos.generateFromTemplate'),
	'repos.get': giteaSchemaEntry('repos.get'),
	'repos.getById': giteaSchemaEntry('repos.getById'),
	'repos.gitHooks.delete': giteaSchemaEntry('repos.gitHooks.delete'),
	'repos.gitHooks.get': giteaSchemaEntry('repos.gitHooks.get'),
	'repos.gitHooks.list': giteaSchemaEntry('repos.gitHooks.list'),
	'repos.gitHooks.update': giteaSchemaEntry('repos.gitHooks.update'),
	'repos.languages': giteaSchemaEntry('repos.languages'),
	'repos.licenses': giteaSchemaEntry('repos.licenses'),
	'repos.list': giteaSchemaEntry('repos.list'),
	'repos.mergeUpstream': giteaSchemaEntry('repos.mergeUpstream'),
	'repos.migrate': giteaSchemaEntry('repos.migrate'),
	'repos.mirrorSync': giteaSchemaEntry('repos.mirrorSync'),
	'repos.newPinAllowed': giteaSchemaEntry('repos.newPinAllowed'),
	'repos.pushMirrors.add': giteaSchemaEntry('repos.pushMirrors.add'),
	'repos.pushMirrors.delete': giteaSchemaEntry('repos.pushMirrors.delete'),
	'repos.pushMirrors.get': giteaSchemaEntry('repos.pushMirrors.get'),
	'repos.pushMirrors.list': giteaSchemaEntry('repos.pushMirrors.list'),
	'repos.pushMirrors.sync': giteaSchemaEntry('repos.pushMirrors.sync'),
	'repos.rejectTransfer': giteaSchemaEntry('repos.rejectTransfer'),
	'repos.reviewers': giteaSchemaEntry('repos.reviewers'),
	'repos.search': giteaSchemaEntry('repos.search'),
	'repos.signingKey.gpg': giteaSchemaEntry('repos.signingKey.gpg'),
	'repos.signingKey.ssh': giteaSchemaEntry('repos.signingKey.ssh'),
	'repos.stargazers': giteaSchemaEntry('repos.stargazers'),
	'repos.subscribers': giteaSchemaEntry('repos.subscribers'),
	'repos.subscription.get': giteaSchemaEntry('repos.subscription.get'),
	'repos.subscription.unwatch': giteaSchemaEntry('repos.subscription.unwatch'),
	'repos.subscription.watch': giteaSchemaEntry('repos.subscription.watch'),
	'repos.teams.add': giteaSchemaEntry('repos.teams.add'),
	'repos.teams.check': giteaSchemaEntry('repos.teams.check'),
	'repos.teams.list': giteaSchemaEntry('repos.teams.list'),
	'repos.teams.remove': giteaSchemaEntry('repos.teams.remove'),
	'repos.topics.add': giteaSchemaEntry('repos.topics.add'),
	'repos.topics.list': giteaSchemaEntry('repos.topics.list'),
	'repos.topics.remove': giteaSchemaEntry('repos.topics.remove'),
	'repos.topics.replace': giteaSchemaEntry('repos.topics.replace'),
	'repos.trackedTimes': giteaSchemaEntry('repos.trackedTimes'),
	'repos.transfer': giteaSchemaEntry('repos.transfer'),
	'repos.update': giteaSchemaEntry('repos.update'),
	'settings.api': giteaSchemaEntry('settings.api'),
	'settings.attachment': giteaSchemaEntry('settings.attachment'),
	'settings.repository': giteaSchemaEntry('settings.repository'),
	'settings.ui': giteaSchemaEntry('settings.ui'),
	'tagProtections.create': giteaSchemaEntry('tagProtections.create'),
	'tagProtections.delete': giteaSchemaEntry('tagProtections.delete'),
	'tagProtections.get': giteaSchemaEntry('tagProtections.get'),
	'tagProtections.list': giteaSchemaEntry('tagProtections.list'),
	'tagProtections.update': giteaSchemaEntry('tagProtections.update'),
	'tags.create': giteaSchemaEntry('tags.create'),
	'tags.delete': giteaSchemaEntry('tags.delete'),
	'tags.get': giteaSchemaEntry('tags.get'),
	'tags.list': giteaSchemaEntry('tags.list'),
	'teams.activityFeeds.list': giteaSchemaEntry('teams.activityFeeds.list'),
	'teams.delete': giteaSchemaEntry('teams.delete'),
	'teams.get': giteaSchemaEntry('teams.get'),
	'teams.members.add': giteaSchemaEntry('teams.members.add'),
	'teams.members.get': giteaSchemaEntry('teams.members.get'),
	'teams.members.list': giteaSchemaEntry('teams.members.list'),
	'teams.members.remove': giteaSchemaEntry('teams.members.remove'),
	'teams.repos.add': giteaSchemaEntry('teams.repos.add'),
	'teams.repos.get': giteaSchemaEntry('teams.repos.get'),
	'teams.repos.list': giteaSchemaEntry('teams.repos.list'),
	'teams.repos.remove': giteaSchemaEntry('teams.repos.remove'),
	'teams.update': giteaSchemaEntry('teams.update'),
	'user.actions.jobs.list': giteaSchemaEntry('user.actions.jobs.list'),
	'user.actions.runners.createRegistrationToken': giteaSchemaEntry(
		'user.actions.runners.createRegistrationToken',
	),
	'user.actions.runners.delete': giteaSchemaEntry(
		'user.actions.runners.delete',
	),
	'user.actions.runners.get': giteaSchemaEntry('user.actions.runners.get'),
	'user.actions.runners.list': giteaSchemaEntry('user.actions.runners.list'),
	'user.actions.runners.update': giteaSchemaEntry(
		'user.actions.runners.update',
	),
	'user.actions.runs.list': giteaSchemaEntry('user.actions.runs.list'),
	'user.actions.secrets.delete': giteaSchemaEntry(
		'user.actions.secrets.delete',
	),
	'user.actions.secrets.set': giteaSchemaEntry('user.actions.secrets.set'),
	'user.actions.variables.create': giteaSchemaEntry(
		'user.actions.variables.create',
	),
	'user.actions.variables.delete': giteaSchemaEntry(
		'user.actions.variables.delete',
	),
	'user.actions.variables.get': giteaSchemaEntry('user.actions.variables.get'),
	'user.actions.variables.list': giteaSchemaEntry(
		'user.actions.variables.list',
	),
	'user.actions.variables.update': giteaSchemaEntry(
		'user.actions.variables.update',
	),
	'user.avatar.delete': giteaSchemaEntry('user.avatar.delete'),
	'user.avatar.update': giteaSchemaEntry('user.avatar.update'),
	'user.blocks.add': giteaSchemaEntry('user.blocks.add'),
	'user.blocks.check': giteaSchemaEntry('user.blocks.check'),
	'user.blocks.list': giteaSchemaEntry('user.blocks.list'),
	'user.blocks.remove': giteaSchemaEntry('user.blocks.remove'),
	'user.emails.add': giteaSchemaEntry('user.emails.add'),
	'user.emails.list': giteaSchemaEntry('user.emails.list'),
	'user.emails.remove': giteaSchemaEntry('user.emails.remove'),
	'user.followers.list': giteaSchemaEntry('user.followers.list'),
	'user.following.check': giteaSchemaEntry('user.following.check'),
	'user.following.follow': giteaSchemaEntry('user.following.follow'),
	'user.following.list': giteaSchemaEntry('user.following.list'),
	'user.following.unfollow': giteaSchemaEntry('user.following.unfollow'),
	'user.gpgKeys.create': giteaSchemaEntry('user.gpgKeys.create'),
	'user.gpgKeys.delete': giteaSchemaEntry('user.gpgKeys.delete'),
	'user.gpgKeys.get': giteaSchemaEntry('user.gpgKeys.get'),
	'user.gpgKeys.list': giteaSchemaEntry('user.gpgKeys.list'),
	'user.gpgKeys.verificationToken': giteaSchemaEntry(
		'user.gpgKeys.verificationToken',
	),
	'user.gpgKeys.verify': giteaSchemaEntry('user.gpgKeys.verify'),
	'user.hooks.create': giteaSchemaEntry('user.hooks.create'),
	'user.hooks.delete': giteaSchemaEntry('user.hooks.delete'),
	'user.hooks.get': giteaSchemaEntry('user.hooks.get'),
	'user.hooks.list': giteaSchemaEntry('user.hooks.list'),
	'user.hooks.update': giteaSchemaEntry('user.hooks.update'),
	'user.keys.create': giteaSchemaEntry('user.keys.create'),
	'user.keys.delete': giteaSchemaEntry('user.keys.delete'),
	'user.keys.get': giteaSchemaEntry('user.keys.get'),
	'user.keys.list': giteaSchemaEntry('user.keys.list'),
	'user.me': giteaSchemaEntry('user.me'),
	'user.oauth2Apps.create': giteaSchemaEntry('user.oauth2Apps.create'),
	'user.oauth2Apps.delete': giteaSchemaEntry('user.oauth2Apps.delete'),
	'user.oauth2Apps.get': giteaSchemaEntry('user.oauth2Apps.get'),
	'user.oauth2Apps.list': giteaSchemaEntry('user.oauth2Apps.list'),
	'user.oauth2Apps.update': giteaSchemaEntry('user.oauth2Apps.update'),
	'user.orgs.list': giteaSchemaEntry('user.orgs.list'),
	'user.projects.columns.create': giteaSchemaEntry(
		'user.projects.columns.create',
	),
	'user.projects.columns.delete': giteaSchemaEntry(
		'user.projects.columns.delete',
	),
	'user.projects.columns.get': giteaSchemaEntry('user.projects.columns.get'),
	'user.projects.columns.issues.add': giteaSchemaEntry(
		'user.projects.columns.issues.add',
	),
	'user.projects.columns.issues.list': giteaSchemaEntry(
		'user.projects.columns.issues.list',
	),
	'user.projects.columns.issues.remove': giteaSchemaEntry(
		'user.projects.columns.issues.remove',
	),
	'user.projects.columns.list': giteaSchemaEntry('user.projects.columns.list'),
	'user.projects.columns.move': giteaSchemaEntry('user.projects.columns.move'),
	'user.projects.columns.setDefault': giteaSchemaEntry(
		'user.projects.columns.setDefault',
	),
	'user.projects.columns.update': giteaSchemaEntry(
		'user.projects.columns.update',
	),
	'user.projects.create': giteaSchemaEntry('user.projects.create'),
	'user.projects.delete': giteaSchemaEntry('user.projects.delete'),
	'user.projects.get': giteaSchemaEntry('user.projects.get'),
	'user.projects.issues.move': giteaSchemaEntry('user.projects.issues.move'),
	'user.projects.list': giteaSchemaEntry('user.projects.list'),
	'user.projects.update': giteaSchemaEntry('user.projects.update'),
	'user.settings.get': giteaSchemaEntry('user.settings.get'),
	'user.settings.update': giteaSchemaEntry('user.settings.update'),
	'user.starred.check': giteaSchemaEntry('user.starred.check'),
	'user.starred.list': giteaSchemaEntry('user.starred.list'),
	'user.starred.star': giteaSchemaEntry('user.starred.star'),
	'user.starred.unstar': giteaSchemaEntry('user.starred.unstar'),
	'user.stopwatches.list': giteaSchemaEntry('user.stopwatches.list'),
	'user.subscriptions.list': giteaSchemaEntry('user.subscriptions.list'),
	'user.teams.list': giteaSchemaEntry('user.teams.list'),
	'user.token.delete': giteaSchemaEntry('user.token.delete'),
	'user.token.get': giteaSchemaEntry('user.token.get'),
	'user.trackedTimes.list': giteaSchemaEntry('user.trackedTimes.list'),
	'users.activityFeeds.list': giteaSchemaEntry('users.activityFeeds.list'),
	'users.followers.list': giteaSchemaEntry('users.followers.list'),
	'users.following.check': giteaSchemaEntry('users.following.check'),
	'users.following.list': giteaSchemaEntry('users.following.list'),
	'users.get': giteaSchemaEntry('users.get'),
	'users.gpgKeys.list': giteaSchemaEntry('users.gpgKeys.list'),
	'users.heatmap': giteaSchemaEntry('users.heatmap'),
	'users.keys.list': giteaSchemaEntry('users.keys.list'),
	'users.orgs.list': giteaSchemaEntry('users.orgs.list'),
	'users.orgs.permissions': giteaSchemaEntry('users.orgs.permissions'),
	'users.projects.list': giteaSchemaEntry('users.projects.list'),
	'users.repos.list': giteaSchemaEntry('users.repos.list'),
	'users.search': giteaSchemaEntry('users.search'),
	'users.starred.list': giteaSchemaEntry('users.starred.list'),
	'users.subscriptions.list': giteaSchemaEntry('users.subscriptions.list'),
	'webhooks.create': giteaSchemaEntry('webhooks.create'),
	'webhooks.delete': giteaSchemaEntry('webhooks.delete'),
	'webhooks.get': giteaSchemaEntry('webhooks.get'),
	'webhooks.list': giteaSchemaEntry('webhooks.list'),
	'webhooks.test': giteaSchemaEntry('webhooks.test'),
	'webhooks.update': giteaSchemaEntry('webhooks.update'),
	'wiki.create': giteaSchemaEntry('wiki.create'),
	'wiki.delete': giteaSchemaEntry('wiki.delete'),
	'wiki.get': giteaSchemaEntry('wiki.get'),
	'wiki.list': giteaSchemaEntry('wiki.list'),
	'wiki.revisions': giteaSchemaEntry('wiki.revisions'),
	'wiki.update': giteaSchemaEntry('wiki.update'),
} satisfies RequiredPluginEndpointSchemas<typeof giteaEndpointsNested>;

export const giteaEndpointMeta = {
	'actions.artifacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a specific artifact for a workflow run',
	},
	'actions.artifacts.download': {
		riskLevel: 'read',
		description:
			'Downloads a specific artifact for a workflow run redirects to blob url (returned as a file)',
	},
	'actions.artifacts.get': {
		riskLevel: 'read',
		description: 'Gets a specific artifact for a workflow run',
	},
	'actions.artifacts.list': {
		riskLevel: 'read',
		description: 'Lists all artifacts for a repository',
	},
	'actions.jobs.downloadLogs': {
		riskLevel: 'read',
		description:
			'Downloads the job logs for a workflow run (returned as a file)',
	},
	'actions.jobs.get': {
		riskLevel: 'read',
		description: 'Gets a specific workflow job for a workflow run',
	},
	'actions.jobs.list': {
		riskLevel: 'read',
		description: 'Lists all jobs for a repository',
	},
	'actions.runners.createRegistrationToken': {
		riskLevel: 'write',
		description: "Get a repository's actions runner registration token",
	},
	'actions.runners.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a repo-level runner',
	},
	'actions.runners.get': {
		riskLevel: 'read',
		description: 'Get a repo-level runner',
	},
	'actions.runners.list': {
		riskLevel: 'read',
		description: 'Get repo-level runners',
	},
	'actions.runners.update': {
		riskLevel: 'write',
		description: 'Update a repo-level runner',
	},
	'actions.runs.approve': {
		riskLevel: 'write',
		description: 'Approve a workflow run that requires approval',
	},
	'actions.runs.artifacts.list': {
		riskLevel: 'read',
		description: 'Lists all artifacts for a repository run',
	},
	'actions.runs.attempts.get': {
		riskLevel: 'read',
		description: 'Gets a specific workflow run attempt',
	},
	'actions.runs.attempts.jobs.list': {
		riskLevel: 'read',
		description: 'Lists all jobs for a workflow run attempt',
	},
	'actions.runs.cancel': {
		riskLevel: 'write',
		description: 'Cancel a workflow run and its jobs',
	},
	'actions.runs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a workflow run',
	},
	'actions.runs.downloadLogs': {
		riskLevel: 'read',
		description: 'Download workflow run logs as archive (returned as a file)',
	},
	'actions.runs.forceCancel': {
		riskLevel: 'write',
		description: 'Force-cancel a workflow run',
	},
	'actions.runs.get': {
		riskLevel: 'read',
		description: 'Gets a specific workflow run',
	},
	'actions.runs.jobs.list': {
		riskLevel: 'read',
		description: 'Lists all jobs for a workflow run',
	},
	'actions.runs.jobs.rerun': {
		riskLevel: 'write',
		description: 'Reruns a specific workflow job in a run',
	},
	'actions.runs.list': {
		riskLevel: 'read',
		description: 'Lists all runs for a repository run',
	},
	'actions.runs.rerun': {
		riskLevel: 'write',
		description: 'Reruns an entire workflow run',
	},
	'actions.runs.rerunFailed': {
		riskLevel: 'write',
		description: 'Reruns all failed jobs in a workflow run',
	},
	'actions.secrets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a secret in a repository',
	},
	'actions.secrets.list': {
		riskLevel: 'read',
		description: "List a repo's actions secrets, one page at a time",
	},
	'actions.secrets.set': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create or Update a secret value in a repository',
	},
	'actions.tasks.list': {
		riskLevel: 'read',
		description: "List a repository's action tasks",
	},
	'actions.variables.create': {
		riskLevel: 'write',
		description: 'Create a repo-level variable',
	},
	'actions.variables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a repo-level variable',
	},
	'actions.variables.get': {
		riskLevel: 'read',
		description: 'Get a repo-level variable',
	},
	'actions.variables.list': {
		riskLevel: 'read',
		description: 'Get repo-level variables list, one page at a time',
	},
	'actions.variables.update': {
		riskLevel: 'write',
		description: 'Update a repo-level variable',
	},
	'actions.workflows.disable': {
		riskLevel: 'write',
		description: 'Disable a workflow',
	},
	'actions.workflows.dispatch': {
		riskLevel: 'write',
		description: 'Create a workflow dispatch event',
	},
	'actions.workflows.enable': {
		riskLevel: 'write',
		description: 'Enable a workflow',
	},
	'actions.workflows.get': {
		riskLevel: 'read',
		description: 'Get a workflow',
	},
	'actions.workflows.list': {
		riskLevel: 'read',
		description: 'List repository workflows',
	},
	'actions.workflows.runs.list': {
		riskLevel: 'read',
		description: 'List runs for a workflow',
	},
	'admin.actions.jobs.list': {
		riskLevel: 'read',
		description: 'Lists all jobs (site admins only)',
	},
	'admin.actions.runners.createRegistrationToken': {
		riskLevel: 'destructive',
		description:
			'Get a global actions runner registration token (site admins only)',
	},
	'admin.actions.runners.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a global runner (site admins only)',
	},
	'admin.actions.runners.get': {
		riskLevel: 'read',
		description: 'Get a global runner (site admins only)',
	},
	'admin.actions.runners.list': {
		riskLevel: 'read',
		description: 'Get all runners (site admins only)',
	},
	'admin.actions.runners.update': {
		riskLevel: 'destructive',
		description: 'Update a global runner (site admins only)',
	},
	'admin.actions.runs.list': {
		riskLevel: 'read',
		description: 'Lists all runs (site admins only)',
	},
	'admin.cron.list': {
		riskLevel: 'read',
		description: 'List cron tasks, one page at a time (site admins only)',
	},
	'admin.cron.run': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Run one of the instance cron tasks now (site admins only)',
	},
	'admin.emails.list': {
		riskLevel: 'read',
		description: 'List all emails, one page at a time (site admins only)',
	},
	'admin.emails.search': {
		riskLevel: 'read',
		description: 'Search all emails, one page at a time (site admins only)',
	},
	'admin.hooks.create': {
		riskLevel: 'destructive',
		description: 'Create a hook (site admins only)',
	},
	'admin.hooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a hook (site admins only)',
	},
	'admin.hooks.get': {
		riskLevel: 'read',
		description: 'Get a hook (site admins only)',
	},
	'admin.hooks.list': {
		riskLevel: 'read',
		description:
			"List system's webhooks, one page at a time (site admins only)",
	},
	'admin.hooks.update': {
		riskLevel: 'destructive',
		description: 'Update a hook (site admins only)',
	},
	'admin.orgs.list': {
		riskLevel: 'read',
		description:
			'List all organizations, one page at a time (site admins only)',
	},
	'admin.packages.list': {
		riskLevel: 'read',
		description: 'List all packages, one page at a time (site admins only)',
	},
	'admin.unadopted.adopt': {
		riskLevel: 'destructive',
		description: 'Adopt unadopted files as a repository (site admins only)',
	},
	'admin.unadopted.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete unadopted files (site admins only)',
	},
	'admin.unadopted.list': {
		riskLevel: 'read',
		description:
			'List unadopted repositories, one page at a time (site admins only)',
	},
	'admin.users.badges.add': {
		riskLevel: 'destructive',
		description: 'Add a badge to a user (site admins only)',
	},
	'admin.users.badges.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a badge from a user (site admins only)',
	},
	'admin.users.badges.list': {
		riskLevel: 'read',
		description: "List a user's badges (site admins only)",
	},
	'admin.users.create': {
		riskLevel: 'destructive',
		description: 'Create a user (site admins only)',
	},
	'admin.users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a user (site admins only)',
	},
	'admin.users.keys.create': {
		riskLevel: 'destructive',
		description: 'Add a public key on behalf of a user (site admins only)',
	},
	'admin.users.keys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Delete a user's public key (site admins only)",
	},
	'admin.users.list': {
		riskLevel: 'read',
		description:
			'Search users according filter conditions, one page at a time (site admins only)',
	},
	'admin.users.orgs.create': {
		riskLevel: 'destructive',
		description: 'Create an organization (site admins only)',
	},
	'admin.users.rename': {
		riskLevel: 'destructive',
		description: 'Rename a user (site admins only)',
	},
	'admin.users.repos.create': {
		riskLevel: 'destructive',
		description: 'Create a repository on behalf of a user (site admins only)',
	},
	'admin.users.update': {
		riskLevel: 'destructive',
		description: 'Edit an existing user (site admins only)',
	},
	'branchProtections.create': {
		riskLevel: 'write',
		description: 'Create a branch protections for a repository',
	},
	'branchProtections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a specific branch protection for the repository',
	},
	'branchProtections.get': {
		riskLevel: 'read',
		description: 'Get a specific branch protection for the repository',
	},
	'branchProtections.list': {
		riskLevel: 'read',
		description: 'List branch protections for a repository',
	},
	'branchProtections.setPriority': {
		riskLevel: 'write',
		description: 'Update the priorities of branch protections for a repository',
	},
	'branchProtections.update': {
		riskLevel: 'write',
		description:
			'Edit a branch protections for a repository. Only fields that are set will be changed',
	},
	'branches.create': {
		riskLevel: 'write',
		description: 'Create a branch',
	},
	'branches.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a specific branch from a repository',
	},
	'branches.get': {
		riskLevel: 'read',
		description:
			'Retrieve a specific branch from a repository, including its effective branch protection',
	},
	'branches.list': {
		riskLevel: 'read',
		description:
			"List a repository's branches with their latest commit and protection status, one page at a time",
	},
	'branches.rename': {
		riskLevel: 'write',
		description: 'Rename a branch',
	},
	'branches.setCommit': {
		riskLevel: 'destructive',
		description:
			"Point a branch at another commit; when the new commit is not a descendant this rewrites the branch's history like a force-push",
	},
	'comments.attachments.create': {
		riskLevel: 'write',
		description: 'Create a comment attachment',
	},
	'comments.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a comment attachment',
	},
	'comments.attachments.get': {
		riskLevel: 'read',
		description: 'Get a comment attachment',
	},
	'comments.attachments.list': {
		riskLevel: 'read',
		description: "List comment's attachments",
	},
	'comments.attachments.update': {
		riskLevel: 'write',
		description: 'Edit a comment attachment',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Add a markdown comment to an issue or pull request',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a comment',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Get a comment',
	},
	'comments.list': {
		riskLevel: 'read',
		description:
			'List every comment on an issue or pull request, oldest first, optionally within an updated-at window (this route takes no paging)',
	},
	'comments.listForRepo': {
		riskLevel: 'read',
		description: 'List all comments in a repository, one page at a time',
	},
	'comments.reactions.add': {
		riskLevel: 'write',
		description: 'Add a reaction to a comment of an issue',
	},
	'comments.reactions.list': {
		riskLevel: 'read',
		description: 'Get a list of reactions from a comment of an issue',
	},
	'comments.reactions.remove': {
		riskLevel: 'destructive',
		description: 'Remove a reaction from a comment of an issue',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Edit a comment',
	},
	'commits.compare': {
		riskLevel: 'read',
		description: 'Get commit comparison information',
	},
	'commits.downloadDiff': {
		riskLevel: 'read',
		description: "Get a commit's diff or patch (returned as text)",
	},
	'commits.get': {
		riskLevel: 'read',
		description:
			'Get a single commit from a repository, it has a GitHub-compatible alias "/repos/{owner}/{repo}/commits/{ref}"',
	},
	'commits.list': {
		riskLevel: 'read',
		description:
			"List a repository's commits, newest first, optionally from a ref, path or time window, one page at a time; a repository with no commits answers 409",
	},
	'commits.pullRequest': {
		riskLevel: 'read',
		description: 'Get the merged pull request of the commit',
	},
	'commits.statuses.combined': {
		riskLevel: 'read',
		description:
			"Get a commit's combined status, by branch/tag/commit reference",
	},
	'commits.statuses.create': {
		riskLevel: 'write',
		description: 'Create a commit status',
	},
	'commits.statuses.list': {
		riskLevel: 'read',
		description: "Get a commit's statuses, one page at a time",
	},
	'commits.statuses.listByRef': {
		riskLevel: 'read',
		description:
			"Get a commit's statuses, by branch/tag/commit reference, one page at a time",
	},
	'contents.applyPatch': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Apply a unified diff to the repository as a new commit on a branch',
	},
	'contents.changeFiles': {
		riskLevel: 'write',
		description: 'Modify multiple files in a repository',
	},
	'contents.create': {
		riskLevel: 'write',
		description: 'Create a file in a repository',
	},
	'contents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a file in a repository',
	},
	'contents.editorConfig': {
		riskLevel: 'read',
		description: 'Get the EditorConfig definitions of a file in a repository',
	},
	'contents.get': {
		riskLevel: 'read',
		description:
			'Gets the metadata and contents (if a file) of an entry in a repository, or a list of entries if a dir',
	},
	'contents.getExt': {
		riskLevel: 'read',
		description:
			'The extended "contents" API, to get file metadata and/or content, or list a directory',
	},
	'contents.getMany': {
		riskLevel: 'read',
		description: 'Get the metadata and contents of requested files',
	},
	'contents.getManyByPost': {
		riskLevel: 'read',
		description: 'Get the metadata and contents of requested files',
	},
	'contents.list': {
		riskLevel: 'read',
		description: 'Gets the metadata of all the entries of the root dir',
	},
	'contents.media': {
		riskLevel: 'read',
		description:
			"Get a file or it's LFS object from a repository (returned as a file)",
	},
	'contents.raw': {
		riskLevel: 'read',
		description: 'Get a file from a repository (returned as a file)',
	},
	'contents.update': {
		riskLevel: 'write',
		description:
			'Update a file in a repository if SHA is set, or create the file if SHA is not set',
	},
	'git.blobs.get': {
		riskLevel: 'read',
		description: 'Gets the blob of a repository',
	},
	'git.notes.get': {
		riskLevel: 'read',
		description:
			'Get a note corresponding to a single commit from a repository',
	},
	'git.refs.list': {
		riskLevel: 'read',
		description: "Get specified ref or filtered repository's refs",
	},
	'git.refs.listMatching': {
		riskLevel: 'read',
		description: "Get specified ref or filtered repository's refs",
	},
	'git.tags.get': {
		riskLevel: 'read',
		description:
			'Gets the tag object of an annotated tag (not lightweight tags)',
	},
	'git.trees.get': {
		riskLevel: 'read',
		description: 'Gets the tree of a repository',
	},
	'issues.assignees.add': {
		riskLevel: 'write',
		description: 'Add assignees to an issue',
	},
	'issues.assignees.check': {
		riskLevel: 'read',
		description: 'Check if a user can be assigned to an issue',
	},
	'issues.assignees.remove': {
		riskLevel: 'destructive',
		description: 'Remove assignees from an issue',
	},
	'issues.attachments.create': {
		riskLevel: 'write',
		description: 'Create an issue attachment',
	},
	'issues.attachments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an issue attachment',
	},
	'issues.attachments.get': {
		riskLevel: 'read',
		description: 'Get an issue attachment',
	},
	'issues.attachments.list': {
		riskLevel: 'read',
		description: "List issue's attachments",
	},
	'issues.attachments.update': {
		riskLevel: 'write',
		description: 'Edit an issue attachment',
	},
	'issues.blocks.add': {
		riskLevel: 'write',
		description: 'Block the issue given in the body by the issue in path',
	},
	'issues.blocks.list': {
		riskLevel: 'read',
		description:
			'List issues that are blocked by this issue, one page at a time',
	},
	'issues.blocks.remove': {
		riskLevel: 'destructive',
		description: 'Unblock the issue given in the body by the issue in path',
	},
	'issues.config.get': {
		riskLevel: 'read',
		description: 'Returns the issue config for a repo',
	},
	'issues.config.validate': {
		riskLevel: 'read',
		description: 'Returns the validation information for a issue config',
	},
	'issues.create': {
		riskLevel: 'write',
		description:
			'Create an issue with a title, body, labels, assignees, milestone and optional deadline, optionally already closed',
	},
	'issues.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an issue',
	},
	'issues.dependencies.add': {
		riskLevel: 'write',
		description: 'Make the issue in the url depend on the issue in the form',
	},
	'issues.dependencies.list': {
		riskLevel: 'read',
		description:
			"List an issue's dependencies, i.e all issues that block this issue, one page at a time",
	},
	'issues.dependencies.remove': {
		riskLevel: 'destructive',
		description: 'Remove an issue dependency',
	},
	'issues.get': {
		riskLevel: 'read',
		description:
			'Get one issue or pull request by its number, including labels, assignees and the comment count',
	},
	'issues.labels.add': {
		riskLevel: 'write',
		description: 'Add a label to an issue',
	},
	'issues.labels.clear': {
		riskLevel: 'destructive',
		description: 'Remove all labels from an issue',
	},
	'issues.labels.list': {
		riskLevel: 'read',
		description: "Get an issue's labels",
	},
	'issues.labels.remove': {
		riskLevel: 'destructive',
		description: 'Remove a label from an issue',
	},
	'issues.labels.replace': {
		riskLevel: 'write',
		description: "Replace an issue's labels",
	},
	'issues.list': {
		riskLevel: 'read',
		description:
			"List a repository's issues and pull requests, filterable by state, labels, milestone, assignee and time window, one page at a time; pass type 'issues' to leave pull requests out",
	},
	'issues.listPinned': {
		riskLevel: 'read',
		description: "List a repo's pinned issues",
	},
	'issues.lock': {
		riskLevel: 'write',
		description: 'Lock an issue',
	},
	'issues.movePin': {
		riskLevel: 'write',
		description: 'Moves the Pin to the given Position',
	},
	'issues.pin': {
		riskLevel: 'write',
		description: 'Pin an Issue',
	},
	'issues.reactions.add': {
		riskLevel: 'write',
		description: 'Add a reaction to an issue',
	},
	'issues.reactions.list': {
		riskLevel: 'read',
		description: 'Get a list reactions of an issue, one page at a time',
	},
	'issues.reactions.remove': {
		riskLevel: 'destructive',
		description: 'Remove a reaction from an issue',
	},
	'issues.search': {
		riskLevel: 'read',
		description:
			'Search for issues across the repositories that the user has access to, one page at a time',
	},
	'issues.setDeadline': {
		riskLevel: 'write',
		description:
			'Set an issue deadline. If set to null, the deadline is deleted. If using deadline only the date will be taken into account, and time of day ignored',
	},
	'issues.stopwatch.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Delete an issue's existing stopwatch",
	},
	'issues.stopwatch.start': {
		riskLevel: 'write',
		description: 'Start stopwatch on an issue',
	},
	'issues.stopwatch.stop': {
		riskLevel: 'write',
		description: "Stop an issue's existing stopwatch",
	},
	'issues.subscriptions.add': {
		riskLevel: 'write',
		description: 'Subscribe user to issue',
	},
	'issues.subscriptions.check': {
		riskLevel: 'read',
		description: 'Check if user is subscribed to an issue',
	},
	'issues.subscriptions.list': {
		riskLevel: 'read',
		description: 'Get users who subscribed on an issue, one page at a time',
	},
	'issues.subscriptions.remove': {
		riskLevel: 'destructive',
		description: 'Unsubscribe user from issue',
	},
	'issues.templates.list': {
		riskLevel: 'read',
		description: 'Get available issue templates for a repository',
	},
	'issues.timeline': {
		riskLevel: 'read',
		description: 'List all comments and events on an issue, one page at a time',
	},
	'issues.times.add': {
		riskLevel: 'write',
		description: 'Add tracked time to a issue',
	},
	'issues.times.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete specific tracked time',
	},
	'issues.times.list': {
		riskLevel: 'read',
		description: "List an issue's tracked times, one page at a time",
	},
	'issues.times.reset': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Reset a tracked time of an issue',
	},
	'issues.unlock': {
		riskLevel: 'destructive',
		description: 'Unlock an issue',
	},
	'issues.unpin': {
		riskLevel: 'destructive',
		description: 'Unpin an Issue',
	},
	'issues.update': {
		riskLevel: 'write',
		description:
			'Edit an issue: set title, body, labels, assignees, milestone or deadline, or close and reopen it through state',
	},
	'labels.create': {
		riskLevel: 'write',
		description: 'Create a label',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a label',
	},
	'labels.get': {
		riskLevel: 'read',
		description: 'Get a single label',
	},
	'labels.list': {
		riskLevel: 'read',
		description: "Get all of a repository's labels, one page at a time",
	},
	'labels.update': {
		riskLevel: 'write',
		description: 'Update a label',
	},
	'milestones.create': {
		riskLevel: 'write',
		description: 'Create a milestone',
	},
	'milestones.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a milestone',
	},
	'milestones.get': {
		riskLevel: 'read',
		description: 'Get a milestone',
	},
	'milestones.list': {
		riskLevel: 'read',
		description:
			"Get all of a repository's opened milestones, one page at a time",
	},
	'milestones.update': {
		riskLevel: 'write',
		description: 'Update a milestone',
	},
	'misc.gitignoreTemplates.get': {
		riskLevel: 'read',
		description: 'Returns information about a gitignore template',
	},
	'misc.gitignoreTemplates.list': {
		riskLevel: 'read',
		description: 'Returns a list of all gitignore templates',
	},
	'misc.labelTemplates.get': {
		riskLevel: 'read',
		description: 'Returns all labels in a template',
	},
	'misc.labelTemplates.list': {
		riskLevel: 'read',
		description: 'Returns a list of all label templates',
	},
	'misc.licenseTemplates.get': {
		riskLevel: 'read',
		description: 'Returns information about a license template',
	},
	'misc.licenseTemplates.list': {
		riskLevel: 'read',
		description: 'Returns a list of all license templates',
	},
	'misc.markdown.render': {
		riskLevel: 'read',
		description: 'Render a markdown document as HTML (returned as text)',
	},
	'misc.markdown.renderRaw': {
		riskLevel: 'read',
		description:
			'Render raw markdown text as HTML (the text is the whole body)',
	},
	'misc.markup.render': {
		riskLevel: 'read',
		description: 'Render a markup document as HTML (returned as text)',
	},
	'misc.signingKey.gpg': {
		riskLevel: 'read',
		description: 'Get default signing-key.gpg (returned as text)',
	},
	'misc.signingKey.ssh': {
		riskLevel: 'read',
		description: 'Get default signing-key.pub (returned as text)',
	},
	'misc.topics.search': {
		riskLevel: 'read',
		description: 'Search topics via keyword',
	},
	'misc.version': {
		riskLevel: 'read',
		description: 'Returns the version of the Gitea application',
	},
	'notifications.countNew': {
		riskLevel: 'read',
		description: 'Check if unread notifications exist',
	},
	'notifications.list': {
		riskLevel: 'read',
		description: "List users's notification threads, one page at a time",
	},
	'notifications.listForRepo': {
		riskLevel: 'read',
		description:
			"List users's notification threads on a specific repo, one page at a time",
	},
	'notifications.markRead': {
		riskLevel: 'write',
		description: 'Mark notification threads as read, pinned or unread',
	},
	'notifications.markReadForRepo': {
		riskLevel: 'write',
		description:
			'Mark notification threads as read, pinned or unread on a specific repo',
	},
	'notifications.threads.get': {
		riskLevel: 'read',
		description: 'Get notification thread by ID',
	},
	'notifications.threads.markRead': {
		riskLevel: 'write',
		description: 'Mark notification thread as read by ID',
	},
	'orgs.actions.jobs.list': {
		riskLevel: 'read',
		description: 'Get org-level workflow jobs',
	},
	'orgs.actions.runners.createRegistrationToken': {
		riskLevel: 'write',
		description: "Get an organization's actions runner registration token",
	},
	'orgs.actions.runners.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an org-level runner',
	},
	'orgs.actions.runners.get': {
		riskLevel: 'read',
		description: 'Get an org-level runner',
	},
	'orgs.actions.runners.list': {
		riskLevel: 'read',
		description: 'Get org-level runners',
	},
	'orgs.actions.runners.update': {
		riskLevel: 'write',
		description: 'Update an org-level runner',
	},
	'orgs.actions.runs.list': {
		riskLevel: 'read',
		description: 'Get org-level workflow runs',
	},
	'orgs.actions.secrets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a secret in an organization',
	},
	'orgs.actions.secrets.list': {
		riskLevel: 'read',
		description: "List an organization's actions secrets, one page at a time",
	},
	'orgs.actions.secrets.set': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create or Update a secret value in an organization',
	},
	'orgs.actions.variables.create': {
		riskLevel: 'write',
		description: 'Create an org-level variable',
	},
	'orgs.actions.variables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an org-level variable',
	},
	'orgs.actions.variables.get': {
		riskLevel: 'read',
		description: 'Get an org-level variable',
	},
	'orgs.actions.variables.list': {
		riskLevel: 'read',
		description: 'Get an org-level variables list, one page at a time',
	},
	'orgs.actions.variables.update': {
		riskLevel: 'write',
		description: 'Update an org-level variable',
	},
	'orgs.activityFeeds.list': {
		riskLevel: 'read',
		description: "List an organization's activity feeds, one page at a time",
	},
	'orgs.avatar.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Avatar',
	},
	'orgs.avatar.update': {
		riskLevel: 'write',
		description: 'Update Avatar',
	},
	'orgs.blocks.add': {
		riskLevel: 'write',
		description: 'Block a user',
	},
	'orgs.blocks.check': {
		riskLevel: 'read',
		description: 'Check if a user is blocked by the organization',
	},
	'orgs.blocks.list': {
		riskLevel: 'read',
		description: 'List users blocked by the organization, one page at a time',
	},
	'orgs.blocks.remove': {
		riskLevel: 'destructive',
		description: 'Unblock a user',
	},
	'orgs.create': {
		riskLevel: 'write',
		description: 'Create an organization',
	},
	'orgs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an organization',
	},
	'orgs.get': {
		riskLevel: 'read',
		description: 'Get an organization',
	},
	'orgs.hooks.create': {
		riskLevel: 'write',
		description: 'Create a hook',
	},
	'orgs.hooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a hook',
	},
	'orgs.hooks.get': {
		riskLevel: 'read',
		description: 'Get a hook',
	},
	'orgs.hooks.list': {
		riskLevel: 'read',
		description: "List an organization's webhooks, one page at a time",
	},
	'orgs.hooks.update': {
		riskLevel: 'write',
		description: 'Update a hook',
	},
	'orgs.labels.create': {
		riskLevel: 'write',
		description: 'Create a label for an organization',
	},
	'orgs.labels.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a label',
	},
	'orgs.labels.get': {
		riskLevel: 'read',
		description: 'Get a single label',
	},
	'orgs.labels.list': {
		riskLevel: 'read',
		description: "List an organization's labels, one page at a time",
	},
	'orgs.labels.update': {
		riskLevel: 'write',
		description: 'Update a label',
	},
	'orgs.list': {
		riskLevel: 'read',
		description: 'Get list of organizations, one page at a time',
	},
	'orgs.members.check': {
		riskLevel: 'read',
		description: 'Check if a user is a member of an organization',
	},
	'orgs.members.list': {
		riskLevel: 'read',
		description: "List an organization's members, one page at a time",
	},
	'orgs.members.remove': {
		riskLevel: 'destructive',
		description: 'Remove a member from an organization',
	},
	'orgs.projects.columns.create': {
		riskLevel: 'write',
		description: 'Create a column in a project',
	},
	'orgs.projects.columns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project column',
	},
	'orgs.projects.columns.get': {
		riskLevel: 'read',
		description: 'Get a project column',
	},
	'orgs.projects.columns.issues.add': {
		riskLevel: 'write',
		description: 'Add an issue to a project column',
	},
	'orgs.projects.columns.issues.list': {
		riskLevel: 'read',
		description: 'List the issues in a project column, one page at a time',
	},
	'orgs.projects.columns.issues.remove': {
		riskLevel: 'destructive',
		description: 'Remove an issue from a project column',
	},
	'orgs.projects.columns.list': {
		riskLevel: 'read',
		description: "List a project's columns, one page at a time",
	},
	'orgs.projects.columns.move': {
		riskLevel: 'write',
		description: "Reorder a project's columns",
	},
	'orgs.projects.columns.setDefault': {
		riskLevel: 'write',
		description: "Set a project's default column",
	},
	'orgs.projects.columns.update': {
		riskLevel: 'write',
		description: 'Edit a project column',
	},
	'orgs.projects.create': {
		riskLevel: 'write',
		description: 'Create a project owned by an organization',
	},
	'orgs.projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project',
	},
	'orgs.projects.get': {
		riskLevel: 'read',
		description: 'Get a project',
	},
	'orgs.projects.issues.move': {
		riskLevel: 'write',
		description: "Move an issue between a project's columns",
	},
	'orgs.projects.list': {
		riskLevel: 'read',
		description: "List an organization's projects, one page at a time",
	},
	'orgs.projects.update': {
		riskLevel: 'write',
		description: 'Edit a project',
	},
	'orgs.publicMembers.check': {
		riskLevel: 'read',
		description: 'Check if a user is a public member of an organization',
	},
	'orgs.publicMembers.conceal': {
		riskLevel: 'destructive',
		description: "Conceal a user's membership",
	},
	'orgs.publicMembers.list': {
		riskLevel: 'read',
		description: "List an organization's public members, one page at a time",
	},
	'orgs.publicMembers.publicize': {
		riskLevel: 'write',
		description: "Publicize a user's membership",
	},
	'orgs.rename': {
		riskLevel: 'destructive',
		description: 'Rename an organization',
	},
	'orgs.repos.create': {
		riskLevel: 'write',
		description: 'Create a repository in an organization',
	},
	'orgs.repos.deleteAll': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete every repository in the organization (Gitea answers 202 and deletes in the background)',
	},
	'orgs.repos.list': {
		riskLevel: 'read',
		description: "List an organization's repos, one page at a time",
	},
	'orgs.teams.create': {
		riskLevel: 'write',
		description: 'Create a team',
	},
	'orgs.teams.list': {
		riskLevel: 'read',
		description: "List an organization's teams, one page at a time",
	},
	'orgs.teams.search': {
		riskLevel: 'read',
		description: 'Search for teams within an organization',
	},
	'orgs.update': {
		riskLevel: 'write',
		description: 'Edit an organization',
	},
	'packages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a package',
	},
	'packages.link': {
		riskLevel: 'write',
		description: 'Link a package to a repository',
	},
	'packages.list': {
		riskLevel: 'read',
		description: 'Gets all packages of an owner, one page at a time',
	},
	'packages.unlink': {
		riskLevel: 'write',
		description: 'Unlink a package from a repository',
	},
	'packages.versions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a package version',
	},
	'packages.versions.files.list': {
		riskLevel: 'read',
		description: 'Gets all files of a package',
	},
	'packages.versions.get': {
		riskLevel: 'read',
		description: 'Gets a package',
	},
	'packages.versions.getLatest': {
		riskLevel: 'read',
		description: 'Gets the latest version of a package',
	},
	'packages.versions.list': {
		riskLevel: 'read',
		description: 'Gets all versions of a package, one page at a time',
	},
	'projects.columns.create': {
		riskLevel: 'write',
		description: 'Create a column in a project',
	},
	'projects.columns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project column',
	},
	'projects.columns.get': {
		riskLevel: 'read',
		description: 'Get a project column',
	},
	'projects.columns.issues.add': {
		riskLevel: 'write',
		description: 'Add an issue to a project column',
	},
	'projects.columns.issues.list': {
		riskLevel: 'read',
		description: 'List the issues in a project column, one page at a time',
	},
	'projects.columns.issues.remove': {
		riskLevel: 'destructive',
		description: 'Remove an issue from a project column',
	},
	'projects.columns.list': {
		riskLevel: 'read',
		description: "List a project's columns, one page at a time",
	},
	'projects.columns.move': {
		riskLevel: 'write',
		description: "Reorder a project's columns",
	},
	'projects.columns.setDefault': {
		riskLevel: 'write',
		description: "Set a project's default column",
	},
	'projects.columns.update': {
		riskLevel: 'write',
		description: 'Edit a project column',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project owned by a repository',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project',
	},
	'projects.issues.move': {
		riskLevel: 'write',
		description: "Move an issue between a project's columns",
	},
	'projects.list': {
		riskLevel: 'read',
		description: "List a repository's projects, one page at a time",
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Edit a project',
	},
	'pulls.cancelAutoMerge': {
		riskLevel: 'destructive',
		description: 'Cancel the scheduled auto merge for the given pull request',
	},
	'pulls.commits': {
		riskLevel: 'read',
		description: 'Get commits for a pull request, one page at a time',
	},
	'pulls.create': {
		riskLevel: 'write',
		description: 'Create a pull request',
	},
	'pulls.downloadDiff': {
		riskLevel: 'read',
		description: 'Get a pull request diff or patch (returned as text)',
	},
	'pulls.files': {
		riskLevel: 'read',
		description: 'Get changed files for a pull request, one page at a time',
	},
	'pulls.get': {
		riskLevel: 'read',
		description: 'Get a pull request',
	},
	'pulls.getByBaseHead': {
		riskLevel: 'read',
		description: 'Get a pull request by base and head',
	},
	'pulls.isMerged': {
		riskLevel: 'read',
		description: 'Check if a pull request has been merged',
	},
	'pulls.list': {
		riskLevel: 'read',
		description: "List a repo's pull requests, one page at a time",
	},
	'pulls.listPinned': {
		riskLevel: 'read',
		description: "List a repo's pinned pull requests",
	},
	'pulls.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Merge a pull request with the chosen style (merge, rebase, rebase-merge, squash, fast-forward-only or manually-merged), optionally deleting the head branch, or schedule it to merge when checks pass',
	},
	'pulls.requestedReviewers.add': {
		riskLevel: 'write',
		description: 'Create review requests for a pull request',
	},
	'pulls.requestedReviewers.remove': {
		riskLevel: 'destructive',
		description: 'Cancel review requests for a pull request',
	},
	'pulls.reviewComments.reply': {
		riskLevel: 'write',
		description: 'Reply to a pull request review comment',
	},
	'pulls.reviewComments.resolve': {
		riskLevel: 'write',
		description: 'Resolve a pull request review comment',
	},
	'pulls.reviewComments.unresolve': {
		riskLevel: 'write',
		description: 'Unresolve a pull request review comment',
	},
	'pulls.reviews.comments': {
		riskLevel: 'read',
		description: 'Get a specific review for a pull request',
	},
	'pulls.reviews.create': {
		riskLevel: 'write',
		description: 'Create a review to a pull request',
	},
	'pulls.reviews.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a specific review from a pull request',
	},
	'pulls.reviews.dismiss': {
		riskLevel: 'write',
		description: 'Dismiss a review for a pull request',
	},
	'pulls.reviews.get': {
		riskLevel: 'read',
		description: 'Get a specific review for a pull request',
	},
	'pulls.reviews.list': {
		riskLevel: 'read',
		description: 'List all reviews for a pull request, one page at a time',
	},
	'pulls.reviews.submit': {
		riskLevel: 'write',
		description: 'Submit a pending review to a pull request',
	},
	'pulls.reviews.undismiss': {
		riskLevel: 'write',
		description: 'Cancel to dismiss a review for a pull request',
	},
	'pulls.update': {
		riskLevel: 'write',
		description:
			'Update a pull request. If using deadline only the date will be taken into account, and time of day ignored',
	},
	'pulls.updateBranch': {
		riskLevel: 'write',
		description: "Merge PR's baseBranch into headBranch",
	},
	'releases.assets.create': {
		riskLevel: 'write',
		description: 'Create a release attachment',
	},
	'releases.assets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a release attachment',
	},
	'releases.assets.get': {
		riskLevel: 'read',
		description: 'Get a release attachment',
	},
	'releases.assets.list': {
		riskLevel: 'read',
		description: "List release's attachments",
	},
	'releases.assets.update': {
		riskLevel: 'write',
		description: 'Edit a release attachment',
	},
	'releases.create': {
		riskLevel: 'write',
		description:
			'Create a release for a tag, creating the tag on the target commit when it does not exist yet; a tag that already has a release answers 409',
	},
	'releases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a release',
	},
	'releases.deleteByTag': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a release by tag name',
	},
	'releases.get': {
		riskLevel: 'read',
		description: 'Get a release',
	},
	'releases.getByTag': {
		riskLevel: 'read',
		description: 'Get a release by tag name',
	},
	'releases.getLatest': {
		riskLevel: 'read',
		description:
			'Gets the most recent non-prerelease, non-draft release of a repository, sorted by created_at',
	},
	'releases.list': {
		riskLevel: 'read',
		description:
			"List a repository's releases with their assets, filterable by draft and prerelease, one page at a time",
	},
	'releases.update': {
		riskLevel: 'write',
		description: 'Update a release',
	},
	'repos.acceptTransfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Accept a repo transfer',
	},
	'repos.activityFeeds.list': {
		riskLevel: 'read',
		description: "List a repository's activity feeds, one page at a time",
	},
	'repos.assignees.check': {
		riskLevel: 'read',
		description: 'Check if a user can be assigned to issues in a repository',
	},
	'repos.assignees.list': {
		riskLevel: 'read',
		description:
			'Return all users that have write access and can be assigned to issues',
	},
	'repos.avatar.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete avatar',
	},
	'repos.avatar.update': {
		riskLevel: 'write',
		description: 'Update avatar',
	},
	'repos.collaborators.add': {
		riskLevel: 'write',
		description: 'Add or Update a collaborator to a repository',
	},
	'repos.collaborators.check': {
		riskLevel: 'read',
		description: 'Check if a user is a collaborator of a repository',
	},
	'repos.collaborators.list': {
		riskLevel: 'read',
		description: "List a repository's collaborators, one page at a time",
	},
	'repos.collaborators.permission': {
		riskLevel: 'read',
		description: 'Get repository permissions for a user',
	},
	'repos.collaborators.remove': {
		riskLevel: 'destructive',
		description: 'Delete a collaborator from a repository',
	},
	'repos.create': {
		riskLevel: 'write',
		description:
			'Create a repository owned by the authenticated user, optionally seeded with a README, license and gitignore',
	},
	'repos.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a repository together with its issues, pull requests, releases and wiki; no API call can restore it',
	},
	'repos.deployKeys.create': {
		riskLevel: 'write',
		description: 'Add a key to a repository',
	},
	'repos.deployKeys.createToken': {
		riskLevel: 'write',
		description:
			'Add a deploy token to a repository, it authenticates git over HTTPS',
	},
	'repos.deployKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a key from a repository',
	},
	'repos.deployKeys.get': {
		riskLevel: 'read',
		description: "Get a repository's key by id",
	},
	'repos.deployKeys.list': {
		riskLevel: 'read',
		description: "List a repository's keys, one page at a time",
	},
	'repos.downloadArchive': {
		riskLevel: 'read',
		description: 'Get an archive of a repository (returned as a file)',
	},
	'repos.forks.create': {
		riskLevel: 'write',
		description: 'Fork a repository',
	},
	'repos.forks.list': {
		riskLevel: 'read',
		description: "List a repository's forks, one page at a time",
	},
	'repos.generateFromTemplate': {
		riskLevel: 'write',
		description: 'Create a repository using a template',
	},
	'repos.get': {
		riskLevel: 'read',
		description:
			'Get one repository, including its counts, permissions and feature flags',
	},
	'repos.getById': {
		riskLevel: 'read',
		description: 'Get a repository by id',
	},
	'repos.gitHooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Git hook in a repository',
	},
	'repos.gitHooks.get': {
		riskLevel: 'read',
		description: 'Get a Git hook',
	},
	'repos.gitHooks.list': {
		riskLevel: 'read',
		description: 'List the Git hooks in a repository',
	},
	'repos.gitHooks.update': {
		riskLevel: 'destructive',
		description: 'Edit a Git hook in a repository',
	},
	'repos.languages': {
		riskLevel: 'read',
		description: 'Get languages and number of bytes of code written',
	},
	'repos.licenses': {
		riskLevel: 'read',
		description: 'Get repo licenses',
	},
	'repos.list': {
		riskLevel: 'read',
		description:
			'List the repositories the authenticated user owns or can access, one page at a time',
	},
	'repos.mergeUpstream': {
		riskLevel: 'write',
		description: 'Merge a branch from upstream',
	},
	'repos.migrate': {
		riskLevel: 'write',
		description: 'Migrate a remote git repository',
	},
	'repos.mirrorSync': {
		riskLevel: 'write',
		description: 'Sync a mirrored repository',
	},
	'repos.newPinAllowed': {
		riskLevel: 'read',
		description: 'Returns if new Issue Pins are allowed',
	},
	'repos.pushMirrors.add': {
		riskLevel: 'write',
		description: 'Add a push mirror to the repository',
	},
	'repos.pushMirrors.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a push mirror from a repository by remoteName',
	},
	'repos.pushMirrors.get': {
		riskLevel: 'read',
		description: 'Get push mirror of the repository by remoteName',
	},
	'repos.pushMirrors.list': {
		riskLevel: 'read',
		description: 'Get all push mirrors of the repository, one page at a time',
	},
	'repos.pushMirrors.sync': {
		riskLevel: 'write',
		description: 'Sync all push mirrored repository',
	},
	'repos.rejectTransfer': {
		riskLevel: 'write',
		description: 'Reject a repo transfer',
	},
	'repos.reviewers': {
		riskLevel: 'read',
		description:
			'Return all users that can be requested to review in this repo',
	},
	'repos.search': {
		riskLevel: 'read',
		description: 'Search for repositories',
	},
	'repos.signingKey.gpg': {
		riskLevel: 'read',
		description: 'Get signing-key.gpg for given repository (returned as text)',
	},
	'repos.signingKey.ssh': {
		riskLevel: 'read',
		description: 'Get signing-key.pub for given repository (returned as text)',
	},
	'repos.stargazers': {
		riskLevel: 'read',
		description: "List a repo's stargazers, one page at a time",
	},
	'repos.subscribers': {
		riskLevel: 'read',
		description: "List a repo's watchers, one page at a time",
	},
	'repos.subscription.get': {
		riskLevel: 'read',
		description: 'Check if the current user is watching a repo',
	},
	'repos.subscription.unwatch': {
		riskLevel: 'destructive',
		description: 'Unwatch a repo',
	},
	'repos.subscription.watch': {
		riskLevel: 'write',
		description: 'Watch a repo',
	},
	'repos.teams.add': {
		riskLevel: 'write',
		description: 'Add a team to a repository',
	},
	'repos.teams.check': {
		riskLevel: 'read',
		description: 'Check if a team is assigned to a repository',
	},
	'repos.teams.list': {
		riskLevel: 'read',
		description: "List a repository's teams",
	},
	'repos.teams.remove': {
		riskLevel: 'destructive',
		description: 'Delete a team from a repository',
	},
	'repos.topics.add': {
		riskLevel: 'write',
		description: 'Add a topic to a repository',
	},
	'repos.topics.list': {
		riskLevel: 'read',
		description: 'Get list of topics that a repository has',
	},
	'repos.topics.remove': {
		riskLevel: 'destructive',
		description: 'Delete a topic from a repository',
	},
	'repos.topics.replace': {
		riskLevel: 'write',
		description: 'Replace list of topics for a repository',
	},
	'repos.trackedTimes': {
		riskLevel: 'read',
		description: "List a repo's tracked times, one page at a time",
	},
	'repos.transfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer the repository to another user or organization (the new owner may have to accept it)',
	},
	'repos.update': {
		riskLevel: 'write',
		description:
			"Edit a repository's properties. Only fields that are set will be changed",
	},
	'settings.api': {
		riskLevel: 'read',
		description: "Get instance's global settings for api",
	},
	'settings.attachment': {
		riskLevel: 'read',
		description: "Get instance's global settings for Attachment",
	},
	'settings.repository': {
		riskLevel: 'read',
		description: "Get instance's global settings for repositories",
	},
	'settings.ui': {
		riskLevel: 'read',
		description: "Get instance's global settings for ui",
	},
	'tagProtections.create': {
		riskLevel: 'write',
		description: 'Create a tag protections for a repository',
	},
	'tagProtections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a specific tag protection for the repository',
	},
	'tagProtections.get': {
		riskLevel: 'read',
		description: 'Get a specific tag protection for the repository',
	},
	'tagProtections.list': {
		riskLevel: 'read',
		description: 'List tag protections for a repository',
	},
	'tagProtections.update': {
		riskLevel: 'write',
		description:
			'Edit a tag protections for a repository. Only fields that are set will be changed',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a new git tag in a repository',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Delete a repository's tag by name",
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get the tag of a repository by tag name',
	},
	'tags.list': {
		riskLevel: 'read',
		description: "List a repository's tags, one page at a time",
	},
	'teams.activityFeeds.list': {
		riskLevel: 'read',
		description: "List a team's activity feeds, one page at a time",
	},
	'teams.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a team',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Get a team',
	},
	'teams.members.add': {
		riskLevel: 'write',
		description: 'Add a team member',
	},
	'teams.members.get': {
		riskLevel: 'read',
		description: 'List a particular member of team',
	},
	'teams.members.list': {
		riskLevel: 'read',
		description: "List a team's members, one page at a time",
	},
	'teams.members.remove': {
		riskLevel: 'destructive',
		description: 'Remove a team member',
	},
	'teams.repos.add': {
		riskLevel: 'write',
		description: 'Add a repository to a team',
	},
	'teams.repos.get': {
		riskLevel: 'read',
		description: 'List a particular repo of team',
	},
	'teams.repos.list': {
		riskLevel: 'read',
		description: "List a team's repos, one page at a time",
	},
	'teams.repos.remove': {
		riskLevel: 'destructive',
		description: 'Remove a repository from a team',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Edit a team',
	},
	'user.actions.jobs.list': {
		riskLevel: 'read',
		description: 'Get workflow jobs',
	},
	'user.actions.runners.createRegistrationToken': {
		riskLevel: 'write',
		description: "Get a user's actions runner registration token",
	},
	'user.actions.runners.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a user-level runner',
	},
	'user.actions.runners.get': {
		riskLevel: 'read',
		description: 'Get a user-level runner',
	},
	'user.actions.runners.list': {
		riskLevel: 'read',
		description: 'Get user-level runners',
	},
	'user.actions.runners.update': {
		riskLevel: 'write',
		description: 'Update a user-level runner',
	},
	'user.actions.runs.list': {
		riskLevel: 'read',
		description: 'Get workflow runs',
	},
	'user.actions.secrets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a secret in a user scope',
	},
	'user.actions.secrets.set': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create or Update a secret value in a user scope',
	},
	'user.actions.variables.create': {
		riskLevel: 'write',
		description: 'Create a user-level variable',
	},
	'user.actions.variables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a user-level variable which is created by current doer',
	},
	'user.actions.variables.get': {
		riskLevel: 'read',
		description: 'Get a user-level variable which is created by current doer',
	},
	'user.actions.variables.list': {
		riskLevel: 'read',
		description:
			'Get the user-level list of variables which is created by current doer, one page at a time',
	},
	'user.actions.variables.update': {
		riskLevel: 'write',
		description:
			'Update a user-level variable which is created by current doer',
	},
	'user.avatar.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Avatar',
	},
	'user.avatar.update': {
		riskLevel: 'write',
		description: 'Update Avatar',
	},
	'user.blocks.add': {
		riskLevel: 'write',
		description: 'Block a user',
	},
	'user.blocks.check': {
		riskLevel: 'read',
		description: 'Check if a user is blocked by the authenticated user',
	},
	'user.blocks.list': {
		riskLevel: 'read',
		description:
			'List users blocked by the authenticated user, one page at a time',
	},
	'user.blocks.remove': {
		riskLevel: 'destructive',
		description: 'Unblock a user',
	},
	'user.emails.add': {
		riskLevel: 'write',
		description: 'Add email addresses',
	},
	'user.emails.list': {
		riskLevel: 'read',
		description: "List the authenticated user's email addresses",
	},
	'user.emails.remove': {
		riskLevel: 'destructive',
		description: 'Delete email addresses',
	},
	'user.followers.list': {
		riskLevel: 'read',
		description: "List the authenticated user's followers, one page at a time",
	},
	'user.following.check': {
		riskLevel: 'read',
		description: 'Check whether a user is followed by the authenticated user',
	},
	'user.following.follow': {
		riskLevel: 'write',
		description: 'Follow a user',
	},
	'user.following.list': {
		riskLevel: 'read',
		description:
			'List the users that the authenticated user is following, one page at a time',
	},
	'user.following.unfollow': {
		riskLevel: 'destructive',
		description: 'Unfollow a user',
	},
	'user.gpgKeys.create': {
		riskLevel: 'write',
		description: 'Create a GPG key',
	},
	'user.gpgKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a GPG key',
	},
	'user.gpgKeys.get': {
		riskLevel: 'read',
		description: 'Get a GPG key',
	},
	'user.gpgKeys.list': {
		riskLevel: 'read',
		description: "List the authenticated user's GPG keys, one page at a time",
	},
	'user.gpgKeys.verificationToken': {
		riskLevel: 'read',
		description: 'Get a Token to verify (returned as text)',
	},
	'user.gpgKeys.verify': {
		riskLevel: 'write',
		description: 'Verify a GPG key',
	},
	'user.hooks.create': {
		riskLevel: 'write',
		description: 'Create a hook',
	},
	'user.hooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a hook',
	},
	'user.hooks.get': {
		riskLevel: 'read',
		description: 'Get a hook',
	},
	'user.hooks.list': {
		riskLevel: 'read',
		description: "List the authenticated user's webhooks, one page at a time",
	},
	'user.hooks.update': {
		riskLevel: 'write',
		description: 'Update a hook',
	},
	'user.keys.create': {
		riskLevel: 'write',
		description: 'Create a public key',
	},
	'user.keys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a public key',
	},
	'user.keys.get': {
		riskLevel: 'read',
		description: 'Get a public key',
	},
	'user.keys.list': {
		riskLevel: 'read',
		description:
			"List the authenticated user's public keys, one page at a time",
	},
	'user.me': {
		riskLevel: 'read',
		description: 'Get the authenticated user, as the account token sees it',
	},
	'user.oauth2Apps.create': {
		riskLevel: 'write',
		description: 'Creates a new OAuth2 application',
	},
	'user.oauth2Apps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an OAuth2 Application',
	},
	'user.oauth2Apps.get': {
		riskLevel: 'read',
		description: 'Get an OAuth2 Application',
	},
	'user.oauth2Apps.list': {
		riskLevel: 'read',
		description:
			"List the authenticated user's oauth2 applications, one page at a time",
	},
	'user.oauth2Apps.update': {
		riskLevel: 'write',
		description:
			'Update an OAuth2 Application, this includes regenerating the client secret',
	},
	'user.orgs.list': {
		riskLevel: 'read',
		description: "List the current user's organizations, one page at a time",
	},
	'user.projects.columns.create': {
		riskLevel: 'write',
		description: 'Create a column in a project',
	},
	'user.projects.columns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project column',
	},
	'user.projects.columns.get': {
		riskLevel: 'read',
		description: 'Get a project column',
	},
	'user.projects.columns.issues.add': {
		riskLevel: 'write',
		description: 'Add an issue to a project column',
	},
	'user.projects.columns.issues.list': {
		riskLevel: 'read',
		description: 'List the issues in a project column, one page at a time',
	},
	'user.projects.columns.issues.remove': {
		riskLevel: 'destructive',
		description: 'Remove an issue from a project column',
	},
	'user.projects.columns.list': {
		riskLevel: 'read',
		description: "List a project's columns, one page at a time",
	},
	'user.projects.columns.move': {
		riskLevel: 'write',
		description: "Reorder a project's columns",
	},
	'user.projects.columns.setDefault': {
		riskLevel: 'write',
		description: "Set a project's default column",
	},
	'user.projects.columns.update': {
		riskLevel: 'write',
		description: 'Edit a project column',
	},
	'user.projects.create': {
		riskLevel: 'write',
		description: 'Create a project owned by the authenticated user',
	},
	'user.projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project',
	},
	'user.projects.get': {
		riskLevel: 'read',
		description: 'Get a project',
	},
	'user.projects.issues.move': {
		riskLevel: 'write',
		description: "Move an issue between a project's columns",
	},
	'user.projects.list': {
		riskLevel: 'read',
		description: 'List your projects, one page at a time',
	},
	'user.projects.update': {
		riskLevel: 'write',
		description: 'Edit a project',
	},
	'user.settings.get': {
		riskLevel: 'read',
		description: 'Get user settings',
	},
	'user.settings.update': {
		riskLevel: 'write',
		description: 'Update user settings',
	},
	'user.starred.check': {
		riskLevel: 'read',
		description: 'Whether the authenticated is starring the repo',
	},
	'user.starred.list': {
		riskLevel: 'read',
		description:
			'The repos that the authenticated user has starred, one page at a time',
	},
	'user.starred.star': {
		riskLevel: 'write',
		description: 'Star the given repo',
	},
	'user.starred.unstar': {
		riskLevel: 'destructive',
		description: 'Unstar the given repo',
	},
	'user.stopwatches.list': {
		riskLevel: 'read',
		description: 'Get list of all existing stopwatches, one page at a time',
	},
	'user.subscriptions.list': {
		riskLevel: 'read',
		description:
			'List repositories watched by the authenticated user, one page at a time',
	},
	'user.teams.list': {
		riskLevel: 'read',
		description: 'List all the teams a user belongs to, one page at a time',
	},
	'user.token.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke the access token this call is made with; every later call with it answers 401',
	},
	'user.token.get': {
		riskLevel: 'read',
		description:
			'Get the access token this call is made with: its name, scopes and last-used time',
	},
	'user.trackedTimes.list': {
		riskLevel: 'read',
		description: "List the current user's tracked times, one page at a time",
	},
	'users.activityFeeds.list': {
		riskLevel: 'read',
		description: "List a user's activity feeds, one page at a time",
	},
	'users.followers.list': {
		riskLevel: 'read',
		description: "List the given user's followers, one page at a time",
	},
	'users.following.check': {
		riskLevel: 'read',
		description: 'Check if one user is following another user',
	},
	'users.following.list': {
		riskLevel: 'read',
		description:
			'List the users that the given user is following, one page at a time',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a user',
	},
	'users.gpgKeys.list': {
		riskLevel: 'read',
		description: "List the given user's GPG keys, one page at a time",
	},
	'users.heatmap': {
		riskLevel: 'read',
		description: "Get a user's heatmap",
	},
	'users.keys.list': {
		riskLevel: 'read',
		description: "List the given user's public keys, one page at a time",
	},
	'users.orgs.list': {
		riskLevel: 'read',
		description: "List a user's organizations, one page at a time",
	},
	'users.orgs.permissions': {
		riskLevel: 'read',
		description: 'Get user permissions in organization',
	},
	'users.projects.list': {
		riskLevel: 'read',
		description: "List a user's projects, one page at a time",
	},
	'users.repos.list': {
		riskLevel: 'read',
		description: 'List the repos owned by the given user, one page at a time',
	},
	'users.search': {
		riskLevel: 'read',
		description: 'Search for users',
	},
	'users.starred.list': {
		riskLevel: 'read',
		description:
			'The repos that the given user has starred, one page at a time',
	},
	'users.subscriptions.list': {
		riskLevel: 'read',
		description: 'List the repositories watched by a user, one page at a time',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			"Register a webhook on a repository: target URL, payload type, events and an optional signing secret. With type 'gitea' and a secret, the plugin's webhooks verify the deliveries",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently remove a webhook registration; deliveries stop immediately',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get a hook',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List the webhooks registered on a repository, with their target URLs, events and active flag, one page at a time',
	},
	'webhooks.test': {
		riskLevel: 'write',
		description: 'Test a push webhook',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Edit a hook in a repository',
	},
	'wiki.create': {
		riskLevel: 'write',
		description: 'Create a wiki page',
	},
	'wiki.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a wiki page',
	},
	'wiki.get': {
		riskLevel: 'read',
		description: 'Get a wiki page',
	},
	'wiki.list': {
		riskLevel: 'read',
		description: 'Get all wiki pages, one page at a time',
	},
	'wiki.revisions': {
		riskLevel: 'read',
		description: 'Get revisions of a wiki page',
	},
	'wiki.update': {
		riskLevel: 'write',
		description: 'Edit a wiki page',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof giteaEndpointsNested>;
