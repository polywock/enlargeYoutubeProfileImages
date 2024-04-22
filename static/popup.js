
let size = 75  
let rounding = 5
let noHover = false  

let sizeAlt = 60 
let roundingAlt = 5
let noHoverAlt = false  
sync()

chrome.storage.local.get(["size", "square", "rounding", "noHover", "sizeAlt", "squareAlt", "roundingAlt", "noHoverAlt"], items => {
    size = items.size ?? 75 
    noHover = items.noHover ?? false 
    rounding = items.rounding ?? (items.square === false ? 100 : 0) 

    sizeAlt = items.sizeAlt ?? 60 
    roundingAlt = items.roundingAlt ?? (items.squareAlt === false ? 100 : 0) 
    noHoverAlt = items.noHoverAlt ?? false 
    sync() 
})

function sync() {
    window.size.value = size 
    window.shape.value = rounding
    window.hover.checked = !noHover

    window.sizeAlt.value = sizeAlt 
    window.shapeAlt.value = roundingAlt
    window.hoverAlt.checked = !noHoverAlt
}

function persist() {
    chrome.storage.local.set({size, rounding, noHover, sizeAlt, roundingAlt, noHoverAlt})
}

window.size.addEventListener("change", e => {
    let newSize = e.target.valueAsNumber
    newSize = isNaN(newSize) ? 75 : newSize

    size = Math.round(Math.min(Math.max(newSize, 25), 300))
    sync() 
    persist()
})

window.shape.addEventListener("change", e => {
    rounding = e.target.valueAsNumber
    console.log(rounding)
    sync() 
    persist()
})

window.hover.addEventListener("change", e => {
    noHover = !e.target.checked 
    sync() 
    persist()
})


window.sizeAlt.addEventListener("change", e => {
    let newSize = e.target.valueAsNumber
    newSize = isNaN(newSize) ? 60 : newSize

    sizeAlt = Math.round(Math.min(Math.max(newSize, 25), 300))
    sync() 
    persist()
})

window.shapeAlt.addEventListener("change", e => {
    roundingAlt = e.target.valueAsNumber
    sync() 
    persist()
})

window.hoverAlt.addEventListener("change", e => {
    noHoverAlt = !e.target.checked 
    sync() 
    persist()
})
