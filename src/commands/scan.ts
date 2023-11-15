import { Command, Option } from 'commander';
import path from 'path';
import spinners from 'cli-spinners';
import readDirectory from '../utils/read-directory';
import showAsyncSpinner from '../utils/show-async-spinner';
import CloudProviders from '../types/cloud-providers';
import {
  getStatementsFromCode,
  getPoliciesFromStatements,
} from '../services/openai';

const scanCommand = new Command();
scanCommand
  .name('scan')
  .description('scan a repository and generate least priviledge policies')
  .addOption(
    new Option(
      '-p, --cloud-provider <cloudProvider>',
      'select the cloud provider you would like to generate policies for'
    )
      .choices(Object.values(CloudProviders))
      .makeOptionMandatory(true)
  )
  .argument('<path>', 'repository path')
  .action(async (pathArg, { cloudProvider }) => {
    try {
      const fullPath = path.resolve(process.cwd(), pathArg);
      const scanPromise = scan(fullPath, cloudProvider);
      await showAsyncSpinner(
        {
          spinner: spinners.simpleDotsScrolling,
          text: 'Scanning your repository',
        },
        scanPromise
      );
      const policies = await scanPromise;

      if (policies) {
        console.log(JSON.stringify(policies, null, 2));
      } else {
        console.log('No policies have been detected');
      }
    } catch (err) {
      console.error(err);
    }
  });

async function scan(
  fullPath: string,
  cloudProvider: keyof typeof CloudProviders
) {
  const fileDocs = await readDirectory(fullPath);
  const statements = (
    await Promise.all(
      fileDocs.map(async doc => {
        return await getStatementsFromCode(doc.pageContent, cloudProvider);
      })
    )
  ).flat();

  return await getPoliciesFromStatements(statements, cloudProvider);
}

export default scanCommand;
