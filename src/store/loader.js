import AssetsLoader from '../game/assetsLoader'

export default {
    namespaced: true,
    state: {
        progress: 0,
        isLoaded: false,
        assets: {}
    },
    mutations: {
        assetsLoaded(state, assets) {
            state.isLoaded = true;
            state.assets = assets;
        }
    },
    actions: {
        async preloadAssets({ commit, state }) {
            this.loader = new AssetsLoader();
            this.loader.onLoad = progress => state.progress = progress;
            commit('assetsLoaded', await this.loader.loadAssets());
        }
    }
}