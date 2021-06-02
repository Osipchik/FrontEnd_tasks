import UserStore from '../store/user.js'


const signIn = async () => {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider)

    const {displayName, photoURL, refreshToken, uid} = result.user;
    const accessToken = result.credential.accessToken
    
    window.location.hash = ''

    return {displayName, photoURL, refreshToken, accessToken, uid}
}

const signOut = async () => {
    await firebase.auth().signOut()
    UserStore.setUser(null)
    window.location.hash = ''
}


export default {
    signIn,
    signOut,
}