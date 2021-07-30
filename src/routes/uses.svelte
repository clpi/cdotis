
<svelte:head>
	<title>uses • clp.is</title>
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
		    color: rgba(0,0,0,0.78);
		    border-bottom: 2px solid rgba(0,0,0,0.12);
		    transition: all 0.15s ease-in-out;
		}
		.crumb:hover {

		    color: rgba(0,0,0,0.98);
		    text-shadow: 0px 0px 8px rgba(0,0,0,0.12);
		    border-bottom: 2px solid rgba(0,0,0,0.4);
		    transition: 0.1s all ease-in;
		    }
		    img { border-radius: 8px; margin:auto; box-shadow: 0px 4px 12px rgba(0,0,0,0.01);}
		.crumb:visited {
		    color: rgba(0,0,0,0.9);
		    border-bottom: 4px dotted rgba(0,0,0,0.1)

		    }
		    .cap { color: rgba(0,0,0,0.5); margin: auto; width: 60%;}
</style>

<h1 id="head"><a href="/etc" class="crumb">etc</a><small class="p"> &nbsp;• /uses </small></h1>
<p>

 <Date date="07/29/21"/>clp.is uses...  (table of contents?)
 <ul>
    <li><a href="#" class="link">text editing (nvim)</a></li>
    <li><a href="#" class="link">virtual workspace (tmux)</a></li>
    <li><a href="#" class="link">window mgr/destkop env (sway/gnome)</a></li>
    <li><a href="#" class="link">operating system (fedora linux)</a></li>
    <li><a href="#" class="link">personal planning (vimwiki)</a></li>
 </ul>

 <h3>text editing</h3>

 <h3>virtual workspace</h3>


<h3>Images</h3>
<img src="./static/swappy-20210729_135416.png" width=90% alt="sway screenshot"/>
<br/><i class="cap">A pic of Sway WM setup running alongside waybar & a few alacritty instances w/ ranger and neovim. excuse the old oofy owwy code I pulled up quickly for the screenshot. tmux also running w/ old config (all dotfiles can be found <a href="https://github.com/clpi/dotfiles" class="link ext">here</a>)</i>
<br/><br/>
<img src="./static/swappy-20210729_134838.png" width=90% alt="sway screenshot"/>
<br/><i class="cap">Sway WM running with waybar, neovim running in tmux running in alacritty. and way in the distance you can catch me still running late for ENGR 231.</i>
