<template>
    <div class="comments-container">
        <div class="upper-tools">
            <span class="tools-unit">
                <el-button type="warning" icon="el-icon-refresh" @click.native="refreshPage">刷新评论</el-button>
            </span>
            <span class="tools-unit" v-if="orderByLikes===0">
                <el-button type="primary" icon="el-icon-sort" @click.native="sortChange('likes')">按赞数排序</el-button>
            </span>
            <span class="tools-unit" v-if="orderByLikes===1">
                <el-button type="primary" icon="el-icon-sort" @click.native="sortChange('time')">按时间排序</el-button>
            </span>
            <span class="search-area">    
                <el-input v-model="keyword" placeholder="输入关键字以检索评论内容">
                    <el-button slot="append" type="primary" icon="el-icon-search" @click.native="searchComments"></el-button>
                </el-input>
            </span>
        </div>
        
        <div class="list-wrapper">
            <p class="comment-content" v-if="comments.length === 0">
                还没有评论哦
            </p>
            <template v-else>
                <div v-for="comment in comments"
                    :key="comment.id"
                    class="comment-wrapper">
                    <article class="comment-unit">
                        <el-row class="comment-upper-bar">
                            <el-col class="comment-upper-unit" :span="16">
                                <span class="comment-time">
                                    <el-date-picker
                                        class="comment-time"
                                        v-model="comment.time"
                                        type="datetime"
                                        readonly>
                                    </el-date-picker>
                                </span>
                            </el-col>
                            <el-col class="comment-upper-unit" :span="4">
                                <span class="comment-likes">
                                    点赞数：{{comment.likes}}
                                </span>
                            </el-col>
                            <el-col class="comment-upper-unit" :span="4">
                                <span class="comment-delete">
                                    <el-button type="danger" icon="el-icon-delete" @click.native="deleteComment(comment.id)" circle></el-button>
                                </span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <p class="comment-content"
                                    v-for="content in comment.contents"
                                    :key="content.lineId">
                                    {{content.text}}
                                </p>
                            </el-col>
                        </el-row>
                    </article>
                </div>
            </template>
        </div> 
        <div class="bottom-pagination">
            <el-pagination
                @current-change="getCommentsByPage(pageNo)"
                :current-page.sync="pageNo"
                :page-size="15"
                layout="total, prev, pager, next"
                :total="commentAmount">
            </el-pagination>
        </div>   
    </div>
</template>

