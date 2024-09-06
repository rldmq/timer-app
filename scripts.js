// IMPORTS
import uniqueId from "./utils.js"

// CLEAR INTERVAL OBJECT
const intervalObj = {}

// VARIABLES
const timerObj = JSON.parse(localStorage.getItem("timers")) || {}

const appFullBody = document.getElementById("app-html")
const newTimerBtn = document.getElementById("new-btn")
const loadProfileForm = document.getElementById("load-form")
const saveProfileForm = document.getElementById("save-form")

const timersContainer = document.querySelector(".timers")

const timerSettings = document.querySelector(".options--timer-settings")

let activeEl
let activeElVal

// EVENT LISTENERS

// For loading profiles
loadProfileForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    console.log("hello")
})
// For saving profiles
saveProfileForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    console.log("save")
})
    // need one for replacing /cancelling profiles?

// For converting input overflow into hours/minutes
timerSettings.addEventListener("change", (e)=>{

    const newHr = document.getElementById("hour")
    const newMin = document.getElementById("minute")

    const settingId = e.target.getAttribute("id")
    const settingEl = document.getElementById(`${settingId}`)

    if(settingId === "minute" && settingEl.value > 59){
        newHr.value = newHr.value*1 + Math.floor(settingEl.value/60)
        settingEl.value = settingEl.value%60

        if(newHr.value < 10){
            newHr.value = "0" + newHr.value
        }
    }

    if(settingId === "second" && settingEl.value > 59){
        newHr.value = newHr.value*1 + Math.floor(Math.floor(newMin.value*1)/60 + Math.floor(settingEl.value/3600))

        newMin.value = newMin.value*1 + Math.floor(settingEl.value/60)

        if(newMin.value%60 === 0){
            newMin.value = 0
        }else if(newMin.value%60 > 0){
            newMin.value = newMin.value%60
        }

        settingEl.value = settingEl.value%60
    }
})

// For creating a new timer
newTimerBtn.addEventListener("click", ()=>{

    const id = uniqueId()

    // If the input is blank, use 0.  If the input is less than 10, append "0".  Else, use the input value
    const defaultHr = document.getElementById("hour").value === "" ? "00" 
    : document.getElementById("hour").value < 10 ? "0" + document.getElementById("hour").value 
    : document.getElementById("hour").value

    const defaultMin = document.getElementById("minute").value === "" ? "00" 
    : document.getElementById("minute").value < 10 ? "0" + document.getElementById("minute").value 
    : document.getElementById("minute").value

    const defaultSec = document.getElementById("second").value === "" ? "00" 
    : document.getElementById("second").value < 10 ? "0" + document.getElementById("second").value 
    : document.getElementById("second").value

    const timerName = document.getElementById("timer-name").value === "" ? id : document.getElementById("timer-name").value

    if((defaultHr + defaultMin + defaultSec) > 0){

        timersContainer.innerHTML += 
        `<div 
        data-timerNumber="${id}"
        data-default-hr="${defaultHr}"
        data-default-min="${defaultMin}"
        data-default-sec="${defaultSec}"
        data-name="${timerName}"
        class="timers--timer-el-${id} timers--timer"
        >
            <span class="timers--timer-name timer-name-${id}" data-nameid=${id}>${timerName}</span>
            <div class="timers--timer-el--countdown-container">
                <span id="${id}-hr">${defaultHr}</span>
                <span>:</span>
                <span id="${id}-min">${defaultMin}</span>
                <span>:</span>
                <span id="${id}-sec">${defaultSec}</span>
                <span class="text-small">.</span>
                <span id="${id}-ms" class="text-small">000</span>
            </div>
            <div class="timers--timer-el--timer-options">
                <button data-start="${id}" data-looping="false" class="start-btn ${id}">
                    <span class="material-symbols-outlined" style="font-size: 2rem" data-start="${id}" >
                    arrow_right</span>
                </button>
                <button data-pause="${id}" class="pause-btn ${id}" disabled>
                    <span class="material-symbols-outlined" style="font-size: 1.5rem" data-pause="${id}">
                    pause</span>
                </button>
                <button data-reset="${id}" class="reset-btn ${id}" disabled>Reset</button>
                <button data-loop="${id}" class="loop-btn ${id}">
                    <span class="material-symbols-outlined" data-loop="${id}">
                    restart_alt</span>
                </button>
                <button data-delete="${id}" class="delete-btn">
                    <span class="material-symbols-outlined" data-delete="${id}">
                    delete_forever</span>
                </button>
            </div>
        </div>`
        // not sure if data-id is needed by all buttons
        document.getElementById("hour").value = ""
        document.getElementById("minute").value = ""
        document.getElementById("second").value = ""
        document.getElementById("timer-name").value = ""
    }

    // Create the nested object
    timerObj[id] = {}

    // Assign properties to nested object
    timerObj[id].defaultHr = defaultHr
    timerObj[id].defaultMin = defaultMin
    timerObj[id].defaultSec = defaultSec
    timerObj[id].timerName = timerName
    timerObj[id].timerId = id

})

