export const updateUsersTracks = async (data, trackId) => {
    const dbRef = firebase.database().ref('users')
    await dbRef.once("value", users => {
        users.forEach(user => {
            user.child('playlists').forEach(playlist => {
                playlist.child('tracks').forEach(track => {
                    if (track.child('albumId').val() === trackId || track.child('id').val() === trackId) {
                        track.ref.update(data)
                    }
                })
            })
        })
    })
}

const updateUserTracks = (snapshot, data, userId) => {
    snapshot.forEach(albums => {
        albums.child('tracks').forEach(track => track.ref.update(data))
        albums.child('info').ref.update({authorName: data.authorName})
    })
}

export const updateUserPage = async (userId, data) => {
    const idLowerCase = userId.toLowerCase()

    const trackData = {
        authorId: idLowerCase,
        authorName: data.name,
    }

    data.id = idLowerCase
    data.type = 'author'
    
    const dbRef = firebase.database().ref(`users/${idLowerCase}`)
    await dbRef.once("value", (snapshot) => {
        if (!snapshot.hasChild('info')) {
            firebase.database().ref().update({[`users/${idLowerCase}/info`]: data})
        }

        updateUserTracks(snapshot.child('albums'), trackData, userId)
        updateUserTracks(snapshot.child('playlists'), trackData, userId)

        snapshot.child('info').ref.update(data)

    })
}

export const getUserPage = async (userId) => {
    const snapshot = await firebase.database().ref(`users/${userId.toLowerCase()}/info`).once('value')

    return snapshot.val()
}

export const getAuthors = async () => {
    const authors = []

    const dbRef = firebase.database().ref('users')
    await dbRef.once("value", users => {
        users.forEach(user => {
            authors.push({info: user.child('info').val()})
        })
    })

    return authors
}

export const getTracks = async () => {
    const tracks = []

    const dbRef = firebase.database().ref('users')
    await dbRef.once("value", users => {
        users.forEach(user => {
            user.child('albums').forEach(albums => {
                albums.child('tracks').forEach(track => tracks.push({info: track.val()}))
            })
        })
    })

    return tracks
}