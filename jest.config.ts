import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  testMatch : ["**/test/eth/**.test.js"]
};

export default config;