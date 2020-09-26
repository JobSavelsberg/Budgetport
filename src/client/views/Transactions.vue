<template>
  <div>
      <DepositSelect v-model="depositId"/>
      <TransactionTable :deposit-id="depositId"/>
  </div>
</template>

<script>
import TransactionTable from "../components/TransactionTable.vue"
import DepositSelect from "../components/DepositSelect.vue"

export default {
  data () {
    return {
      depositId: -1,
    }
  },
  components: {
    TransactionTable,
    DepositSelect
  }
}
</script>