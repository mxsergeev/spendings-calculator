import visualControl from './modules/visualControl.js'
import eventListeners from './modules/eventListeners.js'
import createAndAppendFields from './modules/createAndAppendFields.js'

let inputFields, textareas
const clearAllButton = document.querySelector('.clear')
const moneyLimit = document.querySelector('.limit')
const period = document.querySelector('.period')
const moneySpent = document.querySelector('.spent')
const moneyRemaining = document.querySelector('.spent-remaining')
const moneySpentPercents = document.querySelector('.spent-percent')
const moneySpentDays = document.querySelector('.spent-days')

// Different objects and functions collected in arrays for easier use later.
const settings = [
    moneyLimit, 
    period
]
const info = [
    moneySpent, 
    moneyRemaining, 
    moneySpentPercents, 
    moneySpentDays
]
const listeners = [
    visualControl.handleMoneyBagState, 
    eventListeners.storeToLocalStorage,
    eventListeners.displaySpendings, 
    eventListeners.removeEmpty
]

// Initial index for input fields i.e for first input.
window.inputIndex = -1

// Creates as many fields as there are entries of spendings in the LocalStorage. 
// Inserts all values stored in the LocalStorage to their correct place in the input and textarea NodeList.
// Restores specified settings such as limit and period.
function seedInputValues() {
    Object
        .entries(localStorage)
        .filter(([key, value]) => key.includes('_'))
        .forEach(([key, value]) => {
            if (value !== "") createAndAppendFields()
    })
    inputFields = document.querySelectorAll('.input-container > input')
    inputFields.forEach((e, i) => e.value = localStorage.getItem('_' + i))

    textareas = document.querySelectorAll('.input-container > textarea')
    textareas.forEach((e, i) => e.value = localStorage.getItem(i+'-text'))
    
    settings.forEach(e => e.value = localStorage.getItem(`${e.name}`))
    listeners[eventListeners.displaySpendings()]
    listeners[visualControl.handleMoneyBagState()]
}
// Clears all fields and LocalStorage. Returns app to the initial state.
function clearAll() { 
    window.inputIndex = -1
    localStorage.clear()

    inputFields = document.querySelectorAll('.input-container > input')
    inputFields.forEach(e => e.remove())
    textareas = document.querySelectorAll('.input-container > textarea')
    textareas.forEach(e => e.remove())
    settings.forEach(e => e.value = null)
    info.forEach(e => e.textContent = null)

    moneySpentPercents.innerText = 'Specify the limit and period to see more info.'
    moneySpent.innerText = 'Enter spendings to see amount.'
    createAndAppendFields()
    visualControl.handleMoneyBagState()
}
clearAllButton.addEventListener('click', clearAll)

// Adds listeners to the limit and period fields.
listeners
    .filter(listener => listener != eventListeners.removeEmpty)
    .forEach(listener => {
        moneyLimit.addEventListener('change', {handleEvent: listener, type: 'limit'})
        period.addEventListener('change', {handleEvent: listener, type: 'period'})
    })
    

if(localStorage.length) {
    seedInputValues()
    console.log('localStorage', localStorage)
}
createAndAppendFields()