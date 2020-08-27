<template>
    <v-data-table
        :loading="loading"
      :headers="headers"
      :items="budgets"
      group-by="categoryGroupName"
      item-key="categoryId"
      class="elevation-1"
    >
        <template v-slot:group.header="{items, isOpen, toggle}">
            <th :colspan="headers.length" class="groupHeader">
            <v-icon @click="toggle"
                >{{ isOpen ? 'mdi-menu-down' : 'mdi-menu-right' }}
            </v-icon>
                {{ items[0].categoryGroupName }}
            </th>
        </template>
        <template v-slot:item="{ item }">
        <tr>
            <td><v-chip :color="item.categoryColor">{{ item.categoryName }}</v-chip></td>
            <td>{{ item.goal }}</td>
            <td>
                <v-chip color="success" dark outlined>
                    <v-edit-dialog :return-value.sync="item.budgeted" @save="save" @cancel="cancel" @open="open" @close="close" >
                    {{ item.budgeted }}
                    <template v-slot:input>
                        <v-text-field v-model="item.budgeted" label="Edit" type="number" single-line counter></v-text-field>
                    </template>
                    </v-edit-dialog>
                </v-chip>
            </td>
            <td>{{ item.activity }}</td>
            <td>{{ item.available }}</td>
        </tr>
      </template>
    </v-data-table>
</template>

<script>
import {getBudgets, ensureBudgets} from "../app/db"
import {Month} from "../app/objects/budget"

export default {
  data () {
    return {
        loading: true,
        month: Month.now(),
        headers: [
            {
            text: 'Category',
            align: 'start',
            sortable: false,
            value: 'categoryName',
            },
            { text: 'Goal', value: 'goal',align: 'right' },
            { text: 'Budgeted', value: 'budgeted', align: 'right'},
            { text: 'Activity', value: 'activity',align: 'right' },
            { text: 'Available', value: 'available',align: 'right' },
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
  }
}
</script>

<style>
.groupHead{
    background-color: #111111;
}
</style>