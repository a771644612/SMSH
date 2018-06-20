<template>
    <div :class="[hide ? 'hide' : '' , 'vue-uploader']">
        <div class="blocker"></div>
        <div class="vue-uploader-div">
            <div class="file-list">
                <section v-for="(file, index) of files" :key="index" class="file-item draggable-item">
                    <img :src="file.src" alt="" ondragstart="return false;">
                    <p class="file-name">{{file.name}}</p>
                    <span class="file-remove" @click="remove(index)">+</span>
                </section>
                <section v-if="status == 'ready'" class="file-item">
                    <div @click="add" class="add">
                        <span>+</span>
                    </div>
                </section>
            </div>
            <section class="upload-func">
                <div class="progress-bar">
                    <el-progress v-if="uploading" :text-inside="true" :stroke-width="20" :percentage="(percent * 100)"></el-progress>
                </div>
                <div class="operation-box">
                    <button v-if="status != 'finished'" @click="close">关闭</button>
                    <button v-if="status == 'ready'" @click="submit">上传</button>
                    <button v-if="status == 'finished'" @click="final">完成</button>
                </div>
            </section>
            <input type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            src: {
                type: String,
                required: true
            }
        },
        name: 'ImgUploader',
        data() {
            return {
                status: 'ready',
                files: [],
                uploadingImgNum: 0,
                uploadedImgNum: 0,
                uploading: false,
                percent: 0,
                hide: true
            }
        },
        watch: {
            uploadedImgNum: function (val) {
                const component = this
                const percentComplete = Math.round(val * 100 / this.uploadingImgNum)
                component.percent = percentComplete / 100
                if (val == this.uploadingImgNum && val != 0){
                    this.status = 'finished'
                }
            }
        },
        methods: {
            // TODO: 上传成功之后删除队列中文件 || 全部执行后初始化 ||
            add() {
                this.$refs.file.click()
            },
            submit() {
                if (this.files.length === 0) {
                    console.warn('no file!');
                    return
                }

                this.uploading = true
                this.uploadedImgNum = 0
                this.uploadingImgNum = this.files.length

                this.files.forEach((item) => {
                    if(item.size / 1024 / 1024 > 2){
                        this.$message.error('图片' + item.name + '过大，上传图片大小不能超过2M')
                    }
                    else{
                        var formData = new FormData()
                        formData.append('userfile', item.file, item.name)
                        this.$http.post(this.src, formData
                        ).then(response => {
                                // success callback
                                if(response.body['code'] === 200){
                                    console.log('upload success!')
                                }
                                else if(response.body['code'] === 409){
                                    this.$message.error('图片' + item.name + '已经存在')
                                }
                                else if(response.body['code'] === 407){
                                    this.$message.error('图片' + item.name + '过大，上传图片大小不能超过2M')
                                }
                                else {
                                    this.$message.error('图片' + item.name + '上传失败')
                                }
                                this.uploadedImgNum++
                            }, response => {
                                // error callback
                                this.$message.error('图片' + item.name + '上传失败')
                                console.log('error：error code ' + response.body['code'])
                            }
                        );
                    }
                }) 
            },
            remove(index) {
                this.files.splice(index, 1)
            },
            fileChanged() {
                const list = this.$refs.file.files
                for (let i = 0; i < list.length; i++) {
                    if (!this.isContain(list[i])) {
                        const item = {
                            name: list[i].name,
                            size: list[i].size,
                            file: list[i]
                        }
                        this.html5Reader(list[i], item)
                        this.files.push(item)
                    }
                }
                this.$refs.file.value = ''
            },
            // 将图片文件转成BASE64格式用于预览
            html5Reader(file, item){
                const reader = new FileReader()
                reader.onload = (e) => {
                    this.$set(item, 'src', e.target.result)
                }
                reader.readAsDataURL(file)
            },
            isContain(file) {
              return this.files.find((item) => item.name === file.name && item.size === file.size)
            },
            close () {
                this.hide = true
            },
            final () {
                this.hide = true
                this.$emit('uploadSuccess')
            },
            open () {
                this.init()
                this.hide = false
            },
            init(){
                this.files = []
                this.status = 'ready'
                this.uploading = false
            }
        }
    }
</script>
<style>
.vue-uploader{
    display: block;
}
.hide{
    display: none;
}
.blocker{
    position: fixed;
    width: 300%;
    height: 300%;
    left: -100%;
    top: -100%;
    z-index: 80;
    background-color: #ffffff6c
}
.vue-uploader-div {
    border: 1px solid #e5e5e5;
    position: fixed;
    z-index: 100;
    margin: auto;
    left: 25%;
    top: 25%;
    min-width: 50%;
    max-width: 50%;
    background-color: white;
}
.file-list{
    min-height: 100px;
    max-height: 600px;
    overflow-y: auto;
}
.vue-uploader-div .file-list {
    padding: 10px 0px;
}
.vue-uploader-div .file-list:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
}
.vue-uploader-div .file-list .file-item {
    float: left;
    position: relative;
    width: 100px;
    text-align: center;
}
.vue-uploader-div .file-list .file-item img{
    width: 80px;
    height: 80px;
    border: 1px solid #ececec;
}
.vue-uploader-div .file-list .file-item .file-remove {
    position: absolute;
    right: 12px;
    display: none;
    top: 4px;
    width: 14px;
    height: 14px;
    color: white;
    cursor: pointer;
    line-height: 12px;
    border-radius: 100%;
    transform: rotate(45deg);
    background: rgba(0, 0, 0, 0.5);
}
.vue-uploader-div .file-list .file-item:hover .file-remove {
    display: inline;
}
.vue-uploader-div .file-list .file-item .file-name {
    margin: 0;
    height: 40px;
    word-break: break-all;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.vue-uploader-div .add {
    width: 80px;
    height: 80px;
    margin-left: 10px;
    float: left;
    text-align: center;
    line-height: 80px;
    border: 1px dashed #ececec;
    font-size: 30px;
    cursor: pointer;
}
.vue-uploader-div .upload-func {
    display: flex;
    padding: 10px;
    margin: 0px;
    background: #f8f8f8;
    border-top: 1px solid #ececec;
}
.vue-uploader-div .upload-func .progress-bar {
    flex-grow: 1;
}
.vue-uploader-div .upload-func .progress-bar section {
    margin-top: 5px;
    background: #00b4aa;
    border-radius: 3px;
    text-align: center; 
    color: #fff;
    font-size: 12px;
    transition: all .5s ease;
}
.vue-uploader-div .upload-func .operation-box {
    flex-grow: 0;
    padding-left: 10px;
}
.vue-uploader-div .upload-func .operation-box button {
    padding: 4px 12px;
    color: #fff;
    background: #007ACC;
    border: none;
    border-radius: 2px;
    cursor: pointer;
}
.vue-uploader-div > input[type="file"] {
    display: none;
}
</style>