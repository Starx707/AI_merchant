import express from 'express'
import cors from "cors";
import {callAssistant} from "./chat.js";


//server & response
const app = express()

app.use(cors());
app.use(express.json())

app.use(express.static("public"));

app.post('/api/chat', async (req, res) => {
    const prompt = req.body?.prompt ?? "The user doesn't have a question"
    const response = await callAssistant(prompt);
    res.json({ response })
})

app.listen(process.env.EXPRESS_PORT, () => console.log(`Server running on http://localhost:${process.env.EXPRESS_PORT}`));
