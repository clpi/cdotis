<script context="module">
	export const hydrate = false;
	export const prerender = true;
import Listening from '$lib/comp/listening.svelte';
	import Date from '$lib/date.svelte'
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>About • clp.is</title>
</svelte:head>
<style>
/* .walloftext { width: 80%; margin: auto; display:block; } */
</style>

<h1 id="head">About</h1>
<p class="walloftext">Hi there! And <i>welcome</i> to Chris P's internet property. I'm a budding engineer, a few years out of the University of Washington Materials science & engineering program in Seattle.</p>
<p class="walloftext">I'm currenlty most practiced in backend software development + cloud infrastructure architecture & engineering. Coming from a physical engineering background, I've had to learn quite a lot in my IT endeavours, both on my own and from the gracious assistance of others, whose patience I am grateful for eternally. I envision that with my multifaceted background and cross-disciplinary engineering cultivation, I can really bring a new perspective to the table in backend development and architecture.</p>

<p class="walloftext">I'm also working to build <a class="link" href="https://devisa.io">devisa</a> and <a class="link" href="https://idlets.com">idlets</a>. Keep in touch with me through real means or quietly stalk my <a class="link" href="/etc/updates">activity</a> <a class="link" href="/posts">feeds</a> if you're into that. If you wanna talk, email me at <a href="mailto:clp@clp.is" class="link">clp@clp.is</a> or message me on LinkedIn. Thank you, sincerely!</p>

<p class="walloftext">- Chris P<Date date="07-29-21"/> </p>
<br/><br/>
<h3>Miscellaneous</h3>
<p>
<Listening/>
</p>
<br/>
<br/>
<h3>Pics</h3>
<img src="me/closed.jpeg" height="275" width="275"/>
<img src="me/stare.jpeg" height="275" width="275"/>
<img src="me/cout.jpeg" height="275" width="275"/>
