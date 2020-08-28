<template>
    <v-carousel
        hide-delimiters
        continuous
      height="130"
      hide-delimiter-background
      show-arrows-on-hover
      scrollable>
        <v-carousel-item v-for="(month, i) in months" :key="i">
            <v-menu ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px">
                <template v-slot:activator="{ on }">
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
                </template>
                    <v-date-picker
                    v-model="date"
                    :allowed-dates="allowedMonths"
                    no-title
                    scrollable
                    type="month"
                    class="mt-4"
                    ></v-date-picker>
            </v-menu>
        </v-carousel-item>
    </v-carousel>
    
</template>

<script>
export default {
    props: [
    ],
    data () {
        return {
            date: "2020-1",
            year: 2020,
            month: 1,
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
    mounted() {
        console.log("yes");
    },
    methods:{
        allowedMonths(val) {
            console.log(val);
            return true;
        },
        clickedChip(){
            
        },
    }
}
</script>