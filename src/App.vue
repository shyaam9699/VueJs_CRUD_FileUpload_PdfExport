<template>
  <v-app class="h-100">
    <v-main>
      <router-view />
    </v-main>
    <v-snackbars :objects.sync="objects" top right>
      <template v-slot:default="{ message }">
        <h5 class="mb-2">{{ message.type }}</h5>
        {{ message.msg }}
      </template>
      <template v-slot:action="{ close }">
        <v-btn icon @click="close()"> <v-icon>mdi-close</v-icon></v-btn>
      </template>
    </v-snackbars>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import VSnackbars from "v-snackbars";

export default {
  name: "App",
  components: { VSnackbars },
  data: () => ({
    objects: [],
  }),
  computed: {
    snackbarState() {
      return this.$store.getters.getSnackbarStatus;
    },
    themeMode() {
      return this.$store.getters.getDarkMode;
    },
  },
  methods: {
    ...mapActions(["CloseSnachbar"]),
  },
  watch: {
    snackbarState: {
      immediate: true,
      deep: false,
      handler(newValue) {
        this.objects = newValue;
      },
    },
    objects(newValue) {
      this.CloseSnachbar(newValue);
    },
    themeMode: {
      immediate: true,
      handler(newVal) {
        this.$vuetify.theme.dark = newVal;
      },
    },
  },
};
</script>

<style lang="scss">
@import "assets/scss/style";
body {
  margin: 0 !important;
  width: 100%;
  height: 100%;
}

html {
  overflow-y: auto !important;
}

.sticky-top {
  position: sticky !important;
  z-index: 50 !important;
}

// <!-- Navigation List -->
.nav-list.v-list-group--active
  > .v-list-group__header
  > .v-list-group__header__append-icon
  .v-icon {
  transform: rotate(0deg) !important;
}
.nav-list.v-list-group
  > .v-list-group__header
  > .v-list-group__header__append-icon
  .v-icon {
  transform: rotate(-90deg);
}
// <!-- Navigation List -->

// <!-- Card -->
.theme--dark.v-card:not(.colored-card) {
  background-color: rgba(79, 76, 76, 0.31) !important;
}
// <!-- Card -->

// <!-- Badge With Icon -->
.v-badge__badge .v-icon {
  color: inherit !important;
  font-size: 12px !important;
  height: 12px !important;
  margin: 0 -2px !important;
  width: 12px !important;
}
// <!-- Badge With Icon -->

// <!-- Input Usage -->
#input-usage .v-input__prepend-outer,
#input-usage .v-input__append-outer,
#input-usage .v-input__slot,
#input-usage .v-messages {
  border: 1px dashed rgba(0, 0, 0, 0.4) !important;
}
// <!-- Input Usage -->

// <!-- Button -->
.v-btn {
  text-transform: none !important;
}
// <!-- Button -->

</style>
