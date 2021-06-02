import Modal from './modal.js'
import { GENRES, DEFAULT_IMAGE } from '../../utils/genres.js'

const AddTrackModal = (onSave, {name = 'new track', genre = 'rock', id, lyrics = ''} = {}) => {
    const setModalListener = (modalContainer) => {
        GENRES.forEach(i => document.getElementById(i).onclick = () => {
            document.getElementById(genre).classList.remove('genre-button-active')
            document.getElementById(i).classList.add('genre-button-active')
            genre = i
        })

        document.getElementById('modal-close').onclick = () => {
            modalContainer.innerHTML = ''
        }

        document.getElementById('modal-save').classList.add('bottom-row')
        document.getElementById('modal-save').onclick = async () => {
            const name = document.getElementById('modal-name').value.trim()
            const lyrics = document.getElementById('modal-lyrics')?.value.trim()

            const data = {
                name,
                genre,
                lyrics,
            }

            if (id) {
                data.id = id
            }

            const res = await onSave(data)

            if (res) {
                modalContainer.innerHTML = ''
            }
        }
    }

    const render = async (imageUrl = DEFAULT_IMAGE) => {
        const modalContainer = document.getElementById('modal')

        const modalBody = `
            <div id="upload-image" class="upload-image">
                <img src="${imageUrl}" id="uploaded-img" class="centre uploaded-image">
                <input class="image-uploads" type="file" id="image_uploads" name="image_uploads" accept="image/jpeg, image/png, image/webp">
            </div>
            <div class="modal-text-input-container modal-name-input">
                <input id="modal-name" type="text" class="modal-text-input modal-text" value="${name}">
            </div>
            <div class="genre-container">
                ${GENRES.map(trackGenre => `
                    <button id="${trackGenre}" class="genre-button ${trackGenre === genre && 'genre-button-active'}">
                        ${trackGenre}
                    </button>`).join('\n ')
                }
            </div>
            <textarea 
                id="modal-lyrics"
                class="modal-text-input-container modal-textarea modal-lyrics"
                rows="8"
            >${lyrics}
            </textarea>
        `

        modalContainer.innerHTML = Modal('Добавить трек', modalBody)
        setModalListener(modalContainer)
    }

    return {
        render
    }
}


export default AddTrackModal