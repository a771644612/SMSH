<template>
  <div class="detail-section-div">
    <span v-if="!newSection" class="remove-img-span" @click="$emit('delete', id)">
      <img class="remove-img-icon" src="../../static/image/delete.svg"/>
    </span>
    <el-input
      type="textarea"
      autosize
      :autofocus="newSection"
      placeholder="请输入内容"
      @change="changeText"
      v-model="innerText">
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'detailSection',
  props: {
    value: {
      type: String,
      default: ''
    },
    id: {
      type: Number,
      default: 1
    },
    newSection: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      innerText: this.value
    }
  },
  methods: {
    changeText () {
      this.$emit('input', this.innerText)
    }
  }
}
</script>

<style scoped>
.detail-section-div{
  position: relative;
  padding: 10px 30px 10px 10px
}
.detail-section-div:hover{
  border: 1px dashed #66ccff;
  padding: 9px 29px 9px 9px
}
.detail-section:hover>.delete-span{
  display: inline;
}
.delete-span {
  display: none;
  position: absolute;
  top: -10px;
  right: -10px;
  opacity: .3;
  z-index: 100;
}
.delete-span:hover {
  opacity: .9;
  transition: all 0.1s ease-in;
}
.remove-img-span {
  position: absolute;
  top: 0.25em;
  right: 0.25em;
  opacity: .3;
  z-index: 100;
}
.remove-img-span:hover {
  opacity: .9;
  transition: all 0.1s ease-in;
}
.remove-img-icon{
  height: 20px;
  width: 20px;
  cursor: pointer;
}
</style>
