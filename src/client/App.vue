<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-briefcase</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Budgets</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-receipt</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transactions</v-list-item-title>
          </v-list-item-content>
        </v-list-item> 
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Budgetport</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <TransactionTable/>
      <!--<v-container class="fill-height" fluid> </v-container>-->
    </v-main>

    <v-footer app>
      <div class="caption">Budgetport by Job Savelsberg &copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
import TransactionTable from "./components/TransactionTable.vue"
import api from "./services/initAxios"

export default {
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
  }),
  beforeMount() {
    /*api().get("/transactions/all").then((res: any) => {
      console.log(res);
    }).catch((err: any) => {
      console.log(err);
    });*/
    console.log("Poop");
  },
  mounted() {
    console.log("mounted");
  },
  created () {
    this.$vuetify.theme.dark = true
  },
  destroyed(){
    console.log("bye");
  },
  components: {
    TransactionTable
  }
}
</script>

<style>

</style>