<script>
export default {
    props: {
        from: {
            type: String,
            required: true
        },
        id: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            loading: false,
            pageNo: 1,
            pageSize: 20,
            commentAmount: 0,
            keyword: null,
            fliter: {
                'keyword': {
                    'contents': null
                },
                'where': {
                    'wx_id': null,
                    'book_id': null,
                },
                'order': {
                    'time': 1,
                    'likes': 1
                }
            },
            getCommentsTemplate: this.$store.state.host + '/adminpannel/comments/{0}/{1}/{2}/{3}/{4}',
            orderByLikes: 0,
            name: null,
            comments: [],
        }
    },
    mounted() {
        this.$store.commit('setLoadingStatus', false);
        if(this.from === 'book') {
            this.fliter.where = {'book_id': this.id};
        } else if(this.from === 'user') {
            this.fliter.where = {'wx_id': this.id};
        } else {

        }
        this.refreshPage();
    },
    methods: {
        refreshPage() {
            this.$store.commit('setLoadingStatus', true); 
            this.getCommentAmount();
            this.getCommentsByPage(this.pageNo);
        },/*
        handleSizeChange(value) {

        },
        handleCurrentChange(value) {

        },*/
        sortChange(name) {
            var order = this.fliter.order = {};
            switch(name) {
                case 'likes': this.orderByLikes = 1; order['likes'] = 0; break;
                case 'time': this.orderByLikes = 0; order['time'] = 0; break;
                default: this.orderByLikes = 0;
            }
            //if(this.lastOrderType !== null) {
            //    order[this.lastOrderType] = null;
            //}
            //if(col.prop !== null) {
            //    order[col.prop] = col.order === 'ascending'? 1: 0;
                //this.lastOrderType = col.prop;
            //} else {
                //order[this.lastOrderType] = null;
                //order['id'] = 1;
                //this.lastOrderType = null;
            //}
            //this.orderKeywordType = this.lastOrderType;
            this.refreshPage();
        },
        searchComments() {
            if(this.keyword === '') {
                this.fliter.keyword.contents = null;
                return;
            } else {
                this.fliter.keyword.contents = this.keyword;
            }
            /*
            var key = this.whereKeywordType;
            var value = this.whereKeyword;
            this.fliter.where = {};
            if(key !== null && key !== '-') {
                if(value.length === 0) {
                    this.$message.error('请输入内容');
                    return;
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
            }*/
            this.refreshPage();
        },/*
        getComments() {
            this.$http.get(this.$store.state.host + '/adminpannel/comments/'+this.from+'/'+this.orderByLikes+'/'+this.id+'/'+this.pageNo+'/'+this.pageSize,
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.comments = response.body['info'];
                    this.comments.forEach((comment) => {
                        comment.book_id = this.util.toValidNumber(comment.id);
                        comment.time = this.util.toValidNumber(comment.time)*1000;
                        comment.contents = comment.contents.split('\n');
                        for(var i = 0; i < comment.contents.length; ++i) {
                            comment.contents[i] = {'lineId': i, 'text': comment.contents[i]};
                        }
                    });
                },
                this.util.returnFailHandler
            );
        },*/
        deleteComment(cid) {
            this.$store.commit('setLoadingStatus', true); 
            this.$http.delete(this.$store.state.host + '/adminpannel/comment/'+cid,
                {emulateJSON: true}
            ).then(response => {
                    // success callback
                    this.$store.commit('setLoadingStatus', false); 
                    var code = response.body['code'];
                    if(!this.util.sessionCheck(this, code)) {
                        return; 
                    }
                    switch(code) {
                        case 405: this.$message.error('不存在的评论'); break;
                        case 200: {
                            this.$message.success('删除成功!');
                            this.refreshPage();
                            return;
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                    // this.$store.commit('setLoadingStatus', false); 
                }, this.util.returnFailHandler
            ); 
        },
        getCommentAmount() {
            this.$http.post(this.$store.state.host + '/adminpannel/comments/0/0',
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
                            this.commentAmount = response.body['info'];
                        } break;
                        default: this.util.returnFailHandler(response);
                    }
                }, this.util.returnFailHandler
            );
        },
        getCommentsByPage(page) {
            this.$http.post(this.$store.state.host + '/adminpannel/comments/' + page + '/15',
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
                            this.comments = response.body['info'];
                            this.comments.forEach((comment) => {
                                comment.book_id = this.util.toValidNumber(comment.id);
                                comment.time = this.util.toValidNumber(comment.time)*1000;
                                comment.contents = comment.contents.split('\n');
                                for(var i = 0; i < comment.contents.length; ++i) {
                                    comment.contents[i] = {'lineId': i, 'text': comment.contents[i]};
                                }
                            });
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

div.list-wrapper {
    overflow-y: scroll;
    height: 650px;
    padding: 10px 30px;
}
.upper-tools {
    margin-bottom: 20px;
    padding-top: auto;
}
.tools-unit {
    text-align: center;
    vertical-align: middle;
    margin: 0 5px;
}
div.comment-wrapper {
    margin-bottom: 20px;
}
article.comment-unit {
    background-color: white;
    width: 100%;
    padding: 10px;
    box-shadow: 2px 2px 5px #888888;
    border-radius: 4px;
}
.comment-upper-bar {
    /*background-color: antiquewhite;*/
    width: 100%;
    height: 42px;
    /*padding-left: 10px;*/
    /* border: 1px solid #dcdfe6; */
    border-radius: 4px;
}

.comment-upper-unit {
    background-color: white;
}

.comment-time {
    width: 80%;
    height: 100%;
    /*font-size: 16px;
    line-height: 40px;
    text-align: center;*/
}
.comment-likes {
    font-size: 16px;
    line-height: 40px;
    font: bold;
    text-align: center;
}
.comment-delete {
    float: right;
}
p.comment-content {
    background-color: white;
    width: calc(100%-20px);
    margin: 0;
    padding: 10px;
    font-size: 16px;
    word-wrap: break-word;
}

.search-area {
    float: right;
    width: 50%;
    text-align: center;
    margin: 0 10px;
    margin-bottom: 20px;
}

.bottom-pagination {
    text-align: center;
}

.comments-container{
    background-color: white;
}
</style>
