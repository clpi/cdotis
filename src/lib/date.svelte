<script>
let dt = Date.now().toLocaleString();
export let date = dt;


</script>
<style>

	.date {
		color: rgba(0,0,0,0.14);
		font-family:helvetica;
		font-size: 0.75rem;
		/* vertical-align:center; */
		padding-right: 4px;
		padding-left: 9px;
		letter-spacing:-0px;
		text-shadow: 0px 0px 10px rgba(0,0,0,0.060);
	}
	.date:hover {
		color: rgba(0,0,0,0.38);
		transition: all 0.25s ease-in-out;
		text-shadow: 0px 0px 15px rgba(0,0,0,0.11);

	    }
	.date::before { content: ""; color: rgba(0,0,0,0.2); }
	.date::after { content: "";color: rgba(0,0,0,0.2);  }
</style>

<span class="date">{ date }</span>
