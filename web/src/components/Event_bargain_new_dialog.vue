<template>
    <div>
        <div class="book-picker-wrapper">
            <book-picker
                v-show="showBookPicker"
                @hide="giveUpPick"
                @selectBook="selectBook"
                :visiable="showBookPicker"
                :selected-book="selectedBook">
            </book-picker>
        </div>
        <el-dialog 
            width="800px"
            top="2vh"
            size="mini"
            title="新的砍价" 
            :visible.sync="show"
            :before-close="handleDialogClose"
            :modal-append-to-body="false">
            <el-form
                ref="newBargain"
                :rules="rules"  
                :model="newBargain"
                label-width="200px"
                :label-position="'right'"
                status-icon>
                <el-form-item label="活动书籍id" prop="book_id">
                    <el-input v-model="newBargain.book_id"
                        style="width: 200px;"
                        :readonly="true">
                    </el-input>
                    <el-button
                        @click="beginPick"
                        icon="el-icon-edit"
                        type="primary"
                        circle>
                    </el-button>
                    <el-popover v-if="newBargain.book_id !== null"
                        placement="right-start"
                        width="300"
                        trigger="hover">
                        <div class="image-wrapper">
                            <img :src="selectedBook.cover" width="300px" height="300px"/>
                        </div>
                        <div style="book-name">
                            {{selectedBook.name}}
                        </div>
                        <el-button slot="reference" type="info" icon="el-icon-search" circle></el-button>
                    </el-popover>
                </el-form-item>
                <el-form-item label="活动名称" prop="title">
                    <el-input v-model="newBargain.title"></el-input>
                </el-form-item> 
                <el-form-item label="书籍数目" prop="amount">
                    <el-input v-model="newBargain.amount"></el-input>
                </el-form-item>
                <el-form-item label="起价" prop="price">
                    <el-input v-model="newBargain.price"></el-input>
                </el-form-item>
                <el-form-item label="最大砍价次数" prop="times">
                    <el-input v-model="newBargain.times"></el-input>
                </el-form-item>
                <el-form-item label="砍价类型" prop="type">
                    <el-switch v-model="newBargain.type"
                        :active-value="1"
                        :inactive-value="0"
                        active-color="#cc00aa"
                        inactive-color="#ffaa00"
                        active-text="线性型"
                        inactive-text="指数型"
                        @change="validateType">
                    </el-switch>
                    <el-tooltip class="item" effect="dark" placement="right">
                        <div slot="content">
                            指数型砍价，每次砍掉的价格取决于当前价格，期望值会随着砍价次数增多而减少；<br/>
                            线性型砍价，每次砍掉的价格取决于书本原价，期望值是固定值
                        </div>
                        <el-button type="info" circle>??</el-button>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="单次砍价区间（百分比）">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item prop="min"> 
                                <el-input v-model="newBargain.min" style="width: 100px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">~</el-col>
                        <el-col :span="6">
                            <el-form-item prop="max" required>
                                <el-input v-model="newBargain.max" style="width: 100px;"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 1em;">
                        <el-col :span="24">
                            <span>砍价结束时价格区间：</span>
                            <span>{{minAndMax}}</span>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="起始时间" prop="start_time">
                    <el-date-picker
                        v-model="st"
                        type="datetime"
                        placeholder="选择起始日期时间"
                        :clearable="false"
                        :editable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="end_time">
                    <el-date-picker
                        v-model="ed"
                        type="datetime"
                        placeholder="选择结束日期时间"
                        :clearable="false"
                        :editable="false">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动简介" prop="introduction">
                    <el-input v-model="newBargain.introduction" 
                        type="textarea" 
                        autosize
                        placeholder="在此输入活动描述">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="handleDialogClose(()=>{})">取 消</el-button>
                <el-button type="primary" @click="submitAdd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import BookPicker from './Book_picker.vue';

