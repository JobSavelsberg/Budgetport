<template>
    <TransactionTable :deposit-id="depositId"/>
</template>

<script>
import TransactionTable from "../components/TransactionTable.vue"

export default {
  data () {
    return {
      depositId: 1,
    }
  },
  components: {
    TransactionTable
  }
}
</script>