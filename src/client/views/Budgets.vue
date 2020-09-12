<template>
  <div>
    <v-row fill-height>
      <v-col fill-height>
        <v-btn rounded color="primary" dark>Add category group</v-btn>
      </v-col>
      <v-col cols="8" fill-height>
        <MonthSelect v-model="month"/>
      </v-col>
      <v-col fill-height>
        <p>Other stats</p>
      </v-col>
    </v-row>

    <BudgetList :month="month"/>
  </div>
</template>

<script>
import MonthSelect from "../components/MonthSelect.vue"
import BudgetList from "../components/BudgetList.vue"
import { currentMonth, Month } from "../app/objects/budget";

export default {
  data () {
    return {
      month: currentMonth(),
    }
  },
  watch: {
    month: 'monthChanged'
  },
  methods:{
    monthChanged(newMonth, oldMonth){
      console.log(this.month.getString());
    }
  },
  components: {
    MonthSelect,
    BudgetList
  },
}
</script>