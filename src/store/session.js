export default {
    namespaced: true,
    // содержимое модуля
    state: () => ({
        gamemode: ''

    }), // состояние модуля автоматически вложено и не зависит от опции пространства имён
    getters: {
        isAdmin() { } // -> getters['account/isAdmin']
    },
    actions: {
        login() { } // -> dispatch('account/login')
    },
    mutations: {
        setGamemode(state, mode) { state.gamemode = mode } // -> commit('session/setGamemode')
    },

    // вложенные модули
    modules: {
        // наследует пространство имён из родительского модуля
        // gamemode: {
        //     namespaced: true,
        //     state: () => ({
        //         mode: String // single, pvp_local, pvp_internet
        //     }),
        //     mutations: {
        //         set(state, mode) { state.mode = mode } // -> commit('session/gamemode/set')
        //     },
        // },

        // большая вложенность с собственным пространством имён
        posts: {
            namespaced: true,

            state: () => ({}),
            getters: {
                popular() { } // -> getters['account/posts/popular']
            }
        }
    }
}