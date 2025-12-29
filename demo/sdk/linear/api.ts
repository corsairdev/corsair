import {
	CommentsService,
	IssuesService,
	ProjectsService,
	TeamsService,
} from './services';

export class Linear {
	public static readonly issues = IssuesService;
	public static readonly teams = TeamsService;
	public static readonly projects = ProjectsService;
	public static readonly comments = CommentsService;
}
