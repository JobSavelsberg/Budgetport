<template>
    <div class="moneyChip">
        <v-spacer></v-spacer>
        <v-chip v-if="editing === false || noEdit" @click="clickedChip" :color="color" :text-color="chipColor" dark :outlined="outlined">{{value}}</v-chip>
        <v-text-field v-else autofocus @focus="focused" :readonly="noEdit" v-click-outside="finishInput" @keydown.enter="finishInput" :suffix="moneyPrefix" :color="chipColor" v-model="editableValue" type="number" class="moneyInput numberInput shrink"
 solo rounded outlined dense single-line placeholder="0" hide-details reverse>{{editableValue}}</v-text-field>
    </div>
</template>

<script>
export default {
    props: [
        'noEdit',
        'chipColor',
        'value'
    ],
    data () {
        return {
            moneyPrefix:"",//€$
            editableValue: JSON.parse(this.value),
            editing: false,
            outlined: true,
        }
    },
    computed: {
        color(){
            return this.outlined ? this.chipColor : '#1a1a1a';
        },
    },
    methods:{
        clickedChip(){
            console.log(this.noEdit);
            if(!this.noEdit) this.editing = true;
        },
        focused(){
            console.log("focused");
        },
        finishInput(){
            console.log("blur");
            this.editing = false;
            if(this.editableValue !== this.value){
                this.$emit('input', this.editableValue);
                this.$emit('change', this.editableValue);
            }
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
    }
}
</script>

<style scoped>

.moneyChip{
    display:flex;
    align: right;
}
.moneyInput{
    margin:0;
    padding: 0;
    width: 120px;
}

.v-text-field .v-input__control .v-input__slot {
    min-height: auto !important;
}
</style>
