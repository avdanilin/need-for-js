const score = document.querySelector('.score')
const start = document.querySelector('.start')
const gameArea = document.querySelector('.gameArea')
const car = document.createElement('div')
car.classList.add('car')

start.addEventListener('click', startGame)
document.addEventListener('keydown', startRun)
document.addEventListener('keyup', stopRun)

const keys = {
    arrowUp: false,
    arrowDown: false,
    arrowRight: false,
    arrowLeft: false
}

const setting = {
    start: false,
    score: 0,
    speed: 3
}

function startGame() {
    start.classList.add('hide')
    setting.start = true
    requestAnimationFrame(playGame)
    gameArea.appendChild(car)
}

function playGame() {
    if (setting.start) {
        //для плавного перезапуска анимации игры пока она идёт
        requestAnimationFrame(playGame)
    }
}

function startRun(e) {
    e.preventDefault()
    keys[e.key] = true
}

function stopRun(e) {
    e.preventDefault()
    keys[e.key] = false
}