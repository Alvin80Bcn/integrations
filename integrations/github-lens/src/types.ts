import { IntegrationInstallationConfiguration } from '@gitbook/api';
import type { RuntimeContext, RuntimeEnvironment } from '@gitbook/runtime';

export type GitHubAccountConfiguration = {
    oauth_credentials?: {
        access_token: string;
        expires_at: number;
        refresh_token?: string;
    };
} & ConfigureProps['installation']['configuration'];

export type GithubRuntimeEnvironment = RuntimeEnvironment<GitHubAccountConfiguration, {}>;
export type GithubRuntimeContext = RuntimeContext<GithubRuntimeEnvironment>;

export type ConfigureAction =
    | { action: 'select.installation'; installation: string }
    | { action: 'select.repositories'; repositories: string[] }
    | { action: 'start.sync' };

export type ConfigureProps = {
    installation: {
        configuration?: {
            /**
             * A key to uniquely identify the configuration.
             */
            key?: string;
            /**
             * The installation ID of the GitHub App.
             */
            installation?: string;
            /**
             * Selected repositories to sync.
             */
            repositories?: string[];
        };
    };
    spaceInstallation: {
        configuration?: IntegrationInstallationConfiguration;
    };
};

export type ConfigureState = ConfigureProps['installation']['configuration'] & {};

export type IntegrationTaskType =
    | 'sync:repo'
    | 'sync:pull-requests'
    | 'sync:pull-request-comments'
    | 'sync:issues'
    | 'sync:issue-comments'
    | 'sync:releases';

export type BaseIntegrationTaskPayload = {
    organizationId: string;
    integrationInstallationId: string;
    githubInstallationId: string;
    repositoryId: number;
    ownerName: string;
    repoName: string;
    token: string;
    retriesLeft: number;
    page?: number;
};

export type BaseIntegrationTask<
    Type extends IntegrationTaskType,
    Payload extends BaseIntegrationTaskPayload
> = {
    type: Type;
    payload: Payload;
};

export type IntegrationTaskSyncRepo = BaseIntegrationTask<'sync:repo', BaseIntegrationTaskPayload>;

export type IntegrationTaskSyncPullRequests = BaseIntegrationTask<
    'sync:pull-requests',
    BaseIntegrationTaskPayload
>;

export type IntegrationTaskSyncPullRequestComments = BaseIntegrationTask<
    'sync:pull-request-comments',
    BaseIntegrationTaskPayload & {
        pullRequest: number;
    }
>;

export type IntegrationTaskSyncIssues = BaseIntegrationTask<
    'sync:issues',
    BaseIntegrationTaskPayload
>;

export type IntegrationTaskSyncIssueComments = BaseIntegrationTask<
    'sync:issue-comments',
    BaseIntegrationTaskPayload & {
        issue: number;
    }
>;

export type IntegrationTaskSyncReleases = BaseIntegrationTask<
    'sync:releases',
    BaseIntegrationTaskPayload
>;

export type IntegrationTask =
    | IntegrationTaskSyncRepo
    | IntegrationTaskSyncPullRequests
    | IntegrationTaskSyncPullRequestComments
    | IntegrationTaskSyncIssues
    | IntegrationTaskSyncIssueComments
    | IntegrationTaskSyncReleases;
