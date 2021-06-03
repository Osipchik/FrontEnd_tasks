import DomObserver from '../../utils/observer.js'
import Player from '../components/player.js'

const PlayerButton = (track, classes) => {
    let observerId
    
    const render = () => {
        const view = `
            <button id="play-track${track.id}" class="${classes || 'play-button'}">
                <svg height="16" role="img" width="16" viewBox="0 0 24 24">
                    <polygon points="21.57 12 5.98 3 5.98 21 21.57 12" fill="currentColor"></polygon>
                </svg>
            </button>
        `
        observerId = DomObserver.addCallbacks(afterRender)

        return view
    }

    const afterRender = () => {
        const button = document.getElementById(`play-track${track.id}`)

        if (button) {
            DomObserver.removeCallback(observerId)
            button.onclick = (event) => {
                event.stopPropagation()
                Player(track)
                document.getElementById("audio").play()
            }
        }
    }

    return {
        render
    }
}


export default PlayerButton