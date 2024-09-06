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