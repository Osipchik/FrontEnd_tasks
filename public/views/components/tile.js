import DomObserver from '../../utils/observer.js'
import routeHelper from '../../utils/routeHelper.js'
import { DEFAULT_IMAGE } from '../../utils/genres.js'
import PlayButton from './play-button.js'
import * as playlistAPI from '../../utils/api/playlist.js'
import Player from '../components/player.js'

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

    const playButton = async (type, authorName) => {
        if ((type === 'card' || type === 'music') && authorName) {
            const track = await playlistAPI.getFirstTrack(authorId, albumId)

            return track ? PlayButton(track).render() : ''
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
                    ${await playButton(cardType, authorName)}
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

        if (tile) {
            DomObserver.removeCallback(observerId)
            tile.onclick = () => window.location = tileUrl
        }
    }

    return {
        render,
    }
}

export default Tile;