<template>
  <v-simple-table 
    :loading="loading"
    dense
    id="budgetList"
    :key="forceChange">
      <template v-slot:default>
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.text" :width="header.width"  :class="`text-${header.align}`">{{header.text}} 
                <v-dialog
                    v-model="categoryGroupDialog"
                    max-width="400"
                    >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-if="header.text==='Category'" class="mx-2 categoryAdd" rounded dark x-small color="primary"  v-bind="attrs" v-on="on"><v-icon small dark>mdi-plus</v-icon></v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline">Add Category Group</v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                        <v-text-field v-model="catGroupName" label="Category Group Name" required></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="categoryGroupDialog = false"
                            >
                                Cancel
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="green darken-1"
                                text
                                @click="categoryGroupDialog = false; createCategoryGroup()"
                            >
                                Create
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
            </th>
          </tr>
        </thead>
        <tbody v-for="group in budgetsInGroups" :key="group.name" >
          <tr class="groupRow">
              <td><v-icon small color="grey">mdi-reorder-horizontal</v-icon></td>
              <td>
                <v-icon @click="toggleGroup(group.name)">{{ isOpen[group.name] ? 'mdi-menu-down' : 'mdi-menu-right' }}</v-icon>
                <span class="text--subtitle-2">{{ group.name }}</span>
                 <v-dialog
                    v-model="categoryDialog"
                    max-width="400"
                    >
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn class="mx-2 categoryAdd" rounded dark x-small color="primary"  v-bind="attrs" v-on="on"><v-icon small dark>mdi-plus</v-icon></v-btn>
                        </template>
                        <v-card>
                            <v-card-title class="headline">Add a new Category</v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                        <v-text-field v-model="catName" label="Category Name" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                          <v-color-picker
                                          v-model="catColor"
                                            dot-size="25"
                                            mode="hexa"
                                            class="no-alpha"
                                            swatches-max-height="100"
                                            dark
                                          ></v-color-picker>                                        
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                            <v-btn
                                color="red darken-1"
                                text
                                @click="categoryDialog = false"
                            >
                                Cancel
                            </v-btn>
                            <v-spacer></v-spacer>
                            <v-btn
                                color="green darken-1"
                                text
                                @click="categoryDialog = false; createCategory(group)"
                            >
                                Create
                            </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
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
import * as db from "../app/db"
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
        toBeBudgeted: {},
        isOpen: {},
        forceChange: -1,
        categoryGroupDialog: false,
        catGroupName: "",
        categoryDialog: false,
        catName: "",
        catColor: "",
    }
  },
  watch: {
    month: 'monthChanged',
    catColor(value) {
      if (value.toString().match(/#[a-zA-Z0-9]{8}/)) {
        this.catColor = value.substr(1, 7);
      }
    }
  },
  mounted () {
    this.loadBudgets();
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
      const categoryOrder = db.getPreference("categoryOrder") // array of category id's

      db.ensureBudgets(this.month).then(()=>{
        const monthBudgets = db.getBudgets(this.month);
        const toBeBudgeted = monthBudgets.find((budget) => {
          return budget.category.name === 'To be Budgeted';
        });
        if(toBeBudgeted){
          console.log("Removing tbb");
          console.log(monthBudgets);
          const index = monthBudgets.indexOf(toBeBudgeted);
          monthBudgets.splice(index, 1);
          console.log(monthBudgets)
          this.toBeBudgeted = toBeBudgeted.json();
        }
       

        this.budgetsInGroups = []
        monthBudgets.sort(function(a, b){
          return categoryOrder.indexOf(a.category.id) - categoryOrder.indexOf(b.category.id);
        });
        monthBudgets.forEach((budget) => {
          const group = this.budgetsInGroups.find(group => group.name === budget.category.group.name);
          if(group){
            group.budgets.push(budget.jsonFull(db.getAllTransactions(),db.getAllBudgets()))
          }else{
            this.budgetsInGroups.push({name: budget.category.group.name, budgets: [budget.jsonFull(db.getAllTransactions(),db.getAllBudgets())]})
            this.isOpen[budget.category.group.name] = true;
          }
        });

        // Add lonely budget groups without children
        db.getCategoryGroups().forEach((group) => {
          if(group.name !== 'To be Budgeted'){
            if(!this.budgetsInGroups.find(budgetGroup => budgetGroup.name === group.name)){
              console.log("Adding lonely category group", group.name)
              this.budgetsInGroups.push({name: group.name, budgets: []})
            }
          }
        })


        this.loading = false;
      })
    },
    updatedGoal(budget){
      console.log('updated goal', budget.goal);
    },
    updatedBudget(budget){
      console.log('updated budget', budget.budgeted);
      db.updateBudget(budget.id, (new Month(budget.year,budget.month)).getString(), budget.categoryId, budget.budgeted);
      const budgetInstance = db.getBudgetById(budget.id);
      budgetInstance.budgeted = Money.fromNumber(budget.budgeted);
      this.budgetsInGroups.forEach((budgetGroup, groupIndex) => budgetGroup.budgets.forEach((budgetJson, index) => {
        if (budgetJson.id == budget.id) {
            Vue.set(this.budgetsInGroups[groupIndex].budgets, index, budgetInstance.jsonFull(db.getAllTransactions(),db.getAllBudgets()))
            return true;
        }
      }))
      const budgetGroup = this.budgetsInGroups.find((group) => group.name === budget.categoryGroupName);
      budgetGroup.budgets.some((budgetJson, index) => {
        if (budgetJson.id == budget.id) {
            Vue.set(budgetGroup.budgets, index, budgetInstance.jsonFull(db.getAllTransactions(),db.getAllBudgets()))
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
    createCategory(group){
      console.log(group);
      console.log(this.catName, this.catColor)
      db.addCategory(group.name, this.catName, this.catColor).then(() => {
        this.loadBudgets();
        this.catName = ""
        this.catColor = ""
      })
    },
    createCategoryGroup(){
      db.addCategoryGroup(this.catGroupName);
      this.loadBudgets();
      this.catGroupName = ""
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
.no-alpha {
  .v-color-picker__controls {
    .v-color-picker__preview {
      .v-color-picker__sliders {
        .v-color-picker__alpha {
          display: none;
        }
      }
    }
    .v-color-picker__edit {
      .v-color-picker__input:last-child {
        display: none;
      }
    }
  }
}
</style>