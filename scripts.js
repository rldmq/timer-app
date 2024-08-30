// IMPORTS
import uniqueId from "./utils.js"

// CLEAR INTERVAL OBJECT
const intervalObj = {}

// LOOP OBJECT
const loopObj = {}

// VARIABLES
const addBtn = document.getElementById("add-btn")
const subtractBtn = document.getElementById("subtract-btn")
const timerCountInput = document.getElementById("number-input")

const newTimerBtn = document.getElementById("new-btn")

const timersContainer = document.querySelector(".timers")

// EVENT LISTENERS
newTimerBtn.addEventListener("click", ()=>{

    const id = uniqueId()

    const defaultHr = document.getElementById("hour").value
    const defaultMin = document.getElementById("minute").value
    const defaultSec = document.getElementById("second").value

    if((defaultHr + defaultMin + defaultSec) > 0){

        timersContainer.innerHTML += 
        `<div 
        data-timerNumber="${id}"
        data-default-hr="${defaultHr}"
        data-default-min="${defaultMin}"
        data-default-sec="${defaultSec}"
        class="timer-el-${id} timer"
        >
        <div class="countdown-container">
        <span id="${id}-hr">${defaultHr}</span>
        <span>:</span>
        <span id="${id}-min">${defaultMin}</span>
        <span>:</span>
        <span id="${id}-sec">${defaultSec}</span>
        <span>.</span>
        <span id="${id}-ms" class="milisecond">000</span>
        </div>
        <div class="timer-options">
        <button data-start="${id}" data-loop="false" class="start-btn ${id}">Start</button>
        <button data-pause="${id}" class="pause-btn ${id}" disabled>Pause</button>
        <button data-reset="${id}" class="reset-btn ${id}" disabled>Reset</button>
        <button data-loop="${id}" class="loop-btn ${id}">Loop</button>
        <button data-delete="${id}" class="delete-btn">Delete</button>
        </div>
        </div>`
        // not sure if data-id is needed by all buttons
    }
})

