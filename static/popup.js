
let size = 75 
let square = true  
sync()

chrome.storage.local.get(["size", "square"], items => {
    size = items.size ?? 75 
    square = items.square ?? true 
    sync() 
})

function sync() {
    window.size.value = size 
    window.shape.value = square ? "square" : "circle"
}

function persist() {
    chrome.storage.local.set({size, square})
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