<svelte:head>
	<title>Auth • clp.is</title>
</svelte:head>
<style>
	:global(.secondary) {
	    background-color: rbga(0,0,0,0.25);

	    }
	:global(.secondary:hover) {
	    background-color: rbga(0,0,0,0.35);

	    }
</style>

<h1 id="head">Authentication</h1>
<ul>
<li>Signup sends application to backend to go through verification.</li>
<li>Everything still under construction!</li>

</ul>
<div class="form">
<form class="login">
    <span class="formtitle">Log <span class="gray">in</span> to clp.is</span>

    <label for="email">E-mail</label><br/>
    <input name="email" placeholder="E-mail"/>


    <br/><br/>
    <label for="passwor">Password</label><br/>
    <input name="password" type="password" placeholder="password"/>

<br/>
<br/>
    <button label="login">Login</button>
    <button class="secondary" label="Help">Help</button>
</form>
<form class="sigunp">
    <span class="formtitle">(Apply) to sign up <span class="gray">up</span> to clp.is</span>

    <label for="email">E-mail</label><br/>
    <input name="email" placeholder="E-mail"/>


    <br/><br/>
    <label for="password">Password</label><br/>
    <input name="password" type="password" placeholder="Password"/>

<br/>
<br/>
    <button label="login">Next</button>
    <button class="secondary" label="Help">Help</button>
</form>
</div>
