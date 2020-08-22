<template>
  <div>
    <b-table :items="items" :fields="fields" :tbody-tr-class="rowClass"></b-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fields: ['deposit', 'payee', 'memo'],
        items: [
          { deposit: "Checking", payee: 'AH', memo: 'Macdonald' },
          { deposit: "Cash", payee: 'Henk', memo: 'Shaw' },
          { deposit: "Saving", payee: 'Jan', memo: 'Wilson' }
        ]
      }
    },
    methods: {
      rowClass(item, type) {
        if (!item || type !== 'row') return
        if (item.status === 'awesome') return 'table-success'
      }
    }
  }
</script>