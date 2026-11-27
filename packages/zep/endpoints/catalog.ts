// Generated with endpoints/operation-types.ts from Zep's OpenAPI spec:
// one entry per operation in zep-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { zepSchemaEntry } from './openapi-schema';
import { createZepOperation as op } from './operations';

export const zepEndpointsNested = {
	agents: {
		create: op('agents.create'),
		declareBreakingChange: op('agents.declareBreakingChange'),
		delete: op('agents.delete'),
		get: op('agents.get'),
		getContext: op('agents.getContext'),
		learning: {
			get: op('agents.learning.get'),
			listRuns: op('agents.learning.listRuns'),
		},
		list: op('agents.list'),
		literalPolicy: {
			get: op('agents.literalPolicy.get'),
			update: op('agents.literalPolicy.update'),
		},
		planSplit: op('agents.planSplit'),
		skillCandidates: {
			evaluate: op('agents.skillCandidates.evaluate'),
			get: op('agents.skillCandidates.get'),
			list: op('agents.skillCandidates.list'),
		},
		skillPublications: {
			lookup: op('agents.skillPublications.lookup'),
		},
		skills: {
			approve: op('agents.skills.approve'),
			create: op('agents.skills.create'),
			createVersion: op('agents.skills.createVersion'),
			evaluations: {
				create: op('agents.skills.evaluations.create'),
			},
			evidence: {
				list: op('agents.skills.evidence.list'),
			},
			get: op('agents.skills.get'),
			getPublication: op('agents.skills.getPublication'),
			importPackage: op('agents.skills.importPackage'),
			list: op('agents.skills.list'),
			relations: {
				list: op('agents.skills.relations.list'),
			},
			retire: op('agents.skills.retire'),
			search: op('agents.skills.search'),
			uses: {
				addOutcome: op('agents.skills.uses.addOutcome'),
				create: op('agents.skills.uses.create'),
			},
			versions: {
				compare: op('agents.skills.versions.compare'),
				exports: {
					create: op('agents.skills.versions.exports.create'),
					get: op('agents.skills.versions.exports.get'),
				},
				get: op('agents.skills.versions.get'),
				list: op('agents.skills.versions.list'),
				restore: op('agents.skills.versions.restore'),
			},
		},
		taskFamilies: {
			list: op('agents.taskFamilies.list'),
			rename: op('agents.taskFamilies.rename'),
		},
		traceImports: {
			create: op('agents.traceImports.create'),
			delete: op('agents.traceImports.delete'),
			get: op('agents.traceImports.get'),
			list: op('agents.traceImports.list'),
			pause: op('agents.traceImports.pause'),
			resume: op('agents.traceImports.resume'),
			runs: {
				create: op('agents.traceImports.runs.create'),
				get: op('agents.traceImports.runs.get'),
				items: {
					list: op('agents.traceImports.runs.items.list'),
				},
				list: op('agents.traceImports.runs.list'),
			},
			update: op('agents.traceImports.update'),
		},
		traces: {
			abandon: op('agents.traces.abandon'),
			appendEvent: op('agents.traces.appendEvent'),
			close: op('agents.traces.close'),
			correctTaskFamily: op('agents.traces.correctTaskFamily'),
			create: op('agents.traces.create'),
			delete: op('agents.traces.delete'),
			deleteEvent: op('agents.traces.deleteEvent'),
			get: op('agents.traces.get'),
			getSummary: op('agents.traces.getSummary'),
			list: op('agents.traces.list'),
			listEvents: op('agents.traces.listEvents'),
			listSummaryVersions: op('agents.traces.listSummaryVersions'),
			reopen: op('agents.traces.reopen'),
			update: op('agents.traces.update'),
		},
		update: op('agents.update'),
		verifiers: {
			get: op('agents.verifiers.get'),
			invalidateEvidence: op('agents.verifiers.invalidateEvidence'),
			list: op('agents.verifiers.list'),
			revoke: op('agents.verifiers.revoke'),
			update: op('agents.verifiers.update'),
		},
	},
	batches: {
		addItems: op('batches.addItems'),
		create: op('batches.create'),
		delete: op('batches.delete'),
		get: op('batches.get'),
		list: op('batches.list'),
		listItems: op('batches.listItems'),
		process: op('batches.process'),
	},
	contextTemplates: {
		create: op('contextTemplates.create'),
		delete: op('contextTemplates.delete'),
		get: op('contextTemplates.get'),
		list: op('contextTemplates.list'),
		update: op('contextTemplates.update'),
	},
	debugLogs: {
		enable: op('debugLogs.enable'),
	},
	graphs: {
		clone: op('graphs.clone'),
		create: op('graphs.create'),
		delete: op('graphs.delete'),
		documentSummaries: {
			list: op('graphs.documentSummaries.list'),
		},
		edges: {
			add: op('graphs.edges.add'),
			delete: op('graphs.edges.delete'),
			get: op('graphs.edges.get'),
			list: op('graphs.edges.list'),
			update: op('graphs.edges.update'),
		},
		episodes: {
			add: op('graphs.episodes.add'),
			delete: op('graphs.episodes.delete'),
			get: op('graphs.episodes.get'),
			getDebugLogs: op('graphs.episodes.getDebugLogs'),
			list: op('graphs.episodes.list'),
			listIngestionTraces: op('graphs.episodes.listIngestionTraces'),
			update: op('graphs.episodes.update'),
		},
		get: op('graphs.get'),
		getContentPolicy: op('graphs.getContentPolicy'),
		getContext: op('graphs.getContext'),
		getInclusionRules: op('graphs.getInclusionRules'),
		getInstructions: op('graphs.getInstructions'),
		getKnowledge: op('graphs.getKnowledge'),
		getObservationSteering: op('graphs.getObservationSteering'),
		getOntology: op('graphs.getOntology'),
		getSubgraph: op('graphs.getSubgraph'),
		hyperedges: {
			add: op('graphs.hyperedges.add'),
			createEdge: op('graphs.hyperedges.createEdge'),
			delete: op('graphs.hyperedges.delete'),
			deleteEdge: op('graphs.hyperedges.deleteEdge'),
			get: op('graphs.hyperedges.get'),
			list: op('graphs.hyperedges.list'),
			update: op('graphs.hyperedges.update'),
		},
		list: op('graphs.list'),
		listContentPolicyEvents: op('graphs.listContentPolicyEvents'),
		listMetadataKeys: op('graphs.listMetadataKeys'),
		lookup: op('graphs.lookup'),
		nodes: {
			add: op('graphs.nodes.add'),
			delete: op('graphs.nodes.delete'),
			get: op('graphs.nodes.get'),
			list: op('graphs.nodes.list'),
			listNeighbors: op('graphs.nodes.listNeighbors'),
			update: op('graphs.nodes.update'),
		},
		observations: {
			get: op('graphs.observations.get'),
			list: op('graphs.observations.list'),
		},
		query: op('graphs.query'),
		searchEdges: op('graphs.searchEdges'),
		searchEpisodes: op('graphs.searchEpisodes'),
		searchNodes: op('graphs.searchNodes'),
		searchObservations: op('graphs.searchObservations'),
		searchThreadSummaries: op('graphs.searchThreadSummaries'),
		setInclusionRules: op('graphs.setInclusionRules'),
		setInstructions: op('graphs.setInstructions'),
		setKnowledge: op('graphs.setKnowledge'),
		setObservationSteering: op('graphs.setObservationSteering'),
		setOntology: op('graphs.setOntology'),
		threadSummaries: {
			list: op('graphs.threadSummaries.list'),
		},
		update: op('graphs.update'),
		warm: op('graphs.warm'),
	},
	lookup: {
		developerIds: op('lookup.developerIds'),
	},
	project: {
		get: op('project.get'),
		getContentPolicy: op('project.getContentPolicy'),
		getContentPolicyRevision: op('project.getContentPolicyRevision'),
		getInclusionRules: op('project.getInclusionRules'),
		getInstructions: op('project.getInstructions'),
		getKnowledge: op('project.getKnowledge'),
		getObservationSteering: op('project.getObservationSteering'),
		getOntology: op('project.getOntology'),
		getUserSummaryInstructions: op('project.getUserSummaryInstructions'),
		listContentPolicyRevisions: op('project.listContentPolicyRevisions'),
		setContentPolicy: op('project.setContentPolicy'),
		setInclusionRules: op('project.setInclusionRules'),
		setInstructions: op('project.setInstructions'),
		setKnowledge: op('project.setKnowledge'),
		setObservationSteering: op('project.setObservationSteering'),
		setOntology: op('project.setOntology'),
		setUserSummaryInstructions: op('project.setUserSummaryInstructions'),
		update: op('project.update'),
	},
	tasks: {
		get: op('tasks.get'),
		list: op('tasks.list'),
	},
	threads: {
		create: op('threads.create'),
		delete: op('threads.delete'),
		get: op('threads.get'),
		getContext: op('threads.getContext'),
		getSummary: op('threads.getSummary'),
		list: op('threads.list'),
		listEpisodes: op('threads.listEpisodes'),
		lookup: op('threads.lookup'),
		messages: {
			add: op('threads.messages.add'),
			get: op('threads.messages.get'),
			list: op('threads.messages.list'),
			update: op('threads.messages.update'),
		},
	},
	traceConnections: {
		create: op('traceConnections.create'),
		delete: op('traceConnections.delete'),
		get: op('traceConnections.get'),
		getTrace: op('traceConnections.getTrace'),
		list: op('traceConnections.list'),
		listProjects: op('traceConnections.listProjects'),
		listTraces: op('traceConnections.listTraces'),
		update: op('traceConnections.update'),
		verify: op('traceConnections.verify'),
	},
	userGroups: {
		addMembers: op('userGroups.addMembers'),
		attachPolicySet: op('userGroups.attachPolicySet'),
		create: op('userGroups.create'),
		delete: op('userGroups.delete'),
		detachPolicySet: op('userGroups.detachPolicySet'),
		get: op('userGroups.get'),
		list: op('userGroups.list'),
		listMemberCandidates: op('userGroups.listMemberCandidates'),
		listMembers: op('userGroups.listMembers'),
		listPolicySets: op('userGroups.listPolicySets'),
		removeMember: op('userGroups.removeMember'),
		removeMembers: op('userGroups.removeMembers'),
		update: op('userGroups.update'),
	},
	users: {
		create: op('users.create'),
		delete: op('users.delete'),
		get: op('users.get'),
		getByEmail: op('users.getByEmail'),
		getNode: op('users.getNode'),
		getSummaryInstructions: op('users.getSummaryInstructions'),
		list: op('users.list'),
		listUserGroups: op('users.listUserGroups'),
		lookup: op('users.lookup'),
		setSummaryInstructions: op('users.setSummaryInstructions'),
		update: op('users.update'),
	},
} as const;

