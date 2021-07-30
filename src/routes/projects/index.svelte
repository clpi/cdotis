
<svelte:head>
	<title>projects • clp.is</title>
</svelte:head>

<script>
import  Date  from '$lib/date.svelte'
</script>
<style>
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
    .tag { 
	padding: 6px;
	border-radius: 5px;
	font-size: 0.9rem;
	color: rgba(0,0,0,0.28);
	background-color: rgba(0,0,0,0.06);

	}
	.tag:hover {
		background-color: rgba(0,0,0,0.10);
	color: rgba(0,0,0,0.38);
	    }
    .lite { color: rgba(0,0,0,0.5);}
</style>
<h1 id="head">projects</h1>
<p>Last updated <Date date = "07/29/21"/>. Not a comprehensive list</p>
<ul>

<li><a class="link" href="/projects/recollection">recollection</a>  <a class="link ext lite" href="https://github.com/clpi/recollection"> (github)</a>:&nbsp;&nbsp; implementations and reimplementations of common data structures & algorithms, both in and out of the rust std library. a work in progress in its very infant stage. mostly meant for future project utility.<span class='tag'>#rust</span><Date date="07-29/21"/></li>

</ul>
<p></p>


