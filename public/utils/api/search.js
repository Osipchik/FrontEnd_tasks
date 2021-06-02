
export const searchData = (searchValue, callback) => {
    const result = {
        authors: [],
        albums: [],
        tracks: [],
        best: null
    }

    searchValue = searchValue.toLowerCase()

    const recentPostsRef = firebase.database().ref('users');
    recentPostsRef.on('value', users => {
        users.forEach(user => {
            if (user.child('info/name').val().toLowerCase() === searchValue) {
                result.best = user.val()
                result.best.type = 'author'
            } else if (user.child('info/name').val().toLowerCase().includes(searchValue)) {
                result.authors.push({...(user.val()), type: "author"})
            }

            user.child('albums').forEach(album => {
                if (album.child('info/name').val().toLowerCase() === searchValue) {
                    result.best = album.val()
                    result.best.type = 'album'
                } else if (album.child('info/name').val().toLowerCase().includes(searchValue)) {
                    result.albums.push(album.val())
                }

                album.child('tracks').forEach(track => {
                    if (track.child('name').val().toLowerCase() === searchValue) {
                        result.best = track.val()
                    } else if (track.child('name').val().toLowerCase().includes(searchValue)) {
                        result.tracks.push(track.val())
                    }
                })
            })
        })

        callback(result)
    })
}

export const getTracksByGenre = async (genre, callback) => {
    let tracks = []

    const recentPostsRef = firebase.database().ref('users');
    recentPostsRef.on('value', val => {
        val.forEach(user => {
            user.child('albums').forEach(album => {
                album.child('tracks').forEach(track => {
                    if (track.child('genre').val() === genre) {
                        tracks.push({info: track.val()})
                    }
                })
            })

            callback(tracks)
        })
    })
}