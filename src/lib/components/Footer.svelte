<script lang="ts">
	import * as m from '$paraglide/messages';
</script>

<footer
	class="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-2 px-4 shadow-lg relative"
>
	<div class="container mx-auto px-4">
		<div class="flex flex-col md:flex-row justify-center items-center">
			<div class="mb-4 md:mb-0">
				<p class="text-sm">
					&copy; AI Cost Simulator {new Date().getFullYear()}
					{m.footerCopyright()}
				</p>
			</div>
			<span class="mx-1">|</span>
			<div class="flex space-x-4">
				<a
					href="https://github.com/noricha-vr/genapi-cost-simulator"
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm hover:text-gray-300 transition-colors duration-300"
				>
					{m.footerGithub()}
				</a>
			</div>
		</div>
	</div>
</footer>
