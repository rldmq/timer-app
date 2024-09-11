// FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase, ref, set, get, remove} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

// IMPORTS
import uniqueId from "./utils.js"

// CLEAR INTERVAL OBJECT
const intervalObj = {}

// VARIABLES
const firebaseConfig = {
    databaseURL: "https://timer-app-f13e4-default-rtdb.firebaseio.com/",
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

const timerObj = {}

let modalUp = false

const appHtml = document.getElementById("app-html")
const newTimerBtn = document.getElementById("new-btn")
const loadBtn = document.getElementById("load-btn")
const saveBtn = document.getElementById("save-btn")
const deleteBtn = document.getElementById("delete-btn")
const scriptTag = document.getElementsByTagName("script")[0]

const timersContainer = document.querySelector(".timers")

const timerSettings = document.querySelector(".options--timer-settings")

let activeEl
let activeElVal

// EVENT LISTENERS
// For changing the save and load profile buttons
    window.addEventListener("resize", ()=>{
        if(window.innerWidth >= 1100 && loadBtn.classList.contains("material-symbols-outlined")){
            loadBtn.classList.remove("material-symbols-outlined")
            saveBtn.classList.remove("material-symbols-outlined")
            deleteBtn.classList.remove("material-symbols-outlined")
    
            loadBtn.innerHTML = `<span class="material-symbols-outlined" style="min-width:32px;">person</span>`
            saveBtn.innerHTML = `<span class="material-symbols-outlined" style="min-width:32px;">save</span>`
            deleteBtn.innerHTML = `<span class="material-symbols-outlined" style="min-width:32px;">delete</span>`
    
            loadBtn.style.justifyContent = "end"
            saveBtn.style.justifyContent = "end"
            deleteBtn.style.justifyContent = "end"
    
            loadBtn.style.transition = "width 1s"
            saveBtn.style.transition = "width 1s"
            deleteBtn.style.transition = "width 1s"
    
            setTimeout(()=>{
    
                loadBtn.classList.add("no-google-icon")
                saveBtn.classList.add("no-google-icon")
                deleteBtn.classList.add("no-google-icon")
    
                loadBtn.innerHTML = `<span class="profile-btn-text">Load Profile</span>`
                saveBtn.innerHTML = `<span class="profile-btn-text">Save Profile</span>`
                deleteBtn.innerHTML = `<span class="profile-btn-text">Delete Profile</span>`
    
                loadBtn.innerHTML += `<span class="material-symbols-outlined" style="min-width:32px;">person</span>`
                saveBtn.innerHTML += `<span class="material-symbols-outlined" style="min-width:32px;">save</span>`
                deleteBtn.innerHTML += `<span class="material-symbols-outlined" style="min-width:32px;">delete</span>`
    
                loadBtn.style.justifyContent = "space-between"
                saveBtn.style.justifyContent = "space-between"
                deleteBtn.style.justifyContent = "space-between"
    
            }, 1000)
            
        }else if(window.innerWidth < 1100){
            if(loadBtn.classList.contains("no-google-icon")){
                loadBtn.classList.add("material-symbols-outlined")
                saveBtn.classList.add("material-symbols-outlined")
                deleteBtn.classList.add("material-symbols-outlined")
        
                loadBtn.classList.remove("no-google-icon")
                saveBtn.classList.remove("no-google-icon")
                deleteBtn.classList.remove("no-google-icon")
        
                loadBtn.innerText = "person"
                saveBtn.innerText = "save"
                deleteBtn.innerText = "delete"
                
            }

            loadBtn.style.transition = "width 1s, border-radius 2s"
            saveBtn.style.transition = "width 1s, border-radius 0.5s"
            deleteBtn.style.transition = "width 1s, border-radius 0.5s"
        }
    })

    window.addEventListener("load", ()=>{
        if(window.innerWidth >= 1100){
            
            loadBtn.classList.remove("material-symbols-outlined")
            saveBtn.classList.remove("material-symbols-outlined")
            deleteBtn.classList.remove("material-symbols-outlined")
        
            loadBtn.classList.add("no-google-icon")
            saveBtn.classList.add("no-google-icon")
            deleteBtn.classList.add("no-google-icon")
        
            loadBtn.innerHTML = `<span class="profile-btn-text">Load Profile</span>`
            saveBtn.innerHTML = `<span class="profile-btn-text">Save Profile</span>`
            deleteBtn.innerHTML = `<span class="profile-btn-text">Delete Profile</span>`
        
            loadBtn.innerHTML += `<span class="material-symbols-outlined" style="min-width:32px;">person</span>`
            saveBtn.innerHTML += `<span class="material-symbols-outlined" style="min-width:32px;">save</span>`
            deleteBtn.innerHTML += `<span class="material-symbols-outlined" style="min-width:32px;">delete</span>`
        
            loadBtn.style.justifyContent = "space-between"
            saveBtn.style.justifyContent = "space-between"
            deleteBtn.style.justifyContent = "space-between"

        }else{

            loadBtn.classList.add("material-symbols-outlined")
            saveBtn.classList.add("material-symbols-outlined")
            deleteBtn.classList.add("material-symbols-outlined")

            loadBtn.classList.remove("no-google-icon")
            saveBtn.classList.remove("no-google-icon")
            deleteBtn.classList.remove("no-google-icon")

            loadBtn.innerText = "person"
            saveBtn.innerText = "save"
            deleteBtn.innerText = "delete"

        }
    })

// For load profiles modal
loadBtn.addEventListener("click",(e)=>{

    const modalContainer = document.createElement("div")
    modalContainer.classList.add("modal-background")
    modalContainer.innerHTML = 
    `
    <div class="modal load-modal">
        <p class="modal-msg">Enter the profile name to load:</p>
        <input type="text" placeholder="Profile name" id="profile-load-input"/>
        <button id="profile-load-btn" class="modal-btn">Load</button>
        <button id="profile-cancel-btn" class="modal-btn">Cancel</button>
    </div>
    `

    scriptTag.before(modalContainer)
    modalUp = true

    document.getElementById("profile-load-input").focus()

})

// For saving profiles modal
saveBtn.addEventListener("click",(e)=>{
    // If there are timers on the screen
    if(Object.values(timerObj).length){

        const modalContainer = document.createElement("div")
        modalContainer.classList.add("modal-background")
        modalContainer.innerHTML = 
        `
        <div class="modal save-modal">
            <p class="modal-msg">Enter the profile name to save:</p>
            <input type="text" placeholder="Profle name" id="profile-save-input"/>
            <button id="profile-save-btn" class="modal-btn">Save</button>
            <button id="profile-replace-btn" class="modal-btn">Replace</button>
            <button id="profile-merge-btn" class="modal-btn">Merge</button>
            <button id="profile-cancel-btn" class="modal-btn">Cancel</button>
        </div>
        `

        scriptTag.before(modalContainer)
        modalUp = true

        document.getElementById("profile-save-input").focus()
    }else{
        handleBottomPopup("error", "There are no timers to save.")
    }

})

// For delete profiles modal
deleteBtn.addEventListener("click", (e)=>{
    const modalContainer = document.createElement("div")
    modalContainer.classList.add("modal-background")
    modalContainer.innerHTML = 
    `
    <div class="modal delete-modal">
        <p class="modal-msg">Enter the profile name to delete:</p>
        <input type="text" placeholder="Profile name" id="profile-delete-input"/>
        <button id="profile-delete-btn" class="modal-btn">Delete</button>
        <button id="profile-cancel-btn" class="modal-btn">Cancel</button>
    </div>
    `

    scriptTag.before(modalContainer)
    modalUp = true

    document.getElementById("profile-delete-input").focus()
})

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
    handleCreateTimer()
})

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

