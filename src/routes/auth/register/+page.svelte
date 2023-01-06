<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	$: console.log(form); // for debugging
</script>

<h1>Register for an Account</h1>

<form method="POST" use:enhance>
	<label for="email">Email</label>
	<input type="email" name="email" id="email" value={form?.email ?? ''} required />
	<label for="username">Username</label>
	<input type="text" name="username" id="username" value={form?.username ?? ''} required />
	<label for="pass">Password</label>
	<input type="password" name="pass" id="pass" required />
	<label for="confirmedPass">Password</label>
	<input type="password" name="confirmedPass" id="confirmedPass" required />
	<button type="submit">SUBMIT</button>
</form>
