<template>
  <v-data-table :headers="headers" :items="getTransactions" :items-per-page="20" class="elevation-1 transactionTable" multi-sort v-on:transactionChange :loading="loading" dense>
    <template v-if="headers[0].text !== 'Deposit'" v-slot:body.prepend="{ headers }" >
      <tr>
        <td>
          <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateInput"
                readonly
                v-bind="attrs"
                v-on="on"
                single-line
              ></v-text-field>
            </template>
            <v-date-picker color="primary" v-model="dateInput" @input="menu = false"></v-date-picker>
          </v-menu>
        </td>
        <td>
            <v-combobox
              v-model="payeeInput"
              :items="payeeList"
              label="Payee"
              single-line
              no-data-text
            ></v-combobox>
        </td>
        <td>
            <v-autocomplete
              v-model="categoryInput"
              :items="categoryList"
              item-text="name"
              label="Category"
              return-object
              single-line
              chips
              no-data-text="No category with that name..."
            >
              <template v-slot:item="{item}">
                <v-chip :color="item.color" dark>
                  {{ item.name }}
                </v-chip>
              </template>
              <template v-slot:selection="{item}">
                <v-chip :color="item.color" dark>
                  {{ item.name }}
                </v-chip>
              </template>
            </v-autocomplete>
        </td>
        <td>
          <v-text-field v-model="memoInput"  label="Memo" single-line></v-text-field>
        </td>
        <td>
          <v-text-field v-model="inflowInput" label="0" class="numberInput" type="number" step=".01" min="0" :rules="flowRules" reverse single-line ></v-text-field>
        </td>
        <td>
          <v-text-field v-model="outflowInput" label="0" class="numberInput" type="number" step=".01" min="0" :rules="flowRules" single-line  reverse></v-text-field>
        </td>
        <td>
          <v-btn color="primary" @click="add"><v-icon left>mdi-send</v-icon>Add</v-btn>
        </td>
      </tr>
    </template>

    <template v-slot:item.categoryId="{ item }">
      <v-chip small :color="getCategory(item.categoryId).getColor()" dark>{{ getCategory(item.categoryId).getName()}}</v-chip>
    </template>
    <template v-slot:item.inflow="{ item }">
      <MoneyChip v-if="greaterThanZero(item.inflow)" v-model="item.inflow" chip-color="success" @change="updatedInflow(item)"/>
    </template>
    <template v-slot:item.outflow="{ item }">
      <MoneyChip v-if="greaterThanZero(item.outflow)" v-model="item.outflow" chip-color="warning" @change="updatedOutflow(item)"/>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script>
import Vue from 'vue';
import app from "../app/app"
import {getTransactionsSorted, getCategory,getCategories, getPayees, addTransaction, deleteTransaction} from "../app/db"
import MoneyChip from "./MoneyChip.vue"
import Money from "../app/objects/money"
export default {
  props: [
    'depositId'
  ],
  data () {
    return {
      payeeList: [],
      categoryList: [],
      menu: false,
      dateInput: new Date().toISOString().substr(0, 10),
      payeeInput: "",
      categoryInput: "",
      memoInput: "",
      inflowInput: "",
      outflowInput: "",
      isEditing: false,
      loading: true,
      flowRules: [
        value => !isNaN(value) || 'Not a number',
      ],
      headers: [
        { text: 'Date', value: 'date', width: '6%' },
        { text: 'Payee', value: 'payee',width: '15%' },
        { text: 'Category', value: 'categoryId',width: '15%' },
        { text: 'Memo', value: 'memo',width: '35%' },
        { text: 'Inflow', value: 'inflow', align: 'right',width: '5%'},
        { text: 'Outflow', value: 'outflow', align: 'right',width: '5%' },
        {text: 'Actions', value: 'actions', sortable: false,width: '10%'}
      ],
      transactions: []
    }
  },
  watch: {
    depositId: 'depositIdChanged'
  },
  mounted () {
    // TODO: sort on date
    this.refreshDepositTransactions();
    
  },
  computed:{
    getTransactions(){
      return this.transactions;
    }
  },
  methods:{
    depositIdChanged(newDepositId, oldDepositId){
      if(oldDepositId === -1){
        this.headers.shift();
      }
      this.refreshDepositTransactions();
    },
    refreshDepositTransactions(){
      this.loading = true;
      this.updateTransactions(getTransactionsSorted(this.depositId));
      if(this.depositId==-1){
        this.headers.unshift({
            text: 'Deposit',
            align: 'start',
            sortable: true,
            value: 'deposit',
            width: '7%'
          }
        );
      }
      this.categoryList = getCategories().map((category) => {return category.json()});    
      this.payeeList = getPayees();
      this.loading = false;
    },
    getCategory(categoryId){
      return getCategory(categoryId);
    },
    updateTransactions(newTransactions){
      this.transactions = [];
      newTransactions.forEach((transaction) => {
        this.transactions.push(transaction.json());
      });
    },
    add(){
      this.loading = true;
      if(!this.inflowInput) this.inflowInput = 0;
      if(!this.outflowInput) this.outflowInput = 0;
      addTransaction(this.depositId, this.dateInput, this.payeeInput, this.categoryInput.id, this.memoInput, this.inflowInput, this.outflowInput).then(()=>{
        const newTransactions = getTransactionsSorted(this.depositId);
        this.updateTransactions(newTransactions);
        this.payeeInput = "";
        this.categoryInput = "";
        this.memoInput = "";
        this.inflowInput = 0;
        this.outflowInput = 0;
        this.loading = false;
      });
    },
    updatedInflow(item){
      console.log("updated inflow", item.inflow)
    },
    updatedOutflow(item){
      console.log("updated outflow", item.outflow)
    },
    save () {
      console.log('save')
    },
    cancel () {
      console.log('cancel')
    },
    open () {
      console.log('open')
      this.isEditing = true;
    },
    close () {
      console.log('close')
      this.isEditing = false;
    },
    editItem(transaction){
      console.log("edit", transaction);
    },
    deleteItem(transaction){
      deleteTransaction(transaction.id).then(()=>{
        const index = this.transactions.indexOf(transaction);
        this.transactions.splice(index,1);
      });
    },
    greaterThanZero(number){
      if(typeof number === Money){
        console.log(number);
        return number.greaterThan(Money.ZERO());
      }else{
        return number > 0;
      }
    }
  },
  components: {
    MoneyChip
  }
}
</script>

<style>
.transactionTable{
  table-layout : fixed;
}
</style>