import i18next from 'i18next';
import { AppConfig, AppConfigRequest } from './getAppConfigService';
import randomTimeout from '../utils/randomTimeout';
import translationsMock from '../mocks/translations';

export type Translations = Record<string, Record<string, Record<string, object | string>>>;

const getTranslations = async (supportedLanguages: string[]) => {
  await randomTimeout();
  const translationsByLanguage: Translations = {};
  supportedLanguages.forEach((supportedLanguage) => {
    translationsByLanguage[supportedLanguage] = translationsMock[supportedLanguage];
  });
  return translationsByLanguage;
};

const getSupportedLanguages = (config: AppConfig) => {
  const allLanguages = Object.values(config)
    .map((tenantConfig) => {
      return Object.values(tenantConfig).map(({ languages }) => languages);
    })
    .flat(2);

  return Array.from(new Set(allLanguages));
};

const getTranslationService = async (appConfig: AppConfig) => {
  const supportedLanguages = getSupportedLanguages(appConfig);
  const translations = await getTranslations(supportedLanguages);

  await i18next.init({
    debug: false,
    resources: translations,
    lng: supportedLanguages[0],
    fallbackLng: supportedLanguages[0],
    supportedLngs: supportedLanguages,
  });

  return (requestConfig: AppConfigRequest) => {
    const { language, TLD } = requestConfig;
    const instance = i18next.cloneInstance({
      lng: `${language}-${TLD}`,
    });

    return {
      routes: translations[language].routes,
      translate: instance.t.bind(instance),
    };
  };
};

export default getTranslationService;
