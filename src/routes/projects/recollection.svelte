<svelte:head>
	<title>p/recollection • clp.is</title>
</svelte:head>

<script context="module">
	export const hydrate = false;
	export const prerender = true;
</script>
<script>
    import Date from '$lib/date.svelte'
    export let title = "projets"
</script>
<style>
.p { 
    color: rgba(0,0,0,0.55);  
    font-size: 1.9rem;
		    text-shadow: 0px 0px 8px rgba(0,0,0,0.04);
    }
    .p:hover{
	    color: rgba(0,0,0,0.85);
	    padding-left: 8px;
	    transition: all 0.2s ease-in-out;
		    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);
	}
	    .crumb {
		    text-decoration: none;
		    color: rgba(0,0,0,0.82);
		    border-bottom: 2px solid rgba(0,0,0,0.12);
		    transition: all 0.15s ease-in-out;
		}
		.crumb:hover {

		    color: rgba(0,0,0,0.98);
		    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);
		    border-bottom: 2px solid rgba(0,0,0,0.4);
		    transition: 0.1s all ease-in;
		    }
		.crumb:visited {
		    color: rgba(0,0,0,0.9);
		    border-bottom: 4px dotted rgba(0,0,0,0.1)

		    }
    :global(.ext::after) {
	content: " [->]";
	font-size: 0.6rem;
	padding-left:0px;
	transition: all 0.15s ease-in-out;
	color: rgba(0,0,0,0.4);
    }
    :global(.ext:hover::after) {
	content: " [->]";
	transition: all 0.15s ease-in-out;
    }
</style>


<h1 id="head"><a href="/projects" class="crumb">projects</a><small class="p"> &nbsp;• recollections </small></h1>
<p><Date date="07/29/21"/> implementations of common data structures & algorithms in rust. mostly for practice and learning, but will be implemented in other projects down the road. constantly updated.</p>
<p>...</p>
<h2>further info</h2>
<ul>
<li><a class="link ext" href="https://crates.io/crate/recollection">crates.io</a></li>
<li><a class="link ext" href="https://lib.rs/crate/recollection">lib.rs</a></li>
<li><a class="link ext" href="https://github.com/clpi/recollection">github</a></li>
<li><a class="link ext" href="https://docs.rs/recollection">docs.rs</a> for documentation</li>
</ul>

