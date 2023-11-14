import { Command, Option } from 'commander';
import path from 'path';
import readDirectory from '../utils/read-directory';
import { generatePoliciesFromCode } from '../services/openai';

const scanCommand = new Command();
scanCommand
  .name('scan')
  .description('scan a repository and generate least priviledge policies')
  .addOption(
    new Option(
      '-p, --cloud-provider <cloudProvider>',
      'select the cloud provider you would like to generate policies for'
    )
      .choices(['aws'])
      .makeOptionMandatory(true)
  )
  .argument('<path>', 'repository path')
  .action(async (pathArg, { cloudProvider }) => {
    const fullPath = path.resolve(process.cwd(), pathArg);
    console.log({ fullPath, cloudProvider });
    const fileDocs = await readDirectory(fullPath);

    const policies = await Promise.all(
      fileDocs.map(async doc => {
        return await generatePoliciesFromCode(doc.pageContent);
      })
    );

    console.log(policies);
  });

export default scanCommand;
