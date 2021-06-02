import DomObserver from '../../utils/observer.js'
import routeHelper from '../../utils/routeHelper.js'
import { DEFAULT_IMAGE } from '../../utils/genres.js'

const styles = {
    card: {
        container: 'card',
        imageContainer: 'card-image-container',
        info: 'card-info',
        title: 'card-title',
        description: 'card-description'
    },
    'playlists-tile': {
        container: 'playlists-tile',
        imageContainer: 'playlists-tile-image-container',
        info: 'playlists-tile-info',
        title: 'playlists-tile-title',
        description: 'playlists-tile-description'
    },
    music: {
        container: 'music-tile',
        imageContainer: 'music-tile-image-container',
        info: 'music-tile-info',
        title: 'music-tile-title',
        description: 'music-tile-description'
    }
}

const Tile = ({
    imageUrl,
    albumImage,
    albumId,
    name,
    description = '',
    authorName,
    authorId,
    type,
    id,
}, 
cardType = 'card') => {
    const tileUrl = routeHelper.getUrl(type, authorId, type ? id : albumId)
    let observerId

    const play = (event) => {
        event.stopPropagation()
        console.log('play: ', id)
    }

    const playButton = (type, authorName) => {
        if ((type === 'card' || type === 'music') && authorName) {
            return `
                <button id="play-${id}" class="play-button">
                    <svg height="16" role="img" width="16" viewBox="0 0 24 24">
                        <polygon points="21.57 12 5.98 3 5.98 21 21.57 12" fill="currentColor"></polygon>
                    </svg>
                </button>
            `
        }

        return ''
    }

    const render = async () => {
        const classes = styles[cardType]
        const descriptionText = cardType === 'music' ? authorName || 'Исполнитель' : description
        const cardImageStyle = !authorName && cardType === 'music' ? 'circle-image' : 'card-image-border'

        const view = `
            <div id="${id}" class="${classes.container}">
                <div class="${classes.imageContainer} ${cardImageStyle}">
                    <img loading="lazy" src="${imageUrl || albumImage || DEFAULT_IMAGE}" class="card-image">
                    ${playButton(cardType, authorName)}
                </div>
                <div class="${classes.info}">
                    <a href="${tileUrl}" class="${classes.title} text-cut-one-line">
                        ${name}
                    </a>
                    <p class="${classes.description} text-cut-two-line">
                        ${descriptionText}
                    </p>
                </div>
            </div>
        `

        observerId = DomObserver.addCallbacks(afterRender)

        return view
    }

    const afterRender = () => {
        const tile = document.getElementById(id)
        const playButton = document.getElementById(`play-${id}`)

        if (tile) {
            DomObserver.removeCallback(observerId)
            tile.onclick = () => window.location = tileUrl
            if (playButton) {
                playButton.onclick = play
            }
        }
    }

    return {
        render,
    }
}

export default Tile;