//get asked question from form
//make send question elements (see html)
const now = new Date();
const chatUser = document.getElementById("userChat");
const userInputField = document.getElementById("userInputField");
const chatLog = document.getElementById("chat");
const sendButton = document.getElementById("send");

chatUser.addEventListener('submit', function (e){
    e.preventDefault(); //prevent reload
    getData();
    createChatBubble(userInputField.value, true); //create the chat of the user
    window.scrollTo(0, document.body.scrollHeight); //scroll down to see the msg
    userInputField.value = ""; //empty the msg field
    sendButton.disabled = false;
})

let tokens = 0;

//connect to AI and log the response
async function getData() {
    sendButton.disabled = true;
    //block sending button
    const url = "http://localhost:8000/api/chat";
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(
                {
                    prompt: `${userInputField.value}`
                }
            ),
            headers: {
                'Content-Type': 'application/json',
                'Accept' : '*/*'
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        tokens = result.response.tokenNum;
        createChatBubble(result.response.response, false);
        console.log(result)
        window.scrollTo(0, document.body.scrollHeight);
    } catch (error) {
        console.error(error.message);
    }
}

function messageTime(){ //returns time in string
    const hour = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hour}:${minutes}`;
}

function createChatBubble(content, user){
    let tagDiv = null;
    let aiName = null;
    let tokensAmount = null;

    const listElement = document.createElement("li");
    const container = document.createElement("div");
    const textPrompt = document.createElement("p");
    const time = document.createElement("time");

    listElement.classList.add("self");
    container.classList.add("msg");

    if (user === false){
        tagDiv = document.createElement("div");
        aiName = document.createElement("span");
        tokensAmount = document.createElement("p")

        tagDiv.classList.add("user");
        aiName.classList.add("range", "admin");
        listElement.classList.add("other");
        listElement.classList.remove("self");
        tokensAmount.classList.add("tokens");

        tagDiv.innerText = "Azure"
        aiName.innerText = "AI"
        tokensAmount.innerText = `Tokens: ${tokens}`
    }

    //put in text
    textPrompt.innerText = `${content}`;
    time.innerText = messageTime();

    appendChildren(listElement, container, textPrompt, time, tagDiv, aiName, user, tokensAmount)
}

function appendChildren(list, container, text, time, tagDiv, aiName, user, tokenAmount){
    //if for AI
    //Put div into container and span in that div
    chatLog.appendChild(list);
    list.appendChild(container);

    if (user === false){
        container.appendChild(tagDiv);
        tagDiv.appendChild(aiName);
    }

    container.appendChild(text);
    container.appendChild(time);

    if (user === false){
        container.appendChild(tokenAmount);
    }

}