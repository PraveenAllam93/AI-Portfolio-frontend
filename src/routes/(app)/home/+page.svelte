<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { handleSignOut, isAuthenticated } from '$lib/utils/auth';
	import { getUserInfo, type UserInfoResponse } from '$lib/utils/api';

	let loading = $state(true);
	let error = $state('');
	let userInfo: UserInfoResponse | null = $state(null);

	onMount(async () => {
		// Check if user is authenticated
		const authenticated = await isAuthenticated();
		if (!authenticated) {
			goto('/login');
			return;
		}

		// Fetch user info from API
		const result = await getUserInfo();

		if (result.success && result.data) {
			userInfo = result.data;
		} else {
			error = result.error || 'Failed to load user information';
		}

		loading = false;
	});

	async function onLogout() {
		const result = await handleSignOut();
		if (result.success) {
			goto('/');
		}
	}
</script>

<svelte:head>
	<title>Home — AIfolio</title>
</svelte:head>

<div class="min-h-screen bg-peach-50">
	<!-- Navbar -->
	<nav class="border-b border-peach-200 bg-white">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
			<a href="/" class="font-serif text-2xl font-bold text-charcoal">AIfolio</a>
			<button
				onclick={onLogout}
				class="rounded-full bg-charcoal px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light"
			>
				Log Out
			</button>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="mx-auto max-w-4xl px-6 py-12">
		{#if loading}
			<div class="rounded-2xl bg-white p-8 text-center shadow-sm">
				<div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-charcoal border-t-transparent"></div>
				<p class="mt-4 text-charcoal-light">Loading your information...</p>
			</div>
		{:else if error}
			<div class="rounded-2xl border border-red-200 bg-red-50 p-8">
				<h2 class="font-serif text-xl font-bold text-red-900">Error</h2>
				<p class="mt-2 text-red-800">{error}</p>
				<button
					onclick={() => window.location.reload()}
					class="mt-4 rounded-full bg-red-900 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800"
				>
					Retry
				</button>
			</div>
		{:else if userInfo}
			<!-- Welcome Section -->
			<div class="rounded-2xl bg-white p-8 shadow-sm">
				<h1 class="font-serif text-3xl font-bold text-charcoal">
					Welcome back, {userInfo.user.name}!
				</h1>
				<p class="mt-2 text-charcoal-light">
					You're successfully logged in to AIfolio.
				</p>
			</div>

			<!-- User Information Card -->
			<div class="mt-6 rounded-2xl bg-white p-8 shadow-sm">
				<h2 class="font-serif text-2xl font-bold text-charcoal">Your Account Information</h2>
				<p class="mt-1 text-sm text-charcoal-light">
					Information retrieved from AWS Cognito JWT token
				</p>

				<div class="mt-6 space-y-4">
					<div class="border-b border-peach-200 pb-4">
						<dt class="text-sm font-medium text-charcoal-light">Full Name</dt>
						<dd class="mt-1 text-lg text-charcoal">{userInfo.user.name}</dd>
					</div>

					<div class="border-b border-peach-200 pb-4">
						<dt class="text-sm font-medium text-charcoal-light">Email Address</dt>
						<dd class="mt-1 text-lg text-charcoal">{userInfo.user.email}</dd>
					</div>

					<div class="border-b border-peach-200 pb-4">
						<dt class="text-sm font-medium text-charcoal-light">User ID</dt>
						<dd class="mt-1 font-mono text-sm text-charcoal">{userInfo.user.userId}</dd>
					</div>

					<div class="border-b border-peach-200 pb-4">
						<dt class="text-sm font-medium text-charcoal-light">Email Verified</dt>
						<dd class="mt-1 text-lg text-charcoal">
							{userInfo.user.emailVerified === 'true' ? 'Yes' : 'No'}
						</dd>
					</div>
				</div>
			</div>

			<!-- Token Information (Debug) -->
			<div class="mt-6 rounded-2xl bg-white p-8 shadow-sm">
				<h2 class="font-serif text-2xl font-bold text-charcoal">Session Information</h2>
				<p class="mt-1 text-sm text-charcoal-light">
					Your authentication token details
				</p>

				<div class="mt-6 space-y-4">
					<div class="border-b border-peach-200 pb-4">
						<dt class="text-sm font-medium text-charcoal-light">Token Issued At</dt>
						<dd class="mt-1 text-sm text-charcoal">{userInfo.user.tokenIssuedAt}</dd>
					</div>

					<div class="border-b border-peach-200 pb-4">
						<dt class="text-sm font-medium text-charcoal-light">Token Expires At</dt>
						<dd class="mt-1 text-sm text-charcoal">{userInfo.user.tokenExpiresAt}</dd>
					</div>

					<div class="border-b border-peach-200 pb-4">
						<dt class="text-sm font-medium text-charcoal-light">Issuer</dt>
						<dd class="mt-1 break-all font-mono text-xs text-charcoal">{userInfo.user.issuer}</dd>
					</div>
				</div>
			</div>

			<!-- API Metadata -->
			<div class="mt-6 rounded-2xl bg-peach-100 p-6">
				<h3 class="text-sm font-semibold text-charcoal">API Response Metadata</h3>
				<div class="mt-3 space-y-2 text-xs text-charcoal-light">
					<p><span class="font-medium">Request ID:</span> {userInfo.metadata.requestId}</p>
					<p><span class="font-medium">Request Time:</span> {userInfo.metadata.requestTime}</p>
					<p><span class="font-medium">Source IP:</span> {userInfo.metadata.sourceIp}</p>
				</div>
			</div>

			<!-- Success Message -->
			<div class="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">
				<h3 class="font-semibold text-green-900">Authentication Test Successful!</h3>
				<p class="mt-2 text-sm text-green-800">
					This page successfully demonstrates:
				</p>
				<ul class="mt-2 space-y-1 text-sm text-green-800">
					<li>✓ User authentication with AWS Cognito</li>
					<li>✓ JWT token retrieval and storage</li>
					<li>✓ Authenticated API call to AWS API Gateway</li>
					<li>✓ Lambda function execution and response</li>
					<li>✓ User information extraction from JWT claims</li>
				</ul>
			</div>
		{/if}
	</main>
</div>