// For handling keyups (renaming && modals)
appHtml.addEventListener("keyup",(e)=>{
    if(e.key === "Enter"){
        if(e.target.getAttribute("data-nameid")){
            handleRenameSubmit(e.target.getAttribute("data-nameid"))
        }
        
        if(e.target.getAttribute("id") === "profile-load-input"){
            const name = document.getElementById("profile-load-input").value
            if(name){
                handleLoadProfile(name)
            }
        }

        if(e.target.getAttribute("id") === "profile-save-input"){
            const saveInput = document.getElementById("profile-save-input")

            const name = saveInput.value

            if(name.includes(" ")){
                modalErrorMessage(saveInput,"Please avoid using spaces in the profile name.")
            }else{
                handleSaveProfile(name)

            }
        }

        if(e.target.getAttribute("id") === "profile-delete-input"){
            const name = document.getElementById("profile-delete-input").value
            if(name){
                handleDeleteProfile(name)
            }
        }

        if(e.target.getAttribute("id") === "hour"){
            document.getElementById("minute").focus()
        }

        if(e.target.getAttribute("id") === "minute"){
            document.getElementById("second").focus()
        }

        if(e.target.getAttribute("id") === "second"){
            document.getElementById("timer-name").focus()
        }

        if(e.target.getAttribute("id") === "timer-name"){
            handleCreateTimer()
        }
    }

    if(e.key === "Escape" && modalUp){
        handleCloseModal()
    }
})

