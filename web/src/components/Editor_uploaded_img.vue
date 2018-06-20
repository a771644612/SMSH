<template>
    <div class="uploaded-img-div">
        <span class="remove-img-span" @click="$emit('delete', img.id)">
            <img class="remove-img-icon" src="../../static/image/delete.svg"/>
        </span>
        <img class="uploaded-img"  @click="$emit('selectingImg', img.url, img.id)" v-bind:src='img.url'>
    </div>
</template>

<script>
export default {
  name: 'UploadedImg',
  props: {
    img: {
      id: {
        type: Number,
        required: true
      },
      url: String
    }
  }
}
</script>

<style scoped>
.remove-img-span {
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  opacity: .3;
  z-index: 100;
}
.remove-img-span:hover {
  opacity: .9;
  transition: all 0.1s ease-in;
}
.remove-img-icon{
  height: 25px;
  width: 25px;
}
.remove-img-icon:hover{
  height: 28px;
  width: 28px;
  transition: all 0.1s ease-in;
}
.uploaded-img-div {
  opacity: .75;
  position: relative;
  width: 100%;
  cursor: pointer;
  float: left;
}
.uploaded-img-div:hover{
  opacity: 1;
  transition: all 0.1s ease-in;
}
.uploaded-img {
  width: 150px;
  height: 150px;
}
</style>