timersContainer.addEventListener("click", (e) =>{
    if(e.target.getAttribute("data-start")){
        handleStartButton(e.target.getAttribute("data-start"), e.target.getAttribute("data-loop"))
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
function handleStartButton(id, loop){

    const startBtn = document.querySelector(`.start-btn.${id}`)

    const pauseBtn = document.querySelectorAll(`.pause-btn.${id}`)[0]

    const resetBtn = document.querySelectorAll(`.reset-btn.${id}`)[0]

    const timerContainer = document.querySelector(`.timer-el-${id}`)

    const hrEl = document.getElementById(`${id}-hr`)
    const minEl = document.getElementById(`${id}-min`)
    const secEl = document.getElementById(`${id}-sec`)
    const msEl = document.getElementById(`${id}-ms`)

    let totalMilisec = (hrEl.innerHTML*3600000) + (minEl.innerHTML*60000) + secEl.innerHTML*1000

    const originalTime = (timerContainer.getAttribute("data-default-hr")*3600000) + (timerContainer.getAttribute("data-default-min")*60000) + timerContainer.getAttribute("data-default-sec")*1000

    if(pauseBtn.hasAttribute("disabled") && !pauseBtn.classList.contains("paused")){
        pauseBtn.toggleAttribute("disabled")
        startBtn.toggleAttribute("disabled")

        // to help with looping
        timerContainer.classList.toggle("active")
    }
    if(resetBtn.hasAttribute("disabled")){
        resetBtn.toggleAttribute("disabled")
    }
    
    intervalObj[id] = setInterval(()=>{

        totalMilisec -= 100

        const hrDisplay = Math.floor(totalMilisec/3600000)

        const minDisplay = Math.floor((totalMilisec - Math.floor(hrDisplay*3600000))/60000)

        const secDisplay = Math.floor((totalMilisec-Math.floor(hrDisplay*3600000)-Math.floor(minDisplay*60000))/1000)

        const msDisplay = totalMilisec - Math.floor(hrDisplay*3600000) - Math.floor(minDisplay*60000) - Math.floor(secDisplay*1000)

        hrEl.innerHTML = hrDisplay
        minEl.innerHTML = minDisplay
        secEl.innerHTML = secDisplay
        msEl.innerHTML = msDisplay

        if(totalMilisec === 0){
            if(loop === "true"){
                totalMilisec = originalTime
            }else{
                clearInterval(intervalObj[id])

                const hrDisplayEnd = Math.floor(originalTime/3600000)

                const minDisplayEnd = Math.floor((originalTime - Math.floor(hrDisplayEnd*3600000))/60000)

                const secDisplayEnd = Math.floor((originalTime-Math.floor(hrDisplayEnd*3600000)-Math.floor(minDisplay*60000))/1000)

                const msDisplayEnd = originalTime - Math.floor(hrDisplayEnd*3600000) - Math.floor(minDisplayEnd*60000) - Math.floor(secDisplayEnd*1000)

                hrEl.innerHTML = hrDisplayEnd
                minEl.innerHTML = minDisplayEnd
                secEl.innerHTML = secDisplayEnd
                msEl.innerHTML = msDisplayEnd

                pauseBtn.toggleAttribute("disabled")
                resetBtn.toggleAttribute("disabled")
            }
        }
    },100)

    // Handle styling of pause button when unpausing
    if(pauseBtn.classList.contains("paused")){
        pauseBtn.classList.toggle("paused")
        pauseBtn.toggleAttribute("disabled")
        startBtn.toggleAttribute("disabled")

        // to help with looping
        timerContainer.classList.toggle("active")
    }

}

function handlePauseButton(id){

    clearInterval(intervalObj[id])

    const timerContainer = document.querySelector(`.timer-el-${id}`)

    const pauseBtn = document.querySelectorAll(`.pause-btn.${id}`)[0]

    const startBtn = document.querySelector(`.start-btn.${id}`)

    pauseBtn.classList.toggle("paused")
    pauseBtn.toggleAttribute("disabled")

    startBtn.toggleAttribute("disabled")
    timerContainer.classList.toggle("active")

}

function handleResetButton(id){

    const timerContainer = document.querySelector(`.timer-el-${id}`)

    const pauseBtn = document.querySelectorAll(`.pause-btn.${id}`)[0]

    const resetBtn = document.querySelectorAll(`.reset-btn.${id}`)[0]

    const startBtn = document.querySelector(`.start-btn.${id}`)

    const resetEl = document.querySelector(`.timer-el-${id}`)

    clearInterval(intervalObj[id])

    for(const child of resetEl.children){
        if(child.getAttribute("class") === "countdown-container"){
            for(const c of child.children){
                if(c.getAttribute("id") === `${id}-hr`){
                    c.innerHTML = resetEl.getAttribute("data-default-hr")
                }
                if(c.getAttribute("id") === `${id}-min`){
                    c.innerHTML = resetEl.getAttribute("data-default-min")
                }
                if(c.getAttribute("id") === `${id}-sec`){
                    c.innerHTML = resetEl.getAttribute("data-default-sec")
                }
                if(c.getAttribute("id") === `${id}-ms`){
                    c.innerHTML = "000"
                }
                
            }
        }
    }

    // If the timer is paused, remove the styling upon reset
    if(pauseBtn.classList.contains("paused")){
        pauseBtn.classList.toggle("paused")
    }

    // If the timer is not paused, disable the pause button upon reset
    if(!pauseBtn.hasAttribute("disabled")){
        pauseBtn.toggleAttribute("disabled")
    }

    // Disable the reset button upon reset
    resetBtn.toggleAttribute("disabled")

    // Re-enable the start button
    if(startBtn.hasAttribute("disabled")){
        startBtn.toggleAttribute("disabled")
        timerContainer.classList.toggle("active")
    }

}

function handleLoopButton(id){
    
    // THIS PART WORKS - LOOPING BEFORE STARTING

    const loopBtn = document.querySelectorAll(`.loop-btn.${id}`)[0]
    
    const startBtn = document.querySelectorAll(`.start-btn.${id}`)[0]

    const isLooping = loopBtn.classList.contains("loop")

    startBtn.setAttribute("data-loop", !isLooping)

    loopBtn.classList.toggle("loop")

    //
    
    // If already running
    const timerContainer = document.querySelector(`.timer-el-${id}`)

    if(timerContainer.classList.contains("active" && !isLooping)){
        clearInterval(intervalObj[id])
    }
    // if(intervalObj[id]){

        // clearInterval(intervalObj[id])

        // const timerEl = document.querySelector(`.timer-el-${id}`)

        // const hrEl = document.getElementById(`${id}-hr`)
        // const minEl = document.getElementById(`${id}-min`)
        // const secEl = document.getElementById(`${id}-sec`)

        // let originalTime = (timerEl.getAttribute("data-default-hr")*3600) + (timerEl.getAttribute("data-default-min")*60) + timerEl.getAttribute("data-default-sec")*1

        // let currentTime = (hrEl.innerHTML*3600000) + (minEl.innerHTML*60000) + secEl.innerHTML*1000

        // intervalObj[id] = setInterval(()=>{

        //     currentTime -= 10
    
        //     const hrDisplay = Math.floor(currentTime/3600000)
    
        //     const minDisplay = Math.floor((currentTime - Math.floor(hrDisplay*3600000))/60000)
    
        //     const secDisplay = Math.floor((currentTime-Math.floor(hrDisplay*3600000)-Math.floor(minDisplay*60000))/1000)
    
        //     hrEl.innerHTML = hrDisplay
        //     minEl.innerHTML = minDisplay
        //     secEl.innerHTML = secDisplay
    
        //     if(currentTime === -1){
        //         currentTime = originalTime
        //         hrEl.innerHTML = timerEl.getAttribute("data-default-hr")
        //         minEl.innerText = timerEl.getAttribute("data-default-min")
        //         secEl.innerText = timerEl.getAttribute("data-default-sec")
        //     }
        //     console.log("tick")
        // }, 10)

        

    // }

}

function handleDeleteButton(id){

    const deleteEl = document.querySelector(`.timer-el-${id}`)

    deleteEl.remove()
    clearInterval(intervalObj[id])
    delete intervalObj[id]

}
