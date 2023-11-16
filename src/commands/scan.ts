import { Command, Option } from 'commander';
import path from 'path';
import spinners from 'cli-spinners';
import readDirectory from '../utils/read-directory';
import showAsyncSpinner from '../utils/show-async-spinner';
import CloudProviders from '../utils/cloud-providers';
import { yellow, red, green } from '../utils/colors';
import writeToFile from '../utils/write-to-file';
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
  .option(
    '-o, --output-file <outputFile>',
    'write generated policies to a file instead of stdout'
  )
  .argument('<path>', 'repository path')
  .action(async (pathArg, { cloudProvider, outputFile }) => {
    try {
      const fullPath = path.resolve(process.cwd(), pathArg);
      const scanPromise = scan(fullPath, cloudProvider);
      await showAsyncSpinner(
        {
          spinner: spinners.bouncingBar,
          text: 'Scanning your repository',
        },
        scanPromise
      );
      const policies = await scanPromise;

      if (policies) {
        const policiesJsonString = JSON.stringify(policies, null, 2);

        if (outputFile) {
          const fullOutFilePath = path.resolve(process.cwd(), outputFile);
          await writeToFile(fullOutFilePath, policiesJsonString);
          console.log(`${green('Wrote to file:')} ${fullOutFilePath}`);
          return;
        }

        console.log(green('Detected Policies:\n'));
        console.log(policiesJsonString);
      } else {
        console.log(yellow('No policies have been detected'));
      }
    } catch (err) {
      console.error(red(err));
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
