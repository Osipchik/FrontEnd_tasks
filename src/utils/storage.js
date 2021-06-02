const get = (key) => {
    const value = localStorage.getItem(key)

    return JSON.parse(value)
}

const set = (key, value) => {
    const jsonValue = JSON.stringify(value)
    localStorage.setItem(key, jsonValue);
}

const remove = (key) => {
    localStorage.removeItem(key)
}

export default {
    get,
    set,
    remove,
}