// For renaming timers (click) && for handling modals
appHtml.addEventListener("click", (e)=>{
    if(activeEl && !e.target.getAttribute("data-nameid")){
        handleRenameSubmit(activeEl.getAttribute("data-rename"))
    }
    if(e.target.getAttribute("id") === "profile-load-btn"){
        const name = document.getElementById("profile-load-input").value
        if(name.trim()){
            handleLoadProfile(name)
        }
    }
    if(e.target.getAttribute("id") === "profile-save-btn"){
        const saveInput = document.getElementById("profile-save-input")

        const name = saveInput.value

        if(name.includes(" ")){
            modalErrorMessage(saveInput,"Please avoid using spaces in the profile name.")
        }else{
            handleSaveProfile(name)

        }
    }

    if(e.target.getAttribute("id") === "profile-delete-btn"){
        const name = document.getElementById("profile-delete-input").value

        if(name){
            handleDeleteProfile(name)
        }
    } 

    if(e.target.getAttribute("id") === "profile-cancel-btn"){
        handleCloseModal()
    }
    if(modalUp && e.target.getAttribute("class") === "modal-background"){
        handleCloseModal()
    }
    if(e.target.getAttribute("id") === "profile-replace-btn"){
        const name = document.getElementById("profile-save-input").value
        handleReplaceButton(name)
    }
    if(e.target.getAttribute("id") === "profile-merge-btn"){
        const name = document.getElementById("profile-save-input").value
        handleMergeButton(name)
    }
})


// FUNCTIONS
function handleCreateTimer(){
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

        timersContainer.innerHTML += timerRender(id, timerName, defaultHr, defaultMin, defaultSec)

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
    timerObj[id].looping = false
}

function timerRender(id, timerName, defaultHr, defaultMin, defaultSec, looping, loading){
    console.log(looping)
    return (`<div 
        data-timerNumber="${id}"
        data-default-hr="${defaultHr}"
        data-default-min="${defaultMin}"
        data-default-sec="${defaultSec}"
        data-name="${timerName}"
        class="timers--timer-el-${id} timers--timer ${loading ? "loading" : ""}"
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
                <button data-start="${id}" data-looping="${looping}" class="start-btn ${id}">
                    <span class="material-symbols-outlined" style="font-size: 2rem;" data-start="${id}" data-looping="${looping}" id="start-span-${id}">
                    arrow_right</span>
                </button>
                <button data-pause="${id}" class="pause-btn ${id}" disabled>
                    <span class="material-symbols-outlined" style="font-size: 1.5rem;" data-pause="${id}">
                    pause</span>
                </button>
                <button data-reset="${id}" class="reset-btn ${id}" disabled>Reset</button>
                <button data-loop="${id}" class="loop-btn ${id} ${looping === "true" ? "loop" : ""}">
                    <span class="material-symbols-outlined" data-loop="${id}">
                    restart_alt</span>
                </button>
                <button data-delete="${id}" class="delete-btn">
                    <span class="material-symbols-outlined" data-delete="${id}">
                    delete_forever</span>
                </button>
            </div>
        </div>`)
        // not sure if data-id is needed by all buttons
}

