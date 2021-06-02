import RecommendationTiles from '../components/recommendation-tiles.js'
import Tiles from '../components/tiles.js'
import * as userAPI from '../../utils/api/user.js'

const Home = () => {
    const render = async () => {
        const authors = await userAPI.getAuthors()
        const tracks = await userAPI.getTracks()

        console.log(tracks)

        const [
            recent,
        ] = await Promise.all([
            Tiles().render({
                header: 'Новые релизы', 
                tilesInfo: {val: tracks}
            })
        ])
        
        const view = `
            <section>
                ${RecommendationTiles.render(authors.slice(0, 6))}
                ${recent}
            </section>
        `

        return view
    }

    const afterRender =async () => {
    }

    return {
        render,
        afterRender
    }
}

export default Home();
