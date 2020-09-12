<template>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="budgets"
      group-by="categoryGroupName"
      item-key="categoryId"
      class="budgetTable elevation-1"
      :items-per-page="50"
    >
        <template v-slot:group.header="{items, isOpen, toggle}">
            <td class="groupRow">
            <v-icon @click="toggle">{{ isOpen ? 'mdi-menu-down' : 'mdi-menu-right' }}</v-icon>
            <span class="text--subtitle-2">{{ items[0].categoryGroupName }}</span>
            <v-btn class="mx-2 categoryAdd" fab dark x-small color="primary"><v-icon dark>mdi-plus</v-icon></v-btn>
            </td>
            <td class="groupRow ">
            </td>
            <td class="groupRow">
              <MoneyChip no-edit="true" chip-color="success" v-model="getCategoryGroupBudget(items).budgeted"/>
            </td>
            <td class="groupRow">
              <MoneyChip no-edit="true" chip-color="info" v-model="getCategoryGroupBudget(items).activity"/>
            </td>
            <td class="groupRow">
              <MoneyChip no-edit="true" chip-color="warning" v-model="getCategoryGroupBudget(items).available"/>
            </td>
        </template>
        
        <template v-slot:item.categoryName="{ item }">
          <div>
          <v-chip :color="item.categoryColor" dark>{{ item.categoryName }}</v-chip>
          </div>
        </template>

        <template v-slot:item.goal="{ item }">
          <MoneyChip chip-color="info" v-model="item.goal" @change="updated(item)"/>
        </template>

        <template v-slot:item.budgeted="{ item }">
          <MoneyChip chip-color="success" v-model="item.budgeted" @change="updated(item)"/>
        </template>

        <template v-slot:item.activity="{ item }">
          <MoneyChip no-edit="true" chip-color="info" :value="item.activity"/>
        </template>

        <template v-slot:item.available="{ item }">
          <MoneyChip no-edit="true" chip-color="warning" :value="item.available"/>
        </template>
    </v-data-table>
</template>

<script>
import {getBudgets, getAllTransactions, getAllBudgets, ensureBudgets} from "../app/db"
import {Month} from "../app/objects/budget"
import MoneyChip from "./MoneyChip.vue"

export default {
  props: [
    'month'
  ],
  data () {
    return {
        loading: true,
        headers: [
            {text: 'Category', align: 'start',  sortable: false, value: 'categoryName', width: "40%" },
            { text: 'Goal', value: 'goal',align:'right',width: "15%"  },
            { text: 'Budgeted', value: 'budgeted',align:'right',width: "15%" },
            { text: 'Activity', value: 'activity',align:'right',width: "15%"  },
            { text: 'Available', value: 'available', align:'right',width: "15%" },
        ],
        budgets: [],
        toBeBudgeted: {},
    }
  },
  watch: {
    month: 'monthChanged'
  },
  mounted () {
    this.loadBudgets();
  },
  methods:{
    getCategoryGroupBudget(budgets){
      const groupBudget = {
        budgeted: 0,
        activity: 0,
        available: 0
      }
      return groupBudget;
    },
    monthChanged(newMonth, oldMonth){
      this.loadBudgets();
    },
    loadBudgets(){
      ensureBudgets(this.month).then(()=>{
        const monthBudgets = getBudgets(this.month);
        const toBeBudgeted = monthBudgets.find((budget) => {
          return budget.category.name === 'To be Budgeted';
        });
        const index = monthBudgets.indexOf(toBeBudgeted);
        monthBudgets.splice(index, 1);
        this.toBeBudgeted = toBeBudgeted.json();
        console.log("tbb", this.toBeBudgeted);

        this.budgets = monthBudgets.map((budget) => {
          return budget.jsonFull(getAllTransactions(),getAllBudgets())
        });
        this.loading = false;
        console.log(this.budgets);
      })
    },
    updated(value){
      console.log(value);
    },
    save () {
      console.log('save')
    },
    cancel () {
      console.log('cancel')
    },
    open () {
      console.log('open')
    },
    close () {
      console.log('close')
    },
  },
  components: {
    MoneyChip
  }
}
</script>

<style>
.groupRow{
  background-color:#333333;
}
.budgetTable{
  table-layout : fixed;
}
.categoryAdd{
  margin-left: 5%;
}
</style>