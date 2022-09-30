
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

let activeRect; 
let wrapper; 

function show(src, rect) {
    if (!wrapper) {
        wrapper = document.createElement("img")
        wrapper.id = "eypi"
        wrapper.addEventListener("load", handleLoad)
    
        const s = document.createElement("style")
        s.textContent = `#eypi {position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; pointer-events: none; z-index: 999999999;}`
        document.head.appendChild(s)

        window.addEventListener("scroll", this.handleScroll, {passive: true, capture: true})
    }
    wrapper.remove()
    activeRect = rect 
    wrapper.src = src.split("=")[0] 
}

function handleLoad(e) {
    if (!activeRect || !(wrapper?.naturalWidth)) return 

    let x = activeRect.x + activeRect.width + 20
    let y = activeRect.y + 20
    let width = wrapper.naturalWidth
    let height = wrapper.naturalHeight
    let ratio = width / height 
    
    
    if (height > (window.innerHeight - 80)) {
        y = 40 
        height = window.innerHeight - 80
        width = height * ratio 
    }

    
    const maxWidth = (window.innerWidth - x - 40) 
    if (width > maxWidth) {
        width = maxWidth
        height = width / ratio 
    }


    const floorX = x
    const floorY = 40 

    const ceilX = window.innerWidth - width - 40
    const ceilY = window.innerHeight - height - 40 

    x = Math.min(Math.max(floorX, x), ceilX)
    y = Math.min(Math.max(floorY, y), ceilY)

    wrapper.style.left = `${x}px`
    wrapper.style.top = `${y}px`
    wrapper.style.width = `${width}px`
    wrapper.style.height = `${height}px`
    document.body.appendChild(wrapper)
}

function handleScroll(e) {
    activeRect && remove() 
}

function remove() {
    wrapper.remove()
    wrapper.src = ""
    activeRect = null 
}    


function handleMouseOver(e) {
    activeRect && remove() 

    const img = e.target
    if (!(img?.tagName === "IMG" && img.src.includes("https://yt3.ggpht.com"))) return 

    const parent = img.parentElement
    if (!(parent?.tagName === "YT-IMG-SHADOW" && (parent.classList.contains("ytd-comment-renderer") || parent.classList.contains("ytd-video-owner-renderer")))) return 

    e.stopImmediatePropagation();
    show(img.src.split("=")[0], img.getBoundingClientRect())
}

function handleMouseOut(e) {
    activeRect && remove() 
    e.stopImmediatePropagation()
}

