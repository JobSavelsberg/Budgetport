<template>
    <!--<v-data-table
      id="budgetList"
      :loading="loading"
      :headers="headers"
      :items="budgets"
      group-by="categoryGroupName"
      item-key="categoryId"
      class="budgetTable elevation-1"
      :items-per-page="50"
      dense
    >
     <!--   <template v-slot:group.header="{items, isOpen, toggle}">
          <td  class="groupRow "></td>
            <td class="groupRow">
              <v-icon @click="toggle">{{ isOpen ? 'mdi-menu-down' : 'mdi-menu-right' }}</v-icon>
              <span class="text--subtitle-2">{{ items[0].categoryGroupName }}</span>
              <v-btn class="mx-2 categoryAdd" fab dark x-small color="primary"><v-icon dark>mdi-plus</v-icon></v-btn>
            </td>
            <td class="groupRow ">
            </td>
            <td class="groupRow">
              <MoneyChip :no-edit="false" chip-color="success" v-model="getCategoryGroupBudget(items).budgeted"/>
            </td>
            <td class="groupRow">
              <MoneyChip :no-edit="true" chip-color="info" v-model="getCategoryGroupBudget(items).activity"/>
            </td>
            <td class="groupRow">
              <MoneyChip :no-edit="true" chip-color="warning" v-model="getCategoryGroupBudget(items).available"/>
            </td>
        </template>

        <template v-slot:group="{group, items}"> 
          <tr :key="forceChange+group" class="categoryGroup">
            <td  class="groupRow "></td>
            <td class="groupRow">
              <v-icon @click="toggleGroup(group)">{{ isOpen[group] ? 'mdi-menu-down' : 'mdi-menu-right' }}</v-icon>
              <span class="text--subtitle-2">{{ items[0].categoryGroupName }}</span>
              <v-btn class="mx-2 categoryAdd" fab dark x-small color="primary"><v-icon dark>mdi-plus</v-icon></v-btn>
            </td>
            <td class="groupRow ">
            </td>
            <td class="groupRow">
              <MoneyChip :no-edit="false" chip-color="success" v-model="getCategoryGroupBudget(items).budgeted"/>
            </td>
            <td class="groupRow">
              <MoneyChip :no-edit="true" chip-color="info" v-model="getCategoryGroupBudget(items).activity"/>
            </td>
            <td class="groupRow">
              <MoneyChip :no-edit="true" chip-color="warning" v-model="getCategoryGroupBudget(items).available"/>
            </td>
          </tr>
          <tr v-if="isOpen[group]" v-for="item in items" :key="item.id + '' + group" class="budgetRow">
            <td>
            </td>
            <td>
            <div>
              <v-chip small :color="item.categoryColor" dark>{{ item.categoryName }}</v-chip>
            </div>
            </td>
            <td>
              <MoneyChip chip-color="info" v-model="item.goal" @change="updatedGoal(item)"/>
            </td>
            <td>
              <MoneyChip chip-color="success" v-model="item.budgeted" @change="updatedBudget(item)"/>
            </td>
            <td>
              <MoneyChip :no-edit="true" chip-color="info" :value="item.activity"/>
            </td>       
            <td>
              <MoneyChip :no-edit="true" chip-color="warning" :value="item.available"/>
            </td>
          </tr>
          
        </template>

    </v-data-table>-->


  <v-simple-table 
    :loading="loading"
    dense
    id="budgetList"
    :key="forceChange">
      <template v-slot:default>
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.text" :width="header.width"  :class="`text-${header.align}`">{{header.text}} 
                <v-btn v-if="header.text==='Category'" class="mx-2 categoryAdd" rounded dark x-small color="primary"><v-icon small dark>mdi-plus</v-icon></v-btn>
            </th>
          </tr>
        </thead>
        <tbody v-for="group in budgetsInGroups" :key="group.name" >
          <tr class="groupRow">
              <td><v-icon small color="grey">mdi-reorder-horizontal</v-icon></td>
              <td>
                <v-icon @click="toggleGroup(group.name)">{{ isOpen[group.name] ? 'mdi-menu-down' : 'mdi-menu-right' }}</v-icon>
                <span class="text--subtitle-2">{{ group.name }}</span>
                <v-btn class="mx-2 categoryAdd" rounded dark x-small color="primary"><v-icon small dark>mdi-plus</v-icon></v-btn>
              </td>
              <td></td>
              <td><MoneyChip :no-edit="false" chip-color="success" v-model="getCategoryGroupBudget(group.budgets).budgeted"/></td>
              <td><MoneyChip :no-edit="true" chip-color="info" v-model="getCategoryGroupBudget(group.budgets).activity"/></td>
              <td><MoneyChip :no-edit="true" chip-color="warning" v-model="getCategoryGroupBudget(group.budgets).available"/></td>
          </tr>
          <tr v-if="isOpen[group.name]" v-for="budget in group.budgets" :key="group.name + budget.id" class="budgetRow">
            <td><v-icon small color="grey">mdi-reorder-horizontal</v-icon></td>
            <td><div><v-chip small :color="budget.categoryColor" dark>{{ budget.categoryName }}</v-chip></div></td>          
            <td><MoneyChip chip-color="info" v-model="budget.goal" @change="updatedGoal(budget)"/></td>
            <td><MoneyChip chip-color="success" v-model="budget.budgeted" @change="updatedBudget(budget)"/></td>
            <td><MoneyChip :no-edit="true" chip-color="info" :value="budget.activity"/></td>       
            <td><MoneyChip :no-edit="true" chip-color="warning" :value="budget.available"/></td> 
          </tr>
          </tbody>
      </template>
    </v-simple-table>

