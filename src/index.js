'use strict';

import Home from './views/pages/home.js'
import Liked from './views/pages/liked.js'
import Playlists from './views/pages/playlists.js'
import Search from './views/pages/search.js'
import Author from './views/pages/author.js'
import Genre from './views/pages/genre.js'
import ErrorPage from './views/pages/error-page.js'
import Header from './views/components/header.js'
import DesktopNavbar from './views/components/desktop-navbar.js'
import MobileNavbar from './views/components/mobile-navbar.js'
import routeHelper from './utils/routeHelper.js'
import componentsHelper from './utils/componentsHelper.js'
import History from './store/history.js'
import UserStore from './store/user.js'

const firebaseConfig = {
    apiKey: "AIzaSyCly8Bd4HXvU7PHFtkH9iyo784HYN9QLHU",
    authDomain: "spotify-db1cf.firebaseapp.com",
    projectId: "spotify-db1cf",
    storageBucket: "spotify-db1cf.appspot.com",
    messagingSenderId: "410564688987",
    appId: "1:410564688987:web:39c90092a57b309da6537e"
  };

 firebase.initializeApp(firebaseConfig);

const routes = {
    '/': {
        page: Home,
    },
    '/liked': {
        page: Liked,
        isPrivate: true,
    },
    '/playlists': {
        page: Playlists,
        isPrivate: true,
    },
    '/playlist/:id': {
        page: Liked,
        isPrivate: true,
    },
    '/search': {
        page: Search,
    },
    '/search/:id': {
        page: Genre,
    },
    '/author/:id': {
        page: Author,
    },
    '/author/:id/:verb': {
        page: Liked,
    },
    '404': {
        page: ErrorPage,
    }
}

const elem = {
    'desktop-navbar': false,
    'mobile-navbar': false,
}

const renderOnce = async (elementName, render, isForce) => {
    if (!elem[elementName] || isForce) {
        const el = document.getElementById(elementName)
        el.innerHTML = await render()
        elem[elementName] = true
    }
}

const router = async (isForce = false, changeHeader = true) => {
    const request = routeHelper.parseRequestURL()
    const parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/:verb' : '')
    const user = UserStore.getUser()

    componentsHelper.setDefaultStyle()   

    History.updateHistory()
    

    const header = document.getElementById('header')
    const content = document.getElementById('main')

    const routeComponents = routes[parsedURL] || routes['404']

    renderOnce('desktop-navbar', DesktopNavbar.render, isForce)
    renderOnce('mobile-navbar', MobileNavbar.render)

    if (changeHeader) {
        header.innerHTML = await Header.render()
    }

    if (routeComponents.isPrivate && !user) {
        content.innerHTML = await Home.render()
        await Home.afterRender()
    } else {
        const pageResult = await routeComponents.page.render(request, user)
        if (pageResult === '/404') {
            window.location.hash = '/404'
        }
        if (pageResult) {
            content.innerHTML = pageResult
            await routeComponents.page.afterRender()
        }
    }
} 

const forceUpdate = async (changeHeader = true) => {
    await router(true, changeHeader)
}

export default {
    forceUpdate
}

firebase.auth().onAuthStateChanged(async user => {
    if (user) {
        const {displayName, photoURL, refreshToken, uid} = user;
        UserStore.setUser({displayName, photoURL, refreshToken, uid})
        await router()
    } else {
        window.location.hash = ''
    }
})

window.addEventListener('hashchange', router)
window.addEventListener('load', router)

document.getElementById('main-container').addEventListener('scroll', function(e) {
    const element = document.getElementById('main-container')
    if (element.scrollTop >= 60) {
        document.getElementById('header').classList.add('dark-header')
    } else {
        document.getElementById('header').classList.remove('dark-header')
    }
});
