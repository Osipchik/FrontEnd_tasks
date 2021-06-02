import DomObserver from '../../utils/observer.js'

const buttonTypes = {
    navButton: {
        container: 'group-button',
        text: 'button-text',
    },
    playlistButton: {
        container: 'playlists-button',
        image: 'playlist-button-image',
        text: 'playlist-button-text',
    },
}

const CreatePlayListButton = (onClick) => {
    let observerId

    const render = async (type = 'navButton') => {
        const classes = buttonTypes[type]

        const view = `
            <button id="createPlaylist-${type}" class="${classes.container}">
                <div class="group-icon add-icon ${classes.image} centrefy">
                    <svg role="img" height="12" width="12" viewBox="0 0 16 16">
                        <path d="M14 7H9V2H7v5H2v2h5v5h2V9h5z"></path>
                        <path fill="none" d="M0 0h16v16H0z"></path>
                    </svg>
                </div>
                <p class="${classes.text} text-cut-one-line">
                    Создать плейлист
                </p>
            </button>
        `

        observerId = DomObserver.addCallbacks(afterRender)

        return view
    }

    const afterRender = async () => {
        const button = document.getElementById('createPlaylist-playlistButton')

        if(button) {
            DomObserver.removeCallback(observerId)
            button.onclick = onClick
        }
    }

    return {
        render
    }
}

export default CreatePlayListButton