import { AppConfig } from '../middleware/getAppConfigService';

const appConfig: AppConfig = {
  nike: {
    at: {
      features: ['footer'],
      languages: ['de'],
    },
  },
  adidas: {
    ch: {
      features: [],
      languages: ['de', 'en'],
    },
  },
};

export default appConfig;
