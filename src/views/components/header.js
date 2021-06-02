import Auth from '../../utils/auth.js'
import UserStore from '../../store/user.js'
import History from '../../store/history.js'
import DomObserver from '../../utils/observer.js'
import componentsHelper from '../../utils/componentsHelper.js'
import { DEFAULT_IMAGE } from '../../utils/genres.js'

const Header = () => {
    let observerId

    const renderUserButton = async ({displayName, photoURL = DEFAULT_IMAGE}) => {
        return `
            <button id="options-button" class="options-button">
                <img src="${photoURL}" class="avatar"/>
                <span class="user-name">
                    ${displayName}
                </span>
                <svg height="16" width="16" viewBox="0 0 16 16" class="options-arrow">
                    <path d="M3 6l5 5.794L13 6z"></path>
                </svg>
            </button>
            <div id="sign-out-menu" class="header-menu-container display-none">
                <div class="header-menu-button">
                    <a href="/#/author/me">
                        Моя страница
                    </a>
                </div>
                <button id="sign-out-button" class="header-menu-button">
                    Выйти
                </button>
            </div>
        `
    }

    const renderSignInButton = async () => {
        return `
            <button id="sign-in-button" class="options-button">
                <span class="user-name">
                    Войти
                </span>
            </button>
        `
    }

    const render = async () => {
        const user = UserStore.getUser()
        const button = user ? renderUserButton(user) : renderSignInButton()

        const view = `
            <div id="search-group" class="search-group">
                <div class="header-buttons-container mobile-hide">
                    <button id="go-back" class="header-nav-button">
                        <svg role="img" focusable="false" height="24" width="24" viewBox="0 0 24 24">
                            <polyline points="16 4 7 12 16 20" fill="none" stroke="#B3B3B3"></polyline>
                        </svg>
                    </button>
                    <button id="go-forward" class="header-nav-button">
                        <svg role="img" focusable="false" height="24" width="24" viewBox="0 0 24 24">
                            <polyline points="8 4 17 12 8 20" fill="none" stroke="#B3B3B3"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
            <div id="options-group">
                ${await button}
            </div>
        `

        observerId = DomObserver.addCallbacks(afterRender)

        return view
    }

    
    const auth = async () => {
        const user = await Auth.signIn()
        UserStore.setUser(user)
    }

    const afterRender = async () => {
        const goBack = document.getElementById('go-back')
        const goForward = document.getElementById('go-forward')
        const optionsButton = document.getElementById('options-button')
        const signInButton = document.getElementById('sign-in-button')

        if (!goBack) {
            return null
        }

        DomObserver.removeCallback(observerId)

        if (optionsButton) {
            optionsButton.onclick = () => componentsHelper.popup('sign-out-menu').showPopup()
            const signOutButton = document.getElementById('sign-out-button')
            signOutButton.onclick = Auth.signOut
        } else {
            signInButton.onclick = auth
        }

        goBack.disabled = !History.canGoBack()
        goBack.onclick = () => History.goBack()

        goForward.disabled = !History.canGoForward()
        goForward.onclick = () => History.goForward()
    }

    return {
        render,
    }
}

export default Header()