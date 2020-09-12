<template>
<div>
    <v-card flat dark>
        <div class="d-flex justify-center">
            <v-row>
                <v-col class="ml-5">
                    <h1 >Balance: </h1>
                </v-col>
                <v-col class="balance justify-center">
                    <h1 :class="(selectedBalance >= 0 ? 'success' : 'warning') + '--text'" >{{selectedBalance | formatNumberMoney}}</h1>
                </v-col>
            </v-row>
        </div>
    </v-card>
    <v-card>
        <v-toolbar flat dark>
            <v-toolbar-title>Transactions</v-toolbar-title>
            <v-spacer></v-spacer>
             <v-spacer></v-spacer>
  
            <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
            </v-btn>
    
            <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>

            <template v-slot:extension>
                <v-tabs
                dark
                v-model="selectedId"
                @change="changedTab"
                >
                    <v-tab
                    v-for="deposit in deposits"
                    :key="deposit.id"
                    >
                    {{ deposit.name }}
                    </v-tab>
                </v-tabs>
            </template>
        </v-toolbar>
    </v-card>
</div>
    
</template>

<script>
import * as db from "../app/db";

export default {
    props: [
        'value'
    ],
  data () {
    return {
      deposits: [{id: -1, name: "all"}],
      selectedId: 0,
    }
  },
  computed: {
      selectedDeposit(){
          return this.deposits[this.selectedId];
      },
      selectedBalance(){
          if(this.selectedId >= 1 ){
              return this.selectedDeposit.getBalance();
          }else{
              return db.getTotalBalance();
          }
      }
  },
  mounted () {
      const deposits = db.getDeposits();
      deposits.forEach(deposit => {
          this.deposits.push(deposit);
      });
      console.log(this.deposits);
  },
  methods:{
      changedTab () {
          console.log(this.selectedId);
          this.$emit('input',   this.selectedDeposit.id);
      }
  }

}
</script>

<style>
.balance{
    margin-left: -15%;
}
</style>