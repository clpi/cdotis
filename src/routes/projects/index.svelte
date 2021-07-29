
<svelte:head>
	<title>projects • clp.is</title>
</svelte:head>

<script>
import  Date  from '$lib/date.svelte'
</script>
<style>

li a  {
	text-decoration: underline;
	text-underline-offset: 6px;
    }
    .ext {
	    font-size: 1rem;
	}
	li a:hover {
		background-color: rgba(0,0,0,0.8);
		font-weight: 500;
		color: rgba(255,255,255,0.95);
		border-radius: 4px;
	    }
.ext::after {
	content: "[->]";
	font-size: 0.8rem;
	vertical-align:super;
    }
.ext:hover::after {
	content: "[->]";
	transform: scale(1.4);
	transition: all 0.15s ease-in-out;
	vertical-align:super;
    }
</style>
<h1 id="head">projects</h1>
<p>Last updated <Date date = "07/29/21"/>. Not a comprehensive list</p>
<ul>
<li><a href="/projects/recollection">recollection</a>  <a class="ext" href="https://github.com/clpi/recollection"> (github)</a>: implementations and reimplementations of common data structures & algorithms, both in and out of the rust std library. a work in progress in its very infant stage. mostly meant for future project utility.</li>
</ul>
<p></p>