export const zepEndpointSchemas = {
	'agents.create': zepSchemaEntry('agents.create'),
	'agents.declareBreakingChange': zepSchemaEntry(
		'agents.declareBreakingChange',
	),
	'agents.delete': zepSchemaEntry('agents.delete'),
	'agents.get': zepSchemaEntry('agents.get'),
	'agents.getContext': zepSchemaEntry('agents.getContext'),
	'agents.learning.get': zepSchemaEntry('agents.learning.get'),
	'agents.learning.listRuns': zepSchemaEntry('agents.learning.listRuns'),
	'agents.list': zepSchemaEntry('agents.list'),
	'agents.literalPolicy.get': zepSchemaEntry('agents.literalPolicy.get'),
	'agents.literalPolicy.update': zepSchemaEntry('agents.literalPolicy.update'),
	'agents.planSplit': zepSchemaEntry('agents.planSplit'),
	'agents.skillCandidates.evaluate': zepSchemaEntry(
		'agents.skillCandidates.evaluate',
	),
	'agents.skillCandidates.get': zepSchemaEntry('agents.skillCandidates.get'),
	'agents.skillCandidates.list': zepSchemaEntry('agents.skillCandidates.list'),
	'agents.skillPublications.lookup': zepSchemaEntry(
		'agents.skillPublications.lookup',
	),
	'agents.skills.approve': zepSchemaEntry('agents.skills.approve'),
	'agents.skills.create': zepSchemaEntry('agents.skills.create'),
	'agents.skills.createVersion': zepSchemaEntry('agents.skills.createVersion'),
	'agents.skills.evaluations.create': zepSchemaEntry(
		'agents.skills.evaluations.create',
	),
	'agents.skills.evidence.list': zepSchemaEntry('agents.skills.evidence.list'),
	'agents.skills.get': zepSchemaEntry('agents.skills.get'),
	'agents.skills.getPublication': zepSchemaEntry(
		'agents.skills.getPublication',
	),
	'agents.skills.importPackage': zepSchemaEntry('agents.skills.importPackage'),
	'agents.skills.list': zepSchemaEntry('agents.skills.list'),
	'agents.skills.relations.list': zepSchemaEntry(
		'agents.skills.relations.list',
	),
	'agents.skills.retire': zepSchemaEntry('agents.skills.retire'),
	'agents.skills.search': zepSchemaEntry('agents.skills.search'),
	'agents.skills.uses.addOutcome': zepSchemaEntry(
		'agents.skills.uses.addOutcome',
	),
	'agents.skills.uses.create': zepSchemaEntry('agents.skills.uses.create'),
	'agents.skills.versions.compare': zepSchemaEntry(
		'agents.skills.versions.compare',
	),
	'agents.skills.versions.exports.create': zepSchemaEntry(
		'agents.skills.versions.exports.create',
	),
	'agents.skills.versions.exports.get': zepSchemaEntry(
		'agents.skills.versions.exports.get',
	),
	'agents.skills.versions.get': zepSchemaEntry('agents.skills.versions.get'),
	'agents.skills.versions.list': zepSchemaEntry('agents.skills.versions.list'),
	'agents.skills.versions.restore': zepSchemaEntry(
		'agents.skills.versions.restore',
	),
	'agents.taskFamilies.list': zepSchemaEntry('agents.taskFamilies.list'),
	'agents.taskFamilies.rename': zepSchemaEntry('agents.taskFamilies.rename'),
	'agents.traceImports.create': zepSchemaEntry('agents.traceImports.create'),
	'agents.traceImports.delete': zepSchemaEntry('agents.traceImports.delete'),
	'agents.traceImports.get': zepSchemaEntry('agents.traceImports.get'),
	'agents.traceImports.list': zepSchemaEntry('agents.traceImports.list'),
	'agents.traceImports.pause': zepSchemaEntry('agents.traceImports.pause'),
	'agents.traceImports.resume': zepSchemaEntry('agents.traceImports.resume'),
	'agents.traceImports.runs.create': zepSchemaEntry(
		'agents.traceImports.runs.create',
	),
	'agents.traceImports.runs.get': zepSchemaEntry(
		'agents.traceImports.runs.get',
	),
	'agents.traceImports.runs.items.list': zepSchemaEntry(
		'agents.traceImports.runs.items.list',
	),
	'agents.traceImports.runs.list': zepSchemaEntry(
		'agents.traceImports.runs.list',
	),
	'agents.traceImports.update': zepSchemaEntry('agents.traceImports.update'),
	'agents.traces.abandon': zepSchemaEntry('agents.traces.abandon'),
	'agents.traces.appendEvent': zepSchemaEntry('agents.traces.appendEvent'),
	'agents.traces.close': zepSchemaEntry('agents.traces.close'),
	'agents.traces.correctTaskFamily': zepSchemaEntry(
		'agents.traces.correctTaskFamily',
	),
	'agents.traces.create': zepSchemaEntry('agents.traces.create'),
	'agents.traces.delete': zepSchemaEntry('agents.traces.delete'),
	'agents.traces.deleteEvent': zepSchemaEntry('agents.traces.deleteEvent'),
	'agents.traces.get': zepSchemaEntry('agents.traces.get'),
	'agents.traces.getSummary': zepSchemaEntry('agents.traces.getSummary'),
	'agents.traces.list': zepSchemaEntry('agents.traces.list'),
	'agents.traces.listEvents': zepSchemaEntry('agents.traces.listEvents'),
	'agents.traces.listSummaryVersions': zepSchemaEntry(
		'agents.traces.listSummaryVersions',
	),
	'agents.traces.reopen': zepSchemaEntry('agents.traces.reopen'),
	'agents.traces.update': zepSchemaEntry('agents.traces.update'),
	'agents.update': zepSchemaEntry('agents.update'),
	'agents.verifiers.get': zepSchemaEntry('agents.verifiers.get'),
	'agents.verifiers.invalidateEvidence': zepSchemaEntry(
		'agents.verifiers.invalidateEvidence',
	),
	'agents.verifiers.list': zepSchemaEntry('agents.verifiers.list'),
	'agents.verifiers.revoke': zepSchemaEntry('agents.verifiers.revoke'),
	'agents.verifiers.update': zepSchemaEntry('agents.verifiers.update'),
	'batches.addItems': zepSchemaEntry('batches.addItems'),
	'batches.create': zepSchemaEntry('batches.create'),
	'batches.delete': zepSchemaEntry('batches.delete'),
	'batches.get': zepSchemaEntry('batches.get'),
	'batches.list': zepSchemaEntry('batches.list'),
	'batches.listItems': zepSchemaEntry('batches.listItems'),
	'batches.process': zepSchemaEntry('batches.process'),
	'contextTemplates.create': zepSchemaEntry('contextTemplates.create'),
	'contextTemplates.delete': zepSchemaEntry('contextTemplates.delete'),
	'contextTemplates.get': zepSchemaEntry('contextTemplates.get'),
	'contextTemplates.list': zepSchemaEntry('contextTemplates.list'),
	'contextTemplates.update': zepSchemaEntry('contextTemplates.update'),
	'debugLogs.enable': zepSchemaEntry('debugLogs.enable'),
	'graphs.clone': zepSchemaEntry('graphs.clone'),
	'graphs.create': zepSchemaEntry('graphs.create'),
	'graphs.delete': zepSchemaEntry('graphs.delete'),
	'graphs.documentSummaries.list': zepSchemaEntry(
		'graphs.documentSummaries.list',
	),
	'graphs.edges.add': zepSchemaEntry('graphs.edges.add'),
	'graphs.edges.delete': zepSchemaEntry('graphs.edges.delete'),
	'graphs.edges.get': zepSchemaEntry('graphs.edges.get'),
	'graphs.edges.list': zepSchemaEntry('graphs.edges.list'),
	'graphs.edges.update': zepSchemaEntry('graphs.edges.update'),
	'graphs.episodes.add': zepSchemaEntry('graphs.episodes.add'),
	'graphs.episodes.delete': zepSchemaEntry('graphs.episodes.delete'),
	'graphs.episodes.get': zepSchemaEntry('graphs.episodes.get'),
	'graphs.episodes.getDebugLogs': zepSchemaEntry(
		'graphs.episodes.getDebugLogs',
	),
	'graphs.episodes.list': zepSchemaEntry('graphs.episodes.list'),
	'graphs.episodes.listIngestionTraces': zepSchemaEntry(
		'graphs.episodes.listIngestionTraces',
	),
	'graphs.episodes.update': zepSchemaEntry('graphs.episodes.update'),
	'graphs.get': zepSchemaEntry('graphs.get'),
	'graphs.getContentPolicy': zepSchemaEntry('graphs.getContentPolicy'),
	'graphs.getContext': zepSchemaEntry('graphs.getContext'),
	'graphs.getInclusionRules': zepSchemaEntry('graphs.getInclusionRules'),
	'graphs.getInstructions': zepSchemaEntry('graphs.getInstructions'),
	'graphs.getKnowledge': zepSchemaEntry('graphs.getKnowledge'),
	'graphs.getObservationSteering': zepSchemaEntry(
		'graphs.getObservationSteering',
	),
	'graphs.getOntology': zepSchemaEntry('graphs.getOntology'),
	'graphs.getSubgraph': zepSchemaEntry('graphs.getSubgraph'),
	'graphs.hyperedges.add': zepSchemaEntry('graphs.hyperedges.add'),
	'graphs.hyperedges.createEdge': zepSchemaEntry(
		'graphs.hyperedges.createEdge',
	),
	'graphs.hyperedges.delete': zepSchemaEntry('graphs.hyperedges.delete'),
	'graphs.hyperedges.deleteEdge': zepSchemaEntry(
		'graphs.hyperedges.deleteEdge',
	),
	'graphs.hyperedges.get': zepSchemaEntry('graphs.hyperedges.get'),
	'graphs.hyperedges.list': zepSchemaEntry('graphs.hyperedges.list'),
	'graphs.hyperedges.update': zepSchemaEntry('graphs.hyperedges.update'),
	'graphs.list': zepSchemaEntry('graphs.list'),
	'graphs.listContentPolicyEvents': zepSchemaEntry(
		'graphs.listContentPolicyEvents',
	),
	'graphs.listMetadataKeys': zepSchemaEntry('graphs.listMetadataKeys'),
	'graphs.lookup': zepSchemaEntry('graphs.lookup'),
	'graphs.nodes.add': zepSchemaEntry('graphs.nodes.add'),
	'graphs.nodes.delete': zepSchemaEntry('graphs.nodes.delete'),
	'graphs.nodes.get': zepSchemaEntry('graphs.nodes.get'),
	'graphs.nodes.list': zepSchemaEntry('graphs.nodes.list'),
	'graphs.nodes.listNeighbors': zepSchemaEntry('graphs.nodes.listNeighbors'),
	'graphs.nodes.update': zepSchemaEntry('graphs.nodes.update'),
	'graphs.observations.get': zepSchemaEntry('graphs.observations.get'),
	'graphs.observations.list': zepSchemaEntry('graphs.observations.list'),
	'graphs.query': zepSchemaEntry('graphs.query'),
	'graphs.searchEdges': zepSchemaEntry('graphs.searchEdges'),
	'graphs.searchEpisodes': zepSchemaEntry('graphs.searchEpisodes'),
	'graphs.searchNodes': zepSchemaEntry('graphs.searchNodes'),
	'graphs.searchObservations': zepSchemaEntry('graphs.searchObservations'),
	'graphs.searchThreadSummaries': zepSchemaEntry(
		'graphs.searchThreadSummaries',
	),
	'graphs.setInclusionRules': zepSchemaEntry('graphs.setInclusionRules'),
	'graphs.setInstructions': zepSchemaEntry('graphs.setInstructions'),
	'graphs.setKnowledge': zepSchemaEntry('graphs.setKnowledge'),
	'graphs.setObservationSteering': zepSchemaEntry(
		'graphs.setObservationSteering',
	),
	'graphs.setOntology': zepSchemaEntry('graphs.setOntology'),
	'graphs.threadSummaries.list': zepSchemaEntry('graphs.threadSummaries.list'),
	'graphs.update': zepSchemaEntry('graphs.update'),
	'graphs.warm': zepSchemaEntry('graphs.warm'),
	'lookup.developerIds': zepSchemaEntry('lookup.developerIds'),
	'project.get': zepSchemaEntry('project.get'),
	'project.getContentPolicy': zepSchemaEntry('project.getContentPolicy'),
	'project.getContentPolicyRevision': zepSchemaEntry(
		'project.getContentPolicyRevision',
	),
	'project.getInclusionRules': zepSchemaEntry('project.getInclusionRules'),
	'project.getInstructions': zepSchemaEntry('project.getInstructions'),
	'project.getKnowledge': zepSchemaEntry('project.getKnowledge'),
	'project.getObservationSteering': zepSchemaEntry(
		'project.getObservationSteering',
	),
	'project.getOntology': zepSchemaEntry('project.getOntology'),
	'project.getUserSummaryInstructions': zepSchemaEntry(
		'project.getUserSummaryInstructions',
	),
	'project.listContentPolicyRevisions': zepSchemaEntry(
		'project.listContentPolicyRevisions',
	),
	'project.setContentPolicy': zepSchemaEntry('project.setContentPolicy'),
	'project.setInclusionRules': zepSchemaEntry('project.setInclusionRules'),
	'project.setInstructions': zepSchemaEntry('project.setInstructions'),
	'project.setKnowledge': zepSchemaEntry('project.setKnowledge'),
	'project.setObservationSteering': zepSchemaEntry(
		'project.setObservationSteering',
	),
	'project.setOntology': zepSchemaEntry('project.setOntology'),
	'project.setUserSummaryInstructions': zepSchemaEntry(
		'project.setUserSummaryInstructions',
	),
	'project.update': zepSchemaEntry('project.update'),
	'tasks.get': zepSchemaEntry('tasks.get'),
	'tasks.list': zepSchemaEntry('tasks.list'),
	'threads.create': zepSchemaEntry('threads.create'),
	'threads.delete': zepSchemaEntry('threads.delete'),
	'threads.get': zepSchemaEntry('threads.get'),
	'threads.getContext': zepSchemaEntry('threads.getContext'),
	'threads.getSummary': zepSchemaEntry('threads.getSummary'),
	'threads.list': zepSchemaEntry('threads.list'),
	'threads.listEpisodes': zepSchemaEntry('threads.listEpisodes'),
	'threads.lookup': zepSchemaEntry('threads.lookup'),
	'threads.messages.add': zepSchemaEntry('threads.messages.add'),
	'threads.messages.get': zepSchemaEntry('threads.messages.get'),
	'threads.messages.list': zepSchemaEntry('threads.messages.list'),
	'threads.messages.update': zepSchemaEntry('threads.messages.update'),
	'traceConnections.create': zepSchemaEntry('traceConnections.create'),
	'traceConnections.delete': zepSchemaEntry('traceConnections.delete'),
	'traceConnections.get': zepSchemaEntry('traceConnections.get'),
	'traceConnections.getTrace': zepSchemaEntry('traceConnections.getTrace'),
	'traceConnections.list': zepSchemaEntry('traceConnections.list'),
	'traceConnections.listProjects': zepSchemaEntry(
		'traceConnections.listProjects',
	),
	'traceConnections.listTraces': zepSchemaEntry('traceConnections.listTraces'),
	'traceConnections.update': zepSchemaEntry('traceConnections.update'),
	'traceConnections.verify': zepSchemaEntry('traceConnections.verify'),
	'userGroups.addMembers': zepSchemaEntry('userGroups.addMembers'),
	'userGroups.attachPolicySet': zepSchemaEntry('userGroups.attachPolicySet'),
	'userGroups.create': zepSchemaEntry('userGroups.create'),
	'userGroups.delete': zepSchemaEntry('userGroups.delete'),
	'userGroups.detachPolicySet': zepSchemaEntry('userGroups.detachPolicySet'),
	'userGroups.get': zepSchemaEntry('userGroups.get'),
	'userGroups.list': zepSchemaEntry('userGroups.list'),
	'userGroups.listMemberCandidates': zepSchemaEntry(
		'userGroups.listMemberCandidates',
	),
	'userGroups.listMembers': zepSchemaEntry('userGroups.listMembers'),
	'userGroups.listPolicySets': zepSchemaEntry('userGroups.listPolicySets'),
	'userGroups.removeMember': zepSchemaEntry('userGroups.removeMember'),
	'userGroups.removeMembers': zepSchemaEntry('userGroups.removeMembers'),
	'userGroups.update': zepSchemaEntry('userGroups.update'),
	'users.create': zepSchemaEntry('users.create'),
	'users.delete': zepSchemaEntry('users.delete'),
	'users.get': zepSchemaEntry('users.get'),
	'users.getByEmail': zepSchemaEntry('users.getByEmail'),
	'users.getNode': zepSchemaEntry('users.getNode'),
	'users.getSummaryInstructions': zepSchemaEntry(
		'users.getSummaryInstructions',
	),
	'users.list': zepSchemaEntry('users.list'),
	'users.listUserGroups': zepSchemaEntry('users.listUserGroups'),
	'users.lookup': zepSchemaEntry('users.lookup'),
	'users.setSummaryInstructions': zepSchemaEntry(
		'users.setSummaryInstructions',
	),
	'users.update': zepSchemaEntry('users.update'),
} satisfies RequiredPluginEndpointSchemas<typeof zepEndpointsNested>;

