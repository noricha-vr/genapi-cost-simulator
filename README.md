# AI Cost Simulator

AI Cost Simulator is a powerful tool designed to accurately calculate and compare the costs of using popular AI models like OpenAI's ChatGPT, Anthropic's Claude, Google's Gemini, and other leading AI technologies. This simulator is essential for budgeting AI projects and comparing costs across different AI services.

## Features

- Simulate costs for multiple AI models including GPT-4, GPT-3.5-turbo, Claude-3 variants, and Gemini models
- Interactive input for system tokens, input tokens, output tokens, and conversation turns
- Real-time cost calculation and visualization
- Support for multiple currencies (USD, EUR, JPY, GBP)
- Detailed breakdown of input costs, output costs, and total costs for each model
- Interactive chart for cost comparison across iterations
- Ability to toggle visibility of different models in the chart
- Responsive design for various screen sizes

## How to Use

1. **Enter conversation settings:**
   - System message length: Length of instructions to models
   - User input length: Length of your prompt or query
   - AI response length: Estimated length of the model's response
   - Number of conversation turns: How many back-and-forths in your AI interaction

2. **Select currency:**
   Choose your preferred currency for cost calculation.

3. **Check results:**
   - Graph: Visualize cost progression for different AI models
   - Table: Compare final total costs across different AI models
   - Detailed costs for each AI model are displayed

4. **Utilize results:**
   - Compare costs of different models to choose the most cost-effective one
   - Adjust conversation length or turns to fit your budget
   - Use for project cost estimation with various AI models

## Development

This project is built using SvelteKit and uses the following technologies:

- Svelte
- TypeScript
- Chart.js for data visualization
- TailwindCSS for styling
- Skeleton UI for component library

### Setup

1. Clone the repository
2. Install dependencies:

   ```
   npm install
   ```

3. Run the development server:

   ```
   npm run dev
   ```

### Testing

Run tests using Vitest:

```
npm run test
```

### Building

To create a production version of your app:

```
npm run build
```

You can preview the production build with `npm run preview`.

## Deployment

This project is configured to deploy on Cloudflare Pages using the SvelteKit adapter for Cloudflare.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your chosen license here]

## Acknowledgements

- Pricing data is sourced from official OpenAI, Anthropic, and Google AI pricing pages.
- This project uses Chart.js for data visualization.

## Disclaimer

This tool provides estimates based on current pricing models. Always refer to the official pricing pages of AI providers for the most up-to-date and accurate pricing information.

## TODO

- Multi language support
- Set each model color
