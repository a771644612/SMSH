<template>
    <el-dialog 
        width="800px"
        top="2vh"
        size="mini"
        :visible.sync="show"
        :before-close="handleDialogClose"
        :modal-append-to-body="false">
        <div slot="title" class="dialog-header">
            <div>
                选择一本书
            </div>
        </div>
        
        <div class="search-area">
            <el-input v-model="keyword" maxlength="10" placeholder="输入书籍名称或作者进行检索">
                <el-button slot="append" type="primary" icon="el-icon-search" @click.native="searchBook"></el-button>
            </el-input>
        </div>
        
        <div class="book-list">
            <el-row>
                <el-col v-if="books.length === 0">
                    <div class="no-book-info">
                        还没有书哦:(
                    </div>
                </el-col>
                <el-col style="margin:10px;" 
                    :span="4" 
                    v-for="book in books" 
                    :key="book.id"
                    @click.native="selectBook(book)">
                    <div class="card-wrapper">
                        <div v-show="selected.id === book.id" class="selected-mask">
                            <i type="primary" class="el-icon-check">已选择</i>
                        </div>
                        <el-card :body-style="{ padding: '0px' }">
                            <img style="margin: 0 2px;" width="120" height="120" :src="book.cover"/>
                            <div style="padding: 2px 10px;">
                                <div class="book-author">{{book.author}}</div>
                                <div class="book-name">{{book.name}}</div>
                            </div>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="bottom-pagination">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="page"
                :page-size="15"
                layout="total, prev, pager, next"
                :total="amount">
            </el-pagination>
        </div>
        <div slot="footer" class="dialog-footer">
            <span class="selected-book">
                已选定:
                <span>
                    <el-input v-model="selected.id"
                        style="width:80px;"
                        :readonly="true"
                        placeholder="id">
                    </el-input>
                </span>
                <span>
                    <el-input v-model="selected.name"
                        style="width:250px;"
                        :readonly="true"
                        placeholder="书籍名称">
                    </el-input>
                </span>
                <span>
                    <el-input v-model="selected.author"
                        style="width:150px;"
                        :readonly="true"
                        placeholder="作者">
                    </el-input>
                </span>
            </span>
            <span>
                <el-button type="danger" 
                    icon="el-icon-close"
                    @click="handleDialogClose(()=>{})"
                    circle>
                </el-button>
                <el-button type="primary" 
                    icon="el-icon-check"
                    :disabled="selected.id === null"
                    @click="submitAdd" 
                    circle >
                </el-button>
            </span>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visiable: false,
        selectedBook: null,
    },
    data() {
        return {
            show: false,
            page: 1,
            amount: 0,
            keyword: null,
            fliter: {
                'keyword': {
                    'name': null,
                    'author': null,
                },
                'where': {},
                'order': {
                    'id': 1,
                    'name': 1
                }
            },
            selected: {
                id: null,
                name: null,
                author: null,
            },
            emptyBook: {
                id: null,
                name: null,
                author: null,
            },
            books:[],
        };
    },
    watch: {
        visiable(value) {
            this.show = value;
        },
        selectedBook(value) {
            this.selected = value;
        }
    },
    computed: {

    },
    mounted() {
        this.refreshPage();
    },
    methods: {
        refreshPage() {
            this.$store.commit('setLoadingStatus', true); 
            this.getBookAmount();
            this.getBookByPage(this.page);
        },
        handleCurrentChange(value) {
            this.page = value;
            this.refreshPage();
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
        selectBook(book) {
            if(book.id === this.selected.id) {
                this.selected = {id: null, name: null, author: null};
            } else {
                this.selected = book;    
            }
        },
        searchBook() {
            this.fliter.keyword.name = this.keyword;
            this.fliter.keyword.author = this.keyword;
            this.refreshPage();
        },
        giveUpAdd() {
            this.$emit('hide');
            this.show = false;
            if(this.selected['id'] !== this.selectedBook['id']) {
                this.selected = this.selectedBook;
            }
        },
        submitAdd() {
            this.$emit('selectBook', this.selected);
            this.giveUpAdd();
        },
        getBookAmount() {
            this.$http.post(this.$store.state.host + '/adminpannel/books/page/0/0',
                {'keyword': JSON.stringify(this.fliter.keyword),
                'where': JSON.stringify(this.fliter.where),
                'order': JSON.stringify(this.fliter.order)},
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 402: this.$message.error('非法的页码'); break;
                        case 200: {
                            this.amount = response.body['info'];
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
        },
        getBookByPage(page) {
            this.$http.post(this.$store.state.host + '/adminpannel/books/page/' + page + '/15',
                {'keyword': JSON.stringify(this.fliter.keyword),
                'where': JSON.stringify(this.fliter.where),
                'order': JSON.stringify(this.fliter.order)},
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 402: this.$message.error('非法的页码'); break;
                        case 200: {
                            this.books = response.body['info'];
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

.el-dialog__body {
    padding-top: 10px;
}

.no-book-info {
    text-align: center;
    font-size: 30px;
    padding-top: 200px;
}

.card-wrapper {
    position: relative;
}

div.card-wrapper:hover {
    box-shadow: 0 0 16px #ffc400aa;
    transition: all .1s ease-in;
}

div.selected-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 126px;
    height: 132px;
    padding-top: 60px;
    color: aliceblue;
    background-color: #00000088;
    box-shadow: 0 0 16px #0066ffaf;
    transition: all .1s ease-in;
    text-align: center;
}

.book-list {
    height: 660px;
    /*overflow-y: scroll;*/
}

.book-name {
    font-size: 14px;
    line-height: 14px;
    height: 42px;
    word-break: break-all;
}

.book-author {
    color: #999;
    font-size: 10px;
    margin-bottom: 4px;
    /*word-break: break-all;*/
}

.selected-book {
    float: left;
    margin-left: 20px;
}

.bottom-pagination {
    text-align: center;
}

.search-area {
    width: 60%;
    text-align: center;
    margin: 0 10px;
    margin-bottom: 20px;
}

</style>
