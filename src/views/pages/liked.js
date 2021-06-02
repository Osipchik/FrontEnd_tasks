import PlaylistHeader from '../components/playlist-header.js'
import TrackList from '../components/track-list.js'
import componentsHelper from '../../utils/componentsHelper.js'
import * as albumAPI from '../../utils/api/album.js'
import * as playlistAPI from '../../utils/api/playlist.js'
import * as userAPI from '../../utils/api/user.js'
import EditModal from '../components/edit-modal.js'
import AddTrackModal from '../components/add-track-modal.js'
import routeHelper from '../../utils/routeHelper.js'
import storageHelper from '../../utils/api/storage.js'
import pageRender from '../../index.js'
import AddToPlaylistModal from '../components/add-to-playlist-modal.js'

const Liked = () => {
    let userId
    let playlistInfo = {}
    const routeData = {}
    let playlistTracksList

    const click = () => console.log('click')

    const savePlaylistChanges = async (image, data) => {
        const imageUrl = await storageHelper.uploadImage(image)
        data.imageUrl = imageUrl || data.imageUrl

        const trackData = {
            albumName: data.name,
            albumImage: data.imageUrl,
        }
        
        const playlistUpdate = playlistInfo.type === 'playlist'
            ? playlistAPI.updateUserPlaylist(userId, routeData.id, routeData.resource, data)
            : playlistAPI.updateUserPlaylist(userId, routeData.verb, routeData.resource, data)

        await Promise.all([
            playlistAPI.updatePlaylistTracks(userId, routeData.verb, playlistInfo.type, trackData),
            userAPI.updateUsersTracks(trackData, trackData.albumId),
            playlistUpdate
        ])

        await pageRender.forceUpdate()
        
        return true
    }

    const saveTrack = async (track) => {
        const data = {
            ...track,
            albumName: playlistInfo.name,
            albumImage: playlistInfo.imageUrl,
            authorName: playlistInfo.authorName,
        }

        albumAPI.createTrack(userId, playlistInfo.id, data)

        await pageRender.forceUpdate()

        return true
    }

    const editPlaylist = () => {
        EditModal(playlistInfo, savePlaylistChanges).render('Изменить альбом')
    }

    const editTrack = async (data) => {
        await Promise.all([
            albumAPI.updateTrack(userId, playlistInfo.id, data),
            userAPI.updateUsersTracks(data, data.id)
        ])

        await pageRender.forceUpdate()

        return true
    }

    const onEditTrack = (track) => {
        AddTrackModal(editTrack, track).render(track.albumImage)
    }

    const createTrack = () => {
        AddTrackModal(saveTrack).render(playlistInfo.imageUrl)
    }

    const addToPlaylist = (track) => {
        AddToPlaylistModal(track, async (playlistId) => {
            if (playlistId) {
                await playlistAPI.addTrackToPlaylist(track, playlistId, userId)
            }

            return true
        }).render()
    }

    const removePlaylist = async () => {
        await playlistAPI.removePlaylist(userId, playlistInfo.id)
        await pageRender.forceUpdate()

        window.location.hash = ''
    }

    const removeTrack = async (track) => {
        await playlistAPI.removePlaylistTrack(userId, playlistInfo.id, track.id)
        await pageRender.forceUpdate()
    }

    const render = async ({resource, id, verb}, user) => {
        userId = user?.uid
        componentsHelper.setFullscreenStyle()

        const playlist = resource === 'author' 
            ? await playlistAPI.getUserPlaylist(id, verb, resource)
            : await playlistAPI.getUserPlaylist(userId, id, resource)
 
        if (!playlist.val) {
            return '/404'
        }

        playlistInfo = playlist.val?.info
        routeHelper.setRouteData(routeData, {resource, id, verb, uid: user?.uid})
        const tracks = Object.values(playlist.val?.tracks || {})
        const controls = componentsHelper.getControls(user, playlist, click, editPlaylist, createTrack, removePlaylist)

        const isTracksEditable = playlistInfo.type === 'album' && user?.uid === playlist.parent

        playlistTracksList = TrackList({
            tracks, 
            showHead: playlistInfo.type === 'playlist', 
            editTrack: isTracksEditable && onEditTrack,
            removeTrack: playlistInfo.type === 'playlist' && removeTrack,
            addToPlaylist: user?.uid && addToPlaylist,
        })

        const [
            playlistHeader,
            playlistControls,
            trackList,
            ] = await Promise.all([
                PlaylistHeader.render(playlistInfo, playlist.parent),
                controls.render({
                    buttonText: 'Изменить',
                    secondButtonText: playlistInfo.type === 'playlist' ? 'Удалить плейлист' : 'Добавить трек',
                    color: playlistInfo?.color
                }),
                playlistTracksList.render(),
            ])

        const view = `
            <section class="liked-container">
                ${playlistHeader}
                ${playlistControls}
                ${trackList}
            </section>
        `

        return view
    }

    const afterRender = async () => {
        playlistTracksList.afterRender()
    }

    return {
        render,
        afterRender
    }
}

export default Liked();