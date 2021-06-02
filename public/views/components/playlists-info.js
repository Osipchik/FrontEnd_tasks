const PlaylistsInfo = {
    trackCounter(tracksCount) {
        if (tracksCount) {
            return `
                <span class="statistic-info">
                    ${tracksCount} любимые треки
                </span>
            `
        }

        return ''
    },

    async render ({tracksCount, tracks = []}) {
        const view = `
            <div class="playlists-info-container mobile-hide">
                <div class="recent-container">
                    <div class="recent-tracks">
                        ${tracks.map(track => `
                            <span>
                                <span class="recent-author">
                                    ${track.author}
                                </span>
                                <span class="recent-track">
                                    ${track.name}
                                </span>
                            </span>
                        `).join('\n ')}
                    </div>
                </div>

                <div class="playlist-statistic-container">
                    <h2 class="statistic-title">
                        Любимые треки
                    </h2>
                    ${this.trackCounter(tracksCount)}
                </div>
            </div>
        `

        return view
    },
}

export default PlaylistsInfo