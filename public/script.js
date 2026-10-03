const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {
    const message = userInput.value.trim();

    if (message === "") {
        return;
    }

    // Show user message
    const userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = message;
    chatBox.appendChild(userMessage);

    userInput.value = "";

    // Show typing indicator
    const typingMessage = document.createElement("div");
    typingMessage.className = "bot-message typing";
    typingMessage.innerHTML = "Typing<span class=\"dots\">...</span>";
    chatBox.appendChild(typingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    // Disable send button while AI is replying
    sendBtn.disabled = true;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        // Remove Typing...
        typingMessage.remove();

        // Show AI response
        const botMessage = document.createElement("div");
        botMessage.className = "bot-message";
        botMessage.textContent = data.reply;

        chatBox.appendChild(botMessage);

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error(error);

        // Remove Typing...
        typingMessage.remove();

        const botMessage = document.createElement("div");
        botMessage.className = "bot-message";
        botMessage.textContent = "Sorry, something went wrong.";

        chatBox.appendChild(botMessage);
    }

    // Enable send button again
    sendBtn.disabled = false;
}