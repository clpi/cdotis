<svelte:head>
	<title>uses • clp.is</title>
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
		    color: rgba(0,0,0,0.78);
		    border-bottom: 2px solid rgba(0,0,0,0.12);
		    transition: all 0.15s ease-in-out;
		}
		.crumb:hover {

		    color: rgba(0,0,0,0.98);
		    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);
		    border-bottom: 2px solid rgba(0,0,0,0.4);
		    transition: 0.1s all ease-in;
		    }
		    img { border-radius: 8px; margin:auto; box-shadow: 0px 4px 12px rgba(0,0,0,0.01);}
		.crumb:visited {
		    color: rgba(0,0,0,0.9);
		    border-bottom: 4px dotted rgba(0,0,0,0.1)

		    }
		    .cap { color: rgba(0,0,0,0.5); margin: auto; width: 60%;}
</style>

<h1 id="head"><a href="/etc/" class="crumb">etc</a><small class="p"> &nbsp;• laptops i've used & loved </small></h1>
<p>

 <Date date="07/29/21"/>laptop time!
 </p>
