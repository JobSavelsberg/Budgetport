<template>
  <div>
    <v-row fill-height align="center">
      <v-col cols="3" fill-height>
          <h1 class="text-h4 text-center">To be Budgeted:</h1>
          <h1 :class="`text-h3 text-center ${toBeBudgeted.toNumber() >= 0 ? 'success' : 'error'}--text`">{{toBeBudgeted}}</h1>
      </v-col>
      <v-col cols="6" fill-height>
        <MonthSelect v-model="month"/>
      </v-col>
      <v-col fill-height>
      </v-col>
    </v-row>

    <BudgetList :month="month" @updated="updated"/>
  </div>
</template>

<script>
import MonthSelect from "../components/MonthSelect.vue"
import BudgetList from "../components/BudgetList.vue"
import { currentMonth, Month } from "../app/objects/budget";
import * as db from "../app/db";
import Money from '../app/objects/money'

export default {
  data () {
    return {
      month: currentMonth(),
      toBeBudgeted: Money.ZERO(),
    }
  },
  mounted(){
    this.updated();
  },
  watch: {
    month: 'monthChanged'
  },
  methods:{
    monthChanged(newMonth, oldMonth){
      console.log(this.month.getString());
      //this.updated();
    },
    updated(){
      console.log("Updated from budgets.vue")
      this.toBeBudgeted = db.toBeBudgeted(this.month);
    }

  },
  components: {
    MonthSelect,
    BudgetList
  },
}
</script>