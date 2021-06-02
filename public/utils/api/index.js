export const getGenres = async (type) => {
    const snapshot = await firebase.database().ref(type).once('value')

    return snapshot.val()
}