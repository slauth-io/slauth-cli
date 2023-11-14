import { Command, Option } from 'commander';
import path from 'path';
import readDirectory from '../utils/read-directory';
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
      .choices(['aws'])
      .makeOptionMandatory(true)
  )
  .argument('<path>', 'repository path')
  .action(async (pathArg, { cloudProvider }) => {
    try {
      const fullPath = path.resolve(process.cwd(), pathArg);
      console.log({ fullPath, cloudProvider });
      const fileDocs = await readDirectory(fullPath);

      const statements = (
        await Promise.all(
          fileDocs.map(async doc => {
            return await getStatementsFromCode(doc.pageContent);
          })
        )
      ).flat();

      const policies = await getPoliciesFromStatements(statements);
      console.log(JSON.stringify(policies, null, 2));
    } catch (err) {
      console.error(err);
    }
  });

export default scanCommand;
