import {store as pcStore} from '@core/templates/desktop/app';
import {store as h5Store} from '@core/templates/mobile/app';

const getDpStore = () => {
  return process.env.CLIENT_MODE === 'mobile' ? h5Store : pcStore;
};

export default getDpStore;
