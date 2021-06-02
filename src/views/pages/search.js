import { getGenres } from '../../utils/api/index.js'
import pageRender from '../../index.js'
import Tile from '../components/tile.js'
import Tiles from '../components/tiles.js'
import TrackList from '../components/track-list.js'
import * as searchAPI from '../../utils/api/search.js'

const Search = () => {
    const renderSearchInput = () => {
        const container = document.createElement('div')
        container.classList.add('search-container')
        container.innerHTML = `
            <div class="icon">
                <svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M349.714 347.937l93.714 109.969-16.254 13.969-93.969-109.969q-48.508 36.825-109.207 36.825-36.826 0-70.476-14.349t-57.905-38.603-38.603-57.905-14.349-70.476 14.349-70.476 38.603-57.905 57.905-38.603 70.476-14.349 70.476 14.349 57.905 38.603 38.603 57.905 14.349 70.476q0 37.841-14.73 71.619t-40.889 58.921zM224 377.397q43.428 0 80.254-21.461t58.286-58.286 21.461-80.254-21.461-80.254-58.286-58.285-80.254-21.46-80.254 21.46-58.285 58.285-21.46 80.254 21.46 80.254 58.285 58.286 80.254 21.461z" fill="currentColor" fill-rule="evenodd"></path>
                </svg>
            </div>
            <input id="search-input" class="search-input"/>
        `

        return container
    }

    const render = async () => {
        const topGenres = await Tiles().render({
            cardType: 'genre',
            hasControlButtons: true,
            header: 'Топ жанров', 
            tilesInfo: await getGenres('topGenres'),
        })

        const otherGenres = await Tiles().render({
            cardType: 'otherGenre',
            header: 'Все остальное', 
            tilesInfo: await getGenres('allGenres')
        })
        
        const view = `
            <section>
                ${topGenres}
                ${otherGenres}
            </section>
        `

        if (!document.getElementById('search-input')) {
            document.getElementById('search-group').appendChild(renderSearchInput())
        }
        
        return view
    }

    const renderBestResult = async (data) => {
        const tile = await Tile(data.info || data, 'music').render()

        return `
            <section class="section-indent">
                <div class="mb-16">
                    <h2 class="section-subtitle text-cut-one-line">
                        Лучшее совпадение
                    </h2>
                </div>
                <div class="search-best">
                    ${tile}
                </div>
            </section>
        `
    }

    const renderSearchResult = async ({authors, albums, tracks, best}) => {
        const tracksResult = TrackList({tracks, showHead:false})
        const renderList = []

            if (best) {
                const bestResultRender = await renderBestResult(best)
                renderList.push(bestResultRender)
            } 
            
            if (albums.length !== 0) {
                const albumTiles = await Tiles().render({
                    cardType: 'music',
                    header: 'Альбомы', 
                    tilesInfo: {val: albums},
                })

                renderList.push(albumTiles)
            }

            if (authors.length !== 0) {
                const albumTiles = await Tiles().render({
                    cardType: 'music',
                    header: 'Исполнители', 
                    tilesInfo: {val: authors}
                })
                renderList.push(albumTiles)
            } 
            
            if (tracks.length !== 0) {
                renderList.push(await tracksResult.render())
            }

            if (renderList.length !== 0) {
                document.getElementById('main').innerHTML = `
                    <div class="sections-gap">
                        ${renderList.join('\n')}
                    </div>
                `

                tracksResult.afterRender()
            } else {
                document.getElementById('main').innerHTML = `
                    <div class="centre empty-container">
                        <h1 class="empty-title">
                            По запросу «${searchValue}» ничего не найдено
                        </h1>
                        <p class="empty-info">
                            Проверь, нет ли опечаток, сократи запрос или перефразируй его.
                        </p>
                    </div>
                `
            }
    }

    const afterRender = async () => {
        document.getElementById('search-input').oninput = async (event) => {
            const searchValue = event.target.value

            if (!Boolean(searchValue)) {
                await pageRender.forceUpdate(false)
                return 0
            }

            searchAPI.searchData(searchValue, renderSearchResult)
        }
    }

    return {
        render,
        afterRender,
    }
}

export default Search()
