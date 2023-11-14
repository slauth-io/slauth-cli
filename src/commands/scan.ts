import { Command, Option } from 'commander';
import path from 'path';

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
  .action((pathArg, { cloudProvider }) => {
    const fullPath = path.resolve(process.cwd(), pathArg);
    console.log({ fullPath, cloudProvider });
  });

export default scanCommand;
