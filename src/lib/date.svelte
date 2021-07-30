<script>
let dt = Date.now().toLocaleString();
export let date = dt;


</script>
<style>

	.date {
		color: rgba(0,0,0,0.35);
		font-family:monospace;
		font-size: 1rem;
		letter-spacing:-1px;
		padding-right: 4px;
		letter-spacing:-2px;
	}
	.date::before { content: "["; color: rgba(0,0,0,0.2); }
	.date::after { content: "]";color: rgba(0,0,0,0.2);  }
</style>

<span class="date">{ date }</span>
