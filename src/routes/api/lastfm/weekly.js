const VITE_LASTFM_API_ROOT="http://ws.audioscrobbler.com/2.0/";
const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

// TODO have the weekly route accept param for stat (artist album tag etc., have /artist or /album be for top)
// Gets my most recent tracks
export async function get(req) {
    const qStr = "?method=user.getweeklyalbumchart&user=ooohm&api_key="+apiKey+"&format=json"
    const res = await fetch(VITE_LASTFM_API_ROOT + qStr)
	.then(r => r.json())
    return {
	body: res
    }
}
