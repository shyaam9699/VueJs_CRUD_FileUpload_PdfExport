import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'
import "bootstrap/dist/css/bootstrap.min.css"
import store from "../store/index"

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: store.getters.getTheme,
            dark: {
                primary: colors.grey.darken2,
                secondary: colors.grey.lighten3,
                accent: colors.shades.black,
                error: colors.red.accent3,
            },
        },
    },
});
