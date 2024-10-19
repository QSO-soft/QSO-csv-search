import axios, { AxiosError } from 'axios';

import { SETTINGS } from '../_inputs/settings';
import {
  buildCsvPath,
  convertAndWriteToJSON,
  convertToCsvAndWrite,
  getAxiosConfig,
  initLocalLogger,
  MY_IP_API_URL,
  prepareProxy,
  prepareProxyAgent,
} from '../helpers';
import { buildFolderName } from '../logger/utils';

(async () => {
  try {
    const projectName = 'test-proxy';
    const logsFolderName = buildFolderName(projectName);
    const logger = initLocalLogger(logsFolderName, projectName);

    logger.setLoggerMeta({
      moduleName: 'Test proxy',
    });

    const inputFolder = buildCsvPath();

    const testUrl = SETTINGS.testProxyUrl;
    const inputPath = inputFolder + 'proxies.csv';

    const proxies = (await convertAndWriteToJSON({
      inputPath,
      // logger,
    })) as { proxy: string }[];

    const prepared = proxies.map(({ proxy }) => prepareProxy({ proxy })).filter(Boolean) as any[];

    const goodProxies = [];
    const badProxies = [];

    for (let i = 0; i < prepared.length; i++) {
      const proxy = prepared[i];

      const count = `[${i + 1}/${prepared.length}]`;

      if (proxy) {
        try {
          const proxyData = await prepareProxyAgent(proxy);

          if (proxyData) {
            const config = await getAxiosConfig({
              proxyAgent: proxyData.proxyAgent,
            });

            const response = await axios.get(MY_IP_API_URL, config);

            const data = response?.data;

            if (data && !data.error) {
              logger.info(`${count} Current IP: ${data?.ip} | ${data?.country} - ${proxy.url}`);
            } else {
              throw new Error(data?.error || 'Unknown error');
            }

            if (testUrl) {
              await axios.get(testUrl, config);
            }

            goodProxies.push({ proxy: proxy.url });
          }
        } catch (err) {
          let errorMessage = (err as Error).message;

          const isAxiosError = err instanceof AxiosError;
          if (isAxiosError) {
            if (typeof err.response?.data === 'string') {
              errorMessage = err.response.data || errorMessage;
            } else {
              errorMessage =
                err.response?.data?.msg ||
                err.response?.data?.error ||
                err.response?.data?.message ||
                err.response?.data?.error?.message ||
                err.response?.data?.errorDescription ||
                errorMessage;
            }
          }

          logger.error(`${count} Failed proxy: ${errorMessage} - ${proxy.url}`);

          badProxies.push({ proxy: proxy.url, reason: errorMessage });
        }
      }
    }

    const outputPath = buildCsvPath(true);
    convertToCsvAndWrite({
      data: goodProxies,
      fileName: 'proxies-success.csv',
      outputPath,
    });

    convertToCsvAndWrite({
      data: badProxies,
      fileName: 'proxies-fail.csv',
      outputPath,
    });
  } catch (err) {
    console.log(err);
  }
})();
