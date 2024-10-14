import GCPScanner from './gcp';
import AWSScanner from './aws';
import AzureScanner from './azure';
import { CloudProviders } from '@slauth.io/langchain-wrapper';
import ScannerStrategy from '../../types/scanner-strategy';

type ScannerStrategiesType = {
  [k in CloudProviders]: ScannerStrategy;
};

const ScannerStrategies: ScannerStrategiesType = {
  gcp: new GCPScanner(),
  aws: new AWSScanner(),
  azure: new AzureScanner(),
};

export default ScannerStrategies;
