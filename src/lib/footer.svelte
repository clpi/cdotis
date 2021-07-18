<footer>
	<div class="left">
	<p class="foot">Last updated 2021</p>
	<p class="foot"><a href="mailto:clp@clp.is">Email</a> me</p>
	</div>
		<div class="right">
			<a class="nav" id="gl" href="https://gitlab.com/clpi">gitlab</a>
			<a class="nav" id="gh" href="https://github.com/clpi">github</a>
			<a class="nav"  href="https://github.com/clpi">twitter</a>
			<a class="nav"  href="https://github.com/clpi">linkedin</a>

		</div>

</footer>
<style>
	p {
		color: rgba(0,0,0,0.3);
		font-size: 0.9rem;

	}
	a {
		text-decoration:none;
		font-size: 0.9rem;
		color: rgba(130,130,70,0.7);
	}
	.nav:hover {
		padding: 8px 5px;
		transition: all 0.25s ease-in-out;
	}
	footer {
		color: rgba(0,0,0,0.3);
		font-size: 0.8rem;
		padding: 24px;
		margin-top: 0%;
		position:sticky;
		bottom:0;
		display: block;
	}
	.right a:hover{
		color: rgba(0,0,0,0.4);
		border: 2px solid rgba(0,0,0,0.4);
		background: #fffdfc;
		transition: all 0.05s;
		box-shadow: 0px 0px 4px rgba(0,0,0,0.15);

	}
	.right a {
		/* color: #fffdfc; */
		padding: 3px 5px;
		border: 2px solid rgba(0,0,0,0.2);
		color: rgba(0,0,0,0.2);
		border-radius: 2px;
		font-size: 0.8rem;
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
</style>
