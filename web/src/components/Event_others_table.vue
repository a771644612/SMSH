<template>
    <div class="container">
        <img-uploader ref="uploader" :src="$store.state.host + '/adminpannel/image'"></img-uploader>
        <!-- CheckinEditor: -->
        <el-row :gutter="20">
            <el-col :span="16" :offset="4">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="font-size: x-large;">签到积分编辑</span>
                        <div style="float:right;" class="upper-tools">
                            <span class="tools-unit">
                                <el-button type="success" icon="el-icon-refresh" @click.native="refreshCheckinEditor" circle></el-button>
                            </span>
                            <span v-if="!isEditing" class="tools-unit">
                                <el-button type="warning" icon="el-icon-edit" @click.native="editInfo" circle></el-button>
                            </span>
                            <span v-if="isEditing" class="tools-unit">
                                <el-button type="primary" icon="el-icon-check" @click.native="saveEdit" circle></el-button>
                            </span>
                            <span v-if="isEditing" class="tools-unit">
                                <el-button type="danger" icon="el-icon-close" @click.native="giveUpEdit" circle></el-button>
                            </span>
                        </div>
                    </div>
                    <div class="table-wrapper">
                        <div style="margin-bottom: 1em;">
                            <span style="margin-right: 1em;">签到前6天所得积分：</span>
                            <el-input v-model="info.creditsdaily" 
                                :readonly="!isEditing"
                                :suffix-icon="isEditing? 'el-icon-edit': null"
                                style="width: 150px;" 
                                placeholder="请输入积分数值">
                            </el-input>
                        </div>
                        <div>
                            <span style="margin-right: 1em;">签到第7天所得积分：</span>
                            <el-input v-model="info.creditsweekly" 
                                :readonly="!isEditing"
                                :suffix-icon="isEditing? 'el-icon-edit': null"
                                style="width: 150px;" 
                                placeholder="请输入积分数值">
                            </el-input>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- SwapsEditor -->
        <el-dialog title="添加轮播图" width="70%" :visible.sync="dialogFormVisible">
            <el-dialog
                width="60%"
                title="选择活动"
                :visible.sync="activityDialogVisible"
                append-to-body>
                <el-table :data="activities">
                    <el-table-column prop="title" label="活动标题" header-align="center" align="center" width="150"></el-table-column>
                    <el-table-column prop="introduction" label="活动详情" header-align="center" align="center" width="200"></el-table-column>
                    <el-table-column label="选择" header-align="center" align="center" >
                        <template slot-scope="scope">
                            <span><el-button type="warning" icon="el-icon-check" @click="selectActivity(scope.row)" circle></el-button></span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    fixed
                    background
                    @current-change="getActivitiesByPage(activitiesPage)"
                    :current-page.sync="activitiesPage"
                    :page-size="25"
                    layout="total, prev, pager, next, jumper">
                </el-pagination>
            </el-dialog>
            <el-dialog
                width="60%"
                title="选择图片"
                :visible.sync="imageDialogVisible"
                append-to-body>
                <el-table :data="images">
                    <el-table-column prop="name" label="图片名" header-align="center" align="center" width="150"></el-table-column>
                    <el-table-column prop="introduction" label="图片预览" header-align="center" align="center" width="200">
                        <template slot-scope="scope">
                            <div style="width:100%">
                                <img style="width:100%" :src="scope.row.url"/>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="选择" header-align="center" align="center" >
                        <template slot-scope="scope">
                            <span><el-button type="warning" icon="el-icon-check" @click="selectImage(scope.row)" circle></el-button></span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    fixed
                    background
                    @current-change="getImagesByPage(imagesPage)"
                    :current-page.sync="imagesPage"
                    :page-size="25"
                    layout="total, prev, pager, next, jumper">
                </el-pagination>
            </el-dialog>
            <el-form :inline="true">
                <el-form-item label="活动名称：">
                    <el-input placeholder="请选择活动" :disabled="true" v-model="newActivity.title" class="input-with-select">
                        <el-button slot="append" icon="el-icon-edit" @click="showActivities"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="封面图片：">
                    <el-input placeholder="请选择图片" :disabled="true" v-model="newImage.name" class="input-with-select">
                        <el-button slot="append" icon="el-icon-edit" @click="showImages"></el-button>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleDialogClose(()=>{})">取 消</el-button>
                <el-button type="primary" @click="uploadSwap">确 定</el-button>
            </div>
        </el-dialog>
        <el-row :gutter="20">
            <el-col :span="16" :offset="4">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="font-size: x-large;">首页轮播图编辑</span>
                        <el-button style="float:right;" size="small" type="primary" icon="el-icon-upload2" @click="$refs.uploader.open()">上传图片</el-button>
                        <el-button style="float:right; margin-right: 10px;" size="small" type="success" icon="el-icon-refresh" @click.native="refreshSwapsEditor"> 刷新 </el-button>
                    </div>
                    <el-carousel :autoplay="false" :interval="4000" type="card" height="300px">
                        <el-carousel-item v-for="swap in swaps" :key="swap.id" >
                            <div style="position: absolute;margin:1em;right:0;">
                                <el-button type="danger" icon="el-icon-delete" @click="deleteSwap(swap)" circle></el-button>
                            </div>
                            <div style="width:100%;height:100%;">
                                <img style="width:100%;height:100%;" :src="swap.image.url">
                            </div>
                        </el-carousel-item>
                        <el-carousel-item v-if="swaps.length<9">    
                            <div class="add-swap-div">
                                <el-button  type="primary" icon="el-icon-plus" @click="addSwap()" circle></el-button>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ImgUploader from './Editor_img_uploader'

