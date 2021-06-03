import { DEFAULT_IMAGE } from '../../utils/genres.js'
import DomObserver from '../../utils/observer.js'

const RecommendationTile = ({
    imageUrl = DEFAULT_IMAGE,
    name,
    id
    }) => {
    let observerId
    const tileUrl = `/#/author/${id}`

    const render = () => {
        const view = `
            <div id="${id}" class="main-card-container">
                <img loading="lazy" src="${imageUrl}" class="main-card-image">
                <div class="main-card-title-container">
                    <a href="${tileUrl}">
                        <p class="main-card-title text-cut-two-line">
                            ${name}
                        </p>
                    </a>
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
                playButton.onclick = (event) => {
                    event.stopPropagation()
                    console.log('play: ', id)
                }
            }
        }
    }

    return {
        render,
    }
}

export default RecommendationTile