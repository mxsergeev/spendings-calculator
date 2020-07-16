let input = document.querySelectorAll('.input-container > input')
let textarea = document.querySelectorAll('.input-container > textarea')
const clearAllButton = document.querySelector('.clear')
const moneyLimit = document.querySelector('.limit')
const period = document.querySelector('.period')
const moneySpent = document.querySelector('.spent')
const moneyRemaining = document.querySelector('.spent-remaining')
const moneySpentPercents = document.querySelector('.spent-percent')
const moneySpentDays = document.querySelector('.spent-days')

const settings = [moneyLimit, period]
const info = [moneySpent,moneyRemaining, moneySpentPercents, moneySpentDays]

let index = -1

function createNewInput() {
    const inputContainer = document.querySelector('.input-container')
    index++

    const newInput = document.createElement('input')
    newInput.placeholder = '€€€'
    newInput.setAttribute('type', 'number')
    newInput.classList.add('number')
    newInput.addEventListener('change', {handleEvent: handleMoneyBagState})
    newInput.addEventListener('change', {handleEvent: storeInputValue, type: 'input', index: index})
    newInput.addEventListener('change', {handleEvent: calcValues})
    newInput.addEventListener('change', {handleEvent: removeEmpty, element: newInput, index: index, type: 'input'})
    inputContainer.appendChild(newInput)
    input = document.querySelectorAll('.input-container > input')
    
    const newTextArea = document.createElement('textarea')
    newTextArea.placeholder = 'Description'
    newTextArea.classList.add('text')
    newTextArea.addEventListener('change', {handleEvent: storeInputValue, type: 'text', index: index})
    newTextArea.addEventListener('change', {handleEvent: removeEmpty, element: newTextArea, index: index, type: 'text'})
    inputContainer.appendChild(newTextArea)
    textarea = document.querySelectorAll('.input-container > textarea')
    
    input.forEach((el, i) => {
        el.removeEventListener('change', createNewInput)
        if(i === input.length - 1) { 
            el.addEventListener('change', createNewInput)
            el.addEventListener('change', scroll, {once: true})
        }
    })
}

function handleMoneyBagState() {
    function jump() {
        const animationContainer = document.querySelector('.animation-container')
        animationContainer.classList.add('onchange-transform')
        setTimeout(() => {
            animationContainer.classList.remove('onchange-transform')
        }, 1500)
    }
    function shake() {
        const animationContainer = document.querySelector('.animation-container')
        animationContainer.classList.add('shake')
        setTimeout(() => {
            animationContainer.classList.remove('shake')
        }, 1500)
    }
    const animationContainer = document.querySelector('.animation-container')
    const moneyBag = document.querySelector('.money-bag')
    const leftMoney = moneySpent.textContent.match(/([0-9]+\.)\w+/g)
    const sign = document.querySelector('.sign')
    sign.classList.add('hidden')
    moneyRemaining.classList.remove('hidden')
    animationContainer.classList.remove('remaining-money-animation')
    moneyBag.classList.add('grayscale')
    if (moneyLimit.value) {
        animationContainer.classList.add('remaining-money-animation')
        moneyBag.classList.remove('grayscale')
    }
    if (moneySpent.textContent && new Number(leftMoney[0]) >= new Number(leftMoney[1])) {
        moneyRemaining.classList.add('hidden')
        sign.classList.remove('hidden')
        moneyBag.classList.add('grayscale')
        shake()
        return
    }
    jump()
}

function scroll() {
    scrollTo(0, document.querySelector(".flex-container").scrollHeight)
}
function storeInputValue(event) {
    switch (this.type) {
        case "input":
            localStorage.setItem('_' + this.index, event.target.value)
            break
        case "text":
            localStorage.setItem(this.index + '-text', event.target.value)
            break
        case "limit":
            localStorage.setItem('limit', event.target.value)
            break
        case "period": 
            localStorage.setItem('period', event.target.value)
            break
    }
    console.log('localStorage', localStorage)
}

function calcValues() {
    const sum = Object.entries(localStorage)
    .filter(([key, value]) => key.includes('_'))
    .map(([key, value]) => value)
    .reduce((prev, next) => prev*1 + next*1, 0)
    const limit = moneyLimit.value

    moneySpent.textContent = limit ? 
    `Spent ${sum.toFixed(2)}€ of ${new Number(limit).toFixed(2)}€ available` 
    : `${sum.toFixed(2)}€`

    moneyRemaining.textContent = limit-sum > 0 ?
    `${(limit-sum).toFixed(2)}€`
    : 'No money remaining'
    if (!limit) moneyRemaining.textContent = null

    moneySpentPercents.textContent = limit ? 
    `Spent ${Math.round(sum/limit*100)}%` 
    : null

    moneySpentDays.textContent = period.value && period.value != 0 ? 
    `${(limit/period.value).toFixed(2)}€ available per day` 
    : null

    handleMoneyBagState()
}

function removeEmpty() {
    if (!this.element.value) {
        localStorage.removeItem(this.index + '-text')
        if (this.type === 'input') {
            index--
            this.element.remove()
            textarea[this.index].remove()
            localStorage.removeItem(this.index + '-text')
            const keys = Object.keys(localStorage).filter(e => e.includes('_'))
            for (let i = this.index+1; i <= keys.length; i++) {
                localStorage.setItem('_'+(i-1), localStorage.getItem('_' + i))
                localStorage.setItem((i-1)+'-text', localStorage.getItem(i + '-text'))
            }
            console.log('keys', keys)
            if (keys.length >= 1) {
                localStorage.removeItem('_' + (keys.length))
                localStorage.removeItem((keys.length) + '-text')
            }
            Object
                .entries(localStorage)
                .forEach(([key, value]) => {
                    if (value === "null") localStorage.removeItem(key)
                })
        }
        calcValues()
    }
}

function seedInputValues() {
    Object
        .entries(localStorage)
        .filter(([key, value]) => key.includes('_'))
        .forEach(([key, value]) => {
            if (value !== "") createNewInput()
    })
    input.forEach((e, i) => e.value = localStorage.getItem('_' + i))
    textarea.forEach((e, i) => e.value = localStorage.getItem(i+'-text'))
    settings.forEach(e => e.value = localStorage.getItem(`${e.name}`))
    calcValues()
    handleMoneyBagState()
}

moneyLimit.addEventListener('change', {handleEvent: storeInputValue, type: 'limit'})
moneyLimit.addEventListener('change', calcValues)
moneyLimit.addEventListener('change', handleMoneyBagState)

period.addEventListener('change', {handleEvent: storeInputValue, type: 'period'})
period.addEventListener('change', calcValues)
clearAllButton.addEventListener('click', () => {
    index = -1
    localStorage.clear()
    input.forEach(e => e.remove())
    textarea.forEach(e => e.remove())
    settings.forEach(e => e.value = null)
    info.forEach(e => e.textContent = null)
    createNewInput()
    handleMoneyBagState()
    moneySpentPercents.innerText = 'Specify the limit and period to see more info.'
    moneySpent.innerText = 'Enter spendings to see amount.'
})

if(localStorage.length) {
    seedInputValues()
    console.log('localStorage', localStorage)
}
createNewInput()