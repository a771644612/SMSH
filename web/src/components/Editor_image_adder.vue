<template>
  <div :class="[selecting ? 'img-selecting' : '' , 'img-adder']" @click="$emit('addImage')">
    {{text}}
  </div>
</template>

<script>
export default {
  name: 'ImageAdder',
  props: {
    text: String,
    selecting: Boolean
  }
}
</script>

<style>
.img-adder{
  height: 145px;
  width: 145px;
  text-align: center;
  line-height: 145px;
  border: 2px dashed #6c6d6f;
  overflow: hidden;
  cursor: pointer;
  opacity: .7;
}
.img-selecting{
  background-color: #afafaf6b
}
.img-adder:hover{
  opacity: 1;
  transition: all 0.1s ease-in;
}
.img-adder:active{
  opacity: .7;
  transition: all 0.1s ease-in;
}
</style>
