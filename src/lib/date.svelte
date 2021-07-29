<script>
let dt = Date.now().toLocaleString();
export let date = dt;


</script>
<style>

	.date {
		color: rgba(0,0,0,0.3);
		font-family:monospace;
		font-size: 1rem;
		letter-spacing:-1px;
		padding-right: 4px;
	}
	.date::before { content: "["; }
	.date::after { content: "]"; }
</style>

<span class="date">{ date }</span>
