<template>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :items="budgets"
      group-by="categoryGroupName"
      item-key="categoryId"
      class="budgetTable elevation-1"
    >
        <template v-slot:group.header="{items, isOpen, toggle}">
            <th :colspan="headers.length" class="groupHeader">
            <v-icon @click="toggle"
                >{{ isOpen ? 'mdi-menu-down' : 'mdi-menu-right' }}
            </v-icon>
                {{ items[0].categoryGroupName }}
            </th>
        </template>
        
        <template v-slot:item.category="{ item }">
          <v-chip :color="item.categoryColor">{{ item.categoryName }}</v-chip>
        </template>

        <template v-slot:item.budgeted="{ item }">
          <MoneyChip chip-color="success" v-model="item.budgeted" @change="updated(item.budgeted)"/>
        </template>

        <template v-slot:item.activity="{ item }">
          <MoneyChip no-edit chip-color="info" :value="item.activity"/>
        </template>

        <template v-slot:item.available="{ item }">
          <MoneyChip no-edit chip-color="info" :value="item.available"/>
        </template>
    </v-data-table>
</template>

<script>
import {getBudgets, ensureBudgets} from "../app/db"
import {Month} from "../app/objects/budget"
import MoneyChip from "./MoneyChip.vue"

export default {
  data () {
    return {
        loading: true,
        month: Month.now(),
        headers: [
            {text: 'Category', align: 'start',  sortable: false, value: 'categoryName', width: "60%" },
            { text: 'Goal', value: 'goal',align:'right',width: "10%"  },
            { text: 'Budgeted', value: 'budgeted',align:'right',width: "10%" },
            { text: 'Activity', value: 'activity',align:'right',width: "10%"  },
            { text: 'Available', value: 'available', align:'right',width: "10%" },
        ],
        budgets: [],
    }
  },
  mounted(){
    ensureBudgets(this.month).then(()=>{
        this.budgets = getBudgets(this.month).map((budget) => {return budget.json()});
        this.loading = false;
    })
  },
  methods:{
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
.groupHead{
    background-color: #111111;
}
.budgetTable{
  table-layout : fixed;
}
</style>