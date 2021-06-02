import { DEFAULT_IMAGE } from '../../utils/genres.js'

const AuthorHeader = {
    async render (name = 'Name', imageUrl = DEFAULT_IMAGE) {
        const view = `
        <div class="playlist-header">
            <div class="playlist-header-gradient"></div>
            <img src="${imageUrl}" class="artist-image">
            <div class="playlist-header-shadow"></div>
            <div class="playlist-info-container">
                <h1 class="playlist-title text-cut-two-line">
                    ${name}
                </h1>
                <button class="play-mobile-button">
                    Перемешать
                </button>
            </div>
        </div>
        `

        return view
    },
}

export default AuthorHeader