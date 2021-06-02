import Modal from './modal.js'
import { DEFAULT_IMAGE } from '../../utils/genres.js'

const EditModal = ({
    name = 'Любимые треки',
    description = 'spotify',
    color = '#5038B4',
    imageUrl,
}, onSave) => {
    const callImageUploader = () => {
        document.getElementById('image_uploads').click()
    }
    
    const setModalListener = (modalContainer, imageUrl) => {
        let image

        document.getElementById('upload-image').addEventListener('click', callImageUploader)
        document.getElementById('image_uploads').onchange = (event) => {
            image = event.target.files[0]
            const url = URL.createObjectURL(image)
            document.getElementById('uploaded-img').src = url
        }

        document.getElementById('modal-close').onclick = () => {
            modalContainer.innerHTML = ''
        }

        document.getElementById('modal-save').onclick = async () => {
            const name = document.getElementById('modal-name').value.trim()
            const description = document.getElementById('modal-description')?.value.trim()
            const color = document.getElementById('modal-color-piker').value
            const data = {
                imageUrl: imageUrl,
                name,
                color
            }

            if (description) {
                data.description = description
            }

            const res = await onSave(image, data)

            if (res) {
                modalContainer.innerHTML = ''
            }
        }
    }

    const render = async (title, hideTextArea = false) => {
        const modalContainer = document.getElementById('modal')
        const textArea = hideTextArea ? '' :
                `<textarea 
                    id="modal-description"
                    class="modal-text-input-container modal-textarea modal-textarea-description"
                    rows="6"
                >${description}
                </textarea>
            `

        const modalBody = `
            <div id="upload-image" class="upload-image">
                <div class="image-placeholder">
                    <div class="image-label">
                        <p class="centre">Выбрать фото</p>
                    </div>
                </div>
                <img src="${imageUrl || DEFAULT_IMAGE}" id="uploaded-img" class="centre uploaded-image">
                <input class="image-uploads" type="file" id="image_uploads" name="image_uploads" accept="image/jpeg, image/png, image/webp">
            </div>
            <div class="modal-text-input-container  modal-name-input">
                <input id="modal-name" type="text" class="modal-text-input modal-text" value="${name}">
            </div>
            ${textArea}
            <input class="color-piker" type="color" id="modal-color-piker" value="${color}">
        `

        modalContainer.innerHTML = Modal(title, modalBody)
        setModalListener(modalContainer, imageUrl)
    }

    return {
        render
    }
}


export default EditModal