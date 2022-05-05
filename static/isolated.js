
const s = document.createElement("script")
s.src = chrome.runtime.getURL("main.js")
document.documentElement.appendChild(s)



window.addEventListener("EYPI-I", e => {
    e.stopImmediatePropagation()
    chrome.storage.local.get(items => {
        window.dispatchEvent(new CustomEvent("EYPI-M", {detail: JSON.stringify({size: items.size ?? 75, square: items.square ?? true})}))
    })
}, {once: true, capture: true})