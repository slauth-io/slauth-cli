import { Command, Option } from 'commander';

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
  .action((path, options) => {
    console.log('scan', { path, options });
  });

export default scanCommand;
