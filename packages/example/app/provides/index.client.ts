import { RenderContextBrowser } from '@micro-frame/browser/types';
import { Provides } from './types';

declare global {
  interface Window {
    provides: Provides;
  }
}

const providesClient = (context: RenderContextBrowser): Provides => {
  const provides = window.provides;

  return provides;
};

export default providesClient;
