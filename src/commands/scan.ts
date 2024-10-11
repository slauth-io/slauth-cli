import { Command, Option } from 'commander';
import path from 'path';
import spinners from 'cli-spinners';
import readDirectory from '../utils/read-directory';
import showAsyncSpinner from '../utils/show-async-spinner';
import { yellow, red, green } from '../utils/colors';
import writeToFile from '../utils/write-to-file';
import isGitRepository from '../utils/is-git-repository';
import { CloudProviders } from '@slauth.io/langchain-wrapper';
import ScannerStrategies from '../utils/scanner-strategies';
import Scanner from '../utils/scanner';

//Added a new string to the model name parameter
const scanCommand = new Command();
scanCommand
  .name('scan')
  .description('Scan a repository and generate least privilege policies')
  .addOption(
    new Option(
      '-p, --cloud-provider <cloudProvider>',
      'Select the cloud provider you would like to generate policies for'
    )
      .choices(Object.values(CloudProviders))
      .makeOptionMandatory(true)
  )
  .addOption(
    new Option(
      '-m, --openai-model <openaiModel>',
      'Specify the OpenAI model to use (e.g., "gpt-3.5-turbo", "gpt-4")'
    )
  )
  .option(
    '-o, --output-file <outputFile>',
    'Write generated policies to a file instead of stdout'
  )
  .argument('<path>', 'Repository path')
  .action(async (pathArg, { cloudProvider, openaiModel, outputFile }) => {
    try {
      const fullPath = path.resolve(process.cwd(), pathArg);
      const result = await scan(fullPath, cloudProvider, openaiModel);

      if (result) {
        const resultJSONString = JSON.stringify(result, null, 2);

        if (outputFile) {
          const fullOutFilePath = path.resolve(process.cwd(), outputFile);
          await writeToFile(fullOutFilePath, resultJSONString);
          console.log(`${green('Wrote to file:')} ${fullOutFilePath}`);
          return;
        }

        console.log(green(`Detected ${getResultType(cloudProvider)}:\n`));
        console.log(resultJSONString);
      } else {
        console.log(yellow('No policies have been detected'));
      }
    } catch (err) {
      console.error(red(err));
    }
  });

function getResultType(cloudProvider: keyof typeof CloudProviders) {
  switch (cloudProvider) {
    case 'aws':
      return 'Policies';
    case 'gcp':
      return 'Custom Roles';
    default:
      return 'Result';
  }
}

async function scan(
  fullPath: string,
  cloudProvider: keyof typeof CloudProviders,
  modelName?: string
) {
  if (!isGitRepository(fullPath)) {
    throw new Error('Directory needs to be a Git repository');
  }

  const readDirectoryPromise = readDirectory(fullPath);

  await showAsyncSpinner(
    {
      spinner: spinners.dots,
      text: yellow('Reading repository'),
    },
    readDirectoryPromise
  );

  const scanner = new Scanner(ScannerStrategies[cloudProvider]);
  const codeSnippets = (await readDirectoryPromise).map(doc => doc.pageContent);
  return await scanner.scan(codeSnippets, modelName);
}

export default scanCommand;
