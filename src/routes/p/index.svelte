
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
	padding: 3px;
	margin: 3px;
	border-radius: 3px;
	font-size: 0.85rem;
	color: rgba(0,0,0,0.28);
	background-color: rgba(0,0,0,0.06);

	}
	.tag:hover {
		background-color: rgba(0,0,0,0.10);
		transform: scale(1.1);
		transition: all 0.2s ease-in-out;
	color: rgba(0,0,0,0.38);
	    }
    .lite { color: rgba(0,0,0,0.5);}
</style>
<h1 id="head">Projects</h1>
<ul>
<li><a class="link" href="/p/recollection">recollection</a>  <a class="link ext lite" href="https://github.com/clpi/recollection"> (github)</a>:&nbsp;&nbsp; implementations and reimplementations of common data structures & algorithms, both in and out of the rust std library. a work in progress in its very infant stage. mostly meant for future project utility.<span class='tag'>#lib</span><span class='tag'>#rust</span><Date date="07-29-21"/></li>
<li><a class="link" href="/p/iz">iz</a>  <a class="link ext lite" href="https://github.com/clpi/iz"> (github)</a>:&nbsp;&nbsp; Zig implementation of CLI utility to automate and motivate daily data tasks esp. regarding health, like logging blood glucose levels for type 1 diabetics and performing elementary data analaysis and management. Also using to learn zig and generally become more experienced, as well as  uprototyping certain ideas for down the road. <span class='tag'>#zig</span><span class="tag">#nim</span><span class="tag">#cli</span><Date date="08-07-21"/></li>
</ul>
<p>Last updated <Date date="08-07-21"/>. Not a comprehensive list</p>
<br/>