export const zepEndpointMeta = {
	'agents.create': {
		riskLevel: 'write',
		description: 'Create Agent. (POST /agents)',
	},
	'agents.declareBreakingChange': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Declare a breaking Agent deployment change. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Agent. Cannot be undone. (DELETE /agents/{agent_uuid})',
	},
	'agents.get': {
		riskLevel: 'read',
		description: 'Get Agent. (GET /agents/{agent_uuid})',
	},
	'agents.getContext': {
		riskLevel: 'read',
		description:
			'Get Agent context. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.learning.get': {
		riskLevel: 'read',
		description:
			'Get Agent Learning State. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.learning.listRuns': {
		riskLevel: 'read',
		description:
			'List Agent Skill Compilation Outcomes. List durable learning-run outcomes for an Agent. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.list': {
		riskLevel: 'read',
		description: 'List Agents. (POST /agents/list)',
	},
	'agents.literalPolicy.get': {
		riskLevel: 'read',
		description:
			'Get Agent Literal Policy. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.literalPolicy.update': {
		riskLevel: 'write',
		description:
			'Update Agent Literal Policy. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.planSplit': {
		riskLevel: 'read',
		description:
			'Plan an Agent split. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skillCandidates.evaluate': {
		riskLevel: 'write',
		description: 'Record Agent Skill Candidate Evaluation.',
	},
	'agents.skillCandidates.get': {
		riskLevel: 'read',
		description:
			'Get Agent Skill Candidate Review. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skillCandidates.list': {
		riskLevel: 'read',
		description:
			'List Agent Skill Candidate Reviews. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skillPublications.lookup': {
		riskLevel: 'read',
		description:
			'Look up automatic Skill publication lineage. Find a destination Skill by its source Agent, Skill, and version. The endpoint returns 404 until an automatic publication is ready or after it is invalidated. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.approve': {
		riskLevel: 'write',
		description:
			'Approve Agent Skill. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.create': {
		riskLevel: 'write',
		description:
			'Create Agent Skill. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.createVersion': {
		riskLevel: 'write',
		description:
			'Create Agent Skill Version. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.evaluations.create': {
		riskLevel: 'write',
		description:
			'Record Agent Skill Evaluation. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.evidence.list': {
		riskLevel: 'read',
		description:
			'List Agent Skill Evidence. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.get': {
		riskLevel: 'read',
		description:
			'Get Agent Skill. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.getPublication': {
		riskLevel: 'read',
		description:
			'Get automatic Skill publication lineage. Get the publication that created a destination Skill. Use its source version and policy identity to verify a copied Skill. The endpoint returns 404 for unpublished and invalidated Skills. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.importPackage': {
		riskLevel: 'write',
		description:
			'Import an Agent Skill. Submit a portable Skill archive. The completed Task returns {"result":{"skill_uuid":"<uuid>"}}. Approve that Skill before retrieval. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.list': {
		riskLevel: 'read',
		description:
			'List Agent Skills. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.relations.list': {
		riskLevel: 'read',
		description:
			'List Agent Skill Relationships. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.retire': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Retire Agent Skill. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.search': {
		riskLevel: 'read',
		description:
			'Search Agent Skills. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.uses.addOutcome': {
		riskLevel: 'write',
		description:
			'Record Agent Skill Feedback. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.uses.create': {
		riskLevel: 'write',
		description:
			'Create Agent Skill Use. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.versions.compare': {
		riskLevel: 'read',
		description:
			'Compare Agent Skill Versions. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.versions.exports.create': {
		riskLevel: 'write',
		description:
			'Export an Agent Skill version. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.versions.exports.get': {
		riskLevel: 'read',
		description:
			'Download an Agent Skill export. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.versions.get': {
		riskLevel: 'read',
		description:
			'Get Agent Skill Version. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.versions.list': {
		riskLevel: 'read',
		description:
			'List Agent Skill Versions. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.skills.versions.restore': {
		riskLevel: 'write',
		description:
			'Restore Agent Skill Version. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.taskFamilies.list': {
		riskLevel: 'read',
		description:
			'List Agent Task Families. (POST /agents/{agent_uuid}/task-families/list)',
	},
	'agents.taskFamilies.rename': {
		riskLevel: 'write',
		description:
			'Rename Agent Task Family. (POST /agents/{agent_uuid}/task-families/rename)',
	},
	'agents.traceImports.create': {
		riskLevel: 'write',
		description:
			'Create a trace import. Create a scheduled import or queue a one-time import. A scheduled import returns HTTP 201 with import. A one-time import returns HTTP 202 with import, run, and task. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a trace import. Set traces=delete to queue asynchronous Trace deletion. The default keeps Traces. Example query: ?traces=delete. Agent Skills is in closed release: accounts without access get 403 permission_denied. Cannot be undone.',
	},
	'agents.traceImports.get': {
		riskLevel: 'read',
		description:
			'Get a trace import. Read one trace import. The response does not include its source cursor. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.list': {
		riskLevel: 'read',
		description:
			'List trace imports. List trace imports that belong to this Agent. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.pause': {
		riskLevel: 'write',
		description:
			'Pause a trace import. Pause a scheduled trace import. One-time imports cannot be paused. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.resume': {
		riskLevel: 'write',
		description:
			'Resume a trace import. Resume a scheduled trace import. Zep verifies credentials first when they caused the pause. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.runs.create': {
		riskLevel: 'write',
		description:
			'Create a trace import run. Create a pending run and its Task. This operation does not start the run. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.runs.get': {
		riskLevel: 'read',
		description:
			'Get a trace import run. Read one run that belongs to this trace import. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.runs.items.list': {
		riskLevel: 'read',
		description:
			'List trace import run items. List trace results for this run. Run items do not include source payload. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.runs.list': {
		riskLevel: 'read',
		description:
			'List trace import runs. List runs that belong to this trace import. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traceImports.update': {
		riskLevel: 'write',
		description:
			'Update a trace import. Use expected_revision to reject a stale update. Example request: {"expected_revision":1,"name":"Updated support traces"}. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.traces.abandon': {
		riskLevel: 'write',
		description:
			'Abandon Agent Trace. (POST /agents/{agent_uuid}/traces/{trace_uuid}/abandon)',
	},
	'agents.traces.appendEvent': {
		riskLevel: 'write',
		description:
			'Append Agent Trace Event. A tool call and its result can share a tool_call_id. For example, append {"event_type":"tool_call","tool_call_id":"call_8f2b","content":"Search orders","context":{"tools":[{"name":"search_orders"}]}} and {"event_type":"tool_result","tool_call_id":"call_8f2b","content":"Order…',
	},
	'agents.traces.close': {
		riskLevel: 'write',
		description:
			'Close Agent Trace. (POST /agents/{agent_uuid}/traces/{trace_uuid}/close)',
	},
	'agents.traces.correctTaskFamily': {
		riskLevel: 'write',
		description:
			'Correct Agent Trace Task Family. (POST /agents/{agent_uuid}/traces/{trace_uuid}/correct-task-family)',
	},
	'agents.traces.create': {
		riskLevel: 'write',
		description: 'Create Agent Trace. (POST /agents/{agent_uuid}/traces)',
	},
	'agents.traces.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete Agent Trace. Cannot be undone. (DELETE /agents/{agent_uuid}/traces/{trace_uuid})',
	},
	'agents.traces.deleteEvent': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Agent Trace Event. Cannot be undone.',
	},
	'agents.traces.get': {
		riskLevel: 'read',
		description:
			'Get Agent Trace. (GET /agents/{agent_uuid}/traces/{trace_uuid})',
	},
	'agents.traces.getSummary': {
		riskLevel: 'read',
		description:
			'Get Current Agent Trace Summary. (GET /agents/{agent_uuid}/traces/{trace_uuid}/summary)',
	},
	'agents.traces.list': {
		riskLevel: 'read',
		description: 'List Agent Traces. (POST /agents/{agent_uuid}/traces/list)',
	},
	'agents.traces.listEvents': {
		riskLevel: 'read',
		description:
			'List Agent Trace Events. (GET /agents/{agent_uuid}/traces/{trace_uuid}/events)',
	},
	'agents.traces.listSummaryVersions': {
		riskLevel: 'read',
		description:
			'List Agent Trace Summary Versions. (GET /agents/{agent_uuid}/traces/{trace_uuid}/summary/versions)',
	},
	'agents.traces.reopen': {
		riskLevel: 'write',
		description:
			'Reopen Agent Trace. (POST /agents/{agent_uuid}/traces/{trace_uuid}/reopen)',
	},
	'agents.traces.update': {
		riskLevel: 'write',
		description:
			'Update Agent Trace. (PATCH /agents/{agent_uuid}/traces/{trace_uuid})',
	},
	'agents.update': {
		riskLevel: 'write',
		description: 'Update Agent. (PATCH /agents/{agent_uuid})',
	},
	'agents.verifiers.get': {
		riskLevel: 'read',
		description:
			'Get Agent Verifier. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.verifiers.invalidateEvidence': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Invalidate Agent Verifier Evidence. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.verifiers.list': {
		riskLevel: 'read',
		description:
			'List Agent Verifiers. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.verifiers.revoke': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke Agent Verifier. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'agents.verifiers.update': {
		riskLevel: 'write',
		description:
			'Update Agent Verifier. Agent Skills is in closed release: accounts without access get 403 permission_denied.',
	},
	'batches.addItems': {
		riskLevel: 'write',
		description: 'Add batch items. (POST /batches/{batch_uuid}/items)',
	},
	'batches.create': {
		riskLevel: 'write',
		description: 'Create batch. (POST /batches)',
	},
	'batches.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete batch. Cannot be undone. (DELETE /batches/{batch_uuid})',
	},
	'batches.get': {
		riskLevel: 'read',
		description: 'Get batch. (GET /batches/{batch_uuid})',
	},
	'batches.list': {
		riskLevel: 'read',
		description: 'List batches. (GET /batches)',
	},
	'batches.listItems': {
		riskLevel: 'read',
		description: 'List batch items. (GET /batches/{batch_uuid}/items)',
	},
	'batches.process': {
		riskLevel: 'write',
		description: 'Process batch. (POST /batches/{batch_uuid}/process)',
	},
	'contextTemplates.create': {
		riskLevel: 'write',
		description: 'Create context template. (POST /context-templates)',
	},
	'contextTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete context template. Cannot be undone.',
	},
	'contextTemplates.get': {
		riskLevel: 'read',
		description:
			'Get context template. (GET /context-templates/{template_uuid})',
	},
	'contextTemplates.list': {
		riskLevel: 'read',
		description: 'List context templates. (POST /context-templates/list)',
	},
	'contextTemplates.update': {
		riskLevel: 'write',
		description:
			'Update context template. (PUT /context-templates/{template_uuid})',
	},
	'debugLogs.enable': {
		riskLevel: 'write',
		description:
			'Enable debug logging. Enables debug logging for the project for one hour, or for 24 hours on the Enterprise plan. Episodes ingested while debug logging is enabled have a debug log (see graph.episode.get_debug_logs).',
	},
	'graphs.clone': {
		riskLevel: 'write',
		description: 'Clone graph. (POST /graphs/{graph_uuid}/clone)',
	},
	'graphs.create': {
		riskLevel: 'write',
		description: 'Create graph. (POST /graphs)',
	},
	'graphs.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete graph. Cannot be undone. (DELETE /graphs/{graph_uuid})',
	},
	'graphs.documentSummaries.list': {
		riskLevel: 'read',
		description:
			'List document summaries. Lists the document summaries of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid or created_at. The default sort is uuid in descending order.',
	},
	'graphs.edges.add': {
		riskLevel: 'write',
		description:
			'Add edges. Adds 1 to 100 edges. A name creates a node when deduplicate is false. When deduplicate is true, Zep matches a node by name first.',
	},
	'graphs.edges.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete edge. Cannot be undone. (DELETE /graphs/{graph_uuid}/edges/{edge_uuid})',
	},
	'graphs.edges.get': {
		riskLevel: 'read',
		description: 'Get edge. (GET /graphs/{graph_uuid}/edges/{edge_uuid})',
	},
	'graphs.edges.list': {
		riskLevel: 'read',
		description:
			'List edges. Lists the edges of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid, created_at, or valid_at. The default sort is uuid in descending order. An edge with no valid_at sorts as if its valid_at is 1970-01-01T00:00:00Z.',
	},
	'graphs.edges.update': {
		riskLevel: 'write',
		description:
			'Update edge. Updates one edge. When the edge belongs to a hyperedge, changing fact rewrites it on every member of that hyperedge in one all-or-nothing write, because the members share it. Attribute-only edits touch this edge alone.',
	},
	'graphs.episodes.add': {
		riskLevel: 'write',
		description: 'Add episode. (POST /graphs/{graph_uuid}/episodes)',
	},
	'graphs.episodes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete episode. Cannot be undone. (DELETE /graphs/{graph_uuid}/episodes/{episode_uuid})',
	},
	'graphs.episodes.get': {
		riskLevel: 'read',
		description:
			'Get episode. (GET /graphs/{graph_uuid}/episodes/{episode_uuid})',
	},
	'graphs.episodes.getDebugLogs': {
		riskLevel: 'read',
		description:
			'Get episode debug logs. Returns the ingestion workflow log of an episode. The log exists only when debug logging was enabled for the project when the episode was ingested (see debug_log.enable).',
	},
	'graphs.episodes.list': {
		riskLevel: 'read',
		description:
			'List episodes. Lists the episodes of a graph. filters.mentioned_node_uuids restricts the results to episodes that mention any of the listed node UUIDs. The list can also contain episode UUIDs: an episode UUID matches that episode, so one request can return a known set of episodes. At most 256 entries.',
	},
	'graphs.episodes.listIngestionTraces': {
		riskLevel: 'read',
		description:
			'List episode ingestion traces. Returns the ingestion traces of an episode, oldest first. Each trace records the input and the output of one ingestion step, with an explanation on each output entry that has one.',
	},
	'graphs.episodes.update': {
		riskLevel: 'write',
		description:
			'Update episode. (PATCH /graphs/{graph_uuid}/episodes/{episode_uuid})',
	},
	'graphs.get': {
		riskLevel: 'read',
		description: 'Get graph. (GET /graphs/{graph_uuid})',
	},
	'graphs.getContentPolicy': {
		riskLevel: 'read',
		description:
			'Get graph content policy. Experimental: the request, the response, and the behavior of this operation can change. Returns the content policy the graph bound at creation. The policy of a graph does not change after creation. A graph without a content policy returns revision 0 with no categories and no rules.',
	},
	'graphs.getContext': {
		riskLevel: 'read',
		description: 'Assemble graph context. (POST /graphs/{graph_uuid}/context)',
	},
	'graphs.getInclusionRules': {
		riskLevel: 'read',
		description:
			'Get graph inclusion rules. Returns the graph rules, for example {"inclusion_rules":[],"inherited":true}. A free project answered 404 not_found to both the read and the write (11-27): the feature may need enabling on the account.',
	},
	'graphs.getInstructions': {
		riskLevel: 'read',
		description:
			'Get graph instructions. (GET /graphs/{graph_uuid}/instructions)',
	},
	'graphs.getKnowledge': {
		riskLevel: 'read',
		description:
			'Get graph knowledge. Returns the domain knowledge in effect at this scope. The knowledge_api account flag must be enabled. Response example: {"knowledge":[{"name":"CRM","text":"CRM means the customer service."}],"inherited":false}',
	},
	'graphs.getObservationSteering': {
		riskLevel: 'read',
		description:
			'Get graph observation steering. (GET /graphs/{graph_uuid}/observation-steering)',
	},
	'graphs.getOntology': {
		riskLevel: 'read',
		description: 'Get graph ontology. (GET /graphs/{graph_uuid}/ontology)',
	},
	'graphs.getSubgraph': {
		riskLevel: 'read',
		description: 'Get subgraph. (POST /graphs/{graph_uuid}/subgraph)',
	},
	'graphs.hyperedges.add': {
		riskLevel: 'write',
		description:
			'Add hyperedge. Creates one hyperedge: a fact that relates more than two nodes, written onto one member edge per node pair. The member edges must span at least three distinct nodes, since two nodes are a pair of edges rather than a hyperedge; a single pair uses graph.edge.add.',
	},
	'graphs.hyperedges.createEdge': {
		riskLevel: 'write',
		description:
			"Add hyperedge member. Adds one member edge to an existing hyperedge. The new member inherits the hyperedge's fact and timestamps and joins its episodes, so only its own name and node pair are supplied. The response contains the UUID that Zep assigned and the name and nodes that you supplied.",
	},
	'graphs.hyperedges.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete hyperedge. Deletes every member edge of the hyperedge. After the task completes the hyperedge and each of its members are gone. Cannot be undone.',
	},
	'graphs.hyperedges.deleteEdge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete hyperedge member. Removes one member edge from the hyperedge. The remaining members stay in the hyperedge, and deleting the last member removes the hyperedge itself. Cannot be undone.',
	},
	'graphs.hyperedges.get': {
		riskLevel: 'read',
		description:
			'Get hyperedge. Returns one hyperedge assembled from its member edges. The fact and the validity timestamps are shared by every member and are reported on the hyperedge; each member reports only its own name and endpoints.',
	},
	'graphs.hyperedges.list': {
		riskLevel: 'read',
		description:
			"List hyperedges. Returns the graph's hyperedges. A hyperedge is listed while it has at least one member edge. Supported filters are node_uuids, edge_uuids and episode_uuids: a hyperedge matches a list when any of its members does, and must match every list supplied.",
	},
	'graphs.hyperedges.update': {
		riskLevel: 'write',
		description:
			'Update hyperedge. Updates the shared fact and writes it onto every member edge in one all-or-nothing write: either every member carries the new fact or none does. Only fact is accepted, because it is the only field the members share.',
	},
	'graphs.list': {
		riskLevel: 'read',
		description: 'List graphs. (POST /graphs/list)',
	},
	'graphs.listContentPolicyEvents': {
		riskLevel: 'read',
		description:
			'List graph content policy events. Experimental: the request, the response, and the behavior of this operation can change. Lists the content policy decisions recorded for a graph, newest first. Each event carries identifiers only. A graph without a content policy returns an empty list.',
	},
	'graphs.listMetadataKeys': {
		riskLevel: 'read',
		description:
			'List graph metadata keys. Returns the append-only metadata keys recorded for a graph. A key can remain in the list after no episode or message uses it.',
	},
	'graphs.lookup': {
		riskLevel: 'read',
		description: 'Lookup graph by developer id. (POST /graphs/lookup)',
	},
	'graphs.nodes.add': {
		riskLevel: 'write',
		description: 'Add nodes. (POST /graphs/{graph_uuid}/nodes)',
	},
	'graphs.nodes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete node. Cannot be undone. (DELETE /graphs/{graph_uuid}/nodes/{node_uuid})',
	},
	'graphs.nodes.get': {
		riskLevel: 'read',
		description: 'Get node. (GET /graphs/{graph_uuid}/nodes/{node_uuid})',
	},
	'graphs.nodes.list': {
		riskLevel: 'read',
		description:
			'List nodes. Lists the nodes of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid, created_at, or degree. The default sort is uuid in descending order.',
	},
	'graphs.nodes.listNeighbors': {
		riskLevel: 'read',
		description:
			'List node neighbors. (POST /graphs/{graph_uuid}/nodes/{node_uuid}/neighbors)',
	},
	'graphs.nodes.update': {
		riskLevel: 'write',
		description: 'Update node. (PATCH /graphs/{graph_uuid}/nodes/{node_uuid})',
	},
	'graphs.observations.get': {
		riskLevel: 'read',
		description:
			'Get observation. (GET /graphs/{graph_uuid}/observations/{observation_uuid})',
	},
	'graphs.observations.list': {
		riskLevel: 'read',
		description:
			'List observations. Lists the observations of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid or created_at. The default sort is uuid in descending order.',
	},
	'graphs.query': {
		riskLevel: 'read',
		description:
			'Query a graph. Experimental. Smart Query retrieves multi-hop context from a graph in one call. Some agent tasks need multi-hop retrieval: the agent does not know in advance what to search for, so it must retrieve a record, learn from it, and then plan the next retrieval.',
	},
	'graphs.searchEdges': {
		riskLevel: 'read',
		description:
			'Search edges. Edge search does not support node_labels, exclude_node_labels, or content_policy_violated. content_policy_violated is supported on episode search only. An edge has two nodes, so a node label filter is not defined for edge search.',
	},
	'graphs.searchEpisodes': {
		riskLevel: 'read',
		description:
			'Search episodes. Episode search supports only the metadata_filters and content_policy_violated filters. Every other filter returns unsupported_filter.',
	},
	'graphs.searchNodes': {
		riskLevel: 'read',
		description:
			'Search nodes. Node search does not support edge_types, exclude_edge_types, edge_uuids, connected_node_uuids, source_node_uuids, target_node_uuids, date_filters, or content_policy_violated. content_policy_violated is supported on episode search only. The edge filters select edges.',
	},
	'graphs.searchObservations': {
		riskLevel: 'read',
		description:
			'Search observations. Observation search supports no filters. Every filter returns unsupported_filter.',
	},
	'graphs.searchThreadSummaries': {
		riskLevel: 'read',
		description:
			'Search thread summaries. Thread-summary search supports only the metadata_filters filter, which matches the metadata of the thread episodes. Every other filter returns unsupported_filter.',
	},
	'graphs.setInclusionRules': {
		riskLevel: 'write',
		description:
			'Set graph inclusion rules. Replaces the graph rules. Request: {"inclusion_rules":[]}. Response: {"inclusion_rules":[],"inherited":true}. A free project answered 404 not_found to both the read and the write (11-27): the feature may need enabling on the account.',
	},
	'graphs.setInstructions': {
		riskLevel: 'write',
		description:
			'Set graph instructions. (PUT /graphs/{graph_uuid}/instructions)',
	},
	'graphs.setKnowledge': {
		riskLevel: 'write',
		description:
			'Set graph knowledge. Replaces the complete set of domain knowledge entries at this scope. The knowledge_api account flag must be enabled.',
	},
	'graphs.setObservationSteering': {
		riskLevel: 'write',
		description:
			'Set graph observation steering. (PUT /graphs/{graph_uuid}/observation-steering)',
	},
	'graphs.setOntology': {
		riskLevel: 'write',
		description: 'Set graph ontology. (PUT /graphs/{graph_uuid}/ontology)',
	},
	'graphs.threadSummaries.list': {
		riskLevel: 'read',
		description:
			'List thread summaries. Lists the thread summaries of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid or created_at. The default sort is uuid in descending order.',
	},
	'graphs.update': {
		riskLevel: 'write',
		description: 'Update graph. (PATCH /graphs/{graph_uuid})',
	},
	'graphs.warm': {
		riskLevel: 'write',
		description: 'Warm graph. (POST /graphs/{graph_uuid}/warm)',
	},
	'lookup.developerIds': {
		riskLevel: 'read',
		description: 'Batch lookup of developer ids. (POST /lookup)',
	},
	'project.get': {
		riskLevel: 'read',
		description: 'Get project. (GET /project)',
	},
	'project.getContentPolicy': {
		riskLevel: 'read',
		description:
			'Get project content policy. Experimental: the request, the response, and the behavior of this operation can change. Returns the current content policy revision of the project. A new graph binds this revision at creation.',
	},
	'project.getContentPolicyRevision': {
		riskLevel: 'read',
		description:
			'Get project content policy revision. Experimental: the request, the response, and the behavior of this operation can change.',
	},
	'project.getInclusionRules': {
		riskLevel: 'read',
		description:
			'Get project inclusion rules. Returns the project rules, for example {"inclusion_rules":[],"inherited":false}. A free project answered 404 not_found to both the read and the write (11-27): the feature may need enabling on the account.',
	},
	'project.getInstructions': {
		riskLevel: 'read',
		description: 'Get project instructions. (GET /project/instructions)',
	},
	'project.getKnowledge': {
		riskLevel: 'read',
		description:
			'Get project knowledge. Returns the domain knowledge in effect at this scope. The knowledge_api account flag must be enabled. Response example: {"knowledge":[{"name":"CRM","text":"CRM means the customer service."}],"inherited":false}',
	},
	'project.getObservationSteering': {
		riskLevel: 'read',
		description:
			'Get project observation steering. (GET /project/observation-steering)',
	},
	'project.getOntology': {
		riskLevel: 'read',
		description: 'Get project ontology. (GET /project/ontology)',
	},
	'project.getUserSummaryInstructions': {
		riskLevel: 'read',
		description:
			'Get project user-summary instructions. (GET /project/user-summary-instructions)',
	},
	'project.listContentPolicyRevisions': {
		riskLevel: 'read',
		description:
			'List project content policy revisions. Experimental: the request, the response, and the behavior of this operation can change. Lists every revision of the project content policy, newest first, including revision 0.',
	},
	'project.setContentPolicy': {
		riskLevel: 'write',
		description:
			'Set project content policy. Experimental: this operation and the new rule fields can change. The typed rule fields are in private preview and are available only to enabled accounts. Replaces the project content policy and creates a new immutable revision. Graphs that already exist keep the revision they bound.',
	},
	'project.setInclusionRules': {
		riskLevel: 'write',
		description:
			'Set project inclusion rules. Replaces the project rules. Request: {"inclusion_rules":[]}. Response: {"inclusion_rules":[],"inherited":false}. A free project answered 404 not_found to both the read and the write (11-27): the feature may need enabling on the account.',
	},
	'project.setInstructions': {
		riskLevel: 'write',
		description: 'Set project instructions. (PUT /project/instructions)',
	},
	'project.setKnowledge': {
		riskLevel: 'write',
		description:
			'Set project knowledge. Replaces the complete set of domain knowledge entries at this scope. The knowledge_api account flag must be enabled.',
	},
	'project.setObservationSteering': {
		riskLevel: 'write',
		description:
			'Set project observation steering. (PUT /project/observation-steering)',
	},
	'project.setOntology': {
		riskLevel: 'write',
		description:
			'Set project ontology. Replaces the entity types and the edge types that the project uses.',
	},
	'project.setUserSummaryInstructions': {
		riskLevel: 'write',
		description:
			'Set project user-summary instructions. (PUT /project/user-summary-instructions)',
	},
	'project.update': {
		riskLevel: 'write',
		description:
			'Update project. Set hyperedges_enabled to true to enable extraction. A member needs the project.edit permission. Project API keys receive 403 permission_denied.',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get task. (GET /tasks/{task_uuid})',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks. (GET /tasks)',
	},
	'threads.create': {
		riskLevel: 'write',
		description: 'Create thread. (POST /threads)',
	},
	'threads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete thread. Cannot be undone. (DELETE /threads/{thread_uuid})',
	},
	'threads.get': {
		riskLevel: 'read',
		description: 'Get thread. (GET /threads/{thread_uuid})',
	},
	'threads.getContext': {
		riskLevel: 'read',
		description: 'Get thread context. (GET /threads/{thread_uuid}/context)',
	},
	'threads.getSummary': {
		riskLevel: 'read',
		description: 'Get thread summary. (GET /threads/{thread_uuid}/summary)',
	},
	'threads.list': {
		riskLevel: 'read',
		description: 'List threads. (GET /threads)',
	},
	'threads.listEpisodes': {
		riskLevel: 'read',
		description: 'List thread episodes. (GET /threads/{thread_uuid}/episodes)',
	},
	'threads.lookup': {
		riskLevel: 'read',
		description: 'Lookup thread by developer id. (POST /threads/lookup)',
	},
	'threads.messages.add': {
		riskLevel: 'write',
		description: 'Add thread messages. (POST /threads/{thread_uuid}/messages)',
	},
	'threads.messages.get': {
		riskLevel: 'read',
		description:
			'Get message. (GET /threads/{thread_uuid}/messages/{message_uuid})',
	},
	'threads.messages.list': {
		riskLevel: 'read',
		description: 'List thread messages. (GET /threads/{thread_uuid}/messages)',
	},
	'threads.messages.update': {
		riskLevel: 'write',
		description:
			'Update message. (PATCH /threads/{thread_uuid}/messages/{message_uuid})',
	},
	'traceConnections.create': {
		riskLevel: 'write',
		description:
			'Create a trace connection. Verify a provider credential before Zep stores it. Both providers accept 1 to 60 requests per minute and an optional retention window.',
	},
	'traceConnections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a trace connection. Delete a trace connection that no active trace import uses. Cannot be undone.',
	},
	'traceConnections.get': {
		riskLevel: 'read',
		description:
			'Get a trace connection. Read one trace connection. The response includes a credential hint and never includes the credential.',
	},
	'traceConnections.getTrace': {
		riskLevel: 'read',
		description:
			'Get a source trace. Read one trace and optionally preview a mapping. Example body: {"provider_project_id":"project_123","trace_id":"trace-123","mapping":{"task_family":{"source":"fixed","value":"support"}}}.',
	},
	'traceConnections.list': {
		riskLevel: 'read',
		description:
			'List trace connections. List trace connections in the current Zep project.',
	},
	'traceConnections.listProjects': {
		riskLevel: 'read',
		description:
			'List provider projects. List provider projects with the page_size and cursor query parameters.',
	},
	'traceConnections.listTraces': {
		riskLevel: 'read',
		description:
			'List source traces. Filter provider traces. Example body: {"provider_project_id":"project_123","filter":{"started_after":"2026-01-01T00:00:00Z"}}.',
	},
	'traceConnections.update': {
		riskLevel: 'write',
		description:
			'Update a trace connection. Verify changed settings before Zep stores them. A request that changes api_url must also include credential. Otherwise Zep returns 400 invalid_request. Both providers accept 1 to 60 requests per minute and an optional retention window. Example request: {"requests_per_minute":60,"retention_days":30}.',
	},
	'traceConnections.verify': {
		riskLevel: 'write',
		description:
			'Verify a trace connection. Check the provider credential and update the connection status.',
	},
	'userGroups.addMembers': {
		riskLevel: 'write',
		description:
			'Add user group members. Requires attribute-based access control to be enabled for your account.',
	},
	'userGroups.attachPolicySet': {
		riskLevel: 'write',
		description:
			'Attach policy set to a user group. Administrative operation. Requires a bearer token. Manage policy sets from the Zep dashboard.',
	},
	'userGroups.create': {
		riskLevel: 'write',
		description:
			'Create user group. Requires attribute-based access control to be enabled for your account.',
	},
	'userGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete user group. Requires attribute-based access control to be enabled for your account. Cannot be undone.',
	},
	'userGroups.detachPolicySet': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Detach policy set from a user group. Administrative operation. Requires a bearer token. Manage policy sets from the Zep dashboard. Cannot be undone.',
	},
	'userGroups.get': {
		riskLevel: 'read',
		description:
			'Get user group. Requires attribute-based access control to be enabled for your account.',
	},
	'userGroups.list': {
		riskLevel: 'read',
		description:
			'List user groups. Requires attribute-based access control to be enabled for your account.',
	},
	'userGroups.listMemberCandidates': {
		riskLevel: 'read',
		description:
			'List member candidates. Requires attribute-based access control to be enabled for your account.',
	},
	'userGroups.listMembers': {
		riskLevel: 'read',
		description:
			'List user group members. Requires attribute-based access control to be enabled for your account.',
	},
	'userGroups.listPolicySets': {
		riskLevel: 'read',
		description:
			'List policy sets on a user group. Administrative operation. Requires a bearer token. Manage policy sets from the Zep dashboard.',
	},
	'userGroups.removeMember': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove one user group member. Requires attribute-based access control to be enabled for your account. Cannot be undone.',
	},
	'userGroups.removeMembers': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove user group members. Requires attribute-based access control to be enabled for your account.',
	},
	'userGroups.update': {
		riskLevel: 'write',
		description:
			'Update user group. Requires attribute-based access control to be enabled for your account.',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create user. (POST /users)',
	},
	'users.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user. Cannot be undone. (DELETE /users/{user_uuid})',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get user. (GET /users/{user_uuid})',
	},
	'users.getByEmail': {
		riskLevel: 'read',
		description:
			'Get user by email. Send {"email": "jane@example.com"} to get the user with this email. An email matches only when the stored and requested values are equal after normalization. Normalization lowercases both values and trims leading and trailing whitespace.',
	},
	'users.getNode': {
		riskLevel: 'read',
		description: 'Get user node. (GET /users/{user_uuid}/node)',
	},
	'users.getSummaryInstructions': {
		riskLevel: 'read',
		description:
			'Get user summary instructions. (GET /users/{user_uuid}/summary-instructions)',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users. (POST /users/list)',
	},
	'users.listUserGroups': {
		riskLevel: 'read',
		description:
			'List user groups for a user. Requires attribute-based access control to be enabled for your account.',
	},
	'users.lookup': {
		riskLevel: 'read',
		description: 'Lookup user by developer id. (POST /users/lookup)',
	},
	'users.setSummaryInstructions': {
		riskLevel: 'write',
		description:
			'Set user summary instructions. (PUT /users/{user_uuid}/summary-instructions)',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update user. (PATCH /users/{user_uuid})',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof zepEndpointsNested>;
