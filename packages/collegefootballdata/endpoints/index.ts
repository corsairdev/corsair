import { getUserInfo } from './account';
import { getLines } from './betting';
import { list as coachesList } from './coaches';
import {
	list as conferencesList,
	listDivisions,
	listMemberships,
} from './conferences';
import { listTeams as draftListTeams, listPicks, listPositions } from './draft';
import { list as drivesList } from './drives';
import {
	getAdvancedBoxScore,
	getGamesAndResults,
	getMedia,
	getPlayerStats,
	getTeamStats,
} from './games';
import {
	getFieldGoalExpectedPoints,
	getPregameWinProbabilities,
	getWinProbability,
} from './metrics';
import {
	getReturningProduction,
	getUsage,
	listTransferPortal,
	search,
} from './players';
import {
	listStats,
	listStatTypes,
	listTypes,
	list as playsList,
} from './plays';
import {
	getByPlayerGame,
	getByPlayerSeason,
	getByTeamGame,
	getByTeamSeason,
	getPredictedPoints,
} from './ppa';
import { list as rankingsList } from './rankings';
import { getConferenceSP, getElo, getFPI, getSP, getSRS } from './ratings';
import {
	getGroupRatings,
	getTeamRankings,
	getTeamTalent,
	listRecruits,
} from './recruiting';
import { list as seasonTypesList } from './season-types';
import {
	getAdvancedGameStats,
	getAdvancedSeasonStats,
	getGameHavocStats,
	getPlayerSeasonStats,
	getTeamSeasonStats,
	listCategories,
} from './stats';
import {
	getATSRecords,
	getMatchup,
	getRecords,
	getRoster,
	listFBS,
	listFCS,
	list as teamsList,
} from './teams';
import { list as venuesList } from './venues';

export const Games = {
	getGamesAndResults,
	getMedia,
	getTeamStats,
	getPlayerStats,
	getAdvancedBoxScore,
};

export const Drives = {
	list: drivesList,
};

export const Plays = {
	list: playsList,
	listStats,
	listStatTypes,
	listTypes,
};

export const Metrics = {
	getFieldGoalExpectedPoints,
	getWinProbability,
	getPregameWinProbabilities,
};

export const Ppa = {
	getByTeamSeason,
	getByTeamGame,
	getByPlayerSeason,
	getByPlayerGame,
	getPredictedPoints,
};

export const Ratings = {
	getElo,
	getFPI,
	getSP,
	getConferenceSP,
	getSRS,
};

export const Stats = {
	listCategories,
	getAdvancedGameStats,
	getGameHavocStats,
	getPlayerSeasonStats,
	getTeamSeasonStats,
	getAdvancedSeasonStats,
};

export const Players = {
	search,
	getUsage,
	getReturningProduction,
	listTransferPortal,
};

export const Teams = {
	list: teamsList,
	listFBS,
	listFCS,
	getATSRecords,
	getMatchup,
	getRecords,
	getRoster,
};

export const Conferences = {
	list: conferencesList,
	listMemberships,
	listDivisions,
};

export const Coaches = {
	list: coachesList,
};

export const Venues = {
	list: venuesList,
};

export const Recruiting = {
	listRecruits,
	getTeamRankings,
	getGroupRatings,
	getTeamTalent,
};

export const Rankings = {
	list: rankingsList,
};

export const Betting = {
	getLines,
};

export const Draft = {
	listPicks,
	listPositions,
	listTeams: draftListTeams,
};

export const SeasonTypes = {
	list: seasonTypesList,
};

export const Account = {
	getUserInfo,
};

export * from './types';
