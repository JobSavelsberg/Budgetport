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
                v-model="selectedIndex"
                @change="changedTab"
                >
                    <v-tab
                    v-for="deposit in deposits"
                    :key="deposit.id"
                    >
                    {{ deposit.name }}
                    </v-tab>

                    <v-dialog
                    v-model="depositDialog"
                    max-width="290"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="grey" v-bind="attrs" v-on="on">
                                <v-icon> mdi-plus </v-icon>
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline">Add a new Deposit</v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                        <v-text-field v-model="depositName" label="Name" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                        <v-text-field v-model="startingAmount" label="Starting Balance" type="text" required></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn
                                color="red darken-1"
                                text
                                @click="depositDialog = false"
                            >
                                Cancel
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="green darken-1"
                                text
                                @click="depositDialog = false; addDeposit()"
                            >
                                Create
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-tabs>
            </template>
        </v-toolbar>
    </v-card>
</div>
    
</template>

<script>
import Vue from 'vue';
import * as db from "../app/db";

export default {
    props: [
        'value'
    ],
  data () {
    return {
      deposits: [{id: -1, name: "all"}],
      selectedIndex: 0,
        depositDialog: false,
        depositName: "",
        startingAmount: "0",
    }
  },
  computed: {
      selectedDeposit(){
          return this.deposits[this.selectedIndex];
      },
      selectedBalance(){
          if(this.selectedIndex >= 1 ){
              return this.selectedDeposit.getBalance().toNumber();
          }else{
              return db.getTotalBalance().toNumber();
          }
      }
  },
  mounted () {
      this.loadDeposits();
  },
  methods:{
      loadDeposits(){
        this.deposits = [{id: -1, name: "all"}];
        const deposits = db.getDeposits();
        deposits.forEach((deposit, index) => {
            console.log(deposit.name);
            Vue.set(this.deposits, index+1, deposit)
        });
      },
      changedTab () {
          this.$emit('input',   this.selectedDeposit.id);
      },
      addDeposit(){
          db.createDepositWithStartingBalance(this.depositName, this.startingAmount).then(()=>{
            this.loadDeposits();
            this.selectedIndex = this.deposits.length-1;
            this.changedTab();

          });
      }
  }

}
</script>

<style>
.balance{
    margin-left: -15%;
}
</style>