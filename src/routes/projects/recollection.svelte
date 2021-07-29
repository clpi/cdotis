<svelte:head>
	<title>p/recollection • clp.is</title>
</svelte:head>

<script context="module">
	export const hydrate = false;
	export const prerender = true;
</script>
<script>
    import Date from '$lib/date.svelte'
</script>
<style>
.p {
	color: rgba(0,0,0,0.55);

    }
    .p:hover{
	    color: rgba(0,0,0,0.8);
	    padding-left: 8px;
	    transition: all 0.2s ease-in-out;
	}
</style>


<h1 id="head">projects<small class="p"> &nbsp;• recollections </small></h1>
<p><Date date="07/29/21"/> implementations of common data structures & algorithms in rust. mostly for practice and learning, but will be implemented in other projects down the road. constantly updated.</p>
<p>...</p>
<h3>further info</h3>
<ul>
<li><a href="https://crates.io/crate/recollection">crates.io</a></li>
<li><a href="https://lib.rs/crate/recollection">lib.rs</a></li>
<li><a href="https://github.com/clpi/recollection">github</a></li>
<li><a href="https://docs.rs/recollection">docs.rs</a> for documentation</li>
</ul>

