<template>
  <v-data-table :headers="headers" :items="transactions" :items-per-page="20" class="elevation-1" multi-sort>
    <template v-slot:body.prepend="{ headers }">
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
              append-icon="mdi-calendar"
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
            <v-text-field v-model="payeeInput" label="Payee" single-line></v-text-field>
        </td>
        <td>
            <v-text-field v-model="categoryInput" label="Category" single-line></v-text-field>
        </td>
        <td>
            <v-text-field v-model="memoInput"  label="Memo" single-line></v-text-field>
        </td>
        <td>
            <v-text-field v-model="inflowInput" label="Inflow" type="number"  reverse single-line ></v-text-field>
        </td>
        <td>
            <v-text-field v-model="outflowInput" label="Outflow" type="number"single-line  reverse></v-text-field>
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
  </v-data-table>
</template>

<script>
import app from "../app/app"
import {getTransactions, getCategory} from "../app/db"

export default {
  props: [
    'depositId'
  ],
  data () {
    return {
      menu: false,
      dateInput: new Date().toISOString().substr(0, 10),
      payeeInput: "",
      categoryInput: "",
      memoInput: "",
      inflowInput: "",
      outflowInput: "",
      isEditing: false,
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'Payee', value: 'payee' },
        { text: 'Category', value: 'categoryId' },
        { text: 'Memo', value: 'memo' },
        { text: 'Inflow', value: 'inflow', align: 'right'},
        { text: 'Outflow', value: 'outflow', align: 'right' },
      ],
      transactions: []
    }
  },
  mounted: function () {
    let transactions = getTransactions(this.depositId);
    transactions = transactions.reverse();
    // TODO: sort on date
    transactions.forEach((transaction) => {
      this.transactions.push(transaction.json());
    });
    if(this.depositId==-1){
      this.headers.push({
          text: 'Deposit',
          align: 'start',
          sortable: true,
          value: 'deposit',
        }
      );
    }
  },
  methods:{
    getCategory(categoryId){
      return getCategory(categoryId);
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
  }
}
</script>