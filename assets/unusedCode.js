// For loading timers in storage
loadTimers.addEventListener("click", ()=>{
    
    if(localStorage.getItem("timers")){
        
        const storedTimers = Object.values(JSON.parse(localStorage.getItem("timers")))
        
        timersContainer.innerHTML = storedTimers.map((timer) => {
            const id = timer.timerId
            const name = timer.timerName
            const hr = timer.defaultHr
            const min = timer.defaultMin
            const sec = timer.defaultSec
            
            return ( `<div 
                data-timerNumber="${id}"
                data-default-hr="${hr}"
                data-default-min="${min}"
                data-default-sec="${sec}"
                data-name="${name}"
                class="timers--timer-el-${id} timers--timer loading"
                >
                <span class="timers--timer-name timer-name-${id}" data-nameid=${id}>${name}</span>
                <div class="timers--timer-el--countdown-container">
                <span id="${id}-hr">${hr}</span>
                <span>:</span>
                <span id="${id}-min">${min}</span>
                <span>:</span>
                <span id="${id}-sec">${sec}</span>
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
                </div>`)
        }).join("")
    
        // Remove the "loading" class
        setTimeout(()=>{
            const loadingEls = document.querySelectorAll(".loading")
                        
            for(let element of loadingEls){
                element.classList.toggle("loading")
            }
            
        }, 1500)
    }else{
        handleEmptyStorageNotification()
    }
})

// saveCurrent.addEventListener("click",()=>{
//     localStorage.setItem("timers", JSON.stringify(timerObj))
// })

function handleSaveProfile(name){
    const profiles = JSON.parse(localStorage.getItem("timers")) || {}

    const saveInput = document.getElementById("profile-save-input")

    if(profiles[name]){
        modalErrorMessage(saveInput,"This profile already exists. Please use the replace or merge button to update the profile.")
        saveInput.value = name
    }else{

        // Create the property first to be able to store
        if(!profiles[name]){
            profiles[name] = {}
        }
        for(let timer in timerObj){
            profiles[name][timer] = timerObj[timer]
        }
        // profiles[name] = {
        //     name: name,
        //     timers: timerObj
        // }
        handleCloseModal()
        handleBottomPopup("success","Success! The profile has been saved.")
    }
    localStorage.setItem("timers", JSON.stringify(profiles))
}

function handleLoadProfile(name){

    const modalBackground = document.querySelector(".modal-background")

    const loadInput = document.getElementById("profile-load-input")

    const profiles = JSON.parse(localStorage.getItem("timers")) || {}

    if(profiles[name]){
        if(Object.values(timerObj).length > 0){
            for(let item in timerObj){
                delete timerObj[item]
            }
        }

        // Local storage
        // for(let id in profiles[name]){
        //     timerObj[id] = {...profiles[name][id]}
        // }

        modalBackground.remove()
        handleLoadProfileRender()

    }else if(loadInput.value){
        modalErrorMessage(loadInput, "Profile name not found.")
    }
}

function handleReplaceButton(name){
    const profiles = JSON.parse(localStorage.getItem("timers")) || {}

    const saveInput = document.getElementById("profile-save-input")

    if(profiles[name]){
        profiles[name] = timerObj
        localStorage.setItem("timers",JSON.stringify(profiles))
        handleCloseModal()
        handleBottomPopup("success","Success! The profile has been updated.")
    }else{
        modalErrorMessage(saveInput, "Profile name not found.")
    }
}

function handleMergeButton(name){
    const profiles = JSON.parse(localStorage.getItem("timers")) || {}

    const saveInput = document.getElementById("profile-save-input")

    if(profiles[name]){
        for(let timer in timerObj){
            profiles[name][timer] = timerObj[timer]
        }
        localStorage.setItem("timers", JSON.stringify(profiles))
        handleCloseModal()
        handleBottomPopup("success","Success! The profile has been updated.")
    }else{
        modalErrorMessage(saveInput, "Profile name not found.")
    }
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
            handleTimerReachedZero(id)
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