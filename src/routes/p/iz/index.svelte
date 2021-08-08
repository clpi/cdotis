<svelte:head>
	<title>iz • clp.is</title>
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


<h1 id="head"><a href="/p" class="crumb">projects</a><small class="p"> &nbsp;• iz </small></h1>
<h2>table of contents</h2>
<ul>
<li><a class="link" href="#about">about</a>
<li><a class="link" href="#links">links</a>
<li><a class="link" href="/p/iz/docs">docs</a>
</ul>
<h3 id="about">about</h3>
<p><Date date="08/07/21"/> A cli utility, built in Zig, which will serve to help me (and anybody else who might find it useful!) to manage day-to-date personal data management, logging, and automation tasks -- especially related to health data, and more specifically, with an initial focus on type 1 diabetes health data. Primarily serves to bolster my knowledge of data structures and algorithms at a lower level than Rust (no dependencies), learn the Zig programming language which I am currently very taken with, and develop a prototype framework for certain design decisions and functionality that will be implemented in certain larger-scope projects down the line. Also experimenting with the wasm32-wasi compilation target included with the Zig compiler, with the result published to <a href="https://wapm.io/package/clpi/iz">WAPM</a>.</p>
<p><Date date="08/07/21"/> I'm also implementing the same CLI utility in the Nim programming language (which I'm also coming to like quite a bit) in parallel with the Zig implementation (and also doing a parallel implementation in Rust). All will have manual data structure implementations (in Rust through <a href="/p/recollction">recollection</a>), which will primarily serve to, again, bolster my knowledge of data structures & algorithms, and is also just a fun exercise in general.</p>

<h3 id="links">links</h3>
<ul>
<li><a class="link ext" href="https://wapm.io/package/clpi/iz">wapm.io</a></li>
<li><a class="link ext" href="https://github.com/clpi/recollection">github</a> (iz)</li>
</ul>

