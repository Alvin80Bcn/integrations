import { queryLens } from '../actions/queryLens';
import type { SlashEvent } from '../commands';
import { SlackRuntimeContext } from '../configuration';

/**
 * Handle a slash request and route it to the GitBook Lens' query function.
 */
export async function queryLensSlashHandler(slashEvent: SlashEvent, context: SlackRuntimeContext) {
    // pull out required params from the slashEvent for queryLens
    const { team_id, channel_id, thread_ts, user_id, text } = slashEvent;

    try {
        return queryLens({
            channelId: channel_id,
            teamId: team_id,
            threadId: thread_ts,
            text,
            context,
            userId: user_id,
        });
    } catch (e) {
        // Error state. Probably no installation was found
        return {};
    }
}