// For loading timers in storage
// loadTimers.addEventListener("click", ()=>{
    
//     if(localStorage.getItem("timers")){
        
//         const storedTimers = Object.values(JSON.parse(localStorage.getItem("timers")))
        
//         timersContainer.innerHTML = storedTimers.map((timer) => {
//             const id = timer.timerId
//             const name = timer.timerName
//             const hr = timer.defaultHr
//             const min = timer.defaultMin
//             const sec = timer.defaultSec
            
//             return ( `<div 
//                 data-timerNumber="${id}"
//                 data-default-hr="${hr}"
//                 data-default-min="${min}"
//                 data-default-sec="${sec}"
//                 data-name="${name}"
//                 class="timers--timer-el-${id} timers--timer loading"
//                 >
//                 <span class="timers--timer-name timer-name-${id}" data-nameid=${id}>${name}</span>
//                 <div class="timers--timer-el--countdown-container">
//                 <span id="${id}-hr">${hr}</span>
//                 <span>:</span>
//                 <span id="${id}-min">${min}</span>
//                 <span>:</span>
//                 <span id="${id}-sec">${sec}</span>
//                 <span class="text-small">.</span>
//                 <span id="${id}-ms" class="text-small">000</span>
//                 </div>
//                 <div class="timers--timer-el--timer-options">
//                 <button data-start="${id}" data-looping="false" class="start-btn ${id}">
//                 <span class="material-symbols-outlined" style="font-size: 2rem" data-start="${id}" >
//                 arrow_right</span>
//                 </button>
//                 <button data-pause="${id}" class="pause-btn ${id}" disabled>
//                 <span class="material-symbols-outlined" style="font-size: 1.5rem" data-pause="${id}">
//                 pause</span>
//                 </button>
//                 <button data-reset="${id}" class="reset-btn ${id}" disabled>Reset</button>
//                 <button data-loop="${id}" class="loop-btn ${id}">
//                 <span class="material-symbols-outlined" data-loop="${id}">
//                 restart_alt</span>
//                 </button>
//                 <button data-delete="${id}" class="delete-btn">
//                 <span class="material-symbols-outlined" data-delete="${id}">
//                 delete_forever</span>
//                 </button>
//                 </div>
//                 </div>`)
//         }).join("")
    
//         // Remove the "loading" class
//         setTimeout(()=>{
//             const loadingEls = document.querySelectorAll(".loading")
                        
//             for(let element of loadingEls){
//                 element.classList.toggle("loading")
//             }
            
//         }, 1500)
//     }else{
//         handleEmptyStorageNotification()
//     }
// })

// saveCurrent.addEventListener("click",()=>{
//     localStorage.setItem("timers", JSON.stringify(timerObj))
// })

