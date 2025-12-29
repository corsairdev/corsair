import { IssuesService, TeamsService, ProjectsService, CommentsService } from './services';

export class Linear {
  public static readonly issues = IssuesService;
  public static readonly teams = TeamsService;
  public static readonly projects = ProjectsService;
  public static readonly comments = CommentsService;
}

