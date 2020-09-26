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
                <v-toolbar-title>Log in to Budgetport</v-toolbar-title>
                <v-spacer></v-spacer>

              </v-toolbar>
              <v-card-text>
                <v-alert v-if="error" type="error">
                    {{error}}
                </v-alert>
                  <v-row class="optionRow" justify="center">
                    <v-btn class="grey--text" color="white" @click="useGoogle"  width="50%">
                        <img left height="18" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg">
                        Sign in with Google
                    </v-btn>
                  </v-row>
                  <v-row class="optionRow" justify="center">
                    <v-btn color="red" @click="useEmail = !useEmail" width="50%">
                        <v-icon left dark>mdi-email</v-icon>
                        Sign in with email
                    </v-btn>
                    </v-row>
                    <v-expand-transition>
                        <v-form v-show="useEmail">
                            <v-text-field
                                v-model="email"
                                label="Email"
                                name="email"
                                prepend-icon="mdi-email"
                                type="text"
                            ></v-text-field>

                            <v-text-field
                                v-model="password"
                                id="password"
                                label="Password"
                                name="password"
                                prepend-icon="mdi-lock"
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="show ? 'text' : 'password'"
                                @click:append="show = !show"
                            ></v-text-field>
                        </v-form>
                    </v-expand-transition>
              </v-card-text>
              <v-card-actions v-if="useEmail">
                <v-btn color="secondary" @click="register">Register</v-btn>
                <v-spacer ></v-spacer>
                <v-btn color="primary" @click="emailLogin">Login</v-btn>
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
var provider = new firebase.auth.GoogleAuthProvider();

export default {
  data() {
    return {
        useEmail: false,
        email: "",
        password: "",
        show: false,
        error: null
    };
  },
    mounted(){ 
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                window.setTimeout(this.loginSuccessfull(),1);
            }
        });
    },
  methods: {
      useGoogle(){
          const self = this;
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            console.log(user.displayName);
            //self.loginSuccessfull();

        // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            self.error = errorMessage;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
      },
    emailLogin() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(data => {
            //this.loginSuccessfull();
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    register(){
        this.$router.replace({name: "Register"})
    },
    loginSuccessfull(){
        this.$router.replace({ name: "Home" });
    }

  }
};
</script>
<style>
.optionRow{
    padding: 5px;
}
</style>