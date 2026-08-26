export interface AppVeyorConfig {
    apiKey: string;
    baseUrl?: string;
}

export interface AppVeyorProject {
    projectId: number;
    accountName: string;
    name: string;
    slug: string;
    repositoryType: string;
    repositoryName: string;
}

export interface AppVeyorBuild {
    buildId: number;
    buildNumber: number;
    version: string;
    message: string;
    branch: string;
    status: string;
}

export interface AppVeyorBuildResponse {
    project: AppVeyorProject;
    build: AppVeyorBuild;
}

