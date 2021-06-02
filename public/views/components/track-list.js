import LyricsModal from '../components/lyrics-modal.js'

const TrackList = ({tracks = [], showHead = true, editTrack, addToPlaylist, removeTrack}) =>{
    const header = () => {
        return `
            <div class="grid-row track-list-header">
                <div class="grid-index">
                    #
                </div>
                <div class="grid-name">
                    Название
                </div>
                <div class="grid-album">
                    Альбом
                </div>
                <div class="grid-data">
                    Дата добавления
                </div>
                <div class="grid-time">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.999 3H6.999V7V8H7.999H9.999V7H7.999V3ZM7.5 0C3.358 0 0 3.358 0 7.5C0 11.642 3.358 15 7.5 15C11.642 15 15 11.642 15 7.5C15 3.358 11.642 0 7.5 0ZM7.5 14C3.916 14 1 11.084 1 7.5C1 3.916 3.916 1 7.5 1C11.084 1 14 3.916 14 7.5C14 11.084 11.084 14 7.5 14Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>
        `
    }

    const editButton = (trackId) => {
        if (!editTrack) {
            return ''
        }

        return `
            <button id="${trackId}" class="button-options">
                <svg role="img" height="16" width="16" viewBox="0 0 16 16">
                    <path d="M2 6.5a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 002 6.5zm6 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6 0a1.5 1.5 0 10-.001 2.999A1.5 1.5 0 0014 6.5z"></path>
                </svg>
            </button>
        `
    }

    const addToPlaylistButton = (trackId) => {
        if (removeTrack) {
            return `
            <button id="remove-${trackId}" class="add-to-playlist">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
            `
        }
        
        if (addToPlaylist) {
            return `
                <button id="add-${trackId}" class="add-to-playlist">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/>
                    </svg>
                </button>
            `
        }

        return ''
    }

    const lyricsButton = (track) => {
        if (!track.lyrics) {
            return ''
        }

        return `
            <button id="lyrics-${track.id}" class="add-to-playlist">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
            </button>
        `
    }

    const render = async () => {
        const head = showHead ? header() : ''

        const view = `
            <div class="track-list">
                ${head}
                ${tracks.map((track, index) => `
                    <div class="grid-row track-list-item">
                        <div class="grid-index">
                            ${index + 1}
                        </div>
                        <div class="grid-name">
                            <img src="${track.albumImage}" class="album-image-small"/>
                            <div class="track-name-container">
                                <span class="track-name">
                                    ${track.name}
                                </span>
                                <a href="/#/author/${track.authorId}" class="track-author">
                                    ${track.authorName}
                                </a>
                            </div>
                        </div>
                        <div class="grid-album">
                            <a href="/#/author/${track.authorId}/${track.albumId}" class="grid-album-link">
                                ${track.albumName}
                            </a>
                        </div>
                        
                        <div class="grid-time">
                            ${addToPlaylistButton(track.id)}
                            ${editButton(track.id)}
                            ${lyricsButton(track)}
                        </div>
                    </div>
                `).join('\n ')}
            </div>
        `

        return view
    }

    const afterRender = () => {
        tracks.forEach(track => {
            const editButton = document.getElementById(track.id)
            const addButton = document.getElementById(`add-${track.id}`)
            const removeButton = document.getElementById(`remove-${track.id}`)
            const lyricsButton = document.getElementById(`lyrics-${track.id}`)

            if (editButton) {
                editButton.onclick = () => editTrack(track)
            }

            if (addButton) {
                addButton.onclick = () => addToPlaylist(track)
            }

            if (removeButton) {
                removeButton.onclick = () => removeTrack(track)
            }

            if (lyricsButton) {
                lyricsButton.onclick = () => LyricsModal(track.name, track.lyrics)
            }
        })
    }

    return {
        render,
        afterRender,
    }
}

export default TrackList