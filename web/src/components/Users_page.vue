<template>
    <div>
        <user-table/>
    </div>
</template>

<script>
import UserTable from './User_table.vue'
export default {
    components: {
        UserTable, //UserTable: () => import('./User_table.vue')
    },
    mounted(){
        this.$store.commit('setLoadingStatus', false);
    }
}
</script>

<style scoped>

</style>
