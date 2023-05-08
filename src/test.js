const openai = require('openai');

const api_key = 'YOUR_API_KEY';
const prompt = 'Hello, how are you today?';
const model = 'text-davinci-002';
const temperature = 0.5;
const max_tokens = 50;
const n = 1;
const stop = '\n';

openai.api_key = api_key;

const completions = openai.Completion.create({
  engine: model,
  prompt: prompt,
  temperature: temperature,
  max_tokens: max_tokens,
  n: n,
  stop: stop,
  stream: true, // enable streaming
});

completions.on('data', data => {
  console.log(data.choices[0].text);
});

completions.on('error', error => {
  console.log(error);
});

completions.on('end', () => {
  console.log('Completed!');
});
