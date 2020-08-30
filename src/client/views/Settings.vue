<template>
  <div class="settingsPage">
    <h1 class="text-h3 text-center">Settings</h1>
    <v-col cols="6">
      <v-form ref="YNABform" v-model="YNABvalid">
        <h1 class="text-h5">YNAB Import</h1>
        <v-divider></v-divider>
        <v-file-input
          v-model="budgetsFile"
          :rules="[v => v!==undefined || 'You must supply a budgets file!']"
          label="Budget File"
          filled
          prepend-icon="mdi-briefcase"
          required
        ></v-file-input>
        <v-file-input
          v-model="registerFile"
          :rules="[v => v!==undefined || 'You must supply a register file!']"
          label="Register File"
          filled
          prepend-icon="mdi-receipt"
          required
        ></v-file-input>
        <v-btn 
          :disabled="!YNABvalid"
          color="success"
          class="mr-4"
          @click="importYNAB">Import</v-btn>
      </v-form>
    </v-col>
    
  </div>
</template>

<script>
import {importYNAB} from "../app/YNABImport";

export default {
  data () {
    return {
      YNABvalid: true,
      budgetsFile: undefined,
      registerFile: undefined,
      placeholder: 1,
    }
  },
  methods:{
    importYNAB() {
      this.$refs.YNABform.validate();
      console.log("Importing YNAB");
      importYNAB(this.budgetsFile, this.registerFile);
    }
  }
}
</script>

<style>
.settingsPage{
  margin-top: 10px;
}
</style>