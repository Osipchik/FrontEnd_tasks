import Storage from '../utils/storage.js'

class User {
    constructor() {
        // this.state = Storage.get('user')
        if (this.state) {
            this.state.uid = this.state.uid.toLowerCase()
        }
        
        this.callbacks = []
    }

    setUser(user) {
        this.state = user
        
        if (this.state) {
            this.state.uid = user.uid.toLowerCase()
        }

        this.callbacks.forEach(callback => callback(this.state))
    }

    getUser() {
        return this.state
    }

    addListener(callback) {
        this.callbacks.push(callback)
    }
}

export default new User