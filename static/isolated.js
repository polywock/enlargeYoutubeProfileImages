
window.addEventListener("mouseover", handleMouseOver, {capture: true, passive: true})
window.addEventListener("mouseout", handleMouseOut, {capture: true, passive: true})

window.addEventListener("EYPI-I", e => {
    e.stopImmediatePropagation()
    chrome.storage.local.get(items => {
        window.dispatchEvent(new CustomEvent("EYPI-M", {detail: JSON.stringify({size: items.size ?? 75, square: items.square ?? true})}))

        if (items.noHover) {
            window.removeEventListener("mouseover", handleMouseOver, true) 
            window.removeEventListener("mouseout", handleMouseOver, true) 
        }
    })
}, {once: true, capture: true})

const s = document.createElement("script")
s.src = chrome.runtime.getURL("main.js")
document.documentElement.appendChild(s)

let isActive; 
let wrapper; 
let wrapperImg; 

function show(src) {
    if (!wrapper) {
        wrapper = document.createElement("div")
        wrapper.id = "eypi"
    
        wrapperImg = document.createElement("img")
        wrapper.appendChild(wrapperImg)
    
        const s = document.createElement("style")
        s.textContent = `
        #eypi {display: grid; position: fixed; left: 0px; top: 0px; width: 100vw; height: 100vh; align-items: center; justify-items: center; pointer-events: none;} 
        #eypi img {max-height: 80vh;}`
        document.head.appendChild(s)
    }
    wrapper.remove()
    wrapperImg.src = src.split("=")[0] 
    document.body.appendChild(wrapper)
    isActive = true 
}

function remove() {
    wrapper.remove()
    wrapperImg.src = ""
    isActive = false 
}


function handleMouseOver(e) {
    isActive && remove() 

    const img = e.target
    if (!(img?.tagName === "IMG" && img.src.includes("https://yt3.ggpht.com"))) return 

    const parent = img.parentElement
    if (!(parent?.tagName === "YT-IMG-SHADOW" && (parent.classList.contains("ytd-comment-renderer") || parent.classList.contains("ytd-video-owner-renderer")))) return 

    e.stopImmediatePropagation()
    show(img.src.split("=")[0])
}

function handleMouseOut(e) {
    isActive && remove() 
    e.stopImmediatePropagation()
}

