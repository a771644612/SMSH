<template>
    <el-dialog 
        width="800px" 
        size="mini"
        title="新的书籍" 
        :visible.sync="show"
        :before-close="handleDialogClose"
        :modal-append-to-body="false">
        <el-form
            ref="newBook"
            :rules="rules"  
            :model="newBook"
            label-width="200px"
            :label-position="'right'"
            status-icon>
            <el-form-item label="ISBN" prop="ISBN">
                <el-input v-model="newBook.ISBN" style="width: 200px;"></el-input>
            </el-form-item>
            <el-form-item label="书名" prop="name">
                <el-input v-model="newBook.name"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <el-input v-model="newBook.author"></el-input>
            </el-form-item> 
            <el-form-item label="分类" prop="category">
                <el-input v-model="newBook.category"></el-input>
            </el-form-item>  
            <el-form-item label="库存" prop="left">
                <el-input v-model="newBook.left"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input v-model="newBook.price"></el-input>
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
        var validateISBN = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请输入ISBN'));
            } else if(value === '978-7-302-0-0') {
                callback(new Error('请输入合法的ISBN'));
            } else {
                callback();
            }
        };
        var validatePrice = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入书本价格'));
            } else if(result === 'error' || value == 0) {
                callback(new Error('请输入合法的非负整数'));
            } else {
                this.newBook.price = result;
                callback();
            }
        };
        var validateAmount = (rule, value, callback) => {
            var result = this.util.toValidNumber(value, false, true);
            if (result === 'empty') {
                callback(new Error('请输入书籍库存'));
            } else if(result === 'error') {
                callback(new Error('请输入合法的非负整数'));
            } else {
                this.newBook.amount = result;
                callback();
            }
        };
        var validateName = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请输入书名'));
            } else {
                callback();
            }
        };
        var validateAuthor = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请输入作者'));
            } else {
                callback();
            }
        };
        var validateCategory = (rule, value, callback) => {
            if (value === null || value.length === 0) {
                callback(new Error('请输入类别'));
            } else {
                callback();
            }
        };
        return {
            show: false,
            newBook: {
                ISBN: '978-7-302-0-0',
                name: null, 
                category: null,
                author: null,
                left: null, 
                price: null,
                jdlink: 'https://item.jd.com/',
                ddlink: 'http://product.dangdang.com/',
                tmlink: 'https://detail.tmall.com/',
                brief: '一本新书',
                details: '[{"isText":true,"id":1,"text":"暂时没有详细描述"}]'
            },
            rules: {
                ISBN: [{ validator: validateISBN, trigger: 'blur' }],
                name: [{ validator: validateName, trigger: 'blur' }],
                author: [{ validator: validateAuthor, trigger: 'blur' }],
                category: [{ validator: validateCategory, trigger: 'blur' }],
                price: [{ validator: validatePrice, trigger: 'blur' }],
                left: [{ validator: validateAmount, trigger: 'blur' }],
            }
        };
    },
    watch: {
        visiable(value) {
            this.show = value;
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
            this.$refs['newBook'].resetFields();
            this.newBook = {
                ISBN: '978-7-302-0-0',
                name: null,
                category: null,
                author: null,
                left: null,
                price: null,
                jdlink: 'https://item.jd.com/',
                ddlink: 'http://product.dangdang.com/',
                tmlink: 'https://detail.tmall.com/',
                brief: '一本新书',
                details: '[{"isText":true,"id":1,"text":"暂时没有详细描述"}]'
            }
        },
        submitAdd() {
            this.$refs['newBook'].validate((valid) => {
                if (valid) {
                    this.$confirm('请再次确认书籍的ISBN正确，确认已完成编辑?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$store.commit('setLoadingStatus', true); 
                        this.postBook(this.newBook);
                    }).catch(() => {
                               
                    });
                }
            });
        },
        postBook(book) {
            this.$http.post(this.$store.state.host + '/adminpannel/book', 
                book,
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return;
                    }
                    switch(code) {
                        case 411: this.$message.error('图书信息不全'); break;
                        case 421: this.$message.error('请求传参错误'); break;
                        case 422: this.$message.error('已经存在相同ISBN的书籍了，请直接去修改或删除该书'); break;
                        case 200: {
                            this.$message.success('添加成功!');
                            this.$emit('refreshPage');
                            this.giveUpAdd();
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

</style>
