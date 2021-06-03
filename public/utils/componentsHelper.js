import PlaylistControls from '../views/components/playlist-controls.js'

const getGreeting = () => {
    const currentDate = new Date()
    const currentHours = currentDate.getHours()
    
    if (currentHours < 12) {
        return 'Доброе утро'
    } else if (currentHours < 17) {
        return 'Добрый день'
    } else {
        return 'Добрый вечер'
    }
}

const popup = (elementId) => {
    const element = document.getElementById(elementId)

    const hidePopup = () => {
        element.classList.add('display-none')
        document.removeEventListener('click', hidePopup)
    }

    const showPopup = () => {
        element.classList.remove('display-none')
        setTimeout(() => {
            document.addEventListener('click', hidePopup)
        }, 100);
    }

    return {
        showPopup,
    }
}

const setDefaultStyle = () => {
    const content = document.getElementById('main')
    content.classList.remove(...content.classList);
    content.classList.add('main-section')
}

const setFullscreenStyle = () => {
    const content = document.getElementById('main')
    content.classList.remove(...content.classList);
    content.classList.add('liked-container')
}

const getControls = (user, playlist, editPlaylist, addTrack, removePlaylist) => {
    if (playlist.val && user?.uid === playlist.parent) {
        return playlist.val.info.type === 'playlist' 
            ? PlaylistControls(editPlaylist, removePlaylist)
            : PlaylistControls(editPlaylist, addTrack)
    }

    return PlaylistControls()
}

export default {
    getGreeting,
    popup,
    setDefaultStyle,
    setFullscreenStyle,
    getControls,
}