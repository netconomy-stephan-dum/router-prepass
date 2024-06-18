import { Translations } from '../middleware/getTranslationService';

const translations: Translations = {
  de: {
    routes: {
      category: '/kategorie/:categoryId',
      product: '/produkt/:productId',
      imprint: '/impressum',
    },
  },
  en: {
    routes: {
      category: '/category/:categoryId',
      product: '/product/:productId',
      imprint: '/imprint',
    },
  },
};

export default translations;
