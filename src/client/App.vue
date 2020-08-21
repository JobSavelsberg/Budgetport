<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Vuetify</span>
        <span class="font-weight-light">MATERIAL DESIGN</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
      >
        <span class="mr-2">Latest Release</span>
      </v-btn>
    </v-app-bar>
  </v-app>
</template>

<script lang="ts">
import { Vue, Prop, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
@Component({
  components: {}
})
export default class AppView extends Vue {}
</script>