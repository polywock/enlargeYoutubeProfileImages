

(() => {
    window.addEventListener("contextmenu", e => {
        if (e.target?.tagName === "IMG") {
            if (e.target.parentElement?.tagName === "YT-IMG-SHADOW") {
                if (e.target.parentElement.classList.contains("ytd-comment-renderer")) {
                    window.open(e.target.src.split("=")[0], "_blank")
                    e.stopImmediatePropagation()
                    e.preventDefault()
                }
            }
        }
    })

    window.addEventListener("EYPI-M", e => {
        e.stopImmediatePropagation()
        const {size, square} = JSON.parse(e.detail)
        const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src")
        Object.defineProperty(HTMLImageElement.prototype, "src", {configurable: true, enumerable: true, get: desc.get, set: function(value) {
            if (value.includes("https://yt3.ggpht.com") && this.parentElement.classList.contains("ytd-comment-renderer") && !document.querySelector("ytd-comments.ytd-multi-page-menu-renderer")?.contains(this.parentElement)) {
                return desc.set.call(this, value.replace(/\=s\d+/, `=s${size}`))
            }
            return desc.set.call(this, value)
        }})
        
        const s = document.createElement("style")
        s.innerHTML = `#comments yt-img-shadow.ytd-comment-renderer {height: ${size}px !important; width: ${size}px !important; border-radius: ${square ? "0px" : "50%"} !important;} ytd-comment-replies-renderer {margin-left: ${size + 6}px !important;}` 
        document.documentElement.appendChild(s)
    }, {once: true, capture: true})

    window.dispatchEvent(new CustomEvent("EYPI-I"))
})()
    