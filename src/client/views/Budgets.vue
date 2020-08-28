<template>
  <div>
    <v-row fill-height>
      <v-col fill-height>
        <v-btn rounded color="primary" dark>Add category group</v-btn>
      </v-col>
      <v-col cols="8" fill-height>
        <MonthSelect/>
      </v-col>
      <v-col fill-height>
        <p>Other stats</p>
      </v-col>
    </v-row>

    <BudgetList/>
  </div>
</template>

<script>
import MonthSelect from "../components/MonthSelect.vue"
import BudgetList from "../components/BudgetList.vue"

export default {
  data () {
    return {
    }
  },
  components: {
    MonthSelect,
    BudgetList
  }
}
</script>