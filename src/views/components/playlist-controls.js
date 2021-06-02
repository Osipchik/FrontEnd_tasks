import DomObserver from '../../utils/observer.js'

const PlaylistControls = (onPlayClick, onButtonClick, addTrack) => {
    let observerId

    const getButton = async (buttonId, buttonText, handler) => {
        if (!handler) {
            return ''
        }

        return `
            <button id="${buttonId}" class="add-track-button">
                ${buttonText}
            </button>
        `
    }

    const playButton = (hidePlayButton) => {
        if (hidePlayButton) {
            return ''
        }

        return `
            <button class="play-button-big play-button">
                <svg height="16" role="img" width="16" viewBox="0 0 24 24">
                    <polygon points="21.57 12 5.98 3 5.98 21 21.57 12" fill="currentColor"></polygon>
                </svg>
            </button>
        `
    }

    const render = async ({ 
        buttonText,
        secondButtonText,
        color = '#5038B4',
    } = {},
    hidePlayButton = false) => {
        const view = `
            <div class="gradient-bottom" style="background-color:${color}"></div>
            <div class="playlist-control mobile-hide">
                ${playButton(hidePlayButton)}
                ${await getButton('change-button', buttonText, onButtonClick)}
                ${await getButton('add-button',secondButtonText, addTrack)}
            </div>
        `

        observerId = DomObserver.addCallbacks(afterRender)

        return view
    }

    const afterRender = () => {
        const changeButton = document.getElementById('change-button')
        
        if (changeButton) {
            DomObserver.removeCallback(observerId)
            changeButton.addEventListener('click', onButtonClick)
            document.getElementById('add-button')?.addEventListener('click', addTrack)
        }
    }

    return {
        render,
        afterRender,
    }
}

export default PlaylistControls