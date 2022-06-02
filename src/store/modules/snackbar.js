const state = {
    snackbar: [],
};

const mutations = {
    setSnackbarMode(state, payload) {
        state.snackbar.push(payload);
    },
    resetSnackbar(state, payload) {
        state.snackbar = payload;
    }
};

const getters = {
    getSnackbarStatus(state) {
        return state.snackbar;
    },
};

const actions = {
    OpenSnackbar(context, payload) {
        context.commit('setSnackbarMode', payload);
    },
    CloseSnachbar(context, payload) {
        context.commit('resetSnackbar', payload);
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};