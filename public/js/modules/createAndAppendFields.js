import eventListeners from './eventListeners.js'
import visualControl from './visualControl.js'

const listeners = [
    visualControl.handleMoneyBagState,
    eventListeners.storeToLocalStorage, 
    eventListeners.displaySpendings, 
    eventListeners.removeEmpty
]

// Creates, appends and adds eventlisteners to the input and textarea pair.
export default function createAndAppendFields() {
    // Increase global index so that next field would get the correct index.
    window.inputIndex++
    const inputContainer = document.querySelector('.input-container')

    const newInput = document.createElement('input')
    newInput.placeholder = '€€€'
    newInput.setAttribute('type', 'number')
    newInput.classList.add('number')
    // Add eventlisteners from the listeners array. 
    // Also pass some variables to the listener such as current element's index.
    listeners.forEach(listener => {
        newInput.addEventListener('change', {
            handleEvent: listener, 
            element: newInput, 
            index: window.inputIndex, 
            type: 'input'})
    })
    inputContainer.appendChild(newInput)
    
    // Almost the same but for textarea.
    const newTextArea = document.createElement('textarea')
    newTextArea.placeholder = 'Description'
    newTextArea.classList.add('text')
    listeners
        .filter(listener => listener == eventListeners.storeToLocalStorage || listener == eventListeners.removeEmpty)
        .forEach(listener => {
                newTextArea.addEventListener('change', {
                handleEvent: listener, 
                element: newTextArea, 
                index: window.inputIndex, 
                type: 'text'
            })
    })
    inputContainer.appendChild(newTextArea)
    
    // createAndAppendFields() as well as scroll() listeners are added only to the last input element.
    const inputFields = document.querySelectorAll('.input-container > input')
    inputFields.forEach((el, i) => {
        if(i === inputFields.length - 1) { 
            el.addEventListener('change', createAndAppendFields)
            el.addEventListener('change', visualControl.scroll, {once: true})
            return
        }
        el.removeEventListener('change', createAndAppendFields)
    })
}