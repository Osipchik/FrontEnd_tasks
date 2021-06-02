const getRootParent = (ref) => {
    return ref.parent.key !== 'users' ? getRootParent(ref.parent) : ref.key
}

const types = {
    author: 'albums',
    album: 'albums',
    playlist: 'playlists'
}

export const createPlaylist = (userId, name, description = '', imageUrl = '') => {
    const newPlaylistKey = firebase.database().ref().child(`users/${userId.toLowerCase()}/playlists`).push().key.toLowerCase();
    const data = {
        [`users/${userId.toLowerCase()}/playlists/${newPlaylistKey}/info`]: {
            id: newPlaylistKey,
            type: 'playlist',
            name, 
            description,
            imageUrl,
        }
    }

    firebase.database().ref().update(data);
}

export const getUserPlaylists = async (userId, type = 'playlists') => {
    const playlists = await firebase.database().ref(`users/${userId.toLowerCase()}/${type}`).once('value')
    const parent = getRootParent(playlists.ref)

    return {val: Object.values(playlists.val() || {}), parent}
}

export const getUserPlaylist = async (userId, playlistId, type = 'playlists') => {
    const playlist = playlistId?.toLowerCase()
    const snapshot = await firebase.database().ref(`users/${userId.toLowerCase()}/${types[type]}/${playlist}`).once('value')
    const parent = getRootParent(snapshot.ref)

    return {val: snapshot.val(), parent: parent}
}

export const updateUserPlaylist = async (userId, playlistId, type, data) => {
    const playlist = playlistId?.toLowerCase()
    const dbRef = firebase.database().ref(`users/${userId.toLowerCase()}/${types[type]}/${playlist}`)
    
    await dbRef.once("value", (snapshot) => snapshot.child('info').ref.update(data))
}

export const updatePlaylistTracks = async (userId, playlistId, type, data) => {
    const playlist = playlistId?.toLowerCase()
    const dbRef = firebase.database().ref(`users/${userId.toLowerCase()}/${types[type]}/${playlist}/tracks`)
    await dbRef.once('value', snapshot => {
        snapshot.forEach(child => {
            child.ref.update(data)
        })
    })
}

export const removePlaylist = async (userId, playlistId) => {
    const playlistRef = firebase.database().ref(`users/${userId}/playlists/${playlistId}`)
    await playlistRef.remove()
}

export const removePlaylistTrack = async (userId, playlistId, trackId) => {
    const playlistRef = firebase.database().ref(`users/${userId}/playlists/${playlistId}/tracks/${trackId}`)
    await playlistRef.remove()
}

export const addTrackToPlaylist = async (track, playlistId, userId) => {
    const ref = firebase.database().ref(`users/${userId.toLowerCase()}`)
    await ref.child('playlists').equalTo(playlistId).once('value', snapshot => {
        if (!snapshot.exists()){
          const saveData = {
              [`users/${userId.toLowerCase()}/playlists/${playlistId}/tracks/${track.id}`]: track
          }
      
          firebase.database().ref().update(saveData)
        }
    })
}