<svelte:head>
	<title>iz docs • clp.is</title>
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
    /* :global(.ext::after) {
	content: " [->]";
	font-size: 0.6rem;
	padding-left:0px;
	transition: all 0.15s ease-in-out;
	color: rgba(0,0,0,0.4);
    }
    :global(.ext:hover::after) {
	content: " [->]";
	transition: all 0.15s ease-in-out;
    } */
</style>


<h1 id="head"><a href="/p" class="crumb">projects</a><small class="p"> &nbsp;• iz documentation</small></h1>
<p>(Nothing here yet!)</p>
