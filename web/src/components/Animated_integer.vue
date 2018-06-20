<template>
    <span>{{ animatedNumber }}</span>
</template>

<script>
import TweenMax from 'gsap/TweenMax';
import Draggable from 'gsap/Draggable';

export default {
    components: {
        TweenMax,
        Draggable,
    },
    props: {
        value: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            tweenedNumber: 0
        }
    },
    computed: {
        animatedNumber: function() {
            return this.tweenedNumber.toFixed(0);
        }
    },
    watch: {
        value: function (newValue) {
            TweenLite.to(this.$data, 0.5, { tweenedNumber: newValue });
        }
    }
}
</script>

<style scoped>
    
</style>
