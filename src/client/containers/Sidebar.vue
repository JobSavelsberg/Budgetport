<template>
    <div class="sidebar">
        <b-nav vertical pills type="dark" variant="dark" class="navitemlist"> 
            <b-nav-item button><b-icon icon="grid1x2-fill"></b-icon> Dashboard</b-nav-item>
            <b-nav-item button><b-icon icon="briefcase-fill"></b-icon>  Budgets</b-nav-item>
            <b-nav-item button><b-icon icon="receipt"></b-icon> Transactions</b-nav-item>
        </b-nav>
        <p class="footer">Job Savelsberg &copy; {{ new Date().getFullYear() }}</p>
    </div>
</template>

<script>

</script>

<style scoped>
.nav-item > .nav-link{
    color:lightgrey!important
}
.nav-item > .nav-link:hover{
    color:white!important
}
.nav-item > .nav-link:active{
    background:#353535!important;
    color:white!important
}
.navitemlist{
    margin-top: 3px;
}
.sidebar{
    background: #555555;
    width: 15em;
    float: left;
    height:100%;
}
.footer{
    color: lightgrey;
    position:fixed;
    left:4px;
    bottom:0px;
    margin:0px;
}
</style>