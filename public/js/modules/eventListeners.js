import visualControl from './visualControl.js'

// Depending on the type, values are stored in LocalStorage with different keys.
function storeToLocalStorage(event) {
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
}

// Calculates and displays all kinds of information.
function displaySpendings() {
    const moneyLimit = document.querySelector('.limit')
    const period = document.querySelector('.period')
    const moneySpent = document.querySelector('.spent')
    const moneyRemaining = document.querySelector('.spent-remaining')
    const moneySpentPercents = document.querySelector('.spent-percent')
    const moneySpentDays = document.querySelector('.spent-days')

    // Calculates sum of all spendings from the values stored in LocalStorage.
    const sum = Object
        .entries(localStorage)
        .filter(([key, value]) => key.includes('_'))
        .map(([key, value]) => value)
        .reduce((prev, next) => prev*1 + next*1, 0)
    const limit = moneyLimit.value

    // If limit is specified text like "Spent 5.00€ of 10.00€ available" is printed. 
    // Else prints just the spent amount.
    moneySpent.textContent = limit ? 
    `Spent ${sum.toFixed(2)}€ of ${new Number(limit).toFixed(2)}€ available` : 
    `${sum.toFixed(2)}€`

    // Displays how much money you have left if limit was specified.
    moneyRemaining.textContent = limit ?
    `${(limit-sum).toFixed(2)}€` :
    null

    // Displays percentage of spent money if limit was specified.
    moneySpentPercents.textContent = limit ? 
    `Spent ${Math.round(sum/limit*100)}%` : 
    null

    // Displays how much you can spend on each day if period was specified.
    moneySpentDays.textContent = period.value && period.value != 0 ? 
    `${(limit/period.value).toFixed(2)}€ available per day` : 
    null

    // Change the money bag's state.
    visualControl.handleMoneyBagState()
}

// Removes empty spending fields from document and LocalStorage.
function removeEmpty() {
    const textareas = document.querySelectorAll('.input-container > textarea')
    if (!this.element.value) {
        localStorage.removeItem(this.index + '-text')
        // Only applies to the empty number fields.
        if (this.type === 'input') {
            // Decrease the global index, so that new fields added in the future would get the correct index.
            window.inputIndex-- 
            // Remove number field and it's textarea from the document and LocalStorage.
            this.element.remove()
            textareas[this.index].remove()
            localStorage.removeItem(this.index + '-text')
            // Get keys of the spent money inputs from LocalStorage.
            const keys = Object.keys(localStorage).filter(e => e.includes('_'))
            // Fix indexing of all number input entries that follow the deleted entry.
            for (let i = this.index+1; i <= keys.length; i++) {
                localStorage.setItem('_'+(i-1), localStorage.getItem('_' + i))
                localStorage.setItem((i-1)+'-text', localStorage.getItem(i + '-text'))
            }
            // Remove the last entry because it gets duplicated for some reason.
            if (keys.length >= 1) {
                localStorage.removeItem('_' + (keys.length))
                localStorage.removeItem((keys.length) + '-text')
            }
            // Remove null entries that got stored to LocalStorage from empty fields.
            Object
                .entries(localStorage)
                .forEach(([key, value]) => {
                    if (value === "null") localStorage.removeItem(key)
                })
        }
        // Recalculate spendings.
        displaySpendings()
    }
}

export default {
    storeToLocalStorage,
    displaySpendings,
    removeEmpty
}