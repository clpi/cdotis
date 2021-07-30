

<svelte:head>
	<title>etc • clp.is</title>
</svelte:head>
<script context="module">
import  Date  from '$lib/date.svelte'
	export const hydrate = false;
	export const prerender = true;
</script>
<style>
    .ext {
	}
    :global(.ext::after) {
	content: " [->]";
	font-size: 0.6rem;
	transition: all 0.15s ease-in-out;
	color: rgba(0,0,0,0.4);
    }
    :global(.ext:hover::after) {
	content: " [->]";
	transition: all 0.15s ease-in-out;
    }
</style>

<h1 id="head">etc</h1>
<p><Date date="07/14/21"/>Any other links or resources</p>
<ul>
	<li><a class="link" href="/uses">/uses</a>:  &nbsp;&nbsp;What I use for development, and how I use it</li>
	<li><a class="link ext" href="https://github.com/clpi/dotfiles">dotfiles</a>:  &nbsp;&nbsp;My dotfiles for nvim, alacritty, tmux, etc.</li>
	<li><a class="link ext" href="https://linkedin.com/chrispecunies">linkedin</a>:  &nbsp;&nbsp;My dotfiles for nvim, alacritty, tmux, etc.</li>
</ul>

