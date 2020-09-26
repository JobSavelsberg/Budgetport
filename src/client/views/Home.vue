<template>
<div>
<v-navigation-drawer class="test" v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item link @click="view='dashboard'">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="view='budgets'">
          <v-list-item-action>
            <v-icon>mdi-briefcase</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Budgets</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="view='transactions'">
          <v-list-item-action>
            <v-icon>mdi-receipt</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Transactions</v-list-item-title>
          </v-list-item-content>
        </v-list-item> 
        <v-list-item link @click="view='settings'">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
      <v-footer inset app>
        <div class="caption">Budgetport by Job Savelsberg &copy; {{ new Date().getFullYear() }}</div>
      </v-footer>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Budgetport</v-toolbar-title>
        <v-spacer></v-spacer>
        <h1  v-if="!isLoading"class="text-subtitle-1">{{$store.state.user.data.displayName}}</h1>
        <v-btn  v-if="!isLoading" @click="logout">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>

    <v-main>
        <v-alert v-if="error" type="error">
            {{error}}
        </v-alert>
      <v-alert v-if="failedToLoad" type="error">
        Failed to connect to database.
      </v-alert>
      <v-layout v-if="isLoading"
        fill-height fluid align-center justify-center column> 
        <v-flex row align-center>
          <v-progress-circular 
            :size="150"
            :width="15"
            color="grey"
            indeterminate
          ></v-progress-circular>
        </v-flex>
      </v-layout>
      <Dashboard v-if="isLoading === false && view==='dashboard'" />
      <Budgets v-if="isLoading === false && view==='budgets'" />
      <Transactions v-if="isLoading === false && view==='transactions'" />
      <Settings v-if="isLoading === false && view==='settings'" />

    </v-main>
</div>
</template>

<script>
import {init} from "../app/app";

import Dashboard from "./Dashboard.vue"
import Transactions from "./Transactions.vue"
import Budgets from "./Budgets.vue"
import Settings from "./Settings.vue"
import firebase from "firebase";

export default {
    name: "Home",
  props: {
    source: String,
  },
  data () {
    return {
      drawer: null,
      isLoading: true,
      failedToLoad: false,
      view: "dashboard",
      error: null,
    }
  },
  beforeCreate() {
    firebase.auth().onAuthStateChanged(user => {
        if(user){
            init().then(() => {
                this.isLoading = false;
            }).catch(() =>{
                this.failedToLoad = true;
            })
        }else{
            this.$router.replace({name: "Login"})
        }
    });   
  },
  created () {
    console.log("created()");
  },
  destroyed(){
    console.log("bye");
  },
  methods:{
    logout(){
        const self = this;
        firebase.auth().signOut().then(function() {
        }, function(error) {
            this.error = error;
        });
    },
  },
  components: {
    Dashboard,
    Transactions,
    Budgets,
    Settings,
  }
}
</script>

<style>
.numberInput input[type=number] {
    -moz-appearance:textfield;
}
.numberInput input[type=number]::-webkit-inner-spin-button, 
.numberInput input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 0; 
}
</style>