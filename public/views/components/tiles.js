import Tile from './tile.js'
import GenreTile from './genre-tile.js'
import DomObserver from '../../utils/observer.js'

const tiles = {
    card: {
        call: Tile,
        class: {
            container: 'section-indent',
            tiles: 'cards-section overflow-hidden',
        },
    },
    genre: {
        call: GenreTile,
        class: {
            container: 'section-indent',
            tiles: 'cards-section cards-section-genre',
        }
    },
    otherGenre: {
        call: GenreTile,
        class: {
            container: 'section-indent',
            tiles: 'genre-tiles-container',
        }
    },
    music: {
        call: Tile,
        class: {
            container: 'music-section',
            tiles: 'music-tiles-container',
        }
    },
}

const Tiles = () => {
    let observerId
    
    const containerWithoutControls = (containerClass, tiles) => {
        if (!tiles) {
            return ''
        }

        return `
            <div id="container-with-controls" class="${containerClass}">
                ${tiles.join('\n ')}
            </div>
        `
    }

    const containerWithControls = (containerClass, tiles) => {
        return `
            <div class="cards-container">
                <button id="btn-1" class="control-button control-button-left mobile-hide">
                    <svg height="24" role="img" width="24" viewBox="0 0 24 24">
                        <polygon points="15.54,21.151 5.095,12.229 15.54,3.309 16.19,4.069 6.635,12.229 16.19,20.39 "></polygon>
                    </svg>
                </button>
                ${containerWithoutControls(containerClass, tiles)}
                <button id="btn-2" class="control-button control-button-right mobile-hide">
                    <svg height="24" role="img" width="24" viewBox="0 0 24 24">
                        <polygon points="7.96,21.151 7.311,20.39 16.865,12.229 7.311,4.069 7.96,3.309 18.405,12.229 "></polygon>
                    </svg>
                </button>
            </div>
        `
    }

    const render = async ({
        cardType = 'card',
        header,
        tilesInfo,
        hasControlButtons
    }) => {
        const currentTile = tiles[cardType]
        const toRender = tilesInfo.val?.map(tile => currentTile['call'](tile.info, cardType, tilesInfo.parent).render())
        const renderedTiles = toRender ? await Promise.all(toRender) : ''
        const contentContainer = hasControlButtons  ? containerWithControls : containerWithoutControls

        const view = `
            <section class="${currentTile.class.container || 'section-indent'}">
                <div class="mb-16">
                    <h2 class="section-subtitle text-cut-one-line">
                        ${header}
                    </h2>
                </div>
                ${contentContainer(currentTile.class.tiles, renderedTiles)}
            </section>
        `

        observerId = DomObserver.addCallbacks(afterRender)

        return view
    }

    const scrollContent = (element, direction, speed = 5, distance = 400, step = 5) => {
        let scrollAmount = 0;
        
        const slideTimer = setInterval(function(){
            if(direction == 'left'){
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }
            scrollAmount += step;
            if(scrollAmount >= distance){
                window.clearInterval(slideTimer);
            }
        }, speed);
    }

    const afterRender = async () => {
        const controlLeft = document.getElementById('btn-1')
        const controlRight = document.getElementById('btn-2')
        const el = document.getElementById('container-with-controls')

        if (el) {
            DomObserver.removeCallback(observerId)
            controlLeft?.addEventListener('click', () => scrollContent(el, 'left'))
            controlRight?.addEventListener('click', () => scrollContent(el, 'right'))
        }
    }

    return {
        render,
    }
}

export default Tiles;
