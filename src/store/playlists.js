class PlaylistStore {
    constructor() {
        this.state = []
        this.callbacks = []
    }

    setPlaylists(playlist) {
        this.state = playlist
        this.callbacks.forEach(i => i(playlist))
    }

    getPlaylists() {
        return this.state
    }

    addListener(callback) {
        this.callbacks.push(callback)
    }
    
}

export default new PlaylistStore