import { CreateWebWorkerMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm"

const $ = el => document.querySelector(el)

const $form = $('form')
const $input = $('textarea')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $button = $('button')
const $info = $('small')
const $loading = $('.loading')

$form.addEventListener('submit', (event) => {
    event.preventDefault()
    const messageText = $input.value.trim()
    if(messageText !== ""){
        $input.value = ""
    }

    addMessage(messageText, "user")
})

function addMessage (text, sender){
    //Clonar el template de manera profunda
    const clonTemplate = $template.content.cloneNode(true)
    const $newMessage = clonTemplate.querySelector('.message')
    const $whoSendImage = $newMessage.querySelector('span img')
    const $text = $newMessage.querySelector('p')
    const classSender = sender === "bot" ? "bot" : "user"

    $whoSendImage.src = sender === "bot" ? './arabia.png' : './user.png';
    $text.textContent = text
    //actualizar scroll
    
    $container.scrollTop = $container.scrollHeight
    $newMessage.classList.add(classSender)
    $messages.appendChild($newMessage)
}