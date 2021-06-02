import Tiles from '../components/tiles.js'
import PlaylistControls from '../components/playlist-controls.js'
import PlaylistHeader from '../components/playlist-header.js'
import componentsHelper from '../../utils/componentsHelper.js'
import * as searchAPI from '../../utils/api/search.js'
import { 
    GENRES,
    GENRES_DECORATIONS,
} from '../../utils/genres.js'

const Genre = () => {
    let genre

    const render = async ({resource, id, verb}) => {
        componentsHelper.setFullscreenStyle()
        genre = id.toLowerCase()

        if (!GENRES.includes(genre) && 'space-rock' !== genre) {
            window.location.hash = '/'
        }

        const decorations = GENRES_DECORATIONS[genre]

        const [
            playlistHeader,
            playlistControls,
        ] = await Promise.all([
            PlaylistHeader.render({
                name: decorations.name, 
                type: 'genre', 
                color: decorations.color
            }),
            PlaylistControls().render({color: decorations.color}, true),
        ])
        
        const view = `
            <section class="liked-container">
                ${playlistHeader}
                ${playlistControls}
                <div id="tracks">

                </div>
            </section>
        `

        return view
    }

    const afterRender = async () => {
        searchAPI.getTracksByGenre(genre, async (tracks) => {
            const tracksElement = document.getElementById('tracks')
            if (tracksElement) {
                tracksElement.innerHTML = await Tiles().render({
                    cardType: 'music',
                    header: 'Новые релизы', 
                    tilesInfo: {val: tracks},
                })
            }
        })
    }

    return {
        render,
        afterRender
    }
}

export default Genre();
