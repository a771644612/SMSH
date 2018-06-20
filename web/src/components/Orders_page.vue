<template>
    <div>
        <order-table/>
    </div>
</template>

<script>
import OrderTable from './Order_table.vue'
export default {
    components: {
        OrderTable,//OrderTable: () => import('./Order_table.vue')
    },
    mounted(){
        this.$store.commit('setLoadingStatus', false);
    }
}
</script>

<style scoped>

</style>
