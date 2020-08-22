<template>
  <div id="app" class="app">
    <Navbar class="header"/>
    <div class="below-header">
      <Sidebar/> 
      <b-container class="content">
        <br/>
        <b-card>
          <TransactionList/>
        </b-card>
      </b-container>
    </div>
  </div>
</template>

<script lang="ts">
import Sidebar from "./containers/Sidebar.vue"
import Navbar from "./containers/Navbar.vue"
import TransactionList from "./components/TransactionList.vue"

export default {
  components: {
    Sidebar,
    Navbar,
    TransactionList
  }
}
</script>

<style>
html,body{
  background: #EEf1F4;
  font-family: 'Lato', sans-serif!important;
  height:100%;
  min-height: 100%;
  margin:0;
}
.app{
  margin: 0;
  height: 100%;
  min-height: 100%;
	display: flex;
	flex-direction: column;
}
.header{
  display: flex;
  flex-direction: column;
}
.below-header{
  display: flex;
	flex-direction: row;
  flex: 1 1 auto;
}
.content{
}
</style>