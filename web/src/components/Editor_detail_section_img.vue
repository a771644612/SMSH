<template>
  <div  class="detail-section">
     <div class="uploaded-img-div">
        <span class="remove-img-span" @click="$emit('delete', id)">
            <img class="remove-img-icon" src="../../static/image/delete.svg"/>
        </span>
        <img class="uploaded-img" v-bind:src='url'>
      </div>
    </div>
</template>

<script>
import UploadedImg from './Editor_uploaded_img'

export default {
  name: 'detailSectionImg',
  components: {
    UploadedImg
  },
  props: {
    id: {
      type: Number,
      default: 1
    },
    url: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.detail-section{
  overflow: hidden;
  padding: 10px 30px 10px 10px
}
.uploaded-img{
  margin: auto;
  width: 60%;
}
.detail-section:hover{
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
}
.uploaded-img-div {
  opacity: .75;
  position: relative;
  width: 100%;
  cursor: pointer;
  float: left;
  text-align: center
}
.uploaded-img-div:hover{
  opacity: 1;
  transition: all 0.1s ease-in;
}
.uploaded-img {
  width: 50%;
}
</style>
