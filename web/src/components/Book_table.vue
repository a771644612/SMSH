<template>
    <div class="container">
        <div class="upper-tools">
            <span class="tools-unit">
                <el-button type="success" icon="el-icon-refresh" @click.native="refreshPage" circle></el-button>
            </span>
            <span class="tools-unit">
                <el-button type="primary" icon="el-icon-plus" @click.native="addBook" circle></el-button>
            </span>
            <span class="tools-unit">
                <el-button type="danger" icon="el-icon-delete" @click.native="deleteBooks" circle></el-button>
            </span>
        </div>

        <div class="new-book-form-wrapper">
            <new-book-dialog
                v-show="showNewBookForm"
                @hide="giveUpAdd"
                @refreshPage="refreshPage"
                :visiable="showNewBookForm">
            </new-book-dialog>
        </div>

        <div class="grid-content bg-white">
            <el-row class="row-margin">
                <el-col :span="11" >
                    <div>
                        <span>精确约束：</span>
                        <el-select class="fliter-select" v-model="whereKeywordType" @change="whereChange" placeholder="选择字段">
                            <el-option v-for="item in whereFliters"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">
                                    {{ item.label }}
                                </span>
                            </el-option>
                        </el-select>
                        <el-input class="fliter-input" 
                            v-if="whereKeywordType !== null && whereKeywordType !== '-'"
                            v-model="whereKeyword" 
                            placeholder="输入筛选条件">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="11" >
                    <div>
                        <span>模糊检索：</span>
                        <el-select class="fliter-select" v-model="likeKeywordType" @change="likeChange" placeholder="选择字段">
                            <el-option v-for="item in likeFliters"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                <span style="float: left">
                                    {{ item.label }}
                                </span>
                            </el-option>
                        </el-select>
                        <el-input class="fliter-input" 
                            v-if="likeKeywordType !== null && likeKeywordType !== '-'"
                            v-model="likeKeyword" 
                            placeholder="输入筛选条件">
                        </el-input>
                    </div>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" icon="el-icon-search" @click.native="searchBook">检索</el-button>
                </el-col>
            </el-row>
        </div>

        <div class="table-wrapper">
            <el-table
                ref="multipleTable"
                :data="books"
                :row-key="getRowKeys"
                :expand-row-keys="expands"
                @selection-change="handleSelectionChange"
                @sort-change="sortChange"
                v-loading="loading"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.6)"
                border
                stripe
                tooltip-effect="dark"
                style="width:100%"
                :height="tableHeight">
                <el-table-column
                    type="selection"
                    width="55"
                    fixed="left"
                    header-align="center">
                </el-table-column>
                <el-table-column 
                    label="更多操作" 
                    type="expand" 
                    width="100"
                    fixed="left">
                    <template slot-scope="scope">
                        <div class="inline-tools">
                            <el-dialog 
                                width="800px" 
                                top="3vh"
                                title="评论列表" 
                                :visible.sync="scope.row.showComments"
                                :modal-append-to-body="false">
                                <comment-list from="book" v-bind:id="scope.row.id"/>
                            </el-dialog>
                            <span v-if="!scope.row.isEditing" class="tools-unit">
                                <el-button type="info" icon="el-icon-search" @click.native="scope.row.showComments=true">
                                    查看评论
                                </el-button>
                            </span>
                            <span v-if="!scope.row.isEditing" class="tools-unit">
                                <el-button type="warning" icon="el-icon-edit" @click.native="editBook(scope.row)">
                                    快速编辑
                                </el-button>
                            </span>
                            <span v-if="!scope.row.isEditing" class="tools-unit">
                                <router-link 
                                    @click.native="recoverBook(scope.row)"
                                    :to="$store.state.host + '/adminpannel/editor/' + scope.row.id"
                                    tag="el-button">
                                    <i class="el-icon-edit">
                                    </i>
                                    编辑商品页
                                </router-link>
                            </span>
                            <span v-if="scope.row.isEditing" class="tools-unit">
                                <el-button type="primary" @click.native="saveBook(scope.row)">
                                    保存编辑
                                </el-button>
                            </span>
                            <span v-if="scope.row.isEditing" class="tools-unit">
                                <el-button type="danger" @click.native="recoverBook(scope.row)">
                                    取消编辑
                                </el-button>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="封面"
                    width="60"
                    header-align="center">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            width="300"
                            trigger="hover">
                            <div class="image-wrapper">
                                <img :src="scope.row.cover" width="300px" height="300px"/>
                            </div>
                            <el-button slot="reference" icon="el-icon-search" circle></el-button>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    label="ISBN"
                    prop="ISBN"
                    width="150"
                    header-align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">
                            {{scope.row.ISBN}}
                        </span>
                        <span v-if="scope.row.isEditing">
                            <el-input v-model="scope.row.ISBN" placeholder="请输入内容"/>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="书籍名称"
                    prop="name"
                    sortable="custom"
                    width="400"
                    header-align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">
                            {{scope.row.name}}
                        </span>
                        <span v-if="scope.row.isEditing">
                            <el-input v-model="scope.row.name" placeholder="请输入内容"/>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="书籍类别"
                    prop="category"
                    width="150"
                    sortable="custom"
                    header-align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">
                            {{scope.row.category}}
                        </span>
                        <span v-if="scope.row.isEditing">
                            <el-input v-model="scope.row.category" placeholder="请输入内容"/>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="作者"
                    prop="author"
                    sortable="custom"
                    header-align="center">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">
                            {{scope.row.author}}
                        </span>
                        <span v-if="scope.row.isEditing">
                            <el-input v-model="scope.row.author" placeholder="请输入内容"/>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="销量"
                    prop="sales"
                    sortable="custom"
                    width="100"
                    header-align="center"
                    align="right">
                </el-table-column>
                <el-table-column
                    label="库存"
                    prop="left"
                    sortable="custom"
                    width="100"
                    header-align="center"
                    align="right">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing" :class="{short : scope.row.left <= 10}">
                            {{scope.row.left}}
                        </span>
                        <span v-if="scope.row.isEditing">
                            <el-input v-model="scope.row.left" placeholder="请输入内容"/>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="原价"
                    prop="price"
                    sortable="custom"
                    width="120"
                    header-align="center"
                    align="right">
                    <template slot-scope="scope">
                        <span v-if="!scope.row.isEditing">
                            {{scope.row.price}}
                        </span>
                        <span v-if="scope.row.isEditing">
                            <el-input v-model="scope.row.price" placeholder="请输入内容"/>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="bottom-pagination">
            <el-pagination
                fixed
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageNo"
                :page-size="pageSize"
                :page-sizes="[10, 15, 20]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="bookAmount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import NewBookDialog from './Book_new_dialog.vue';