export default {
    data() {
        return {
            //checkinEditor
            info: {
                creditsdaily: 1,
                creditsweekly: 50,
            },
            daily: 1,
            weekly: 50,
            isEditing: false,
            //swapsEditor
            swaps: [],
            dialogFormVisible: false,
            activityDialogVisible: false,
            imageDialogVisible: false,
            newActivity: {},
            newImage: {},
            activities: [],
            activitiesPage: 1,
            images: [],
            imagesPage: 1,
        }
    },
    components: {
        ImgUploader,
    },
    mounted() {
        this.refreshCheckinEditor()
        this.refreshSwapsEditor()
    },
    methods: {
        //Checkin:
        refreshCheckinEditor() {
            this.$store.commit('setLoadingStatus', true); 
            this.getInfo();
            this.$store.commit('setLoadingStatus', false); 
        },
        creditsCheck() {
            var result = this.util.toValidNumber(this.info.creditsdaily, false, true);
            switch (result) {
                case 'error':
                    this.$message.error('请输入合法的非负数');
                    return false;
                case 'empty':
                    this.$message.error('还没有输入');
                    return false;
            }
            this.info.creditsdaily = result;
            var result = this.util.toValidNumber(this.info.creditsweekly, false, true);
            switch (result) {
                case 'error':
                    this.$message.error('请输入合法的非负数');
                    return false;
                case 'empty':
                    this.$message.error('还没有输入');
                    return false;
            }
            this.info.creditsweekly = result;
            return true;
        },
        editInfo() {
            this.daily = this.info.creditsdaily;
            this.weekly = this.info.creditsweekly;
            this.isEditing = true;
            this.$store.commit('setEditStatus', true);
        },
        saveEdit() {
            if(!this.creditsCheck()) {
                return;
            }
            this.$store.commit('setLoadingStatus', true); 
            this.postChange();
            this.$store.commit('setLoadingStatus', false); 
        },
        giveUpEdit() {
            this.info.creditsdaily = this.daily;
            this.info.creditsweekly = this.weekly;
            this.endEdit();
            this.$message.info('已放弃修改');
        },
        endEdit() {
            this.$store.commit('setEditStatus', false);
            this.isEditing = false;
            this.daily = 1;
            this.weekly = 50;
        },
        getInfo() {
            this.$http.get(this.$store.state.host + '/Config/creditsdaily', 
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 200: {
                            this.info.creditsdaily = response.body['info'];
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
            this.$http.get(this.$store.state.host + '/Config/creditsweekly', 
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 200: {
                            this.info.creditsweekly = response.body['info'];
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
        },
        postChange() {
            this.$http.post(this.$store.state.host + '/Config', 
                {'name': 'creditsdaily',
                'value': this.info.creditsdaily},
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 411: this.$message.error('信息不全'); break;
                        case 421: this.$message.error('不允许修改'); break;
                        case 200: {
                            this.$message.success('修改成功');
                            this.endEdit();
                        } break;
                        default: this.util.returnFailHandler(response);
                    } 
                }, this.util.returnFailHandler
            );
            this.$http.post(this.$store.state.host + '/Config', 
                {'name': 'creditsweekly',
                'value': this.info.creditsweekly},
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 411: this.$message.error('信息不全'); break;
                        case 421: this.$message.error('不允许修改'); break;
                        case 200: {
                            this.$message.success('修改成功');
                            this.endEdit();
                        } break;
                        default: this.util.returnFailHandler(response);
                    } 
                }, this.util.returnFailHandler
            );
        },

        //Swaps:
        refreshSwapsEditor() {
            this.getSwaps()
        },
        handleDialogClose(done) {
            this.$confirm(
                '确认关闭？'
            ).then(
                _ => {
                    done();
                    this.dialogFormVisible=false;
                }
            ).catch(
                _ => {

                }
            );
        },
        showActivities(){
            this.activities = [];
            this.activitiesPage = 1;
            this.activityDialogVisible = true;
            this.getActivitiesByPage(this.activitiesPage);
        },
        modifiedActivity(activity) {
            activity['id'] = this.util.toValidNumber(activity['id']);
            activity['type'] = this.util.toValidNumber(activity['type']);
            switch(activity['type']){
                case 1:
                    break;
                case 2:
                    activity['introduction'] = activity['brief']
                    break;
                default:
                    activity['title'] = activity['bargain_title']
                    activity['introduction'] = '砍价：《' + activity['book_title'] + '》'
                    break;
            }
            return activity;
        },
        getActivitiesByPage(page){
            this.$http.get(this.$store.state.host + '/Activities/Going/' + page, 
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.activities = response.body['info'];
                        this.activities.forEach(activity => {
                            activity = this.modifiedActivity(activity)
                        });
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, this.util.returnFailHandler
            );
        },
        selectActivity(activity){
            this.newActivity = activity;
            this.activityDialogVisible = false;
        },
        showImages(){
            this.images = [];
            this.imagesPage = 1;
            this.imageDialogVisible = true;
            this.getImagesByPage(this.imagesPage);
        },
        modifiedImage(image) {
            image['id'] = this.util.toValidNumber(image['id']);
            image['name'] = image['url'].substring(image['url'].lastIndexOf('/') + 1,image['url'].length)
            return image;
        },
        getImagesByPage(page){
            this.$http.get(this.$store.state.host + '/adminpannel/images/page/' + page, 
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.images = response.body['info'];
                        this.images.forEach(image => {
                            image = this.modifiedImage(image)
                        });
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, this.util.returnFailHandler
            );
        },
        selectImage(image){
            this.newImage = image;
            this.imageDialogVisible = false;
        },
        getSwaps(){
            this.$http.get(this.$store.state.host + '/adminpannel/swaps', 
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.swaps = response.body['info']
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, this.util.returnFailHandler
            );
        },
        addSwap(){
            this.newActivity['title'] = '',
            this.newImage['name'] = '',
            this.dialogFormVisible = true;
        },
        uploadSwap() {
            if(this.newActivity.hasOwnProperty('id') && this.newImage.hasOwnProperty('id')){
                this.$http.put(this.$store.state.host + '/adminpannel/swaps/' + this.newActivity.id + '/' + this.newImage.id,
                    null,
                    {emulateJSON: true}
                ).then(response =>{
                        // success callback
                        if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                            this.refreshSwapsEditor();
                            this.dialogFormVisible = false;
                        }
                        else{
                            this.$message.error('未知错误，请联系维护人员');
                        }
                    }, this.util.returnFailHandler
                );
            }
            else{
                this.$message.error('请选择待添加轮播图的对应活动和图片！')
            }
        },
        deleteSwap(swap) {
            this.$http.delete(this.$store.state.host + '/adminpannel/swaps/' + swap.activity_id,
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.refreshSwapsEditor();
                    }
                    else{
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, this.util.returnFailHandler
            );
        }
    }
}
</script>

<style scoped>

.container {
    /* background-color: #aaccffaa; */
    padding: 20px;
}

.table-wrapper {
    background-color: white;
    padding: 10px;
}

.upper-tools {
    margin-bottom: 20px;
    padding-top: auto;
}

.tools-unit {
    text-align: center;
    vertical-align: middle;
    margin-right: 10px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
}

.add-swap-div{
    position: absolute;
    top: calc(50% - 38px);
    left: calc(50% - 38px);
    overflow: hidden;
}

.add-swap-div button{
    font-size: 50px;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.box-card{
    margin: 20px
}
</style>
