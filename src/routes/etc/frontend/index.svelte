<svelte:head>
	<title>home • clp.is</title>
</svelte:head>

<script>
import  Date  from '$lib/date.svelte'
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
<h1 id="head"><a href="/etc" class="crumb">etc</a><small class="p"> &nbsp;• frontend </small></h1>

<p> <Date date="08-11-21"/> fun fact this site was built in svelte, my previous webpage was built with next.js, the one before that was built with WebAssembly and Rust, and the one before that was built with Svelte (...and the one before that was built with React).</p>

