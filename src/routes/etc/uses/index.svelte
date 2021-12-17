
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
    <li><a href="#" class="link">email / calendar</a></li>
 </ul>

<br/>
<h2>picks</h2>
 <h3>text editing</h3>

 <h3>virtual workspace</h3>

 <h3>operating system</h3>

 <h3>personal planning</h3>
 <p><Date date="08-10-21"/>I nearly exclusively use stream-of-thought note-taking in <a href="https://github.com/vimwiki/vimwiki" class="link">vimwiki</a> to keep track of my thoughts. When potentially useful or otherwise significant thoughts pop into your head, the right tool for the job of recording them should be whatever is the most accessible and comfortable for you in the Eureka moment. In real life, this might be a sticky note which perpetually lives on your working desk. For someone who does just about everything else in their text editing software of choice (Neovim for me), it's a new Vimwiki diary note. Over time, I've developed my Vimwiki "sticky note" system into a complex and hierarchical knowledge base that I refer to all the time for any piece of pertinent info. </p>

 <h3>email/calendar</h3>

 <h3>honorable nominations</h3>

<br/>
<h2>Images</h2>
<!--<img src="./static/swappy-20210729_135416.png" width=90% alt="sway screenshot"/>-->
<br/><i class="cap">A pic of Sway WM setup running alongside waybar & a few alacritty instances w/ ranger and neovim. excuse the old oofy owwy code I pulled up quickly for the screenshot. tmux also running w/ old config (all dotfiles can be found <a href="https://github.com/clpi/dotfiles" class="link ext">here</a>)</i>
<br/><br/>
<!--<img src="./static/swappy-20210729_134838.png" width=90% alt="sway screenshot"/>-->
<br/><i class="cap">Sway WM running with waybar, neovim running in tmux running in alacritty. and way in the distance you can catch me still running late for ENGR 231.</i>
