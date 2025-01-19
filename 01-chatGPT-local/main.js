import { CreateMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.46/+esm"

const $ = el => document.querySelector(el)

const $form = $('form')
const $input = $('textarea')
const $template = $('#message-template')
const $messages = $('ul')
const $container = $('main')
const $button = $('button')
const $info = $('small')
const $loading = $('.loading')

const MODEL = "WizardMath-7B-V1.1-q4f16_1-MLC"

let messages = []

const engeine = await CreateMLCEngine(
    MODEL,
    {
        initProgressCallback: (info) => {
            $info.textContent = info.text
            if(info.progress === 1){
                $button.removeAttribute('disabled')
            }
        }
    }
)

$form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const messageText = $input.value.trim()
    if(messageText !== ""){
        $input.value = ""
    }
    addMessage(messageText, "user")

    const userMessages = {
        role : 'user',
        content: messageText
    }

    messages.push(userMessages)

    //PEDIR RESPUESTA DEL BOT
    const reply = await engeine.chat.completions.create({
        messages
    })
    console.log({reply})

    const botAnswer = reply.choices[0].message
    messages.push(botAnswer)
    addMessage(botAnswer.content , 'bot')

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