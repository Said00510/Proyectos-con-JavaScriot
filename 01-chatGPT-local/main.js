import { CreateMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm";

const $ = (el) => document.querySelector(el);

const $form = $("form");
const $input = $("textarea");
const $template = $("#message-template");
const $messages = $("ul");
const $container = $("main");
const $button = $("button");
const $info = $("small");
const $loading = $(".loading");

const SELECTED_MODEL = "Llama-3-8B-Instruct-q4f16_1-MLC-1k";

let messages = [];

const initProgressCallback = (initProgress) => {
  $info.textContent = initProgress.text;
  if (initProgress.progress === 1) {
    $button.removeAttribute("disabled");
    // addMessage("¡Hola! Soy un Modelo de ChatGpt basado en llama 3.8 que se ejecuta completamente en tu navegador. ¿En qué puedo ayudarte hoy?", 'bot')
    $input.focus();
  }
};

const engine = await CreateMLCEngine(SELECTED_MODEL, {
  initProgressCallback: initProgressCallback,
});

$form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const messageText = $input.value.trim();
  if (messageText !== "") {
    $input.value = "";
  }
  addMessage(messageText, "user");
  $button.setAttribute('disabled', '')

  const userMessages = {
    role: "user",
    content: messageText,
  };
  messages.push(userMessages);
  //PEDIR RESPUESTA DEL BOT
  const chunks = await engine.chat.completions.create({
    messages,
    stream: true,
  });

  let reply = "";

  const $botMessage = addMessage("", "bot");

  for await (const chunk of chunks) {
    const choice = chunk.choices[0];
    const content = choice?.delta?.content ?? "";
    reply += content;
    $botMessage.textContent = reply;
  }

  $button.removeAttribute("disabled");

  messages.push({
    role: "assistant",
    content: reply,
  });
  $container.scrollTop = $container.scrollHeight;
});

function addMessage(text, sender) {
  //Clonar el template de manera profunda
  const clonTemplate = $template.content.cloneNode(true);
  const $newMessage = clonTemplate.querySelector(".message");
  const $whoSendImage = $newMessage.querySelector("span img");
  const $text = $newMessage.querySelector("p");
  const classSender = sender === "bot" ? "bot" : "user";

  $whoSendImage.src = sender === "bot" ? "./arabia.png" : "./user.png";
  $text.textContent = text;
  //actualizar scroll

  $newMessage.classList.add(classSender);
  $messages.appendChild($newMessage);

  return $text;
}
