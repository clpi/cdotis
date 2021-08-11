<script>
	export let section = "Home";
	import { page} from '$app/stores'
</script>

<style>
	:global(body) {
		border: 5px solid black;
		height: 100vh;
		min-height: 100vh;
		margin: 0;
		max-width: 100%;
		overflow-x: hidden;
		padding: 2% 4% 2% 4%;
		font-weight: 300;
		font-family:
			monospace;
	}
	a { text-decoration:none; }
	#title {
		border-radius: 4px;
		font-family: monospace;
		padding: 18px 17px 18px 17px;
		font-size: 1.9rem;
		margin-right: 2.5%;
		color: rgba(0,0,0,0.99);
		margin-left:2%;
		/* border: 2px solid rgba(0,0,0,0.6); */
		transition: all 0.05s;
		color: rgba(0,0,0,1);
		/* font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
		font-weight: 400;
		letter-spacing: -1px;
		position: relative;
		display:inline-flex;
		text-shadow: 0px 0px 8px rgba(0,0,0,0.10);
	}
	#title::after {
		content: ".is ";
		color: rgba(0,0,0,0.25);
		text-shadow: 0px 0px 8px rgba(0,0,0,0.10);
	}
	span {
		display:inline-flex;
	}
	li a::before {
		content: "/";
		color: rgba(0,0,0,0.17);

	}
#title:active {
	transform:scale(0.75);
	transition:0.15s all ease-in-out;
	}
	#title:hover {
		transform: scale(1.15);


		/* border: 2px solid black; */
		/* box-shadow: 0px 2px 8px rgba(0,0,0,0.15); */
		transition: all 0.05s;
		opacity: 0.8;
	}
	li a {
		color:rgba(0,0,0,0.42);
		text-decoration: none;
		padding: 7px 8px;
		/* border-bottom-color: rgba(0,0,0,0.4); */
		border-radius: 0px;
		letter-spacing: -0px;
		display:inline-flex;

		text-shadow: 0px 0px 7px rgba(0,0,0,0.04);
	}
	.active {
		transform: scale(1.35);
		transition: all 0.2s ease-in-out;
		text-shadow: 0px 0px 8px rgba(0,0,0,0.09);
		color: rgba(0,0,0,0.95);
	    }
	    a.active::before {
		    content: "> ";
		    padding-right: 5px;
		    color: rgba(0,0,0,0.30);
		}
	nav ul li a {
		font-size: 0.95rem;
		margin-right: 1.5vw;
	}
	nav {
		color: var(--fg-light);
		margin-bottom: 0%;
		padding: 0% 0%;
		display: block;
		height: 90px;
	}
	ul {
		margin-top: 0%;
		display: inline-flex;
	}
	ul li {
		display: inline-block;
		position:relative;
	}
	.left, .right {
		position: relative;
		display: inline-block;
	}
	.right {
		float:right;
		margin-top: 1%;
	}
	.left {
		float: left;
		display: inline-flex;
	}
	.right a {
		/* color: #fffdfc; */
		padding: 3px 5px;
		/* border: 2px solid rgba(0,0,0,0.2); */
		color: rgba(0,0,0,0.2);
		border-radius: 2px;
		transition:all 0.2s linear;
		font-size: 0.9rem;
	}
	#etc{
		padding: 3px;
		letter-spacing: -1px;
		padding-right: 5px;
	}
	#lititle {
		margin-right: 10%;
	}
	.right a:hover{
		color: rgba(0,0,0,0.4);
		/* border: 2px solid rgba(0,0,0,0.4); */
		background: #fffdfc;
		transition: all 0.05s;
		/* box-shadow: 0px 0px 4px rgba(0,0,0,0.1); */
		/* transform:scale(1.1); */

	}
	.right .active {
	    color: rgba(0,0,0,0.85);
	    }
	    .right .active::before {
		content: "!";

		}
	.tabl {
		clear: both;
		padding:0px;
		margin:0px;
		display:inline-block;
	}
	li {
		padding: 0px;
	}
	li:hover {
		transform:scale(1.15);
		transition: all 0.1s ease-in-out;
	}
	li:hover a {
		color: black;
		border-radius: 0px;
		/* background-color: #fffdfc; */
		/* border-bottom: 2px ridge black; */
		/* transition: all 0.05s ease-in-out; */
		/* padding: 4px 4px; */
		/* box-shadow: 0px 1px 9px rgba(0,0,0,0.25); */
		transition: all 0.03s ease-in-out;
	}
	#sect {
		font-size: 1.0rem;
		margin-left: 4%;
	}
	li:active {
		transform: scale(0.95);
		transition: all 0.03s ease-in-out;
	}
	li:active a {
		transition: all 0.03s ease-in-out;
	}


</style>

<nav>
	<a href="/"><div id="title">clp</div></a>
			 <div class="tabl">
		<ul class="navbar">

			<li><a class:active={ $page.path == "/" } class="nav" sveltekit:prefetch href="/">home</a></li>
			<li><a class:active={ $page.path == "/about" } class="nav" sveltekit:prefetch href="/about">about</a></li>
			<li><a class:active={ $page.path == "/posts" } class="nav" sveltekit:prefetch href="/posts">posts</a></li>
			<li><a class:active={ $page.path == "/p" } class="nav" sveltekit:prefetch href="/p">projects</a></li>
			<li><a class:active={ $page.path == "/etc" } class="nav" sveltekit:prefetch href="/etc">etc</a></li>

		</ul>
			 </div>
		<div class="right">
			<a class:active={ $page.path == "/lab" } class="nav" id="etc" href="/lab">/lab</a>
			<a class:active={ $page.path == "/auth" } class="nav" id="etc" href="/auth">/auth</a>

		</div>
</nav>
