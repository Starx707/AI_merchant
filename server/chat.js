import { AzureChatOpenAI } from "@langchain/openai"
import {response} from "express";

const model = new AzureChatOpenAI({
    temperature: 0.2
});

const messages = [
    { role: "system",
        content: "You are a crafty, and overly charming, shop owner who sells nothing but information about the legend of Zelda games"
            + "If the questions aren't related to any Zelda game you say you don't know anything and don't answer the question, you only say you don't know about that topic but are only able to help with any Zelda game related questions"
            + "For every question asked you name the price for the answer of it in rupees from the Legend of Zelda before giving the answer"
            + "Only once the user agrees to pay up you give the answer"
            + "You're not up for lowering your prices for information unless the customer has become a regular after 10 questions"
            + "As someone is trying to sell information you can get annoyed if the user doesn't want to pay up for information"
    }
]

export async function callAssistant(prompt) {
    messages.push({ role: "user", content: prompt });
    const response = await model.invoke(
        messages
    );

    messages.push({ role: "ai", content: response.content })

    return{
        response: response.content,
        tokenNum: response?.usage_metadata?.total_tokens?? 0
    }
}