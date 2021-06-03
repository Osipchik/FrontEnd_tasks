const Player = ({
    albumImage,
    name,
    authorName,
    trackUrl,
}) => {
    const view = `
            <div class="player-track-container">
                <img loading="lazy" src="${albumImage || DEFAULT_IMAGE}" 
                class="player-track-image">
                <div class="player-track-info-container">
                    <p class="player-track-name text-cut-one-line">
                        ${name}
                    </p>
                    <a href="#" class="player-author text-cut-one-line">
                        ${authorName}
                    </a>
                </div>
            </div>
            <figure class="audio">
                <audio
                    id="audio"
                    class="audio-controls"
                    controls
                    src="${trackUrl}">
                        Your browser does not support the
                        <code>audio</code> element.
                </audio>
            </figure>
        `
    
    const playerElement = document.getElementById('player')
    playerElement.innerHTML = view
    playerElement.classList.remove('player-hide')
}

export default Player;