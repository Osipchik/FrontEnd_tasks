import Modal from './modal.js'
import * as playlistAPI from '../../utils/api/playlist.js'
import UserStore from '../../store/user.js'

const AddToPlaylistModal = (track, onSave) => {
    const setModalListener = (modalContainer, playlists) => {
        let selectedPlaylistId

        playlists.val.forEach(playlist => {
            const item = document.getElementById(`playlist-${playlist.info.id}`)
            item.onclick = () => {
                document.getElementById(`playlist-${selectedPlaylistId}`)?.classList.remove('modal-playlist-item-active')
                item.classList.add('modal-playlist-item-active')
                selectedPlaylistId = playlist.info.id
            }
        })

        document.getElementById('modal-close').onclick = () => {
            modalContainer.innerHTML = ''
        }

        document.getElementById('modal-save').onclick = async () => {
            const res = await onSave(selectedPlaylistId)

            if (res) {
                modalContainer.innerHTML = ''
            }
        }
    }

    const playlistItem = (playlist) => {
        return `
            <button id="playlist-${playlist.id}" class="modal-playlist-item">
                ${playlist.name}
            </button>
        `
    }

    const render = async () => {
        const user = UserStore.getUser()

        const modalContainer = document.getElementById('modal')
        const userPlaylists = await playlistAPI.getUserPlaylists(user.uid)

        const modalBody = `
            <div class="modal-playlists">
                ${userPlaylists?.val.map(playlist => playlistItem(playlist.info)).join('\n')}
            </div>
        `

        modalContainer.innerHTML = Modal('Добавить в плейлист', modalBody)
        setModalListener(modalContainer, userPlaylists)
    }

    return {
        render
    }
}


export default AddToPlaylistModal