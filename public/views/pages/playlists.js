import PlaylistsInfo from '../components/playlists-info.js'
import Tile from '../components/tile.js'
import CreatePlayListButton from '../components/create-playlist-button.js'
import * as playlistAPI from '../../utils/api/playlist.js'
import pageRender from '../../index.js'

const Playlists = () => {
    let userId

    const createPlaylist = async () => {
        playlistAPI.createPlaylist(userId, 'New playlist')
        await pageRender.forceUpdate()
    }

    const render = async ({resource, id, verb}, user) => {
        userId = user.uid

        const tracks = [
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
            {
                albumImage: '',
                name: 'Wellerman - Sea Shanty',
                author: 'Nathan Evans',
                albumName: 'album',
                creationTime: 1621631709769,
                duration: 314
            },
        ]
        
        const playlists = await playlistAPI.getUserPlaylists(userId)
        const tiles = await Promise.all(playlists.val.map(playlist => Tile(playlist.info, 'playlists-tile').render()))

        const view = `
            <h2 class="section-indent section-subtitle text-cut-one-line">
                Плейлисты
            </h2>
            <div class="playlists-section">
                ${await CreatePlayListButton(createPlaylist).render('playlistButton')}
                ${await PlaylistsInfo.render({tracksCount: 10, tracks})}
                ${tiles.join('\n ')}
            </div>
        `

        return view
    }

    const afterRender = async () => {
    }

    return {
        render,
        afterRender
    }
}

export default Playlists();
