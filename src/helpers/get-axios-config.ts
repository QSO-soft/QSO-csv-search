import { BASE_TIMEOUT } from './constants';
import { getHeaders, StringRecord } from './get-headers';
import { ProxyAgent } from './proxy';

export interface OptionalProxyAgentConfig {
  httpsAgent?: ProxyAgent | undefined;
}
export interface BaseAxiosConfig extends OptionalProxyAgentConfig {
  timeout?: number;
  signal?: AbortSignal;
  headers: StringRecord;
}
interface GetAxiosConfig {
  proxyAgent?: ProxyAgent;
  timeout?: number;
  headers?: StringRecord;
  token?: string;
  isScraper?: boolean;
  withoutAbort?: boolean;
}

export const getAxiosConfig = async ({
  proxyAgent,
  token,
  headers = getHeaders(),
  timeout = BASE_TIMEOUT,
  isScraper = false,
  withoutAbort = false,
}: GetAxiosConfig): Promise<BaseAxiosConfig> => {
  const proxyAgentConfig = {
    ...(!!proxyAgent && {
      [isScraper ? 'agent' : 'httpsAgent']: proxyAgent,
    }),
  };

  const authHeader = {
    ...(!!token && {
      Authorization: `Bearer ${token}`,
    }),
  };

  const scraperConfig = {
    ...(!!isScraper && {
      json: true,
    }),
  };

  const timeoutConfig = {
    ...(!!timeout && {
      timeout,
      ...(!withoutAbort && {
        signal: AbortSignal.timeout(timeout * 10),
      }),
    }),
  };

  return {
    ...proxyAgentConfig,
    ...timeoutConfig,
    headers: {
      ...authHeader,
      ...headers,
    },
    ...scraperConfig,
  };
};
