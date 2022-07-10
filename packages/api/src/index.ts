import { Api, HttpResponse } from './client';

export * from './client';

export const GITBOOK_DEFAULT_ENDPOINT = 'https://api.gitbook.com';

class GitBookAPIError extends Error {
    constructor(
        public response: HttpResponse<null, { error?: { code: number; message: string } }>
    ) {
        super(response.error?.error.message || 'Unknown error');
    }
}

/*
 * Export the auto-generated API client under the name 'GitBookAPI'
 * and export all API types.
 */
export class GitBookAPI extends Api<{
    authToken?: string;
}> {
    private endpoint: string;

    constructor(
        options: {
            /**
             * API endpoint to use.
             * @default "https://api.gitbook.com"
             */
            endpoint?: string;

            /**
             * Authentication token to use.
             */
            authToken?: string;
        } = {}
    ) {
        const { endpoint = GITBOOK_DEFAULT_ENDPOINT, authToken } = options;

        super({
            baseUrl: `${endpoint}/v1`,
            securityWorker: (securityData) => {
                if (securityData.authToken) {
                    return {
                        headers: {
                            Authorization: `Bearer ${securityData.authToken}`,
                        },
                    };
                }

                return {};
            },
        });

        this.endpoint = endpoint;

        const request = this.request;
        this.request = async (...args) => {
            try {
                const response = await request(...args);
                return response;
            } catch (error) {
                if (error instanceof Error) {
                    throw error;
                }

                throw new GitBookAPIError(error);
            }
        };

        this.setSecurityData({ authToken });
    }

    /**
     * Create a new API client, authenticated as an installation.
     */
    public async createInstallationClient(
        integrationName: string,
        installationId: string
    ): Promise<GitBookAPI> {
        const { data: installationToken } =
            await this.integrations.createIntegrationInstallationToken(
                integrationName,
                installationId
            );

        return new GitBookAPI({
            endpoint: this.endpoint,
            authToken: installationToken.token,
        });
    }
}
