<template>
  <div class="editor-panel">
    <div class="editing-block">
      <!-- 书籍信息编辑块 -->
      <div class="upper-block">
        <!-- 设置块样式 -->
        <div class="block-cell book-info-editor">
          <!-- 轮播图编辑 -->
          <p class="guide-text">在此编辑书籍的轮播图：</p>
          <div class="carousel-editor">
            <ul class="img-ul">
              <li class="horizontal img-li" v-for="img in carousel" :key="img.id">
                <uploaded-img @delete="deleteCarousel" :img="img"/>
              </li>
              <li class="horizontal img-li">
                <image-adder @addImage="addCarouseling" :text="addCarouselGuide" :selecting="selectingCarousel"/>
              </li>
            </ul>
          </div>
          <hr/>
          <!-- 书籍信息编辑 -->
          <el-row>
            <el-col :span="12"><p class="guide-text">在此选择书籍封面：</p></el-col>
            <el-col :span="12"><p class="guide-text">在此编辑书籍简介：</p></el-col>
          </el-row>
          <div class="info-editor">
            <div class="cover-edit-block">
              <div class="cover-editor">
                <div v-if="!haveCover">
                  <image-adder @addImage="addCovering" :text="addCoverGuide" :selecting="selectingCover"/>
                </div>
                <div v-else style="height:200px;width:200px">
                  <uploaded-img @delete="deleteCover" :img="{url:bookCover}" />
                </div>
              </div>
            </div>
            <div class="info-input-block">
                <el-input v-model="book.brief" 
                    type="textarea"
                    :rows="8"
                    placeholder="在此输入书籍简介">
                </el-input>
            </div>
          </div>
        </div>
      </div>
      <!-- Book.detail编辑块 -->
      <div>
        <!-- 已有detail -->
        <div class="block-cell book-detail-editor">
          <p class="guide-text">在此编辑书籍详情：</p>
          <detail-section v-for="detail in details" v-if="detail.isText" :key="detail.id" @delete="deleteSection" :id="detail.id" v-model="detail.text"/>
          <detail-section-img v-else @delete="deleteSection" :key="detail.id" :id="detail.id" :url="detail.url"/>
        </div>
        <!-- 添加detail -->
        <div class="block-cell input-block">
          <section v-if="!isEditing" v-on:click="isEditing=true" style="margin: 0;">点击此处新增文字，点击左侧图库新增图片</section>
          <detail-section v-else class="text-editor" :newSection="true" v-model="newText"/>
        </div>
        <button v-if="isEditing" @click="addSection" class="block-cell add-text-button">
          添加
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import UploadedImg from './Editor_uploaded_img'
import ImageAdder from './Editor_image_adder'
import detailSection from './Editor_detail_section'
import detailSectionImg from './Editor_detail_section_img'
import Bus from '../bus'

