import { DEFAULT_IMAGE } from '../../utils/genres.js'

const types = {
    playlist: 'плейлист',
    album: 'Альбом',
    genre: 'genre',
}

const PlaylistHeader = () => {
    const playlistType = (typeName) => {
        if (typeName === types.genre) {
            return ''
        }

        return `
            <h2 class="playlist-type mobile-hide">
                ${typeName}
            </h2>
        `
    }

    const playlistImage = (imageUrl, typeName) => {
        if (typeName === types.genre) {
            return ''
        }

        return `
            <img 
                src="${imageUrl || DEFAULT_IMAGE}" 
                class="playlist-image mobile-hide"
            />
        `
    }

    const render = async ({
            type = 'playlist',
            name = '',
            authorName = '',
            imageUrl,
            color = '#5038B4',
        }, parent) => {

        const view = `
            <div class="playlist-header">
                <div class="playlist-header-gradient playlist-header-gradient-mobile" style="background: linear-gradient(
                    149.18deg, ${color} 17.59%, #C4EFD9 87.15%);"></div>
                <div class="playlist-header-gradient" style="background-color: ${color};"></div>
                <div class="playlist-header-shadow"></div>
                ${playlistImage(imageUrl, types[type])}
                <div class="playlist-info-container">
                    ${playlistType(types[type])}
                    <h1 class="playlist-title text-cut-two-line">
                        ${name}
                    </h1>
                    <button class="play-mobile-button">
                        Перемешать
                    </button>
                    <div class="playlist-info">
                        <a 
                            href="/#/author/${parent}"
                            class="playlist-author text-cut-one-line"
                        >
                            ${authorName}
                        </a>
                    </div>
                </div>
            </div>
        `

        return view
    }

    return {
        render
    }
}

export default PlaylistHeader()