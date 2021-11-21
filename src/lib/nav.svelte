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
		padding: 0% 4% 2% 4%;
		font-weight: 300;
		font-family:
			Helvetica;
	}
	a { text-decoration:none; }
	#title {
		border-radius: 4px;
		font-family: Helvetica;
		padding: 10px 0px 0px 10px;
		font-size: 1.9rem;
		margin-right: 1.5%;
		margin-left:1%;
		/* border: 2px solid rgba(0,0,0,0.6); */
		transition: all 0.1s;
		color: rgba(0,0,0,0.77);
		/* font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; */
		font-weight: 300;
		letter-spacing: -2px;
		display:inline-flex;
		text-shadow: 0px 0px 8px rgba(0,0,0,0.10);
	}
	#title::after {
		content: ".is ";
		font-weight:100;
		color: rgba(0,0,0,0.20);
		color: rgba(130,210,150,0.6);
		letter-spacing:0px;
		text-shadow: 0px 0px 15px rgba(0,0,0,0.06);
	}
	span {
		display:inline-flex;
	}
	li a::before {
		content: "*";
		padding-right: 4px;
		transition: all 0.15s ease-in-out;
		color: rgba(130,220,150,0.0);

	}
	li:hover a.active::before {
	    transform:scale(1.3);
	    }
	    li:hover a.active {
		    transform:scale(1.3);
		}
	li a.active::before {
		content: "•";
		color: rgba(130,220,150,0.6);
		padding-right:07px;
		padding-left: 07px;
		transition: all 0.15s ease-in-out;
		text-shadow: 0px 0px 15px rgba(130,220,150,0.25);

	}
	#title:active {
	    transform:scale(0.75);
	    transition:0.15s all ease-in-out;
	}
	#title:hover {
		transform: scale(1.15);
		transition: all 0.05s;
		opacity: 0.9;
	}
	li a {
		color:rgba(0,0,0,0.32);
		text-decoration: none;
		padding: 7px 8px;
		/* border-bottom-color: rgba(0,0,0,0.4); */
		border-radius: 0px;
		letter-spacing: -0px;
		display:inline;

		text-shadow: 0px 0px 7px rgba(0,0,0,0.05);
	}
	.active {
		transform: scale(1.1);
		transition: all 0.2s ease-in-out;
		text-shadow: 0px 0px 8px rgba(0,0,0,0.09);
		color: rgba(0,0,0,0.95);
	    }
	    /* a.active::before {
		    content: ">";
		    transition: all 0.05s ease-in-out;
		    color: rgba(0,0,0,0.15);
		    text-shadow: 0px 1px 8px rgba(0,0,0,0.1);
		    opacity: 100%;
		}N*/
	nav ul li a {
		font-size: 0.95rem;
		margin-right: 1.1vw;
		text-shadow: 0px 1px 6px rgba(0,0,0,0.05);
	    font-size:0.97rem;
	}
	nav ul li a.active {
		text-shadow: 0px 1px 10px rgba(0,0,0,0.08);
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
		margin-right: 2.5%;
		margin-top: 1.6%;
	}
	.left {
		float: left;
		display: inline-flex;
	}
	.right a {
		color: rgba(0,0,0,0.10);
		transition:all 0.2s linear;
		font-size: 0.84rem;
	}
	#etc{
		padding: 3px;
		letter-spacing: -0px;
		padding-right: 5px;
		color: rgba(0,0,0,0.3);
		font-size:0.8rem;
	}
	.right a:hover{
		color: rgba(0,0,0,0.4);
		background: #fffdfc;
		transition: all 0.02s;
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
		display:inline;
	}
	li:hover {
		transform:scale(1.05);
		transition: all 0.25s ease-in-out;
	}
	li:hover a {
		color: rgba(0,0,0,0.9);
		border-radius: 0px;
		transition: all 0.025s ease-in-out;
	}
	#sect {
		font-size: 1.0rem;
		margin-left: 4%;
	}


</style>

<nav>
	<a href="/"><div id="title">clp</div></a>
			 <div class="tabl">
		<ul class="navbar">

			<li><a class:active={ $page.path == "/" } class="nav" sveltekit:prefetch href="/">
			Home</a></li>
			<li><a class:active={ $page.path == "/about" } class="nav" sveltekit:prefetch href="/about">About</a></li>
			<li><a class:active={ $page.path == "/posts" } class="nav" sveltekit:prefetch href="/posts">Posts</a></li>
			<li><a class:active={ $page.path == "/p" } class="nav" sveltekit:prefetch href="/p">Projects</a></li>
			<li><a class:active={ $page.path == "/etc" } class="nav" sveltekit:prefetch href="/etc">Etc</a></li>

		</ul>
			 </div>
		<div class="right">
			<a class:active={ $page.path == "/lab" } class="nav" id="etc" href="/lab">Lab</a>
			<a class:active={ $page.path == "/auth" } class="nav" id="etc" href="/auth">Auth</a>
			<a class:active={ $page.path == "/auth" } class="nav" id="etc" href="https://api.clp.is/">API</a>

		</div>
</nav>
