
let size = 75 
let square = true 
let noHover = false  

let sizeAlt = 60 
let squareAlt = true 
let noHoverAlt = false  
sync()

chrome.storage.local.get(["size", "square", "noHover", "sizeAlt", "squareAlt", "noHoverAlt"], items => {
    size = items.size ?? 75 
    square = items.square ?? true 
    noHover = items.noHover ?? false 

    sizeAlt = items.sizeAlt ?? 60 
    squareAlt = items.squareAlt ?? true 
    noHoverAlt = items.noHoverAlt ?? false 
    sync() 
})

function sync() {
    window.size.value = size 
    window.shape.value = square ? "square" : "circle"
    window.hover.checked = !noHover

    window.sizeAlt.value = sizeAlt 
    window.shapeAlt.value = squareAlt ? "square" : "circle"
    window.hoverAlt.checked = !noHoverAlt
}

function persist() {
    chrome.storage.local.set({size, square, noHover, sizeAlt, squareAlt, noHoverAlt})
}

window.size.addEventListener("change", e => {
    let newSize = e.target.valueAsNumber
    newSize = isNaN(newSize) ? 75 : newSize

    size = Math.round(Math.min(Math.max(newSize, 25), 300))
    sync() 
    persist()
})

window.shape.addEventListener("change", e => {
    square = e.target.value !== "circle"
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
    squareAlt = e.target.value !== "circle"
    sync() 
    persist()
})

window.hoverAlt.addEventListener("change", e => {
    noHoverAlt = !e.target.checked 
    sync() 
    persist()
})
