export class Question {
    static create(question) {
        fetch('https://podcast-work.firebaseio.com/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            } 
        })
        .then(response => response.json())
        .then(response => {
            question.id = response.name
            return question
        })
        .then(addTolocalStorage)
        .then(Question.renderList)//Он статический, поэтому через this не получится
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">У вас нет токена</p>')
        }
        fetch(`https://podcast-work.firebaseio.com/questions.json?auth=${token}`)
        .then(response => response.json())
        .then(response => {
            if (response && response.error) {
                return `<p class="error">${response.error}</p>`
            }
            return response ? Object.keys(response).map(key => ({
                ...response[key],
                id: key
            })) : []
        })
    
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage()

        const html = questions.length
        ? questions.map(toCard).join('')
        : `  <div class="mui--text-headline">Пока вопросов нет у вас</div>`//Трансформация массива с помощью функции...
   
        const list = document.getElementById('list')
        list.innerHTML = html
    }

    static listToHTML(questions) {
        return questions.length
        ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
        :'<p>Вопросов пока нет</p>'
    }
}

function addTolocalStorage(question) {
    //Не работает потому что он не создает список, а обновляет
    const all = getQuestionsFromLocalStorage()
    all.push(question)
    localStorage.setItem('questions', JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
    return `
    <div class="mui--text-black-54">
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    `
}