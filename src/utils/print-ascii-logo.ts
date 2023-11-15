import { yellow } from './colors';

const logo = `
         ##                    #    #                     ##      #   
          #                    #    #                      #          
  ####    #     ####  #   #  #####  ####           ####    #     ##   
 #        #    #   #  #   #    #    #   #  #####  #        #      #   
  ###     #    #   #  #   #    #    #   #         #        #      #   
     #    #    #  ##  #  ##    #    #   #         #        #      #   
 ####    ###    ## #   ## #     ##  #   #          ####   ###    ###                                              
`;

export const coloredLogo = yellow(logo);
export default function printLogo() {
  console.log(coloredLogo);
}