import CommentList from './Comment_list.vue';


export default {
    components: {
        NewBookDialog, // NewBookDialog: () => import('./Book_new_dialog.vue'),
        CommentList, //CommentList: () => import('./Comment_list.vue')
    },
    data () {
        return {
            loading: false,
            loadingText: "玩命加载中",
            bookAmount: 21,
            maxPage: 0,
            pageNo: 1,
            lastPage: 1,
            pageSize: 10,
            lastSize: 10,
            selectedAll: false,
            editing: -1,
            showNewBookForm: false,
            expands: [],
            multipleSelection: [],
            tableHeight: 600,
            newBook: null,
            whereKeywordType: null,
            whereKeyword: null,
            likeKeywordType: null,
            likeKeyword: null,
            orderKeywordType: 'id',
            whereFliters: [
                {value: '-', label: '-'},
                {value: 'ISBN',label: 'ISBN'},
                {value: 'name',label: '书籍名称'},
                {value: 'category',label: '书籍分类'},
                {value: 'author',label: '作者'},
                {value: 'left',label: '库存'},
                {value: 'price',label: '价格'},
                {value: 'pageview',label: '浏览量'},
                {value: 'sales',label: '销量'},
            ],
            likeFliters: [
                {value: '-', label: '-'},
                {value: 'ISBN',label: 'ISBN'},
                {value: 'name',label: '书籍名称'},
                {value: 'category',label: '书籍分类'},
                {value: 'author',label: '作者'}
            ],
            fliter: {
                keyword: {/*
                    'ISBN': null, 
                    'name': null, 
                    'category': null,
                    'author': null, 
                    'brief': null, 
                    'details': null,*/
                },
                where: {/*
                    'id': null, 
                    'ISBN': null, 
                    'name': null, 
                    'category': null, 
                    'author': null, 
                    'left': null, 
                    'price': null, 
                    'pageview': null, 
                    'sales': null,*/
                },
                order: {
                    'id': 1, 
                    /*'name': null, 
                    'category': null, 
                    'author': null, 
                    'left': null, 
                    'price': null, 
                    'pageview': null, 
                    'sales': null,*/
                }
            },
            books: [
                // {isEditing: false, index:1,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:2,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:3,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:4,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:5,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:6,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:7,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:8,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:9,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:10,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:11,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:12,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:13,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:14,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:15,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:16,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:17,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:18,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:19,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:20,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
                // {isEditing: false, index:21,ISBN: '978-7-302-0-0',name: null, category: null,author: null,left: null, price: null,},
            ],
        }
    },
    computed: {
        isEditing() {
            return this.editing !== -1;
        }
    },
    mounted() {
        this.refreshPage();
    },
    methods: {
        refreshPage() {
            this.pageLeaveEnsure((sure) => {
                if(sure) {
                    this.$store.commit('setLoadingStatus', true);
                    this.getBookAmount();
                    this.getBookByPage(this.pageNo);
                }
            });
        },
        pageLeaveEnsure(callback) {
            if(this.isEditing) {
                this.$confirm('当前仍有正在进行的编辑，确定要放弃这些编辑加载新的一页?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.giveUpEdit({isEditing:false});
                    callback(true);
                }).catch(() => {
                    this.$message.info('已取消');
                    callback(false);
                });
            } else {
                callback(true);
            }
        },
        handleSizeChange(value) {
            this.pageLeaveEnsure((sure) => {
                if(sure) {
                    this.pageNo = this.lastPage = 1;
                    this.lastSize = this.pageSize = value;
                    this.refreshPage();
                } else {
                    this.pageSize = this.lastSize;
                }
            });
        },
        handleCurrentChange(value) {
            this.pageLeaveEnsure((sure) => {
                if(sure) {
                    this.pageNo = this.lastPage = value;
                    this.refreshPage();
                } else {
                    this.pageNo = this.lastPage;
                }
            });
        },
        whereChange(type) {/*
            var where = this.fliter.where;
            if(this.lastWhereType !== null) {
                where[this.lastWhereType] = null;
            }
            if(type === '-') {
                type = null;
            }
            this.lastWhereType = type;*/
        },
        likeChange(type) {/*
            var like = this.fliter.keyword;
            if(this.lastLikeType !== null) {
                like[this.lastLikeType] = null;
            }
            if(type === '-') {
                type = null;
            }
            this.lastLikeType = type;*/
        },
        sortChange(col) {
            var order = this.fliter.order = {};
            /*
            if(this.lastOrderType !== null) {
                order[this.lastOrderType] = null;
            }*/
            if(col.prop !== null) {
                order[col.prop] = col.order === 'ascending'? 1: 0;
                //this.lastOrderType = col.prop;
            } else {
                //order[this.lastOrderType] = null;
                order['id'] = 1;
                //this.lastOrderType = null;
            }
            //this.orderKeywordType = this.lastOrderType;
            this.searchBook();
        },
        searchBook() {
            var key = this.whereKeywordType;
            var value = this.whereKeyword;
            this.fliter.where = {};
            if(key !== null && key !== '-') {
                if(value.length === 0) {
                    this.$message.error('请输入内容');
                    return;
                }
                switch(key) {
                    case 'left':case 'price':case 'pageview':case 'sales':
                        value = this.util.toValidNumber(value, false, true);
                        if(value === 'empty') {
                            this.$message.error('请输入内容');
                            return;
                        } else if(value === 'error') {
                            this.$message.error('请输入合法的正整数');
                            return;
                        }
                        break;
                    default: break;
                }
                this.fliter.where[key] = value;
            }
            var key = this.likeKeywordType;
            var value = this.likeKeyword;
            this.fliter.keyword = {};
            if(key !== null && key !== '-') {
                if(value.length === 0) {
                    this.$message.error('请输入内容');
                    return;
                }
                this.fliter.keyword[key] = value;
            }
            this.refreshPage();
        },
        modifiedBook(index, book) {
            book.index = index;
            book.selected = false;
            book.isEditing = false;
            book.showComments = false;
            return book;
        },
        cloneRow(row) {
            var obj = new Object();
            for(var key in row){
                obj[key] = row[key];
            }
            return obj;
        },
        getRowKeys(row) {
            return row.index;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // TODO 反选
        checkBookNumber(number, name) {
            var result = this.util.toValidNumber(number, false, true);
            switch (result) {
                case 'error':
                    this.$message.error('请输入合法的'+name);
                    return false;
                case 'empty':
                    this.$message.error('还没有输入'+name);
                    return false;
            }
            return true;
        },
        checkBookInfo(book) {
            if(book.ISBN === '978-7-302-0-0') {
                this.$message.error('请输入正确的ISBN');
                return false;
            }
            if(book.name.length === 0 || book.name === null) {
                this.$message.error('请输入书名');
                return false;
            }
            if(book.author.length === 0 || book.author === null) {
                this.$message.error('请输入作者');
                return false;
            }
            if(!this.checkBookNumber(book.price, '价格') || !this.checkBookNumber(book.left, '库存')) {
                this.$message.error('请输入合法的价格和库存数字');
                return false;
            }
            return true;
        },
        addBook() {
            if(this.isEditing)
            {
                this.$message.error('请完成当前的编辑再添加新的书籍');
                return;
            }
            this.showNewBookForm = true;
        },
        giveUpAdd() {
            this.showNewBookForm = false;
        },
        giveUpEdit(row) {
            this.$store.commit('setEditStatus', false);
            row.isEditing = false;
            this.editing = -1;
        },
        editBook(row) {
            if(this.isEditing)
            {
                this.$message.error('请完成当前的编辑再编辑另一本书');
                return;
            }
            this.newBook = this.cloneRow(row);
            row.isEditing = true;
            this.$store.commit('setEditStatus', true);
            this.editing = row.index;
        },
        saveBook(row) {
            if(!this.checkBookInfo(row)) {
                // this.$message.error('信息有误');
                return;
            }
            this.$store.commit('setLoadingStatus', true); 
            this.postBook(row);
        },
        recoverBook(row) {
            if(!this.isEditing)
            {
                return;
            }
            this.books[this.editing-1] = this.newBook;
            this.newBook = null;
            this.giveUpEdit(row);
            this.$message.success('已撤销修改!');
        },
        deleteBooks() {
            if(this.isEditing)
            {
                this.$message.error('请完成当前的编辑再删除书籍');
                return;
            }
            var sum = this.multipleSelection.length;
            if(sum === 0)
            {
                this.$message.error('没有选择书籍');
                return;
            }
            this.$confirm('确定删除这' + sum + '本书籍?', '提示', {
                confirmButtonText: '确定删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.commit('setLoadingStatus', true); 
                this.multipleSelection.forEach((item) => {
                    this.removeBook(item);
                })
                this.refreshPage();
            }).catch(() => {
                this.$message.info('已取消删除');          
            });
        },
        getBookAmount() {
            this.$http.post(this.$store.state.host + '/adminpannel/books/page/0/0',
                {'keyword': JSON.stringify(this.fliter.keyword),
                'where': JSON.stringify(this.fliter.where),
                'order': JSON.stringify(this.fliter.order)},
                {emulateJSON: true}
            ).then(response => {
                    // success callback，加载整页书籍
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(code)) {
                        return; 
                    }
                    switch(code) {
                        case 402: this.$message.error('非法的页码'); break;
                        case 200: {
                            this.bookAmount = response.body['info'];
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
        },
        postBook(book) {
            if(book.details === undefined || book.details === null) {
                book['details'] = '[{"isText":true,"id":1,"text":"暂时没有详细描述"}]';
            }
            if(book.brief === undefined || book.brief === null) {
                book['brief'] =  '一本新书';
            }
            this.$http.post(this.$store.state.host + '/adminpannel/book', 
                book,
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(code)) {
                        return;
                    }
                    switch(code) {
                        case 411: this.$message.error('图书信息不全'); break;
                        case 421: this.$message.error('请求传参错误'); break;
                        case 422: this.$message.error('已经存在相同ISBN的书籍了，请直接去修改或删除该书'); break;
                        case 200: {
                            this.$message.success('添加成功!');
                            this.giveUpEdit(book);
                            this.refreshPage();
                            return;
                        } break;
                        default: this.util.returnFailHandler(response); 
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            );
        },
        getBookById(id) {
            this.$http.get(this.$store.state.host + '/adminpannel/book/'+id, 
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(code)) {
                        return; 
                    }
                    switch(code) {
                        case 404: this.$message.error('非法的图书id'); break;
                        case 405: this.$message.error('数据库中不存在对应id的书'); break;
                        case 200: {
                            this.books = [response.body['info']];
                            this.bookAmount = 1;
                            this.$message.success('加载图书成功');
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            );
        },
        /**
         * 
         */
        getBookByPage(page) {
            this.$http.post(this.$store.state.host + '/adminpannel/books/page/' + page + '/' + this.pageSize,
                {'keyword': JSON.stringify(this.fliter.keyword),
                'where': JSON.stringify(this.fliter.where),
                'order': JSON.stringify(this.fliter.order)},
                {emulateJSON: true}
            ).then(response => {
                    // success callback，加载整页书籍
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(code)) {
                        return; 
                    }
                    switch(code) {
                        case 402: this.$message.error('非法的页码'); break;
                        case 200: {
                            this.books = [];
                            var i = 0;
                            var booksGet = response.body['info'];
                            booksGet.forEach((book) => {
                                this.books.push(this.modifiedBook(i+1, book));
                                ++i;
                            });
                            this.$message.success('加载图书成功');
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            );
        },
        removeBook(book) {
            this.$http.delete(this.$store.state.host + '/adminpannel/book/' + book.id, 
                {emulateJSON: true}
            ).then(response =>{
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(code)) {
                        return; 
                    }
                    switch(code) {
                        case 404: this.$message.error('非法的图书id'); break;
                        case 405: this.$message.error('数据库中不存在对应id的书'); break;
                        case 200: {
                            this.$notify.success({
                                title: '任务完成',
                                message: '删除图书《'+book.name+'》成功!'
                            });
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
        }
    }
}
</script>

<style scoped>

.container {
    background-color: #aaccffaa;
    padding: 20px;
    min-width: 600px;
}

.bg-white {
    background: white;
}

.grid-content {
    border-radius: 4px;
    min-height: 40px;
    padding:5px 20px;
    margin: 10px 0;
}

.row-margin{
    margin: 1em;
}

.fliter-input {
    width: 55%;
    min-width: 300px;
    margin-left: 10px;
}

.fliter-select {
    width: 150px;
}

.table-wrapper {
    background-color: lightcyan;
    padding: 10px;
    min-width: 600px;
    width: auto;
}

.image-wrapper {
    width: 300px;
    height: 300px;
}

.inline-tools {
    position: relative;
    width: 100%;
    padding-left: 180px;
}

.upper-tools {
    margin-bottom: 20px;
    padding-top: auto;
}

.tools-unit {
    text-align: center;
    margin-right: 10px;
}

.bottom-pagination {
    margin-top: 20px;
    text-align: center;
}

.short {
    background-color: lightpink;
    color: red;
}

.table-expand {
    font-size: 0;
}

.table-expand label {
    width: 90px;
    color: #99a9bf;
}

.table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 60%;
    padding-left: 80px;
    text-align: left;
}

.el-table td {
    padding: 0!important;
}

</style>
