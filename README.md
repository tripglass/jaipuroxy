# JAIPuR OXY

Proxy for interfacing JanitorAI with a bunch of other LLM APIs **primarily** to:
- enable reasoning, e.g. with models that can do both
- make JanitorAI communicate with Gemini

This proxy works for:
- OpenRouter
- Z.AI
- Google AI Studio/Gemini

## Adding Reasoning

Reasoning makes for more consistent and coherent responses.

Some models offer both reasoning and non-reasoning modes, and some APIs let the user enable reasoning by setting an option in the request body. Since JAI doesn't let you add options to the request at will, this proxy accepts your request, slaps on the required parameter to enable reasoning, and passes it on. 

This is currently implemented for:
- OpenRouter.AI
- Z.AI

## Gemini

### API Support

Gemini has a different API than e.g. OpenRouter. JAI does not support Gemini's request/response format out of the box, so this proxy does the translation. Reasoning is enabled via selected model - either you're using `flash` (which does not reason) or `pro` (which does).

### System Prompt

This proxy additionally supports passing along a **system prompt**, which will make Gemini adhere more strictly to your instructions. (It could be used to experimentally use a Chain-of-Thought with `flash`...) This isn't dynamic yet, so if you want to use your own system prompt, you have to run your own proxy...

## OpenRouter Presets

This proxy also supports using **OpenRouter presets**. You can use those to set the **system prompt** on OpenRouter, select and exclude providers, and more. (Disappointingly enough, presets do not support setting the `reasoning` flag.) 



# About this project

## Stack

Base technologies are Node & TypeScript. API is built on express & tsoa, proxy calls use axios and the Google GenAI SDK. Testing with vitest.

## Questions

### Why no Chutes?

Last time I checked, the Chutes.ai API did not offer a flag for users to explicitly enable reasoning for a request. Instead, it probably depends on the model whether some magic is happening or reasoning just never gets activated. Either way, it looks like my proxy **can't** help here.

### Why no provider XY?

I focused on the providers I use. Adding another provider depends on:
- someone requesting it 
- the provider's API docs being comprehensible
- me easily getting an API key for testing
- me having the time to implement it

### Why use this when XY exists?

Dunno? Compare the features and the code (if the full source is publically available) and decide for yourself. I'm not trying to sell you JAIPuR, I'm just putting it online because I've been using it anyway lol.

### Why build this when XY exists?

- I have simple needs
- I like knowing what code does, which is easiest when I have written it 
- I like messing around and experimenting
- I am a developer

### Why "JAIPuR"?

JAI P(u)ROXY. I... like puns...

## Expectation Management

I work on this for my own purposes in my own time, since I have a day job. I accept feature requests but will probably prioritise them in accordance with my brainworms. While I don't expect merge requests, I'm open to them. I will try to keep the API stable because I'm not a monster.

## Disclaimer

You're free to deploy this code, pilfer it for parts or do whatever. As far as I know, this code does not violate the ToS of JanitorAI, OpenRouter, Google AI Studio or Z.AI, and it wasn't designed to. I don't take responsibility for what other people use this code for or what happens then (e.g. costs incurred, something breaking, getting in trouble). Just know what you're doing.

## License

This code is provided under the MIT License.

Copyright 2025 tripglass

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
