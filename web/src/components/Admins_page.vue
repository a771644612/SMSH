<template>
    <div>
        <admin-table/>
    </div>
</template>

<script>
import AdminTable from './Admin_table.vue'
export default {
    components: {
        AdminTable
    },
    mounted(){
        this.$store.commit('setLoadingStatus', false);
    }
}
</script>

<style scoped>
    
</style>
