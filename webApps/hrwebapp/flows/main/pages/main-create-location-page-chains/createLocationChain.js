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

  class createLocationChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      // Sets the progress variable to true
      $page.variables.createLocationChainInProgress = true;

      // Validates Location form
      const validateFormResult = await Actions.callChain(context, {
        chain: 'flow:validateFormChain2',
        params: {
          validationGroupId: 'validation-group',
        },
      }, { id: 'validateLocation' });

      if (validateFormResult === true) {
        const callRestCreateLocationResult = await Actions.callRest(context, {
          endpoint: 'businessObjects/create_Location',
          body: $page.variables.location,
        }, { id: 'createLocation' });

        if (callRestCreateLocationResult.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Location saved',
            message: 'Location record successfully created',
            displayMode: 'transient',
            type: 'confirmation',
          }, { id: 'fireSuccessNotification' });

          await Actions.navigateBack(context, {
          }, { id: 'navigateBack' });
        } else {
          // Create error message
          const errorMessage = callRestCreateLocationResult.body?.['o:errorDetails']?.[0]?.detail ||
                               `Could not create new Location: status ${callRestCreateLocationResult.status}`;
          // Fires a notification event about failed save
          await Actions.fireNotificationEvent(context, {
              summary: 'Save failed',
              message: errorMessage,
          }, { id: 'fireErrorNotification' });
        }
      }

      // Sets the progress variable to false
      $page.variables.createLocationChainInProgress = false;
    }
  }

  return createLocationChain;
});
