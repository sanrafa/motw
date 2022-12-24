<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<h1>Hello World!</h1>
<p>
	{env.PUBLIC_GREETING}
	The current node environment is: {process.env.NODE_ENV}
</p>

<h1>The Watchtower works.</h1>
