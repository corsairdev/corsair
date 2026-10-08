import {
	BetterProposalsBrand,
	BetterProposalsCompany,
	BetterProposalsCover,
	BetterProposalsCurrency,
	BetterProposalsDocumentType,
	BetterProposalsMergeTag,
	BetterProposalsProposal,
	BetterProposalsQuote,
	BetterProposalsSettings,
	BetterProposalsTemplate,
} from './database';

export const BetterProposalsSchema = {
	version: '1.0.0',
	entities: {
		proposals: BetterProposalsProposal,
		templates: BetterProposalsTemplate,
		documentTypes: BetterProposalsDocumentType,
		quotes: BetterProposalsQuote,
		companies: BetterProposalsCompany,
		covers: BetterProposalsCover,
		currencies: BetterProposalsCurrency,
		settings: BetterProposalsSettings,
		brands: BetterProposalsBrand,
		mergeTags: BetterProposalsMergeTag,
	},
} as const;

export {
	BetterProposalsBrand,
	BetterProposalsCompany,
	BetterProposalsCover,
	BetterProposalsCurrency,
	BetterProposalsDocumentType,
	BetterProposalsMergeTag,
	BetterProposalsProposal,
	BetterProposalsQuote,
	BetterProposalsSettings,
	BetterProposalsTemplate,
} from './database';