export default {
  name: 'EditorPanel',
  components: {
    UploadedImg,
    ImageAdder,
    detailSection,
    detailSectionImg
  },
  props: {},
  data () {
    return {
      carousel: [],
      bookCover: '',
      coverId: 0,
      book: {},
      details: [],
      selectingCarousel: false,
      selectingCover: false,
      isEditing: false,
      newText: '',
      nextSectionId: 0
    }
  },
  computed: {
    haveCover: function () {
      return (this.coverId !== 0)
    },
    addCarouselGuide: function () {
      return (this.selectingCarousel ? '点击图库添加图片' : '点此添加轮播图')
    },
    addCoverGuide: function () {
      return (this.selectingCover ? '点击图库添加图片' : '点此添加封面')
    }
  },
  created () {
    Bus.$on('selectImg', (url, imgId) => {
      if (this.selectingCarousel) {
        this.postCarousel(url,imgId)
      } else if (this.selectingCover) {
        this.postCover(url,imgId)
      } else {
        this.details.push(
          {
            isText: false,
            id: this.nextSectionId++,
            url: url,
          }
        )
      }
    })
  },
  methods: {
    loadData(bookInfo){
      this.book = bookInfo
      this.bookCover = bookInfo.cover
      this.coverId = this.util.toValidNumber(bookInfo.cover_id)
      this.details = JSON.parse(bookInfo.details)
      this.details.forEach(section => {
        this.nextSectionId = Math.max(this.nextSectionId, section.id)
      })
      this.nextSectionId++
      this.carousel = []
      bookInfo.images.forEach(img => {
        this.carousel.push(img)
      })
    },
    saveData () {
      this.book.details = JSON.stringify(this.details)
      this.book.images = this.carousel
      this.$emit('saveDetail', this.book)
    },
    deleteSection (id) {
      this.details = this.details.filter(detail => {
        return detail.id !== id
      })
    },
    addCarouseling () {
      this.selectingCover = false
      this.selectingCarousel = !this.selectingCarousel
    },
    addCovering () {
      this.selectingCarousel = false
      this.selectingCover = !this.selectingCover
    },
    deleteCarousel (id) {
      let imgId = id
      this.$http.delete(this.$store.state.host + '/adminpannel/image/' + imgId + '/' + this.$route.params.id, 
        {emulateJSON: true,}
      ).then(response => {
          // success callback
          if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
            this.$message.success('删除轮播图成功')
            this.carousel = this.carousel.filter(img => {
              return img.id !== id
            })
          }
          else{
            this.$message.error('删除轮播图出现问题，请联系系统管理员')
          }
        }, this.util.returnFailHandler
      );
    },
    postCarousel (url, imgId) {
      this.$http.put(this.$store.state.host + '/adminpannel/image/' + imgId + '/' + this.$route.params.id, 
        {emulateJSON: true,}
      ).then(response => {
          // success callback
          if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
            this.$message.success('添加轮播图成功')
            this.carousel.push({
                id: imgId,
                url: url,
            })
            this.selectingCarousel = false
          }
          else{
            this.$message.error('添加轮播图失败，请联系系统管理员')
          }
        }, this.util.returnFailHandler
      );
    },
    deleteCover () {
      if(this.coverId !== 0){
        let imgId = this.coverId
        this.$http.delete(this.$store.state.host + '/adminpannel/image/cover/' + imgId + '/' + this.$route.params.id, 
          {emulateJSON: true,}
        ).then(response => {
            // success callback
            if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
              this.$message.success('删除封面成功')
              this.bookCover = ''
              this.coverId = 0
            }
            else{
              this.$message.error('删除封面出现问题，请联系系统管理员')
            }
          }, this.util.returnFailHandler
        );
      }
    },
    postCover (url,imgId) {
      this.$http.put(this.$store.state.host + '/adminpannel/image/cover/' + imgId + '/' + this.$route.params.id, 
        {emulateJSON: true,}
      ).then(response => {
          // success callback
          if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
            this.$message.success('添加封面成功')
            this.bookCover = url
            this.coverId = imgId
            this.selectingCover = false
          }
          else{
            this.$message.error('添加封面出现问题，请联系系统管理员')
          }
        }, this.util.returnFailHandler
      );
    },
    addSection () {
      this.details.push(
        {
          isText: true,
          id: this.nextSectionId++,
          text: this.newText
        }
      )
      this.newText = ''
      this.isEditing = false
    }
    // TODO: 添加拖动Section的支持
  }
}
</script>

<style scoped>
.editor-panel{
  position: absolute;
  padding: 30px 30px 30px calc(250px + 6%);
  height: 100%;
}
.editing-block{
  width: 800px;
}
.upper-block{
  margin: auto auto 3em auto;
}
.block-cell{
  text-align: left;
  width: 600px;
  margin: auto auto 1em auto;
  padding: 1em 1em 1em 1em;
}
.book-info-editor, .book-detail-editor, .add-text-button{
  background-color: #fff;
  box-shadow: 0 0 6px rgba(63,70,82,.5);
}
.guide-text{
  color: #6c6d6f;
}
.carousel-editor{
  height: 200px;
  overflow-x: auto;
}
.horizontal {
  float: left;
  display: block;
}
.img-li {
  margin: 10px;
  width: 40%;
}
.info-editor{
  height: 200px;
}
.cover-editor{
  float: left;
  height: 200px;
}
.info-input-block{
  float: left;
  padding-left: 30px;
  width: 50%;
}
.input-block{
  opacity: .7;
  color: #6c6d6f;
  border: 1px dashed #6c6d6f;
}
.add-text-button{
  margin-left: 45%;
  width: 80px;
  text-align: center;
  border: none;
  border-radius: 100px;
}
.add-text-button:hover{
  box-shadow: 0 0 16px #60d0ff;
  transition: all 0.1s ease-in;
}
.input-block:hover{
  opacity: 1;
  transition: all 0.1s ease-in;
}
.cover-edit-block{
  float: left;
  width: 30%;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 20px;
}
</style>
