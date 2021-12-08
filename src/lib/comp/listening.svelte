<script>

    var tracks = Promise.resolve([])
    var albums = Promise.resolve([])
    async function getTracks() {
	const tracksChart = await fetch("/api/lastfm/tracks")
	    .then(res => res.json())
	tracks = tracksChart
	return tracksChart
    }
    async function getAlbums() {
	const albumsChart = await fetch("/api/lastfm/weekly")
	    .then(res => res.json());
	albums = albumsChart
	return albumsChart;
    }
</script>
<listening>
Hello
</listening>
