<template>
  <v-data-table :headers="headers" :items="transactions" :items-per-page="20" class="elevation-1" >
  </v-data-table>
</template>

<script>
export default {
  data () {
    return {
      headers: [
        {
          text: 'Deposit',
          align: 'start',
          sortable: true,
          value: 'deposit',
        },
        { text: 'Date', value: 'date' },
        { text: 'Payee', value: 'payee' },
        { text: 'Category', value: 'category' },
        { text: 'Memo', value: 'memo' },
        { text: 'Inflow', value: 'inflow' },
        { text: 'Outflow', value: 'outflow' },
      ],
      transactions: [
        {
          deposit: "Checking",
          date: "1-1-2020",
          payee: "Albert Heijn",
          category: "Groceries",
          memo: "Taart",
          inflow: 0,
          outflow: 5,
        },
        {
          deposit: "Saving",
          date: "3-5-2020",
          payee: "Meesman",
          category: "Investing",
          memo: "Monthly Investment",
          inflow: 100,
          outflow: 0,
        },
      ],
    }
  }
}
</script>