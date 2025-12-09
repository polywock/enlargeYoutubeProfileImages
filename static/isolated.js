
let noHover = false
let noHoverAlt = false

window.addEventListener("mouseover", handleMouseOver, {capture: true, passive: true})
window.addEventListener("mouseout", handleMouseOut, {capture: true, passive: true})

window.addEventListener("EYPI-I", e => {
    e.stopImmediatePropagation()
    chrome.storage.local.get(items => {
        const state = {size: items.size ?? 75, rounding: items.rounding ?? (items.square === false ? 100 : 0), sizeAlt: items.sizeAlt ?? 60, roundingAlt: items.roundingAlt ?? (items.square === false ? 100 : 0)}
        window.dispatchEvent(new CustomEvent("EYPI-M", {detail: JSON.stringify(state)}))

        noHover = items.noHover
        noHoverAlt = items.noHoverAlt
        if (items.noHover && items.noHoverAlt) {
            window.removeEventListener("mouseover", handleMouseOver, true) 
            window.removeEventListener("mouseout", handleMouseOver, true) 
        }

        const { size, sizeAlt, rounding, roundingAlt } = state 
        let s = document.createElement("style")
        s.innerHTML = `
            #primary ytd-comment-view-model #author-thumbnail yt-img-shadow ${getBase(size, rounding)}
            ytd-shorts ytd-comment-view-model #author-thumbnail yt-img-shadow ${getBase(sizeAlt, roundingAlt)} 

            #primary ytd-comment-view-model #author-thumbnail > div.threadline { height: calc(100% - ${size}px) !important; width: 36px !important; }
            #primary div.thread-hitbox { height: calc(100% - ${size}px) !important; }

            ytd-shorts ytd-comment-view-model #author-thumbnail > div.threadline { height: calc(100% - ${sizeAlt}px) !important; width: 24px !important; }
            ytd-shorts div.thread-hitbox { height: calc(100% - ${sizeAlt}px) !important; }
            `
            document.documentElement.appendChild(s)
            
            
        })
    }, {once: true, capture: true})

// Make threadlines larger approach (Not using it for now, instead keeping the small original threadlines)
// #primary yt-sub-thread.ytSubThreadHost > div.ytSubThreadThreadline { width: ${size}px !important }
// #primary ytd-comment-view-model #author-thumbnail > div.threadline { height: calc(100% - ${size}px) !important }
// #primary div.thread-hitbox { width: ${size}px !important; height: calc(100% - ${size}px) !important; }
// ytd-shorts yt-sub-thread.ytSubThreadHost > div.ytSubThreadThreadline { width: ${sizeAlt}px !important }
// ytd-shorts ytd-comment-view-model #author-thumbnail > div.threadline { height: calc(100% - ${sizeAlt}px) !important }
// ytd-shorts div.thread-hitbox { width: ${sizeAlt}px !important; height: calc(100% - ${sizeAlt}px) !important; }

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
    
    if (!(e.target.closest("#author-thumbnail"))) return 
    let isShorts = e.target.closest('ytd-engagement-panel-section-list-renderer') 

    if (noHoverAlt && isShorts) return
    if (noHover && !isShorts) return 
    
    e.stopImmediatePropagation();
    show(img.src.split("=")[0], img.getBoundingClientRect())
}

function handleMouseOut(e) {
    activeRect && remove()
}

function getBase(size, rounding) {
    return `{ height: ${size}px !important; width: ${size}px !important; border-radius: ${rounding}px !important; }` 
}
