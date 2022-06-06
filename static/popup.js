
let size = 75 
let square = true 
let noHover = false  
sync()

chrome.storage.local.get(["size", "square", "noHover"], items => {
    size = items.size ?? 75 
    square = items.square ?? true 
    noHover = items.noHover ?? false 
    sync() 
})

function sync() {
    window.size.value = size 
    window.shape.value = square ? "square" : "circle"
    window.hover.checked = !noHover
}

function persist() {
    chrome.storage.local.set({size, square, noHover})
}

window.size.addEventListener("change", e => {
    let newSize = e.target.valueAsNumber
    newSize = isNaN(newSize) ? 75 : newSize

    size = Math.round(Math.min(Math.max(newSize, 25), 300))
    sync() 
    persist()
})

window.shape.addEventListener("change", e => {
    console.log(e.target.value)
    square = e.target.value !== "circle"
    sync() 
    persist()
})

window.hover.addEventListener("change", e => {
    noHover = !e.target.checked 
    sync() 
    persist()
})

