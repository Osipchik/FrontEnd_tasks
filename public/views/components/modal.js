const Modal = (title, body) => {
    const view = `
            <div class=modal-container>
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">
                            ${title}
                        </h2>
                        <button id="modal-close" class="modal-close-button">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.929688 15.0699L15.0697 0.929932M0.929688 0.929932L15.0697 15.0699L0.929688 0.929932Z" stroke="#B3B3B3" stroke-miterlimit="10"/>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${body}
                        <button id="modal-save" class="modal-save-button">
                            Сохранить
                        </button>
                    </div>
                </div>
            </div>
        `

    return view

}


export default Modal