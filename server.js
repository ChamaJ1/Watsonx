javascript
const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate-questions', async (req, res) => {
  try {
    const { topics, questionType, difficulty, numQuestions } = req.body;

    if (!topics || !questionType || !difficulty || !numQuestions) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const prompt = `Generate ${numQuestions} ${difficulty} ${questionType} study questions from the following notes: ${topics}. Return JSON with question, type, options, answer, and explanation.`;

    const response = await client.createCompletion({
      model: 'gpt-4.1-mini',
      prompt,
      max_tokens: 2048,
      temperature: 0.7,
      stop: '\n\n',
    });

    const questions = JSON.parse(response.data.choices[0].text);

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating questions' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
