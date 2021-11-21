

<svelte:head>
	<title>Etcetera • clp.is</title>
</svelte:head>
<script context="module">
import  Date  from '$lib/date.svelte'
	export const hydrate = false;
	export const prerender = true;
</script>
<style>
    .ext {
	}
    /* :global(.ext::after) {
	content: " [->]";
	font-size: 0.6rem;
	transition: all 0.15s ease-in-out;
	color: rgba(0,0,0,0.4);
    }
    :global(.ext:hover::after) {
	content: " [->]";
	transition: all 0.15s ease-in-out;
    } */
</style>

<h1 id="head">Etc.</h1>
<p><Date date="07/14/21"/>welcome to the attic of my site</p>
<h3>cool and great info</h3>
<ul>
	<li><a class="link" href="/etc/updates">updates</a>:  &nbsp;&nbsp;updates<Date date="08-10-21"/></li>
	<li><a class="link" href="/etc/frontend">frontend thoughts</a>:  &nbsp;&nbsp;web dev and frontend musings<Date date="08-10-21"/></li>
	<li><a class="link" href="/uses">dev setup</a>:  &nbsp;&nbsp;dev setup<Date date="07-29-21"/></li>
	<li><a class="link" href="/etc/laptops">'tops ive used and loved</a>:  &nbsp;&nbsp;thinkpad pokedex<Date date="07-29-21"/></li>
	<li><a class="link" href="/etc/plangs">programming langs that make me sang</a>:  &nbsp;&nbsp;plangs<Date date="07-29-21"/></li>
	<li><a class="link ext" href="https://github.com/clpi/dotfiles">dotfiles</a>:  &nbsp;&nbsp;dotfiles<Date date="07-29-21"/></li>
</ul>


<h3>miscellaneous profiles</h3>
<ul>
    <li><a class="link" href="https://last.fm/user/ooohm">last.fm</a> profile</li>
    <li><a class="link" href="https://github.com/clpi">github</a>dev profile</li>
</ul>
