import randomTimeout from '../utils/randomTimeout';
import appConfigMock from '../mocks/appConfig';
import { Http2ServerRequest } from 'node:http2';

export interface ShopConfig {
  features: string[];
  languages: string[];
  domain?: string; // default to tenantName
}

export type AppConfig = Record<
  string, // tenantName
  Record<
    string, // TLD
    ShopConfig
  >
>;

const getAppConfig = async (tenants: string[]) => {
  await randomTimeout();
  const appConfig: AppConfig = {};
  tenants.forEach((tenantName) => {
    appConfig[tenantName] = appConfigMock[tenantName];
  });
  return appConfig;
};

const domainReg =
  /^(?:www\.)?(?<languageOrTenantName>[^.]+)\.(?<tenantNameOrTLD>[^.]+)(?:\.(?<TLD>[^.:]+))?/;

const parseHostname = (hostname: string) => {
  const match = domainReg.exec(hostname);
  const { languageOrTenantName, tenantNameOrTLD, TLD } = match?.groups || {};

  if (!TLD) {
    return {
      TLD: tenantNameOrTLD,
      tenantName: languageOrTenantName,
    };
  }
  return {
    TLD,
    parsedLanguage: languageOrTenantName,
    tenantName: tenantNameOrTLD,
  };
};
type FFMode = 'every' | 'some';

type HasFeature = (featureFlags: string | string[], mode?: FFMode) => void;

export interface AppConfigRequest {
  language: string;
  supportedLanguages: string[];
  tenantName: string;
  hasFeature: HasFeature;
  TLD: string;
}

const getAppConfigService = async (tenants: string[]) => {
  const appConfig: AppConfig = await getAppConfig(tenants);

  const onRequest = (request: Http2ServerRequest): AppConfigRequest => {
    const { tenantName, TLD, parsedLanguage } = parseHostname(
      request.headers.host || request.headers[':authority'] || '',
    );

    const { features, languages } = appConfig[tenantName][TLD];
    const hasFeature: HasFeature = (featureFlags, mode = 'every') =>
      (Array.isArray(featureFlags) ? featureFlags : [featureFlags])[mode]((feature) =>
        features.includes(feature),
      );

    const language =
      parsedLanguage && languages.includes(parsedLanguage) ? parsedLanguage : languages[0];

    return {
      tenantName,
      TLD,
      hasFeature,
      supportedLanguages: languages,
      language,
    };
  };

  return {
    appConfig,
    onRequest,
  };
};

export default getAppConfigService;
