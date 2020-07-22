function handleMoneyBagState() {

    // Adds animation classes and after some time removes the animation class.
    const animationContainer = document.querySelector('.animation-container')
    function jump() {
        animationContainer.classList.add('onchange-transform')
        setTimeout(() => {
            animationContainer.classList.remove('onchange-transform')
        }, 1500)
    }
    function shake() {
        animationContainer.classList.add('shake')
        setTimeout(() => {
            animationContainer.classList.remove('shake')
        }, 500)
    }

    const moneyLimit = document.querySelector('.limit')
    const moneySpent = document.querySelector('.spent')
    const moneyBag = document.querySelector('.money-bag')
    const sign = document.querySelector('.sign')
    const leftMoney = moneySpent.textContent.match(/([0-9]+\.)\w+/g)

    // Initial setup.
    moneyBag.classList.add('grayscale')
    sign.classList.add('hidden')
    animationContainer.classList.remove('remaining-money-animation')

    // If you have some money left the money bag is green and animated.
    if (moneyLimit.value) {
        animationContainer.classList.add('remaining-money-animation')
        moneyBag.classList.remove('grayscale')
    }
    // If you have spent more than you have specified in the limit field
    // the money bag is gray, has a red sign and will shake everytime you spend more.
    if (leftMoney) {
        if (new Number(leftMoney[0]) >= new Number(leftMoney[1])) {
            sign.classList.remove('hidden')
            moneyBag.classList.add('grayscale')
            shake()
            return
        }
    }
    // If you have money left everytime you add spendings the money bag jumps.
    jump()
}

// Scroll to the bottom of the page.
function scroll() {
    scrollTo(0, document.querySelector(".flex-container").scrollHeight)
}

export default {
    handleMoneyBagState,
    scroll
}