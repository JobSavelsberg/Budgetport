<template>
<v-container>
<v-main>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>Register with Email</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-alert v-if="error" type="error">
                    {{error}}
                </v-alert>
                <v-form >
                    <v-text-field
                        label="First Name"
                        name="firstName"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="firstName"
                    ></v-text-field>
                    <v-text-field
                        label="Last Name"
                        name="lastName"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="lastName"
                    ></v-text-field>
                    <v-text-field
                        label="Email"
                        name="email"
                        prepend-icon="mdi-email"
                        type="text"
                        v-model="email"
                        :rules="emailRules"
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min]"
                        :type="show ? 'text' : 'password'"
                        label="Password"
                        prepend-icon="mdi-lock"
                        hint="At least 8 characters"
                        required
                        @click:append="show = !show"
                    ></v-text-field>
                    <v-text-field            
                        v-model="rePassword"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min, passwordConfirmationRule]"
                        :type="show1 ? 'text' : 'password'"
                        label="Re-enter Password"
                        prepend-icon="mdi-lock"
                        hint="At least 8 characters"
                        required
                        @click:append="show1 = !show1"
                    />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="secondary" @click="register">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
</v-container>
</template>


<script>
import firebase from "firebase";
export default {
  data() {
    return {
        firstName: "",
        lastName: "",
        email: "",
        show: false,
        show1: false,
        password: '',
        rePassword: '',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailMatch: () => ('The email and password you entered don\'t match')
        },
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
        error: null
    };
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.rePassword || 'Password must match'
    },
    validateAll(){
        return this.firstName && this.lastName && this.email && this.password && this.password.length >= 8 && this.passwordConfirmationRule;
    }
  },
  methods: {
    register() {
        if(this.validateAll){
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(data => {
                data.user.updateProfile({displayName: `${this.firstName} ${this.lastName}`}).then(() => {
                    this.$router.replace({name: "Login"})
                });
            }).catch(err => {
                this.error = err.message;
            });
        }
    },
    clear () {
      this.pass = ''
      this.pass2 = ''
    }
  }
};
</script>