<template>
  <v-data-table :headers="headers" :items="getTransactions" :items-per-page="20" class="elevation-1" multi-sort v-on:transactionChange :loading="loading">
    <template v-slot:body.prepend="{ headers }" >
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
      <v-chip :color="getCategory(item.categoryId).getColor()" dark>{{ getCategory(item.categoryId).getName()}}</v-chip>
    </template>
    <template v-slot:item.inflow="{ item }">
      <v-chip v-if="item.inflow>0" color="success" dark outlined>{{ item.inflow }}</v-chip>
    </template>
    <template v-slot:item.outflow="{ item }">
      <v-chip v-if="item.outflow>0" color="warning" dark outlined>
        <v-edit-dialog :return-value.sync="item.outflow" @save="save" @cancel="cancel" @open="open" @close="close" >
          {{ item.outflow }}
          <template v-slot:input>
              <v-text-field v-model="item.outflow" label="Edit" type="number" single-line counter></v-text-field>
          </template>
        </v-edit-dialog>
      </v-chip>
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
        { text: 'Date', value: 'date',  },
        { text: 'Payee', value: 'payee' },
        { text: 'Category', value: 'categoryId' },
        { text: 'Memo', value: 'memo' },
        { text: 'Inflow', value: 'inflow', align: 'right'},
        { text: 'Outflow', value: 'outflow', align: 'right' },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      transactions: []
    }
  },
  mounted () {
    // TODO: sort on date
    this.updateTransactions(getTransactionsSorted(this.depositId));
    if(this.depositId==-1){
      this.headers.push({
          text: 'Deposit',
          align: 'start',
          sortable: true,
          value: 'deposit',
        }
      );
    }
    this.categoryList = getCategories().map((category) => {return category.json()});    
    this.payeeList = getPayees();
    this.loading = false;
  },
  computed:{
    getTransactions(){
      return this.transactions;
    }
  },
  methods:{
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
    }
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