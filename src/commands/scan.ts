import { Command, Option } from 'commander';
import path from 'path';
import spinners from 'cli-spinners';
import readDirectory from '../utils/read-directory';
import showAsyncSpinner from '../utils/show-async-spinner';
import { yellow, red, green } from '../utils/colors';
import writeToFile from '../utils/write-to-file';
import {
  getStatementsFromCode,
  getPoliciesFromStatements,
  CloudProviders,
  OpenAIModels,
} from '@slauth.io/langchain-wrapper';

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
  .addOption(
    new Option(
      '-m, --openai-model <openaiModel>',
      'select the openai model to use'
    ).choices(Object.values(OpenAIModels))
  )
  .option(
    '-o, --output-file <outputFile>',
    'write generated policies to a file instead of stdout'
  )
  .argument('<path>', 'repository path')
  .action(async (pathArg, { cloudProvider, openaiModel, outputFile }) => {
    try {
      const fullPath = path.resolve(process.cwd(), pathArg);
      const policies = await scan(fullPath, cloudProvider, openaiModel);

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
  cloudProvider: keyof typeof CloudProviders,
  modelName?: keyof typeof OpenAIModels
) {
  const readDirectoryPromise = readDirectory(fullPath);

  await showAsyncSpinner(
    {
      spinner: spinners.dots,
      text: yellow('Reading repository'),
    },
    readDirectoryPromise
  );

  const fileDocs = await readDirectoryPromise;

  const statementsPromises = Promise.all(
    fileDocs.map(async doc => {
      return await getStatementsFromCode(
        doc.pageContent,
        cloudProvider,
        modelName
      );
    })
  );

  await showAsyncSpinner(
    {
      spinner: spinners.dots,
      text: yellow(
        'Scanning for aws-sdk calls (this process might take a few minutes)'
      ),
    },
    statementsPromises
  );

  const statements = (await statementsPromises).flat();

  const policiesPromise = getPoliciesFromStatements(
    statements,
    cloudProvider,
    modelName
  );

  await showAsyncSpinner(
    {
      spinner: spinners.dots,
      text: yellow(
        'Generating policies (this process might take a few minutes)'
      ),
    },
    policiesPromise
  );

  return await policiesPromise;
}

export default scanCommand;
