// CLEAR INTERVAL ARRAY
const intervalObj = {}

// VARIABLES
const addBtn = document.getElementById("add-btn")
const subtractBtn = document.getElementById("subtract-btn")
const timerCountInput = document.getElementById("number-input")

const newTimerBtn = document.getElementById("new-btn")

const timersContainer = document.querySelector(".timers")

// EVENT LISTENERS
// addBtn.addEventListener("click", ()=>{
//     timerCountInput.value = Number(timerCountInput.value) + 1
// })

// subtractBtn.addEventListener("click", ()=>{
//     if(Number(timerCountInput.value) != 1){
//         timerCountInput.value = Number(timerCountInput.value) - 1
//     }
// })

newTimerBtn.addEventListener("click", ()=>{

    // going to be an issue when something is deleted
    // use some sort of id instead
    const timerCount = timersContainer.children.length

    const defaultHr = document.getElementById("hour").value
    const defaultMin = document.getElementById("minute").value
    const defaultSec = document.getElementById("second").value

    timersContainer.innerHTML += 
    `<div 
        data-timerNumber="${timerCount}"
        data-default-hr="${defaultHr}"
        data-default-min="${defaultMin}"
        data-default-sec="${defaultSec}"
        class="timer-el-${timerCount} timer"
    >
        <div class="countdown-container">
            <span id="${timerCount}-hr">${defaultHr}</span>
            <span>:</span>
            <span id="${timerCount}-min">${defaultMin}</span>
            <span>:</span>
            <span id="${timerCount}-sec">${defaultSec}</span>
        </div>
        <div class="timer-options">
            <button data-start="${timerCount}">Start</button>
            <button data-pause="${timerCount}">Pause</button>
            <button data-reset="${timerCount}">Reset</button>
            <button data-loop="${timerCount}">Loop</button>
            <button data-delete="${timerCount}">Delete</button>
        </div>
    </div>`
    // not sure if data-timerNumber is needed by all buttons

    console.log(intervalObj)
})

timersContainer.addEventListener("click", (e) =>{
    if(e.target.getAttribute("data-start")){
        handleStartButton(e.target.getAttribute("data-start"))
    }
    if(e.target.getAttribute("data-pause")){
        handlePauseButton(e.target.getAttribute("data-pause"))
    }
    if(e.target.getAttribute("data-reset")){
        handleResetButton(e.target.getAttribute("data-reset"))
    }
    if(e.target.getAttribute("data-loop")){
        handleLoopButton(e.target.getAttribute("data-loop"))
    }
    if(e.target.getAttribute("data-delete")){
        handleDeleteButton(e.target.getAttribute("data-delete"))
    }
})

// FUNCTIONS
function handleStartButton(num){

    const hrEl = document.getElementById(`${num}-hr`)
    const minEl = document.getElementById(`${num}-min`)
    const secEl = document.getElementById(`${num}-sec`)

    let totalSeconds = (hrEl.innerHTML*3600) + (minEl.innerHTML*60) + secEl.innerHTML*1

    intervalObj[num] = startTimer = setInterval(()=>{

        totalSeconds -= 1

        const hrDisplay = Math.floor(totalSeconds/3600)

        const minDisplay = Math.floor((totalSeconds - Math.floor(hrDisplay*3600))/60)

        const secDisplay = totalSeconds-Math.floor(hrDisplay*3600)-Math.floor(minDisplay*60)

        hrEl.innerHTML = hrDisplay
        minEl.innerHTML = minDisplay
        secEl.innerHTML = secDisplay

        if(totalSeconds === 0){
            clearInterval(intervalObj[num])
        }

        console.log(intervalObj[num], intervalObj)

    }, 1000)

}

function handlePauseButton(num){

    clearInterval(intervalObj[num])

}

function handleResetButton(num){

    clearInterval(intervalObj[num])

    const resetEl = document.querySelector(`.timer-el-${num}`)

    for(const child of resetEl.children){
        if(child.getAttribute("class") === "countdown-container"){
            for(const c of child.children){
                if(c.getAttribute("id") === `${num}-hr`){
                    c.innerHTML = resetEl.getAttribute("data-default-hr")
                }
                if(c.getAttribute("id") === `${num}-min`){
                    c.innerHTML = resetEl.getAttribute("data-default-min")
                }
                if(c.getAttribute("id") === `${num}-sec`){
                    c.innerHTML = resetEl.getAttribute("data-default-sec")
                }
                
            }
        }
    }
}

function handleLoopButton(num){
    console.log(`loop ${num}`)
    // would be a true false switch
}

function handleDeleteButton(num){
    console.log(`delete ${num}`)
    // delete from child of parent
}