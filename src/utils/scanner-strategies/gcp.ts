import { OpenAIModels, Services } from '@slauth.io/langchain-wrapper';
import ScannerStrategy from '../../types/scanner-strategy';
import showAsyncSpinner from '../show-async-spinner';
import spinners from 'cli-spinners';
import { yellow } from '../colors';

export default class GCPScanner implements ScannerStrategy {
  async scan(codeSnippets: string[], modelName: keyof typeof OpenAIModels) {
    const permissionsPromise = Promise.all(
      codeSnippets.map(async snippet => {
        return await Services.gcp.getPermissionsFromCode(snippet, modelName);
      })
    );

    await showAsyncSpinner(
      {
        spinner: spinners.dots,
        text: yellow(
          'Scanning for google-cloud sdk calls (this process might take a few minutes)'
        ),
      },
      permissionsPromise
    );

    const permissions = (await permissionsPromise).flat();

    const customRolesPromise = Services.gcp.getCustomRolesFromPermissions(
      permissions,
      modelName
    );

    await showAsyncSpinner(
      {
        spinner: spinners.dots,
        text: yellow(
          'Generating custom roles (this process might take a few minutes)'
        ),
      },
      customRolesPromise
    );

    return await customRolesPromise;
  }
}
