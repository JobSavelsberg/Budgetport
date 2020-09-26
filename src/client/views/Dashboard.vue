<template>
  <v-layout
        fill-height fluid align-center justify-center column> 
        <v-flex row align-center>
         <h1 class="text-h1">Welcome, {{$store.state.user.data.displayName}}!</h1>
        </v-flex>
      </v-layout>
</template>

<script>
export default {
  data () {
    return {
      placeholder: 1,
    }
  },

}
</script>