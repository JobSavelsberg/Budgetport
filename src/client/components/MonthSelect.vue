<template>
    <v-menu ref="menu"
    v-model="menu"
    transition="scale-transition"
    offset-y
    min-width="290px">
        <template v-slot:activator="{ on }">
            <v-carousel
            v-model="slideIndex"
            hide-delimiters
            continuous
            height="130"
            hide-delimiter-background
            show-arrows-on-hover
            scrollable>
                <v-carousel-item v-for="(month, i) in months" :key="i">
                    <v-sheet
                    :color="colors[i]"
                    height="100%"
                    v-on="on">
                        <v-row
                        class="fill-height"
                        align="center"
                        justify="center">
                            <div class="display-3">{{ month }} {{year}}</div>
                        </v-row>
                    </v-sheet>
                </v-carousel-item>
            </v-carousel>
        </template>
        <v-date-picker
        v-model="datePicker"
        :allowed-dates="allowedMonths"
        no-title
        scrollable
        type="month"
        class="mt-4"
        ></v-date-picker>
    </v-menu>
</template>

<script>
import {Month} from '../app/objects/budget'
export default {
    props: [
        'value'
    ],
    data () {
        return {
            menu: false,
            datePicker: this.value.getString(),
            year: this.value.year,
            month: this.value.month,
            slideIndex: this.value.month-1,
            updatingDate: 0,
            colors: [
                'purple darken-1',
                'deep-purple',
                'orange darken-1',
                'indigo darken-1',
                'lime darken-3',
                'indigo',
                'warning',
                'light-blue',
                'green',
                'deep-purple accent-4',
                'brown darken-1',
                'red darken-3',
            ],
            months: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
        }
    },
    watch: {
        slideIndex: 'slideIndexChanged',
        datePicker: 'datePickerChanged',
        updatingDate: 'updatingDateChanged',
    },
    mounted() {
        console.log(this.value);
    },
    methods:{
        allowedMonths(val) {
            return true;
        },
        clickedChip(){
            
        },
        slideIndexChanged(newIndex, oldIndex){
            if(this.updatingDate === 0){
                if(oldIndex === 11 && newIndex === 0){
                    this.year++;
                }
                if(oldIndex === 0 && newIndex === 11){
                    this.year--;
                }
                this.month = newIndex+1;
                this.datePicker = this.year+"-"+this.month;
            }
            this.updatingDate++;
        },
        datePickerChanged(newDate, oldDate){
            if(this.updatingDate === 0){
                const splittedDatePicker = this.datePicker.split("-");
                this.year = Number(splittedDatePicker[0]);
                this.month = Number(splittedDatePicker[1]);
                this.slideIndex = this.month-1;
            }
            this.updatingDate++;
        },
        updatingDateChanged(newVal, oldVal){
            if(this.updatingDate >= 2){
                this.updateMonthObject();
                this.updatingDate = 0;
            }
        },
        updateMonthObject(){
            this.$emit('input', new Month(this.year, this.month));
        },
    }
}
</script>