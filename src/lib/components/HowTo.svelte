<script>
	import * as m from '$paraglide/messages';
</script>

<div class="card p-4 variant-soft">
	<h2 class="text-2xl font-bold mb-4 text-gray-800">
		{m.howToTitle()}
	</h2>

	<p class="mb-4 text-gray-600">
		{m.howToDescription()}
	</p>

	<h3 class="text-xl font-semibold mb-2 text-gray-700">{m.howToHowToUse()}</h3>

	<ol class="list-decimal list-inside mb-4 text-gray-600">
		<li class="mb-2">
			<span class="font-medium">{m.howToStep1Title()}</span>
			<ul class="list-disc list-inside ml-4 mt-1">
				<li>
					{m.howToStep1SystemMessage()}
				</li>
				<li>{m.howToStep1UserInput()}</li>
				<li>{m.howToStep1AiResponse()}</li>
				<li>{m.howToStep1ConversationTurns()}</li>
			</ul>
		</li>
		<li class="mb-2">
			<span class="font-medium">{m.howToStep2Title()}</span>
			<p class="ml-4">
				{m.howToStep2Description()}
			</p>
		</li>
		<li class="mb-2">
			<span class="font-medium">{m.howToStep3Title()}</span>
			<ul class="list-disc list-inside ml-4 mt-1">
				<li>{m.howToStep3Graph()}</li>
				<li>{m.howToStep3Table()}</li>
				<li>{m.howToStep3DetailedCosts()}</li>
			</ul>
		</li>
		<li>
			<span class="font-medium">{m.howToStep4Title()}</span>
			<ul class="list-disc list-inside ml-4 mt-1">
				<li>{m.howToStep4CompareCosts()}</li>
				<li>{m.howToStep4AdjustConversation()}</li>
				<li>{m.howToStep4ProjectEstimation()}</li>
			</ul>
		</li>
	</ol>

	<h3 class="text-xl font-semibold mb-2 text-gray-700">{m.howToUsefulFeaturesTitle()}</h3>
	<ul class="list-disc list-inside mb-4 text-gray-600">
		<li>{m.howToUsefulFeaturesInstantUpdate()}</li>
		<li>{m.howToUsefulFeaturesSelectModels()}</li>
		<li>{m.howToUsefulFeaturesCurrencySwitching()}</li>
		<li>{m.howToUsefulFeaturesTokenCountLinks()}</li>
	</ul>

	<p class="text-gray-600">
		{m.howToConclusion()}
	</p>

	<p class="mt-4 text-gray-600 font-medium">
		{m.howToCallToAction()}
	</p>
</div>
