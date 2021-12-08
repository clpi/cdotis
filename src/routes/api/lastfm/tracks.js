const VITE_LASTFM_API_ROOT="http://ws.audioscrobbler.com/2.0/";
const apiKey = import.meta.env.VITE_LASTFM_API_KEY;

// Gets my most recent tracks
export async function get(req) {
    const qStr = "?method=user.getrecenttracks&user=ooohm&api_key=" + apiKey + "&format=json&limit=1";
    const res = await fetch(VITE_LASTFM_API_ROOT + qStr)
	.then(r => r.json())
    return {
	body: res
    }
}
