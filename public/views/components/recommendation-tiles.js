import RecommendationTile from './recommendation-tile.js'
import componentsHelper from '../../utils/componentsHelper.js'

const RecommendationTiles = {
    render (recommendations) {
        const greeting = componentsHelper.getGreeting()

        const renderedList = recommendations.map(recommendation => RecommendationTile(recommendation.info).render())

        const view = `
            <section class="section-indent">
                <div class="mb-16 mobile-hide">
                    <h2 class="section-title text-cut-one-line">
                        ${greeting}
                    </h2>
                </div>
                <div class="grid-container">
                    ${renderedList.join('\n ')}
                </div>
            </section>
        `

        return view
    },
}

export default RecommendationTiles