function handleStartButton(id, loop){

    const startBtn = document.querySelector(`.start-btn.${id}`)

    const pauseBtn = document.querySelector(`.pause-btn.${id}`)

    const resetBtn = document.querySelector(`.reset-btn.${id}`)

    const timerContainer = document.querySelector(`.timers--timer-el-${id}`)

    const hrEl = document.getElementById(`${id}-hr`)
    const minEl = document.getElementById(`${id}-min`)
    const secEl = document.getElementById(`${id}-sec`)
    const msEl = document.getElementById(`${id}-ms`)

    let totalMillisec = calculateMs(hrEl, minEl, secEl, msEl)

    const originalTime = getOriginalTime(timerContainer)

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

        totalMillisec -= 10

        setTimerDisplay(totalMillisec, hrEl, minEl, secEl, msEl)

        if(totalMillisec === 0){
            console.log(loop)
            if(loop === "true"){
                totalMillisec = originalTime
            }else{
                clearInterval(intervalObj[id])

                setTimerDisplay(originalTime, hrEl, minEl, secEl, msEl)

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

function calculateMs(hourEl, minEl, secEl, msEl){
    return ((hourEl.innerHTML*3600000) + (minEl.innerHTML*60000) + (secEl.innerHTML*1000) + (msEl.innerHTML*1))
}

function getOriginalTime(container){
    return ((container.getAttribute("data-default-hr")*3600000) + (container.getAttribute("data-default-min")*60000) + (container.getAttribute("data-default-sec")*1000))
}

function setTimerDisplay(totalMs, hourEl, minuteEl, secondEl, msEl){
    const hrDisplay = Math.floor(totalMs/3600000)

    const minDisplay = Math.floor((totalMs - Math.floor(hrDisplay*3600000))/60000)

    const secDisplay = Math.floor((totalMs-Math.floor(hrDisplay*3600000)-Math.floor(minDisplay*60000))/1000)

    const msDisplay = totalMs - Math.floor(hrDisplay*3600000) - Math.floor(minDisplay*60000) - Math.floor(secDisplay*1000)

    hourEl.innerHTML = hrDisplay < 10 ? "0" + hrDisplay : hrDisplay

    minuteEl.innerHTML = minDisplay < 10 ? "0" + minDisplay : minDisplay

    secondEl.innerHTML = secDisplay < 10 ? "0" + secDisplay : secDisplay

    msEl.innerHTML = msDisplay == 0 ? "00" + msDisplay: msDisplay < 100 ? "0" + msDisplay : msDisplay
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

    const startBtnSpan = document.getElementById(`start-span-${id}`)

    const pauseBtn = document.querySelector(`.pause-btn.${id}`)

    const resetBtn = document.querySelector(`.reset-btn.${id}`)

    const isLooping = loopBtn.classList.contains("loop")
    
    const timerContainer = document.querySelector(`.timers--timer-el-${id}`)

    const hrEl = document.getElementById(`${id}-hr`)
    const minEl = document.getElementById(`${id}-min`)
    const secEl = document.getElementById(`${id}-sec`)
    const msEl = document.getElementById(`${id}-ms`)

    let msLeft = calculateMs(hrEl, minEl, secEl, msEl)

    const msOriginal = getOriginalTime(timerContainer)

    // If the timer is active on press
    if(timerContainer.classList.contains("active") && !isLooping){

        startBtn.setAttribute("data-looping","true")
        startBtnSpan.setAttribute("data-looping","true")

        clearInterval(intervalObj[id])

        intervalObj[id] = setInterval(()=>{
            msLeft -= 10

            setTimerDisplay(msLeft, hrEl, minEl, secEl, msEl)

            if(msLeft === 0){
                msLeft = msOriginal
            }
        }, 10)
        loopBtn.classList.toggle("loop")

    // If you want to stop the looping
    }else if(timerContainer.classList.contains("active") && isLooping){

            startBtn.setAttribute("data-looping","false")
            startBtnSpan.setAttribute("data-looping","false")

            clearInterval(intervalObj[id])

            intervalObj[id] = setInterval(()=>{
                msLeft -= 10

                setTimerDisplay(msLeft, hrEl, minEl, secEl, msEl)

                if(msLeft === 0){
                    clearInterval(intervalObj[id])

                    setTimerDisplay(msOriginal, hrEl, minEl, secEl, msEl)

                    startBtn.toggleAttribute("disabled")
                    pauseBtn.toggleAttribute("disabled")
                    resetBtn.toggleAttribute("disabled")
                }
            }, 10)
            if(loopBtn.classList.contains("loop")){
                loopBtn.classList.toggle("loop")
                timerContainer.classList.toggle("active")
            }
    }
    // If the timer is not active on press
    else{
        startBtn.setAttribute("data-looping", String(!isLooping))
        startBtnSpan.setAttribute("data-looping", String(!isLooping))
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
        delete timerObj[id]
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

function handleSaveProfile(name){

    const saveInput = document.getElementById("profile-save-input")

    const profileName = ref(database, `${name}`)

    get(profileName).then((snapshot) => {
        if(snapshot.exists()){
            saveInput.focus()
            modalErrorMessage(saveInput,"This profile already exists. Please use the replace or merge button to update the profile.")
        }else{
            for(let id in timerObj){
                const looping = document.querySelector(`.start-btn.${id}`).getAttribute("data-looping")
                timerObj[id].looping = looping
            }
            set(profileName, timerObj)
            handleCloseModal()
            handleBottomPopup("success","Success! The profile has been saved.")
        }
    }).catch((err) => console.log(err))
}

function handleLoadProfile(name){

    const modalBackground = document.querySelector(".modal-background")

    const loadInput = document.getElementById("profile-load-input")

    const profileName = ref(database, `${name}`)

    get(profileName).then((snapshot) => {
        if(snapshot.exists()){
            
            const fireBaseProfile = snapshot.val()

            if(Object.values(timerObj).length){
                for(let id in timerObj){
                    delete timerObj[id]
                }
            }

            for(let id in fireBaseProfile){
                timerObj[id] = fireBaseProfile[id]
            }

            modalBackground.remove()
            handleLoadProfileRender()
        }else{
            console.log(loadInput)
            modalErrorMessage(loadInput, "Profile name not found.")
        }
    })
}

function handleLoadProfileRender(){

    timersContainer.innerHTML = Object.values(timerObj).map(timer => {
        const id = timer.timerId
        const name= timer.timerName
        const hr = timer.defaultHr
        const min = timer.defaultMin
        const sec = timer.defaultSec
        const loop = timer.looping

        return ( timerRender(id, name, hr, min, sec, loop, true))
    }).join("")

    // Remove the "loading" class
    setTimeout(()=>{
        const loadingEls = document.querySelectorAll(".loading")
                    
        for(let element of loadingEls){
            element.classList.toggle("loading")
        }
        
    }, 1500)
}

function handleCloseModal(){
    document.querySelector(".modal-background").remove()
    modalUp = false
}

function modalErrorMessage(inputEl, message){

    document.querySelector(".modal").innerHTML += `
            <p class="not-found loading">${message}</p>
        `
    // Issue due to innerHTML += above ?
    // inputEl.classList.toggle("input-error")

    setTimeout(()=>{
        if(document.querySelector(".not-found")){
            document.querySelector(".not-found").remove()
        }
    }, 5000)

    setTimeout(()=>{
        if(document.querySelector(".not-found")){
            document.querySelector(".not-found").classList.toggle("deleting")
        }
    },4500)
}

function handleReplaceButton(name){

    const saveInput = document.getElementById("profile-save-input")

    const profileName = ref(database, `${name}`)

    get(profileName).then((snapshot) => {
        if(snapshot.exists()){
            set(profileName, timerObj)
            handleCloseModal()
            handleBottomPopup("success","Success! The profile has been updated.")
        }else{
            modalErrorMessage(saveInput, "Profile name not found")
        }
    })
}

function handleMergeButton(name){

    const saveInput = document.getElementById("profile-save-input")

    const profileName = ref(database, `${name}`)

    get(profileName).then((snapshot) => {
        if(snapshot.exists()){
            for(let id in timerObj){
                const path = ref(database, `${name}/${id}`)
                set(path, timerObj[id])
            }
            handleCloseModal()
            handleBottomPopup("success","Success! The profile has been updated.")
        }else{
            modalErrorMessage(saveInput, "Profile name not found.")
        }
    })
}

function handleDeleteProfile(name){
    const profileName = ref(database, `${name}`)

    const deleteInput = document.getElementById("delete-profile-input")

    get(profileName).then((snapshot) => {
        if(snapshot.exists()){
            remove(profileName)
            handleCloseModal()
            handleBottomPopup("success","Success! The profile has been deleted.")
        }else{
            modalErrorMessage(deleteInput, "Profile name not found.")
        }
    })
}

function handleBottomPopup(type, message){
    setTimeout(()=>{
        const popupEl = document.createElement("div")
        popupEl.classList.add(`${type}-popup`)
        popupEl.classList.add("popup")
        popupEl.setAttribute("id",`${type}-popup`)
        popupEl.innerText = `${message}`
        scriptTag.before(popupEl)
    }, 100)

    setTimeout(()=>{
        document.getElementById(`${type}-popup`).remove()
    }, 3000)
}
