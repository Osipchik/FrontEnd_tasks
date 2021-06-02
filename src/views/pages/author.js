import AuthorHeader from '../components/author-header.js'
import PlaylistControls from '../components/playlist-controls.js'
import TrackList from '../components/track-list.js'
import Tiles from '../components/tiles.js'
import componentsHelper from '../../utils/componentsHelper.js'
import routeHelper from '../../utils/routeHelper.js'
import * as albumAPI from '../../utils/api/album.js'
import * as playlistAPI from '../../utils/api/playlist.js'
import * as userAPI from '../../utils/api/user.js'
import storageHelper from '../../utils/api/storage.js'
import EditModal from '../components/edit-modal.js'
import AddToPlaylistModal from '../components/add-to-playlist-modal.js'
import pageRender from '../../index.js'
import { DEFAULT_IMAGE } from '../../utils/genres.js'

const Author = () => {
    const routeData = {}
    let userId
    let pageInfo
    let recentTracksList

    const click = () => {

    }

    const createUserAlbum = async (image, data) => {
        const imageUrl = await storageHelper.uploadImage(image)
        data.imageUrl = imageUrl || data.imageUrl || ''

        albumAPI.createAlbum(routeData.uid, {...data, authorName: pageInfo.name})

        await pageRender.forceUpdate()

        return true
    }

    const openModal = () => {
        EditModal({name: 'Новый альбом', description: ''}, createUserAlbum).render('Добавить альбом')
    }

    const editPage = () => {
        EditModal(pageInfo || {}, async (image, data) => {    
            const imageUrl = await storageHelper.uploadImage(image)
            data.imageUrl = imageUrl || data.imageUrl
            await userAPI.updateUserPage(routeData.uid, data)
            
            await pageRender.forceUpdate()

            return true
        }).render('Редоктировать', true)
    }

    const addToPlaylist = (track) => {
        AddToPlaylistModal(track, async (playlistId) => {

            if (playlistId) {
                await playlistAPI.addTrackToPlaylist(track, playlistId, userId)
            }

            return true
        }).render()
    }

    const render = async ({resource, id, verb}, user) => { 
        userId = user?.uid  
        componentsHelper.setFullscreenStyle()
        if (id === 'me' && userId) {
            id = userId
        }

        const [
            userPageInfo,
            albums,
        ] = await Promise.all([
            userAPI.getUserPage(id),
            playlistAPI.getUserPlaylists(id, 'albums'),
        ])

        if (!userPageInfo) {
            return '/404'
        }

        pageInfo = userPageInfo

        routeHelper.setRouteData(routeData, {resource, id, verb, uid: id})

        const tracksList = albums.val.reduce((accumulator, i) => {
            return i.tracks ? accumulator.concat(Object.values(i.tracks)) : accumulator
        }, []).slice(0, 5)

        const tiles = await Tiles().render({
            cardType: 'music',
            header: 'Музыка', 
            tilesInfo: albums
        })

        const controlButtons = {
            buttonText: 'Добавить альбом',
            secondButtonText: 'Изменить',
            color: pageInfo?.color,
        }

        recentTracksList = TrackList({
            tracks: tracksList, 
            showHead: false, 
            addToPlaylist: user?.uid && addToPlaylist
        })
        
        const view = `
            <section class="liked-container">
                ${await AuthorHeader.render(pageInfo?.name, pageInfo?.imageUrl)}
                ${await PlaylistControls(click, openModal, editPage).render(controlButtons)}
                ${await recentTracksList.render()}
                ${tiles}
            </section>
        `

        return view
    }

    const afterRender = async () => {
        recentTracksList.afterRender()
    }

    return {
        render,
        afterRender
    }
}

export default Author();