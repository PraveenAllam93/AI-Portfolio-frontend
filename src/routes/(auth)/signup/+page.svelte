<svelte:head>
	<title>Sign Up — AIfolio</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-peach-50 px-6">
	<div class="w-full max-w-md">
		<div class="text-center">
			<a href="/" class="font-serif text-2xl font-bold text-charcoal">AIfolio</a>
			<h1 class="mt-6 font-serif text-3xl font-bold text-charcoal">Create your AIfolio account</h1>
			<p class="mt-2 text-sm text-charcoal-light">
				Start building your portfolio website in minutes.
			</p>
		</div>

		<form class="mt-8 space-y-5" onsubmit={(e) => e.preventDefault()}>
			<div>
				<label for="name" class="block text-sm font-medium text-charcoal">Full name</label>
				<input
					id="name"
					type="text"
					autocomplete="name"
					required
					class="mt-1.5 w-full rounded-xl border border-peach-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-coral focus:ring-coral"
					placeholder="Jane Doe"
				/>
			</div>

			<div>
				<label for="email" class="block text-sm font-medium text-charcoal">Email</label>
				<input
					id="email"
					type="email"
					autocomplete="email"
					required
					class="mt-1.5 w-full rounded-xl border border-peach-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-coral focus:ring-coral"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-charcoal">Password</label>
				<input
					id="password"
					type="password"
					autocomplete="new-password"
					required
					class="mt-1.5 w-full rounded-xl border border-peach-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal-light/50 focus:border-coral focus:ring-coral"
					placeholder="Create a password"
				/>
			</div>

			<button
				type="submit"
				class="w-full rounded-full bg-charcoal py-3.5 text-sm font-semibold text-white transition-colors hover:bg-charcoal-light"
			>
				Create Account
			</button>
		</form>

		<p class="mt-6 text-center text-sm text-charcoal-light">
			Already have an account?
			<a href="/login" class="font-semibold text-coral hover:text-coral-dark">Log in</a>
		</p>
	</div>
</div>
