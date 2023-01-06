<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	$: emailError = form?.errors.find((error) => error.field === 'email');
	$: usernameError = form?.errors.find((error) => error.field === 'username');
	$: passError = form?.errors.find((error) => error.field === 'pass');
	$: confirmedPassError = form?.errors.find((error) => error.field === 'confirmedPass');

	$: console.log(form); // for debugging
</script>

<h1>Register for an Account</h1>

<form method="POST" use:enhance>
	<p>All fields are required.</p>
	<label for="email">Email</label>
	<input
		type="email"
		name="email"
		id="email"
		value={form?.email ?? ''}
		required
		class:error={emailError}
		on:focus={() => {
			if (emailError) emailError = undefined;
		}}
	/>
	{#if emailError}
		<span>{emailError.message}</span>
	{/if}
	<label for="username">Username</label>
	<input
		type="text"
		name="username"
		id="username"
		value={form?.username ?? ''}
		required
		class:error={usernameError}
		on:focus={() => {
			if (usernameError) usernameError = undefined;
		}}
	/>
	{#if usernameError}
		<span>{usernameError.message}</span>
	{/if}
	<label for="pass">Password</label>
	<input
		type="password"
		name="pass"
		id="pass"
		required
		class:error={passError}
		on:focus={() => {
			if (passError) passError = undefined;
		}}
	/>
	{#if passError}
		<span>{passError.message}</span>
	{/if}
	<label for="confirmedPass">Confirm Password</label>
	<input
		type="password"
		name="confirmedPass"
		id="confirmedPass"
		required
		class:error={confirmedPassError}
		on:focus={() => {
			if (confirmedPassError) confirmedPassError = undefined;
		}}
	/>
	{#if confirmedPassError}
		<span>{confirmedPassError.message}</span>
	{/if}
	<button type="submit">SUBMIT</button>
</form>

<style>
	.error {
		border: 1px solid red;
	}

	.error ~ span {
		color: red;
	}
</style>
