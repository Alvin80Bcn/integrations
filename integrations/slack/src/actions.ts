import { FetchEventCallback } from '@gitbook/runtime';
import { documentConversation } from './actions/documentConversation';
import { SlackRuntimeContext } from './configuration';

/**

 * Handle an action from Slack.
 */
export function createSlackActionsHandler(
    handlers: {
        [type: string]: (event: object, context: SlackRuntimeContext) => Promise<any>;
    },
    fallback?: FetchEventCallback
): FetchEventCallback {
    return async (request, context) => {
        const requestText = await request.text();
        const shortcutEvent = Object.fromEntries(new URLSearchParams(requestText).entries());
        const actionPayload = JSON.parse(shortcutEvent.payload);

        const { channel, message, team, user, response_url } = actionPayload;

        return documentConversation({ team, channelId: channel.id, message, user, context });
    };
}

//   token: '1W4r987ZaX2XbnrkVvfdEzQQ',
//   action_ts: '1692187902.226777',
//   team: { id: 'T032HV6MF', domain: 'gitbook' },
//   user: {
//     id: 'U03S41KSY8M',
//     username: 'valentino',
//     team_id: 'T032HV6MF',
//     name: 'valentino'
//   },
//   channel: { id: 'C05M1K6RTD4', name: 'tmp-slack-integration-valentino' },
//   is_enterprise_install: false,
//   enterprise: null,
//   callback_id: 'generate_docs',
//   trigger_id: '5749554069538.3085992729.84e5c8b2c3f206a0a64417a02cb6270d',
//   response_url: 'https://hooks.slack.com/app/T032HV6MF/5735015787015/6zzBIWRLpw6sm438oUpTxC2h',
//   message_ts: '1692106894.378009',
//   message: {
//     bot_id: 'B05MND68QVC',
//     type: 'message',
//     text: 'Hm, I had the case where it would hang at this point, but it was related to changes to our mySQL database and the CLI was waiting for a prompt answer (y/n) higher in the logs.\n' +
//       'Can you check if you have anything earlier that could be blocking too?',
//     user: 'U03S41KSY8M',
//     ts: '1692106894.378009',
//     app_id: 'A05M82VRGPM',
//     blocks: [ [Object] ],
//     team: 'T032HV6MF',
//     bot_profile: {
//       id: 'B05MND68QVC',
//       deleted: false,
//       name: 'GitBook (valentino-dev)',
//       updated: 1692103834,
//       app_id: 'A05M82VRGPM',
//       icons: [Object],
//       team_id: 'T032HV6MF'
//     },
//     thread_ts: '1692106894.088119',
//     parent_user_id: 'U03S41KSY8M'
//

// const payload = JSON.parse(slashEvent.payload);
// const value = JSON.parse(payload.actions[0].value);
// // TODO: constructing a faux-SlashEvent here
// event = {
// channel_id: payload.container.channel_id,
// team_id: payload.team.id,
// ...value,
// };
// }
