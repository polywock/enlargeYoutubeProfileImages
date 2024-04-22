

(() => {
    window.addEventListener("contextmenu", e => {
        if (e.target?.tagName === "IMG") {
            if (e.target.closest("#author-thumbnail")) {
                window.open(e.target.src.split("=")[0], "_blank")
                e.stopImmediatePropagation()
                e.preventDefault()
            }
        }
    })

    window.addEventListener("EYPI-M", e => {
        e.stopImmediatePropagation()
        const {size, rounding, sizeAlt, roundingAlt} = JSON.parse(e.detail)
        const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src")
        Object.defineProperty(HTMLImageElement.prototype, "src", {configurable: true, enumerable: true, get: desc.get, set: function(value) {
            let isShorts = this.closest('ytd-engagement-panel-section-list-renderer') 
            if (value.includes("https://yt3.ggpht.com") && this.closest("#author-thumbnail")) {
                return desc.set.call(this, value.replace(/\=s\d+/, `=s${isShorts ? sizeAlt : size}`))
            }
            return desc.set.call(this, value)
        }})
        
        let s = document.createElement("style")
        s.innerHTML = `
            #primary ytd-comment-view-model #author-thumbnail yt-img-shadow ${getBase(size, rounding)};
        `
        document.documentElement.appendChild(s)

        s = document.createElement("style")
        s.innerHTML = `
            ytd-shorts ytd-comment-view-model #author-thumbnail yt-img-shadow ${getBase(sizeAlt, roundingAlt)}; 
        `
        document.documentElement.appendChild(s)
    }, {once: true, capture: true})

    window.dispatchEvent(new CustomEvent("EYPI-I"))
})()


function getBase(size, rounding) {
    return `{ height: ${size}px !important; width: ${size}px !important; border-radius: ${rounding}px !important; }` 
}
    

// .closest('ytd-engagement-panel-section-list-renderer')