export default {
    props: {
        visiable: false
    },
    components: {
        BookPicker
    },
    data() {
        var validateBook = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty' || result === 'error' || result === 0) {
                callback(new Error('请选择合法的书籍'));
            } else {
                this.newBargain.book_id = result;
                callback();
            }
        };
        var validateMin = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入最小值'));
            } else if(result === 'error') {
                callback(new Error('请输入合法的0~100间的整数'));
            } else {
                this.newBargain.min = result;
                if(result > 100){
                    callback(new Error('请输入0~100间的整数'));
                } else {
                    if(this.newBargain.times !== null) {
                        if(result * this.newBargain.times > 100) {
                            callback(new Error('砍价最低理论值会小于0'));
                        }
                    }
                    if (this.newBargain.max !== null) {
                        this.$refs.newBargain.validateField('max');
                    }
                    callback();
                }
            }
        };
        var validateMax = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入最大值'));
            } else if(result === 'error') {
                callback(new Error('请输入合法的0~100间的整数'));
            } else {
                this.newBargain.max = result;
                if(result > 100) {
                    callback(new Error('请输入0~100间的整数'));
                } else if(result < this.newBargain.min){
                    callback(new Error('最大值不应比最小值小'));
                } else if(this.newBargain.type === 1) {
                    if(this.newBargain.times !== null && result * this.newBargain.times > 100) {
                        callback(new Error('砍价最低理论值会小于0'));
                    }
                }
                callback();
            }
        };
        var validateTimes = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入次数'));
            } else if(result === 'error' || result == 0) {
                callback(new Error('请输入合法的正整数'));
            } else {
                this.newBargain.times = result;
                this.validateType();
                callback();
            }
        };
        var validatePrice = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入砍价的起价'));
            } else if(result === 'error' || result === 0) {
                callback(new Error('请输入合法的正整数'));
            } else {
                this.newBargain.price = result;
                callback();
            }
        };
        var validateAmount = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入参与活动的书籍书目'));
            } else if(result === 'error') {
                callback(new Error('请输入合法的非负整数'));
            } else {
                this.newBargain.amount = result;
                callback();
            }
        };
        var validateTitle = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请输入标题'));
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
            value = this.st;
            if (value === null || value === 0) {
                callback(new Error('请选择起始时间'));
            } else if(value <= new Date().getTime()) {
                callback(new Error('起始时间不应比现在的时间早'));
            } else {
                if (this.ed !== 0) {
                    this.$refs.newBargain.validateField('end_time');
                }
                callback();
            }
        };
        var validateEd = (rule, value, callback) => {
            value = this.ed;
            if (value === null || value === 0) {
                callback(new Error('请选择结束时间'));
            } else if(value <= new Date().getTime()) {
                callback(new Error('结束时间不应比现在的时间早'));
            } else if(value < this.st) {
                callback(new Error('结束时间不应比起始时间早'));
            } else {
                callback();
            }
        };
        return {
            show: false,
            showBookPicker: false,
            selectedBook: {
                id: null,
                name: null,
                cover: null,
            },
            newBargain: {
                'book_id': null,
                'min': null,
                'max': null,
                'times': null, // 总次数
                'type': 0, // 1 linear, 0 exp
                'price': null,
                'title': null,
                'amount': null,
                'introduction': null,
                'start_time': 0,
                'end_time': 0,
            },
            st: 0,
            ed: 0,
            rules: {
                book_id: [{ validator: validateBook, trigger: 'blur' }],
                min: [{ validator: validateMin, trigger: 'blur' }],
                max: [{ validator: validateMax, trigger: 'blur' }],
                times: [{ validator: validateTimes, trigger: 'blur'}],
                // type: [{ validator: validateType, trigger: 'blur' }],
                price: [{ validator: validatePrice, trigger: 'blur' }],
                title: [{ validator: validateTitle, trigger: 'blur' }],
                amount: [{ validator: validateAmount, trigger: 'blur' }],
                introduction: [{ validator: validateIntro, trigger: 'blur' }],
                start_time: [{ validator: validateSt, trigger: 'blur' }],
                end_time: [{ validator: validateEd, trigger: 'blur' }]
            }
        };
    },
    watch: {
        visiable(value) {
            this.show = value;
            if(value === true) {
                this.st = parseInt(new Date().getTime()/1000/60/60/24)*24*60*60*1000 + 1*60*60*1000;
                this.ed = this.st + 7*24*60*60*1000;
            }
        }
    },
    computed: {
        minAndMax() {
            var bargain = this.newBargain;
            var price = this.util.toValidNumber(bargain.price, false, true);
            var min = this.util.toValidNumber(bargain.min, false, true);
            var max = this.util.toValidNumber(bargain.max, false, true);
            var times = this.util.toValidNumber(bargain.times, false, true);
            var type = this.newBargain.type;
            if(price === 'empty' || price === 'error' 
                || max === 'empty' || max === 'error' 
                || min === 'empty' || min === 'error'
                || times === 'empty' || times === 'error'){
                    return '';
                }
            if(max > 100 || min > 100 || max < min) {
                return '';
            }
            if(type === 0) {
                return Math.ceil(price*Math.pow(1-max/100 ,times)) 
                + '~' +
                Math.ceil(price*Math.pow(1-min/100 ,times));
            } else if(type === 1){
                return Math.ceil(price*(1-max*times/100))
                + '~' +
                Math.ceil(price*(1-min*times/100));
            }
            return '';
        },
        bargainType() {
            return this.newBargain.type;
        }
    },
    methods: {
        validateType() {
            if(this.newBargain.price !== 0 && this.newBargain.price !== null) {
                if (this.newBargain.min !== null) {
                    this.$refs.newBargain.validateField('min');
                }
                if (this.newBargain.max !== null) {
                    this.$refs.newBargain.validateField('max');
                }
            }
        },
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
        beginPick() {
            this.showBookPicker = true;
        },
        giveUpPick() {
            this.showBookPicker = false;
        },
        selectBook(book) {
            this.selectedBook = book;
            this.newBargain.book_id = book.id;

        },
        giveUpAdd() {
            this.$emit('hide');
            this.$refs['newBargain'].resetFields();
            this.newBargain = {
                'book_id': null,
                'min': null,
                'max': null,
                'times': null, // 总次数
                'type': 0, // 1 linear, 0 exp
                'price': null,
                'title': null,
                'amount': null,
                'introduction': null,
                'start_time': 0,
                'end_time': 0,
            }
            this.st = 0;
            this.ed = 0;
        },
        submitAdd() {
            this.$refs['newBargain'].validate((valid) => {
                if (valid) {
                    this.$confirm('这些信息以后将无法修改，确认已完成编辑?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$store.commit('setLoadingStatus', true); 
                        this.postBargain(this.newBargain);
                    }).catch(() => {
                               
                    });
                }
            });
        },
        postBargain(bargain) {
            bargain.start_time = parseInt(this.st/1000);
            bargain.end_time = parseInt(this.ed/1000);
            this.$http.post(this.$store.state.host + '/adminpannel/bargain', 
                bargain,
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return;
                    }
                    switch(code) {
                        case 412: this.$message.error('已存在此活动'); break;
                        case 421: this.$message.error('数据错误'); break;
                        case 422: this.$message.error('最低价为负数'); break;
                        case 200: {
                            this.$message.success('添加成功!');
                            this.giveUpAdd();
                            this.$emit('refreshPage');
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            );
        },
    }
}
</script>

<style scoped>

.image-wrapper {
    width: 300px;
    height: 300px;
}

.book-name {
    margin-top: 10px;
    word-break: break-all;
    font-size: 20px;
}

</style>
