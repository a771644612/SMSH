<template>
    <el-dialog 
        width="800px" 
        size="mini"
        title="新的抽奖" 
        :visible.sync="show"
        :before-close="handleDialogClose"
        :modal-append-to-body="false">
        <book-picker :visiable="bookPickerDialogVisible" @selectBook="book=>{newLottery.book_id=book['id'];newLottery.book_name=book['name'];bookPickerDialogVisible = false}" @hide="bookPickerDialogVisible = false"></book-picker>
        <el-form
            ref="newLottery"
            :rules="rules"  
            :model="newLottery"
            label-width="200px"
            :label-position="'right'"
            status-icon>
            <el-form-item label="活动书籍" prop="book_name">
                <el-input v-model="newLottery.book_name" disabled style="width: 200px;" class="input-with-select">
                    <el-button slot="append" icon="el-icon-edit" @click="bookPickerDialogVisible = true"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="活动名称" prop="title">
                <el-input v-model="newLottery.title"></el-input>
            </el-form-item>
            <el-form-item label="奖品描述" prop="title">
                <el-input v-model="newLottery.rewards_title"></el-input>
            </el-form-item>
            <el-form-item label="奖池书籍总量" prop="book_num">
                <el-input v-model="newLottery.book_num"></el-input>
            </el-form-item>
            <el-form-item label="抽奖消耗积分" prop="credits_need">
                <el-input v-model="newLottery.credits_need"></el-input>
            </el-form-item>
            <el-form-item label="起始时间" prop="start_time">
                <el-date-picker
                    v-model="newLottery.start_time"
                    type="datetime"
                    placeholder="选择起始日期时间"
                    :clearable="false"
                    :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
                <el-date-picker
                    v-model="newLottery.end_time"
                    type="datetime"
                    placeholder="选择结束日期时间"
                    :clearable="false"
                    :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动简介" prop="introduction">
                <el-input v-model="newLottery.introduction" 
                    type="textarea" 
                    :autosize="{ minRows: 3}"
                    placeholder="在此输入活动描述">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="danger" @click="handleDialogClose(()=>{})">取 消</el-button>
            <el-button type="primary" @click="submitAdd">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import bookPicker from './Book_picker.vue'

export default {
    props: {
        visiable: false
    },
    components: {
        bookPicker
    },
    data() {
        var validateBook = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请选择书籍'));
            } else {
                callback();
            }
        };
        var validateNum = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入奖池中的书本数'));
            } else if(result === 'error' || value == 0) {
                callback(new Error('请输入合法的正整数'));
            } else {
                this.newLottery.times = result;
                callback();
            }
        };
        var validatePrice = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入每次抽奖消耗的积分'));
            } else if(result === 'error') {
                callback(new Error('请输入合法的非负整数'));
            } else {
                this.newLottery.price = result;
                callback();
            }
        };
        var validateTitle = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请输入内容'));
            } else {
                callback();
            }
        };
        var validateIntro = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请输入活动介绍'));
            } else {
                callback();
            }
        };
        var validateSt = (rule, value, callback) => {
            if (value === null || value === 0) {
                callback(new Error('请选择起始日期'));
            } else {
                if (this.newLottery.end_time !== 0) {
                    this.$refs.newLottery.validateField('end_time');
                }
                callback();
            }
        };
        var validateEd = (rule, value, callback) => {
            if (value === null || value === 0) {
                callback(new Error('请选择结束日期'));
            } else if(value < this.newLottery.start_time){
                callback(new Error('结束时间不应比起始时间早'));
            } else {
                callback();
            }
        };
        return {
            show: false,
            newLottery: {
                'book_id': null,
                'book_name': null,
                'book_num': 1,
                'title': null,
                'rewards_title': null,
                'credits_need': 0,
                'start_time': 0,
                'end_time': 0,
                'introduction': '',
            },
            bookPickerDialogVisible: false,
            rules: {
                book_name: [{ validator: validateBook, trigger: 'blur' }],
                book_num: [{ validator: validateNum, trigger: 'blur'}],
                credits_need: [{ validator: validatePrice, trigger: 'blur' }],
                title: [{ validator: validateTitle, trigger: 'blur' }],
                rewards_title: [{ validator: validateTitle, trigger: 'blur' }],
                start_time: [{ validator: validateSt, trigger: 'blur' }],
                end_time: [{ validator: validateEd, trigger: 'blur' }],
                introduction: [{ validator: validateIntro, trigger: 'blur' }],
            }
        };
    },
    watch: {
        visiable(value) {
            this.show = value;
            if(value === true) {
                this.newLottery.start_time = parseInt(new Date().getTime()/1000/60/60/24)*24*60*60*1000;
                this.newLottery.end_time = this.newLottery.start_time + 7*24*60*60*1000;
            }
        }
    },
    methods: {
        handleDialogClose(done) {
            this.$confirm(
                '确认关闭？'
            ).then(
                _ => {
                    done();
                    this.giveUpAdd();
                }
            ).catch(
                _ => {

                }
            );
        },
        giveUpAdd() {
            this.$emit('hide');
            this.$refs['newLottery'].resetFields();
            this.newLottery = {
                'book_id': null,
                'book_name': null,
                'book_num': 1,
                'title': null,
                'rewards_title': null,
                'credits_need': 0,
                'start_time': 0,
                'end_time': 0,
                'introduction': '',
            }
        },
        submitAdd() {
            this.$refs['newLottery'].validate((valid) => {
                if (valid) {
                    this.$confirm('这些信息以后将无法修改，确认已完成编辑?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.postLottery(this.newLottery);
                    }).catch(() => {
                               
                    });
                }
            });
        },
        postLottery(lottery) {
            lottery.start_time /= 1000;
            lottery.end_time /= 1000;
            for(var key in lottery) {
                console.log(lottery[key]);
            }
            this.$http.post(this.$store.state.host + '/adminpannel/lottery', 
                lottery,
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && response.body['code']===200){
                        this.$message.success('添加成功!');
                        this.giveUpAdd();
                        this.$emit('refreshPage');
                    }
                    else{
                        lottery.start_time *= 1000;
                        lottery.end_time *= 1000;
                        this.util.returnFailHandler()
                    }
                }, response => {
                    // error callback
                    lottery.start_time *= 1000;
                    lottery.end_time *= 1000;
                    this.util.returnFailHandler()
                }
            );
        },
    }
}
</script>

<style scoped>

</style>
