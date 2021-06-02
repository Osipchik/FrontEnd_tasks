import generateUir from './generateUid.js'

class DomObserver {
    callbacks = {}

    constructor () {
        this.observer = new MutationObserver(async () => await this.execCallbacks())
        this.observer.observe(document.body, {
            childList: true,
            attributes: true,
            subtree: true,
            characterData: true
        })
    }

    async execCallbacks() {
        await Promise.all(Object.values(this.callbacks)?.map(callback => callback.call()))
    }

    addCallbacks(callback) {
        const callbackId = generateUir()
        this.callbacks[callbackId] = callback
        return callbackId
    }

    removeCallback(callbackId) {
        delete this.callbacks[callbackId]
    }
}

export default new DomObserver