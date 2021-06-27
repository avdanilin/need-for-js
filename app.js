const MAX_ENEMY = 7
const HEIGHT_ELEMENT = 150
const score = document.querySelector('.score')
const start = document.querySelector('.start')
const game = document.querySelector('.game')
const startLevel = document.querySelector('.levels')
const gameArea = document.querySelector('.gameArea')
const car = document.createElement('div')
const btns = document.querySelectorAll('.btn')
const playerRecords = document.querySelector('.records')
const recordSpan = document.querySelector('.record-span')
const openMusic = document.querySelector('.open-music')
const closeMusic = document.querySelector('.close-music')
const btnMusic = document.querySelector('.button-music')
let record = localStorage.getItem('record') ? localStorage.getItem('record') : 0
const audio = new Audio('audio.mp3')

car.classList.add('car')
recordSpan.textContent = record

start.addEventListener('click', preparationGame)
document.addEventListener('keydown', startRun)
document.addEventListener('keyup', stopRun)
startLevel.addEventListener('click', startGame)

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
}

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
}

let startSpeed = 0

const changeLevel = lvl => {

    switch (lvl) {
        case '1':
            setting.traffic = 5
            setting.speed = 3
            break
        case '2':
            setting.traffic = 4
            setting.speed = 6
            break
        case '3':
            setting.traffic = 4
            setting.speed = 8
            break
    }

    startSpeed = setting.speed
}

function preparationGame() {
    return btns.forEach(btn => btn.disabled = false)
}

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1
}

const getRandomEnemy = max => Math.floor(Math.random() * max + 1)

const togglePlay = () => audio.paused ? audio.play() : audio.pause()

btnMusic.addEventListener('click', () => {
    openMusic.classList.toggle('hide')
    closeMusic.classList.toggle('hide')
    togglePlay()
})

function startGame(e) {
    // if (e.target.classList.contains('start')) {
    //     btns.forEach(btn => btn.disabled = false)
    // } else {
    if (!e.target.classList.contains('btn')) return
    btns.forEach(btn => btn.disabled = true)
    game.style.paddingTop = 0
    playerRecords.classList.remove('hide')
    gameArea.style.height = 100 + 'vh'

    const levelGame = e.target.dataset.levelGame
    changeLevel(levelGame)

    audio.play()
    audio.loop = true
    start.classList.add('hide')

    startLevel.classList.add('hide')

    gameArea.style.height = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEMENT) / HEIGHT_ELEMENT) * HEIGHT_ELEMENT
    gameArea.innerHTML = ''
    gameArea.classList.remove('hide')

    car.style.left = 250 + 'px'
    car.style.top = 'auto'
    car.style.bottom = 10 + 'px'


    for (let i = 0; i < getQuantityElements(HEIGHT_ELEMENT); i++) {
        const line = document.createElement('div')
        line.classList.add('line')
        line.style.top = (i * HEIGHT_ELEMENT) + 'px'
        line.style.height = (HEIGHT_ELEMENT / 2) + 'px'
        line.y = i * HEIGHT_ELEMENT
        gameArea.appendChild(line)
    }

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEMENT * setting.traffic); i++) {
        const enemy = document.createElement('div')
        enemy.classList.add('enemy')
        enemy.y = -HEIGHT_ELEMENT * setting.traffic * (i + 1)
        enemy.style.top = enemy.y + 'px'
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - HEIGHT_ELEMENT)) + 'px'
        enemy.style.background = `
        transparent
        url("./img/enemy${getRandomEnemy(MAX_ENEMY)}.png")
        center / contain no-repeat`
        gameArea.appendChild(enemy)
    }

    setting.start = true
    gameArea.appendChild(car)
    setting.x = car.offsetLeft
    setting.y = car.offsetTop
    requestAnimationFrame(playGame)
    // }
}

function playGame() {
    if (setting.start) {
        moveRoad()
        moveEnemy()

        setting.score += setting.speed
        score.innerHTML = 'SCORE<br>' + setting.score

        setting.speed = startSpeed + Math.floor(setting.score / 5000)

        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed
        }

        if (keys.ArrowRight && setting.x < gameArea.offsetWidth - car.offsetWidth) {
            setting.x += setting.speed
        }

        if (keys.ArrowDown && setting.y < gameArea.offsetHeight - car.offsetHeight) {
            setting.y += setting.speed
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed
        }

        car.style.left = setting.x + 'px'
        car.style.top = setting.y + 'px'
        //для плавного перезапуска анимации игры пока она идёт
        requestAnimationFrame(playGame)
    }
}

function startRun(e) {
    if (keys.hasOwnProperty(e.key)) {
        e.preventDefault()
        keys[e.key] = true
    }
}

function stopRun(e) {
    if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line')

    lines.forEach(line => {
        line.y += setting.speed

        line.style.top = line.y + 'px'

        if (line.y > document.documentElement.clientHeight) {
            line.y = -HEIGHT_ELEMENT
        }
    })
}

function moveEnemy() {
    const enemy = document.querySelectorAll('.enemy')

    enemy.forEach(item => {
        const carRect = car.getBoundingClientRect()
        const enemyRect = item.getBoundingClientRect()

        item.y += setting.speed / 2
        item.style.top = item.y + 'px'

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false

            if (setting.score > localStorage.getItem('record')) {
                record = setting.score
                alert('Поздравляем, Вы побили рекорд!')
                localStorage.setItem('record', setting.score)
            }

            recordSpan.textContent = localStorage.getItem('record')

            audio.pause()
            score.remove()
            gameArea.append(score)
            score.classList.add('end-game')
        }

        if (item.y >= document.documentElement.clientHeight) {
            item.y = -HEIGHT_ELEMENT * setting.traffic
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - HEIGHT_ELEMENT)) + 'px'
        }
    })
}