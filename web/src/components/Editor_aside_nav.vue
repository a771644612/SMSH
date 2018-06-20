<template>
  <div class="editor-aside-nav">
    <div class="button-div">
      <ul style="height:70px">
        <li class="horizontal button-li">
          <el-button type="primary" icon="el-icon-back button-icon" @click="$emit('back')" circle></el-button>
        </li>
        <li class="horizontal button-li">
          <el-button type="primary" icon="el-icon-upload2 button-icon" @click="$emit('uploadImg')" circle></el-button>
        </li>
        <li class="horizontal button-li">
          <el-button type="primary" icon="el-icon-refresh button-icon" @click="$emit('refresh')" circle></el-button>
        </li>
        <li class="horizontal button-li" style="float:right; margin-right:30px">
          <el-button type="danger" icon="el-icon-check button-icon" @click="$emit('saveData')" circle></el-button>
        </li>
      </ul>
      <hr style="border-style: dashed;color: brown;border-width: 2px;" />
      
      <el-form :inline="true" style="padding-left:40px;margin-top: 15px;" @submit.native.prevent="$emit('search',searchKeyword)">
        <el-form-item style="margin:3px">
          <el-input style="width:275px" v-model="searchKeyword" placeholder="搜索" ></el-input>
        </el-form-item>
        <el-form-item  style="padding-left:20px">
          <el-button icon="el-icon-search button-icon" @click="$emit('search',searchKeyword)" circle></el-button>
        </el-form-item>
      </el-form>

    </div>
    <div class="img-div">
      <ul class="img-ul">
        <li class="horizontal img-li" v-for="img in images" :key="img.id" >
          <uploaded-img @delete="$emit('deleteUploadedImg',$event)" @selectingImg="selectingImg" :img="img"/>
          <div class="image-name">{{img.url.substring(img.url.lastIndexOf('/') + 1,img.url.length)}}</div>
        </li>
      </ul>
    </div>

    <div class="page-div">
      <div >
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="25"
        layout="prev, pager, next, jumper"
        :pager-count="5"
        :total="totalImgs">
      </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
import UploadedImg from './Editor_uploaded_img'
import Bus from '../bus'

export default {
  name: 'EditorAsideNav',
  components: {
    UploadedImg
  },
  props: ['images','totalImgs'],
  data() {
    return {
      searchKeyword: '',
      currentPage: 1,
      //TODO: 加入总页数判断
    }
  },
  watch: {
    currentPage: function(val){
      this.$emit('changePage',val)
    }
  },
  methods: {
    // TODO: 搜索栏、平铺
    selectingImg (url, imgId) {
      Bus.$emit('selectImg', url, imgId)
    }
  }
}
</script>

<style scoped>
.el-button{
  font-size:22px;
}
div.editor-aside-nav {
  position: fixed;
  left: 0;
  width: 450px;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #292d36;
  z-index: 10;
  box-shadow: 0 0 3px rgba(63,70,82,.5);
}
.page-div{
  position: fixed;
  bottom: 0;
  width: 449px;
  box-shadow: 0 0 65px rgba(63,70,82,.5);
  background-color: white;
  padding: 7px 0;
}
.image-name{
  width: 150px;
  word-break: break-all;
  word-wrap: break-word;
}
.horizontal {
  float: left;
  display: block;
}
.button-li {
  margin: 12px;
}
.circular-button {
  padding: 5px;
  height: 60px;
  width: 60px;
  border-radius: 30px;
  font-size: 10px;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-image: none;
  background-color: #777777;
  border: none;
  box-shadow: 0 0 3px rgba(63,70,82,.5);
}
.circular-button:active{
  background-color:black;
  transition: all 0.1s ease-in;
}
.circular-button:hover {
  opacity: .75;
  transition: all 0.1s ease-in;
}
.icon-svg{
  width: 30px;
}
.img-div {
  padding: 5px 5px 200px;
  height: calc(100% - 350px);
  background-color: #434a57;
  overflow-x: auto;
}
.img-li {
  margin: 10px;
  width: 40%;
  min-height: 220px;
}
.remove-img-icon {
  height: 0;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
  color: red;
}
.uploaded-img {
  cursor: pointer;
  float: left;
}
</style>
