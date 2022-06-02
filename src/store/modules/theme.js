import colors from 'vuetify/lib/util/colors'

const state = {
    darkMode: JSON.parse(localStorage.getItem('projectTheme') || 'false'),
    lightTheme: {
        primary: colors.blue.darken3,
        secondary: colors.blue.lighten4,
        accent: colors.shades.black,
        error: colors.red.accent3,
        success: colors.green.darken3,
        warning: colors.orange.darken1,
        info: colors.blue.lighten1
    },
    selectedTheme: "default"
};

const mutations = {
    setDarkMode(state, payload) {
        localStorage.setItem('projectTheme', payload)
        state.darkMode = payload;
    },
    setTheme(state, payload) {
        state.selectedTheme = payload.selectedTheme;
        delete payload['selectedTheme'];
        state.lightTheme = payload;
    }
};

const getters = {
    getDarkMode(state) {
        return JSON.parse(state.darkMode);
    },
    getTheme(state) {
        return state.lightTheme;
    },
    getSelectedTheme(state) {
        return state.selectedTheme;
    }
};

const actions = {
    darkModeAction(context, payload) {
        context.commit('setDarkMode', payload)
    },
    setThemeAction(context, payload) {
        context.commit('setTheme', payload)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};