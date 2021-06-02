class History {
    constructor() {
        this.history = {
            currentIndex: 1,
            length: 2,
            state: 0,
        }
    }

    updateHistory() {
        if (this.history.state === 0) {
            this.history.currentIndex += 1
        }
    
        this.history.state = 0
        this.history.length = window.history.length
    }

    goBack() {
        window.history.back()
        this.updateHistoryState(-1)
    }

    goForward() {
        window.history.forward()
        this.updateHistoryState(+1)
    }

    updateHistoryState(state) {
        this.history.state = state
        this.history.currentIndex = this.history.currentIndex + state
    }

    canGoBack() {
        return this.history.length >= this.history.currentIndex && this.history.currentIndex > 2
    }

    canGoForward() {
        return this.history.length > this.history.currentIndex && this.history.currentIndex >= 2
    }
}

export default new History