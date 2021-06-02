const ErrorPage = () => {
    const render = async () => {
        const view = `
            <div class="centre empty-container">
                <h1 class="empty-title">
                    Опаньки...
                </h1>
                <p class="empty-info">
                    похоже тут ничего нет, давайте вернемся 
                    <a href="/">
                        домой
                    </a>
                </p>
            </div>
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

export default ErrorPage();
