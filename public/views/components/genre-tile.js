import { DEFAULT_IMAGE } from '../../utils/genres.js'

const styles = {
    genre: {
        container: 'genre-tile',
        title: 'genre-title',
    },
    otherGenre: {
        container: 'genre-small-tile',
        title: 'genre-subtitle  ',
    },
}

const GenreTile = ({
        type = 'genre',
        imageUrl,
        name,
        color,
    }
) => {
    const classes = styles[type]

    const render = async () => {
        const genreImage = imageUrl ? `<img loading="lazy" src="${imageUrl || DEFAULT_IMAGE}" class="genre-tile-image">` : ''
        const style = `background: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0) 100%), ${color};
        border-radius: 8px;`

        const view = `
            <a href="/#/search/${name}" class="${classes.container}" style="${style}">
                <h3 class="${classes.title}">
                    ${name}
                </h3>
                ${genreImage}
            </a>
        `

        return view
    }

    return {
        render
    }
}

export default GenreTile;