import router from './router';
import getBasicLayout from './layouts/getBasicLayout';

const app = getBasicLayout([router]);

export default app;
