<script>
	import { env } from '$env/dynamic/public';
</script>

<h1>Hello World!</h1>
<p>
	{env.PUBLIC_GREETING}
	The current node environment is: {process.env.NODE_ENV}
</p>

<p>This is rebuilt a fifth time.</p>
