const parseRequestURL = () => {
    const url = location.hash.slice(1).toLowerCase() || '/'
    const r = url.split("/")

    const request = {
        resource    : null,
        id          : null,
        verb        : null
    }

    request.resource = r[1]
    request.id = r[2]
    request.verb = r[3]

    return request
}

const setRouteData = (routeData, data) => {
    routeData.resource = data.resource
    routeData.id = data.id
    routeData.verb = data.verb
    routeData.uid = data.uid
}

const rootTypes = {
    album: 'author',
    author: 'author',
    playlist: 'playlist',
}

const getUrl = (type, authorId, id) => {
    const rootNode = rootTypes[type] || 'author'

    if (authorId) {
        return `/#/${rootNode}/${authorId}/${id}`
    }

    return `/#/${rootNode}/${id}`
}

export default {
    parseRequestURL,
    setRouteData,
    getUrl,
}