<template>
    <div>
        <book-table/>
    </div>
</template>

<script>
import BookTable from './Book_table.vue'

export default {
    components: {
        BookTable, // BookTable: () => import('./Book_table.vue')//BookTable
    },
    mounted(){
        this.$store.commit('setLoadingStatus', false);
    }
}
</script>

<style scoped>

</style>
