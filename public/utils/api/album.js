export const createAlbum = (userId, data) => {
    const newPlaylistKey = firebase.database().ref().child(`users/${userId.toLowerCase()}/albums`).push().key.toLowerCase();
    const saveData = {
        [`users/${userId.toLowerCase()}/albums/${newPlaylistKey}/info`]: {
            id: newPlaylistKey,
            type: 'album',
            authorId: userId,
            ...data,
        }
    }

    firebase.database().ref().update(saveData);
}

export const createTrack = (userId, playlistId, data) => {
    const playlist = playlistId?.toLowerCase()

    data.genre = data.genre.toLowerCase()
    const newPlaylistKey = firebase.database().ref().child(`users/${userId.toLowerCase()}/albums/${playlist}/tracks`).push().key.toLowerCase()
    const saveData = {
        [`users/${userId.toLowerCase()}/albums/${playlist}/tracks/${newPlaylistKey}`]: {
            id: newPlaylistKey,
            authorId: userId,
            albumId: playlistId,
             ...data
            }
    }

    firebase.database().ref().update(saveData)
}

export const updateTrack = async (userId, playlistId, track) => {
    const playlist = playlistId?.toLowerCase()
    track.genre = track.genre.toLowerCase()
    const dbRef = firebase.database().ref(`users/${userId.toLowerCase()}/albums/${playlist}/tracks/${track.id}`)
    await dbRef.once("value", (snapshot) => snapshot.ref.update(track))
}