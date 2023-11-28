import GCPScanner from './gcp';
import AWSScanner from './aws';
import { CloudProviders } from '@slauth.io/langchain-wrapper';
import ScannerStrategy from '../../types/scanner-strategy';

type ScannerStrategiesType = {
  [k in CloudProviders]: ScannerStrategy;
};

const ScannerStrategies: ScannerStrategiesType = {
  gcp: new GCPScanner(),
  aws: new AWSScanner(),
};

export default ScannerStrategies;
