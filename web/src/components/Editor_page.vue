<template>
  <div class="editor">
    <img-uploader ref="uploader" 
                  @uploadSuccess="loadImg(page)" 
                  :src="$store.state.host + '/adminpannel/image'"></img-uploader>
    <editor-aside-nav :images="images"
                      :totalImgs="imageAmount"
                      @back="back" 
                      @refresh="refresh" 
                      @uploadImg="uploadImg" 
                      @saveData="saveData"
                      @changePage="changePage"
                      @search="searchImg"
                      @deleteUploadedImg="deleteUploadedImg"/>
    <editor-panel ref="detailEditor" 
                  @saveDetail="saveDetail"/>
  </div>
</template>

<script>
import EditorAsideNav from './Editor_aside_nav'
import EditorPanel from './Editor_panel'
import ImgUploader from './Editor_img_uploader'


export default {
  props: {
    id: {
      type: Number
    }
  },
  name: 'EditorComponent',
  components: {
    EditorAsideNav,
    EditorPanel,
    ImgUploader
  },
  data () {
    return {
      images: [],
      bookInfo: {},
      page: 1,
      searchingMode: false,
      keyword: '',
      imageAmount: 0,
    }
  },
  mounted () {
    this.$store.commit('setLoadingStatus', false);
    this.refresh()
    this.$store.commit('setEditStatus', false);
  },
  watch: {
    page: function(val){
      this.loadImg(val)
    }
  },
  beforeRouteLeave (to, from, next) {
    this.$confirm('书籍的详细信息将不会自动保存，仍确认离开?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          //_this.$store.commit('setEditStatus', false);
          next();
      }).catch(() => {
        this.$message.info('已取消离开');
    });
  },
  methods: {
    refresh () {
      this.loadBookData(this.$route.params.id)
      this.loadImg(this.page)
    },
    searchImg (keyword) {
      if(keyword == ''){
        this.searchingMode = false
        this.loadImg(this.page)
        return
      }
      this.searchingMode = true
      this.keyword = keyword
      this.loadImg(this.page)
    },
    loadBookData (id) {
      this.$http.get(this.$store.state.host + '/adminpannel/book/' + id, 
          {emulateJSON: true}
      ).then(response =>{
          // success callback
          if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
            this.bookInfo = response.body['info']
            this.$refs.detailEditor.loadData(this.bookInfo)
          }
          else{
            this.$message.error('加载书籍信息失败')
          }
        }, this.util.returnFailHandler
      );
    },
    changePage (val) {
      this.page = val
    },
    getImgAmount(){
      if(this.searchingMode){
        let info = {
          keyword: this.keyword
        }
        this.$http.post(this.$store.state.host + '/adminpannel/images/search/0/0', info,
            {emulateJSON: true}
        ).then(response =>{
            // success callback
            if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
              this.imageAmount = this.util.toValidNumber(response.body['info'])
            }
          }, this.util.returnFailHandler
        );
      }
      else{
        this.$http.get(this.$store.state.host + '/adminpannel/images/page/0/0',
            {emulateJSON: true}
        ).then(response =>{
            // success callback
            if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
              this.imageAmount = this.util.toValidNumber(response.body['info'])
            }
          }, this.util.returnFailHandler
        );
      }
    },
    loadImg (page) {
      this.getImgAmount()

      if(this.searchingMode){
        let info = {
          keyword: this.keyword
        }
        this.$http.post(this.$store.state.host + '/adminpannel/images/search/' + page + '/25', info,
            {emulateJSON: true}
        ).then(response =>{
            // success callback
            if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
              this.images = response.body['info']
            }
            else{
              this.$message.error('搜索第' + page + '页图片信息失败')
            }
          }, this.util.returnFailHandler
        );
      }
      else{
        this.$http.get(this.$store.state.host + '/adminpannel/images/page/' + page,
            {emulateJSON: true}
        ).then(response =>{
            // success callback
            if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
              this.images = response.body['info']
            }
            else{
              this.$message.error('加载第' + page + '页图片信息失败')
            }
          }, this.util.returnFailHandler
        );
      }
    },
    back () {
      this.$router.push({ path: this.$store.state.host + '/adminpannel/books'})
    },
    deleteUploadedImg (id) {
      // TODO: HTTP.DELETE
      this.$confirm('此操作将删除与此图片关联的所有书籍封面、轮播图等, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(this.$store.state.host + '/adminpannel/image/id/' + id,
        ).then(response => {
            // success callback
            if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
              this.$message.success('图片删除成功')
              this.loadImg(this.page)
            }
            else {
              this.$message.error('图片删除失败')
            }
          }, this.util.returnFailHandler
        );
        this.loadImg(this.page)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      
    },
    uploadImg () {
      this.$refs.uploader.open()
    },
    saveData () {
      console.log('savedata')
      this.$refs.detailEditor.saveData()
    },
    saveDetail (bookInfo) {
      this.bookInfo = bookInfo
      this.$http.post(this.$store.state.host + '/adminpannel/book', this.bookInfo, 
        {emulateJSON: true,}
      ).then(response => {
          // success callback
          if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
            this.$message.success('保存书籍信息成功')
          }
          else{
            this.$message.error('保存书籍信息失败，请联系系统管理员')
          }
        }, this.util.returnFailHandler
      );
    }
  }
}
</script>

<style>
.editor{
  height: 100%;
  overflow: hidden;
}
</style>
