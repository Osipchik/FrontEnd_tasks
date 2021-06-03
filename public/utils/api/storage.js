import generateUid from '../generateUid.js'

const uploadFile = async (file) => {
    if (file) {
        const ref = firebase.storage().ref().child(generateUid());
        const snapshot = await ref.put(file)

        return await snapshot.ref.getDownloadURL()
    }
}

export default {
    uploadFile,
}