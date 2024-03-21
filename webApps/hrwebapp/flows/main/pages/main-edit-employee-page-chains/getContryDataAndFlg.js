define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class getContryDataAndFlg extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application } = context;

      if (value.length === 2) {
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.CountryTypeVar',
          ],
        });

        const callRestCountriesGetAlphaCodeResult = await Actions.callRest(context, {
          endpoint: 'countries/getAlphaCode',
          uriParams: {
            code: value,
          },
          responseType: 'getAlphaCode',
        });

        if (!callRestCountriesGetAlphaCodeResult.ok) {
          await Actions.fireNotificationEvent(context, {
            message: callRestCountriesGetAlphaCodeResult.status,
            summary: 'Cannot find the country',
          }, { id: 'CannotFindCountry' });
        
          return;
        } else {
          // getCountryDataFromBody
          $page.variables.CountryTypeVar = callRestCountriesGetAlphaCodeResult.body;

          // calculateCountryDensity
          $page.variables.density = callRestCountriesGetAlphaCodeResult.body.population / callRestCountriesGetAlphaCodeResult.body.area;
        }
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'The country code should be more 2 chars',
          displayMode: 'persist',
          type: 'error',
        }, { id: 'notValidCode' });
      }
    }
  }

  return getContryDataAndFlg;
});