</template>

<script>
import {getBudgets, getAllTransactions, getAllBudgets, ensureBudgets, updateBudget, getBudgetById, getPreference} from "../app/db"
import {Month} from "../app/objects/budget"
import MoneyChip from "./MoneyChip.vue"
import Money from '../app/objects/money'
import Vue from "vue";
import draggable from 'vuedraggable'
import Sortable from "sortablejs"
export default {
  props: [
    'month'
  ],
  data () {
    return {
        loading: true,
        headers: [
            {text: '', align: 'start', width: "0%" },
            {text: 'Category',  sortable: false, value: 'categoryName', width: "40%" },
            { text: 'Goal', value: 'goal',align:'right',width: "15%"  },
            { text: 'Budgeted', value: 'budgeted',align:'right',width: "15%" },
            { text: 'Activity', value: 'activity',align:'right',width: "15%"  },
            { text: 'Available', value: 'available', align:'right',width: "15%" },
        ],
        budgetsInGroups: [],
        budgets: [],
        toBeBudgeted: {},
        isOpen: {},
        forceChange: -1,
    }
  },
  watch: {
    month: 'monthChanged'
  },
  mounted () {
    this.loadBudgets();
    /*let table = document.querySelector("#budgetList");
    const _self = this;
    Sortable.create(table, {
      draggable: ".categoryGroup",
      onEnd({newIndex, oldIndex}){
        const rowSelected = _self.budgetsInGroups.splice(oldIndex, 1)[0];
        _self.budgetsInGroups.splice(newIndex, 0 , rowSelected);
      }
    })
    /*Sortable.create(table, {
      draggable: ".budgetRow",
      onEnd({newIndex, oldIndex}){
        const rowSelected = _self.budgets.splice(oldIndex, 1)[0];
        _self.budgets.splice(newIndex, 0 , rowSelected);
      }
    })*/
  },
  methods:{
    getCategoryGroupBudget(budgets){
      // TODO: calculate
      const groupBudget = {
        budgeted: Money.ZERO(),
        activity: Money.ZERO(),
        available: Money.ZERO()
      }
      return groupBudget;
    },
    monthChanged(newMonth, oldMonth){
      this.loadBudgets();
    },
    loadBudgets(){
      const categoryOrder = getPreference("categoryOrder") // array of category id's
      ensureBudgets(this.month).then(()=>{
        const monthBudgets = getBudgets(this.month);
        const toBeBudgeted = monthBudgets.find((budget) => {
          return budget.category.name === 'To be Budgeted';
        });
        if(toBeBudgeted){
          const index = monthBudgets.indexOf(toBeBudgeted);
          monthBudgets.splice(index, 1);
          this.toBeBudgeted = toBeBudgeted.json();
        }
       

        this.budgets = []
        this.budgetsInGroups = []
        monthBudgets.sort(function(a, b){
          return categoryOrder.indexOf(a.category.id) - categoryOrder.indexOf(b.category.id);
        });
        monthBudgets.forEach((budget) => {
          const group = this.budgetsInGroups.find(group => group.name === budget.category.group.name);
          if(group){
            group.budgets.push(budget.jsonFull(getAllTransactions(),getAllBudgets()))
          }else{
            this.budgetsInGroups.push({name: budget.category.group.name, budgets: [budget.jsonFull(getAllTransactions(),getAllBudgets())]})
            this.isOpen[budget.category.group.name] = true;
          }
          this.budgets.push(budget.jsonFull(getAllTransactions(),getAllBudgets()));
        });



        this.loading = false;
      })
    },
    updatedGoal(budget){
      console.log('updated goal', budget.goal);
    },
    updatedBudget(budget){
      console.log('updated budget', budget.budgeted);
      updateBudget(budget.id, (new Month(budget.year,budget.month)).getString(), budget.categoryId, budget.budgeted);
      const budgetInstance = getBudgetById(budget.id);
      budgetInstance.budgeted = Money.fromNumber(budget.budgeted);
      this.budgets.some((budgetJson, index) => {
        if (budgetJson.id == budget.id) {
            Vue.set(this.budgets, index, budgetInstance.jsonFull(getAllTransactions(),getAllBudgets()))
            return true;
        }
      });
      const budgetGroup = this.budgetsInGroups.find((group) => group.name === budget.categoryGroupName);
      budgetGroup.budgets.some((budgetJson, index) => {
        if (budgetJson.id == budget.id) {
            Vue.set(budgetGroup.budgets, index, budgetInstance.jsonFull(getAllTransactions(),getAllBudgets()))
            return true;
        }
      });
      this.$emit('updated');
    },
    toggleGroup(group){
      console.log("toggle", group)
      Vue.set(this.isOpen, group, !this.isOpen[group]);
      this.forceChange--;
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
    MoneyChip,
    draggable
  }
}
</script>

<style scoped>
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