// For handling individual timer options
timersContainer.addEventListener("click", (e) =>{
    if(e.target.getAttribute("data-start")){
        handleStartButton(e.target.getAttribute("data-start"), e.target.getAttribute("data-looping"))
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
    if(e.target.getAttribute("data-nameid")){
        handleRename(e.target.getAttribute("data-nameid"))
    }
})

// For renaming timers (keyup)
timersContainer.addEventListener("keyup",(e)=>{
    if(e.key === "Enter" && e.target.getAttribute("data-nameid")){
        handleRenameSubmit(e.target.getAttribute("data-nameid"))
    }
})

// For renaming timers (click)
appFullBody.addEventListener("click", (e)=>{
    if(activeEl && !e.target.getAttribute("data-nameid")){
        handleRenameSubmit(activeEl.getAttribute("data-rename"))
    }
})


// FUNCTIONS
function handleStartButton(id, loop){

    const startBtn = document.querySelector(`.start-btn.${id}`)

    const pauseBtn = document.querySelector(`.pause-btn.${id}`)

    const resetBtn = document.querySelector(`.reset-btn.${id}`)

    const timerContainer = document.querySelector(`.timers--timer-el-${id}`)

    const hrEl = document.getElementById(`${id}-hr`)
    const minEl = document.getElementById(`${id}-min`)
    const secEl = document.getElementById(`${id}-sec`)
    const msEl = document.getElementById(`${id}-ms`)

    let totalMilisec = (hrEl.innerHTML*3600000) + (minEl.innerHTML*60000) + secEl.innerHTML*1000 + msEl.innerHTML*1

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

        totalMilisec -= 10

        const hrDisplay = Math.floor(totalMilisec/3600000)

        const minDisplay = Math.floor((totalMilisec - Math.floor(hrDisplay*3600000))/60000)

        const secDisplay = Math.floor((totalMilisec-Math.floor(hrDisplay*3600000)-Math.floor(minDisplay*60000))/1000)

        const msDisplay = totalMilisec - Math.floor(hrDisplay*3600000) - Math.floor(minDisplay*60000) - Math.floor(secDisplay*1000)

        hrEl.innerHTML = hrDisplay < 10 ? "0" + hrDisplay 
        : hrDisplay

        minEl.innerHTML = minDisplay < 10 ? "0" + minDisplay 
        : minDisplay

        secEl.innerHTML = secDisplay < 10 ? "0" + secDisplay 
        : secDisplay

        msEl.innerHTML = msDisplay == 0 ? "00" + msDisplay : msDisplay < 100 ? "0" + msDisplay
        : msDisplay

        if(totalMilisec === 0){
            if(loop === "true"){
                totalMilisec = originalTime
            }else{
                clearInterval(intervalObj[id])

                const hrDisplayEnd = Math.floor(originalTime/3600000)

                const minDisplayEnd = Math.floor((originalTime - Math.floor(hrDisplayEnd*3600000))/60000)

                const secDisplayEnd = Math.floor((originalTime-Math.floor(hrDisplayEnd*3600000)-Math.floor(minDisplay*60000))/1000)

                const msDisplayEnd = originalTime - Math.floor(hrDisplayEnd*3600000) - Math.floor(minDisplayEnd*60000) - Math.floor(secDisplayEnd*1000)

                hrEl.innerHTML = hrDisplayEnd < 10 ? "0" + hrDisplayEnd : hrDisplayEnd
                minEl.innerHTML = minDisplayEnd < 10 ? "0" + minDisplayEnd : minDisplayEnd
                secEl.innerHTML = secDisplayEnd < 10 ? "0" + secDisplayEnd : secDisplayEnd
                msEl.innerHTML = msDisplayEnd == 0 ? "00" + msDisplayEnd : msDisplayEnd < 100 ? "0" + msDisplayEnd : msDisplayEnd

                pauseBtn.toggleAttribute("disabled")
                resetBtn.toggleAttribute("disabled")
                startBtn.toggleAttribute("disabled")
                timerContainer.classList.toggle("active")
            }
        }
    },10)

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

    const timerContainer = document.querySelector(`.timers--timer-el-${id}`)

    const pauseBtn = document.querySelector(`.pause-btn.${id}`)

    const startBtn = document.querySelector(`.start-btn.${id}`)

    pauseBtn.classList.toggle("paused")
    pauseBtn.toggleAttribute("disabled")

    startBtn.toggleAttribute("disabled")
    timerContainer.classList.toggle("active")

}

