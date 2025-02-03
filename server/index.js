import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful AI assistant. Respond to the following message:
{message}
`);

const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await chain.invoke({ message });
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});