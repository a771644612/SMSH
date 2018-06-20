<template>
    <el-dialog 
        width="800px" 
        size="mini"
        title="新的轮盘" 
        :visible.sync="show"
        :modal-append-to-body="false">
        <el-form
            ref="newRound"
            :rules="rules"  
            :model="newRound"
            label-width="200px"
            :label-position="'right'"
            status-icon>
            <el-form-item label="轮盘活动标题" prop="title">
                <el-input v-model="newRound.title"></el-input>
            </el-form-item> 
            <el-form-item label="每次消耗积分" prop="cost">
                <el-input v-model="newRound.cost"></el-input>
            </el-form-item>
            <el-form-item label="最多抽奖次数" prop="times">
                <el-input v-model="newRound.times"></el-input>
            </el-form-item>
            <el-form-item label="起始时间" prop="start_time">
                <el-date-picker
                    v-model="newRound.start_time"
                    type="datetime"
                    placeholder="选择起始日期时间"
                    :clearable="false"
                    :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="end_time">
                <el-date-picker
                    v-model="newRound.end_time"
                    type="datetime"
                    placeholder="选择结束日期时间"
                    :clearable="false"
                    :editable="false">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="活动简要介绍" prop="brief">
                <el-input v-model="newRound.brief" 
                    type="textarea"
                    min-height
                    :autosize="{ minRows: 2}"
                    placeholder="在此输入轮盘活动描述">
                </el-input>
            </el-form-item>
            <el-form-item label="活动详细介绍" prop="details">
                <el-input v-model="newRound.details" 
                    type="textarea" 
                    :autosize="{ minRows: 3}"
                    placeholder="在此输入轮盘活动描述">
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
export default {
    props: {
        visiable: false
    },
    data() {
        var validateTimes = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入次数'));
            } else if(result === 'error' || value == 0) {
                callback(new Error('请输入合法的正整数'));
            } else {
                this.newRound.times = result;
                callback();
            }
        };
        var validateCost = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入轮盘消耗的积分'));
            } else if(result === 'error' || value == 0) {
                callback(new Error('请输入合法的非负整数'));
            } else {
                this.newRound.price = result;
                callback();
            }
        };
        var validateTitle = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请输入轮盘活动的标题'));
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
                if (this.newRound.end_time !== 0) {
                    this.$refs.newRound.validateField('end_time');
                }
                callback();
            }
        };
        var validateEd = (rule, value, callback) => {
            if (value === null || value === 0) {
                callback(new Error('请选择结束日期'));
            } else if(value < this.newRound.start_time){
                callback(new Error('结束时间不应比起始时间早'));
            } else {
                callback();
            }
        };
        return {
            show: false,
            newRound: {
                'times': null,
                'cost': null,
                'title': null,
                'brief': null,
                'details': null,
                'start_time': 0,
                'end_time': 0,
            },
            rules: {
                times: [{ validator: validateTimes, trigger: 'blur'}],
                // type: [{ }],
                cost: [{ validator: validateCost, trigger: 'blur' }],
                title: [{ validator: validateTitle, trigger: 'blur' }],
                brief: [{ validator: validateIntro, trigger: 'blur' }],
                details: [{ validator: validateIntro, trigger: 'blur' }],
                start_time: [{ validator: validateSt, trigger: 'blur' }],
                end_time: [{ validator: validateEd, trigger: 'blur' }]
            }
        };
    },
    watch: {
        visiable(value) {
            this.show = value;
            if(value === true) {
                this.newRound.start_time = parseInt(new Date().getTime()/1000/60/60/24)*24*60*60*1000;
                this.newRound.end_time = this.newRound.start_time + 7*24*60*60*1000;
            }
        }
    },
    computed: {
        minAndMax() {
            var round = this.newRound;
            var price = this.util.toValidNumber(round.price, false, true);
            var min = this.util.toValidNumber(round.min, false, true);
            var max = this.util.toValidNumber(round.max, false, true);
            var times = this.util.toValidNumber(round.times, false, true);
            var type = this.newRound.type;
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
            this.$refs['newRound'].resetFields();
            this.newRound = {
                'times': null,
                'cost': null,
                'title': null,
                'brief': null,
                'details': null,
                'start_time': 0,
                'end_time': 0,
            }
        },
        submitAdd() {
            this.$refs['newRound'].validate((valid) => {
                if (valid) {
                    this.$confirm('这些信息以后将无法修改，确认已完成编辑?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.postRound(this.newRound);
                    }).catch(() => {
                               
                    });
                }
            });
        },
        postRound(round) {
            round.start_time /= 1000;
            round.end_time /= 1000;
            for(var key in round) {
                console.log(round[key]);
            }
            this.$http.post(this.$store.state.host + '/adminpannel/round', 
                round,
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    if(this.util.sessionCheck(this, response.body['code']) && (response.body['code']===200)){
                        this.$message.success('添加成功!');
                        this.giveUpAdd();
                        this.$emit('refreshPage');
                    }
                    else{
                        round.start_time *= 1000;
                        round.end_time *= 1000;
                        console.log('error');
                        this.$message.error('未知错误，请联系维护人员');
                    }
                }, response => {
                    // error callback
                    round.start_time *= 1000;
                    round.end_time *= 1000;
                    console.log('error');
                    this.$message.error('未知错误，请联系维护人员');
                }
            );
        },
    }
}
</script>

<style scoped>

</style>