function handleResetButton(id){

    const timerContainer = document.querySelector(`.timers--timer-el-${id}`)

    const pauseBtn = document.querySelector(`.pause-btn.${id}`)

    const resetBtn = document.querySelector(`.reset-btn.${id}`)

    const startBtn = document.querySelector(`.start-btn.${id}`)

    const resetEl = document.querySelector(`.timers--timer-el-${id}`)

    clearInterval(intervalObj[id])

    for(const child of resetEl.children){
        if(child.getAttribute("class") === "timers--timer-el--countdown-container"){
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

    const loopBtn = document.querySelector(`.loop-btn.${id}`)
    
    const startBtn = document.querySelector(`.start-btn.${id}`)

    const pauseBtn = document.querySelector(`.pause-btn.${id}`)

    const resetBtn = document.querySelector(`.reset-btn.${id}`)

    const isLooping = loopBtn.classList.contains("loop")
    
    const timerContainer = document.querySelector(`.timers--timer-el-${id}`)

    const hrEl = document.getElementById(`${id}-hr`)
    const minEl = document.getElementById(`${id}-min`)
    const secEl = document.getElementById(`${id}-sec`)
    const msEl = document.getElementById(`${id}-ms`)

    let msLeft = (hrEl.innerHTML*3600000) + (minEl.innerHTML*60000) + secEl.innerHTML*1000 + msEl.innerHTML*1

    const msOriginal = (timerContainer.getAttribute("data-default-hr")*3600000) + (timerContainer.getAttribute("data-default-min")*60000) + timerContainer.getAttribute("data-default-sec")*1000

    // If the timer is active on press
    if(timerContainer.classList.contains("active") && !isLooping){

        startBtn.setAttribute("data-looping","true")

        clearInterval(intervalObj[id])

        intervalObj[id] = setInterval(()=>{
            msLeft -= 10

            const hrDisplay = Math.floor(msLeft/3600000)

            const minDisplay = Math.floor((msLeft - Math.floor(hrDisplay*3600000))/60000)

            const secDisplay = Math.floor((msLeft-Math.floor(hrDisplay*3600000)-Math.floor(minDisplay*60000))/1000)

            const msDisplay = msLeft - Math.floor(hrDisplay*3600000) - Math.floor(minDisplay*60000) - Math.floor(secDisplay*1000)

            hrEl.innerHTML = hrDisplay < 10 ? "0" + hrDisplay : hrDisplay

            minEl.innerHTML = minDisplay < 10 ? "0" + minDisplay : minDisplay

            secEl.innerHTML = secDisplay < 10 ? "0" + secDisplay : secDisplay

            msEl.innerHTML = msDisplay == 0 ? "00" + msDisplay : msDisplay < 100 ? "0" + msDisplay : msDisplay


            if(msLeft === 0){
                msLeft = msOriginal
            }
        }, 10)
        loopBtn.classList.toggle("loop")

    }else if(timerContainer.classList.contains("active") && isLooping){

            startBtn.setAttribute("data-looping","false")

            clearInterval(intervalObj[id])

            intervalObj[id] = setInterval(()=>{
                msLeft -= 10

                const hrDisplay = Math.floor(msLeft/3600000)

                const minDisplay = Math.floor((msLeft - Math.floor(hrDisplay*3600000))/60000)

                const secDisplay = Math.floor((msLeft-Math.floor(hrDisplay*3600000)-Math.floor(minDisplay*60000))/1000)

                const msDisplay = msLeft - Math.floor(hrDisplay*3600000) - Math.floor(minDisplay*60000) - Math.floor(secDisplay*1000)

                hrEl.innerHTML = hrDisplay < 10 ? "0" + hrDisplay : hrDisplay

                minEl.innerHTML = minDisplay < 10 ? "0" + minDisplay : minDisplay

                secEl.innerHTML = secDisplay < 10 ? "0" + secDisplay : secDisplay

                msEl.innerHTML = msDisplay == 0 ? "00" + msDisplay : msDisplay < 100 ? "0" + msDisplay : msDisplay


                if(msLeft === 0){
                    clearInterval(intervalObj[id])

                    const hrDisplay = Math.floor(msOriginal/3600000)

                    const minDisplay = Math.floor((msOriginal - Math.floor(hrDisplay*3600000))/60000)

                    const secDisplay = Math.floor((msOriginal-Math.floor(hrDisplay*3600000)-Math.floor(minDisplay*60000))/1000)

                    const msDisplay = msOriginal - Math.floor(hrDisplay*3600000) - Math.floor(minDisplay*60000) - Math.floor(secDisplay*1000)

                    hrEl.innerHTML = hrDisplay < 10 ? "0" + hrDisplay : hrDisplay

                    minEl.innerHTML = minDisplay < 10 ? "0" + minDisplay : minDisplay

                    secEl.innerHTML = secDisplay < 10 ? "0" + secDisplay : secDisplay

                    msEl.innerHTML = msDisplay == 0 ? "00" + msDisplay: msDisplay < 100 ? "0" + msDisplay : msDisplay


                    startBtn.toggleAttribute("disabled")
                    pauseBtn.toggleAttribute("disabled")
                    resetBtn.toggleAttribute("disabled")
                }
            }, 10)
            if(loopBtn.classList.contains("loop")){
                loopBtn.classList.toggle("loop")
            }
    }
    // If the timer is not active on press
    else{
        startBtn.setAttribute("data-looping", !isLooping)
        loopBtn.classList.toggle("loop")
    }
}

function handleDeleteButton(id){

    const deleteEl = document.querySelector(`.timers--timer-el-${id}`)

    deleteEl.classList.toggle("deleting")

    setTimeout(()=>{
        deleteEl.remove()
        clearInterval(intervalObj[id])
        delete intervalObj[id]
    },650)
}

function handleRename(id){
    const timerEl = document.querySelector(`.timers--timer-el-${id}`)
    const refNode = document.querySelector(`.timer-name-${id}`)
    const renameInput = document.createElement("input")

    if(refNode){
        renameInput.setAttribute("type","text")
        renameInput.setAttribute("value",`${timerEl.getAttribute("data-name")}`)
        renameInput.setAttribute("data-rename", `${id}`)
        renameInput.setAttribute("data-nameid", `${id}`)
        renameInput.setAttribute("class",`rename-input-${id}`)
        renameInput.setAttribute("class","timers--timer-name")
    
        timerEl.replaceChild(renameInput,refNode)
    
        renameInput.focus()
        renameInput.select()
    
        activeEl = renameInput
        activeElVal = activeEl.value
    }
}

function handleRenameSubmit(id){

    const timerEl = document.querySelector(`.timers--timer-el-${id}`)

    const refNode = activeEl
    const newName = refNode.value.trim() ? refNode.value : activeElVal
    
    const updatedName = document.createElement("span")
    
    updatedName.setAttribute("class",`timers--timer-name timer-name-${id}`)
    updatedName.setAttribute("data-nameid",`${id}`)
    updatedName.textContent = newName

    timerEl.replaceChild(updatedName, refNode)
    timerEl.setAttribute("data-name", newName)
    activeEl = null

    // Update timer object
    timerObj[id].timerName = newName

}

// basically tests

// function handleEmptyStorageNotification(){
//     timersContainer.innerHTML = `<div class="noTimerNotification loading">There are no timers saved in storage.</div>`

//     setTimeout(()=>{
//         const notificationEl = document.querySelector(".noTimerNotification")

//         notificationEl.classList.toggle("loading")
//         notificationEl.classList.toggle("deleting")
//     }, 1500)

//     setTimeout(()=>{
//         timersContainer.innerHTML = ""
//     },2000)
// }

// document.getElementById("logObj").addEventListener("click", (e)=>{
//     console.log(timerObj)
// })

// document.getElementById("logId").addEventListener("click", (e)=>{
//     const localStorObj = JSON.parse(localStorage.getItem("timers"))
//     console.log(localStorObj)
// })

// document.getElementById("clearLoc").addEventListener("click",()=>{
//     localStorage.clear()

//     for(let timer in timerObj){
//         delete timerObj[timer]
//     }
// })


// Testing area
const testObj = {}

document.getElementById("save-profile-form").addEventListener("submit",(e)=>{
    e.preventDefault()
    const profileName = document.querySelector(".save-profile-input").value

    if(testObj[profileName]){
        // pop up
        document.getElementById("body").innerHTML += 
        `
        <div class="profileNotification">
            <p>This profile already exists.  Select an option:</p>
            <button id="test-replace" data-function="replace">Replace</button>
            <button id="test-add" data-function="add">Add</button>
            <button id="test-cancel" data-function="cancel">Cancel</button>
        </div>
        `
        // add to profile, replace profile, cancel
    }else if(profileName){
        testObj[`${profileName}`] = {
            "iamhim" : uniqueId(),
            "purplelean" : uniqueId(),
            "opps" : uniqueId(),
        }

        document.querySelector(".save-profile-input").value = ""
    }
})

document.getElementById("logtestobj").addEventListener("click",()=>{
    console.log(testObj)
})

document.getElementById("body").addEventListener("click",(e)=>{

    const modal = document.querySelector(".profileNotification")

    if(e.target.getAttribute("data-function")==="replace"){
        console.log("replacing")

        modal.remove()
    }
    if(e.target.getAttribute("data-function")==="add"){
        console.log("adding")
        modal.remove()
    }
    if(e.target.getAttribute("data-function")==="cancel"){
        console.log("cancelling")
        modal.remove()
    }
})