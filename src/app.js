import './style.css'
import {Question} from './question'
import { isValid, createModal } from './utils'
import { getAuthForm, authWithEmailAndPassword } from './auth'

const form = document.getElementById('form')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')
const modalBtn = document.getElementById('modal-btn')

window.addEventListener('load', Question.renderList())
//Нативное событие которое слушает когда я нажимаю кнопку или другие операции
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        //Асинхронный запрос на сервер чтобы сохранить вопрос
        submitBtn.disabled = true
        Question.create(question).then( () => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
    }
}


function openModal() {
    createModal('Авторизация', getAuthForm())
    document.getElementById('auth-form').addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler() {
    event.preventDefault()

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true

    authWithEmailAndPassword(email, password)
    
    .then(Question.fetch)    
    
    // .then(token => { Альтернатива
    //         .then(Question.fetch())
    //        //Альтернатива return Question.fetch(token)
    //     })
    .then(renderModalAfterAuth)
    .then(() => btn.disabled = false)
}

function renderModalAfterAuth() {
    if (typeof content === 'string') {
        createModal('Ошибка!', content)
    } else {
        createModal('Список вопросов', Question.listToHTML(content))
    }
}