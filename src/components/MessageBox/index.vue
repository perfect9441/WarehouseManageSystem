<template>
  <div>
    <el-badge
      :hidden="unSignCount==0?true:false"
      :value="unSignCount"
      :max="99"
      style="line-height: 25px;margin-top: -5px;"
      @click.native="dialogTableVisible=true"
    >
      <el-button style="padding: 8px 10px;" size="small" type="primary">
        <i class="el-icon-s-promotion"></i>
      </el-button>
    </el-badge>

    <el-dialog :visible.sync="dialogTableVisible" fullscreen>
      <div slot="title">
        <span style="padding-right: 10px;">即时消息</span>
      </div>

      <el-container style="height: 700px; border: 1px solid #eee">
        <el-aside width="20%">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select="handleSelect"
          >
            <el-submenu
              v-for="merchantItem in msgMenuList"
              :index="merchantItem.merchantId"
              :key="merchantItem.merchantId"
            >
              <template slot="title">
                <i class="el-icon-location"></i>

                <span>{{merchantItem.merchantName}}</span>
                <el-badge
                  :hidden="merchantItem.unSignCount==0?true:false"
                  :value="merchantItem.unSignCount"
                  :max="99"
                  style="line-height: 25px;margin-top: -5px;"
                ></el-badge>
              </template>
              <el-menu-item
                v-for="userItem in merchantItem.sendUserList"
                :index="merchantItem.merchantId+userItem.sendUserId"
                :key="merchantItem.merchantId+userItem.sendUserId"
              >
                <img class="avatar" :src="userItem.avatar" alt />
                <span>{{userItem.sendUserName}}</span>
                <el-badge
                  :hidden="userItem.unSignCount==0?true:false"
                  :value="userItem.unSignCount"
                  :max="99"
                  style="line-height: 25px;margin-top: -5px;"
                ></el-badge>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-container>
          <el-header class="main-header">Header</el-header>
          <el-main class="main-main" id="chatRecord">
            <div
              v-for="item in msgList"
              :class="item.sendUserId==userInfo.username+'KF'?'mine':'user'"
            >
              <div class="title">{{item.msg.sendUserName+' '+_formatDate(item.createTime)}}</div>
              <div class="content" v-html="item.msg.msg.content"></div>
            </div>
          </el-main>
          <el-footer class="main-footer" v-if="chooseSendUserId" style="height:150px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="msgContent"
              style="width:60%"
            ></el-input>
            <el-button type="primary" @click="sendText">发送</el-button>
          </el-footer>
        </el-container>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getMsgPageByAttributes } from "@/api/mall/websocket";
import { getMerchantById } from "@/api/mall/merchant";
export default {
  name: "MessageBox",
  computed: {
    ...mapGetters([
      "unSignCount",
      "unSignMsgList",
      "userInfo",
      "sendMsgData",
      "acceptMsgData"
    ])
  },
  data() {
    return {
      dialogTableVisible: false,
      chooseMerchantId: null,
      merchantData: null,
      chooseSendUserId: null,
      unSignMsgMap: {},
      msgMenuList: [],
      msgList: [],
      msgContent: ""
    };
  },
  watch: {
    unSignCount(){
      
        this.processUnSignMsg()
     
    },
    acceptMsgData() {
      console.info("acceptMsgData");
      console.info(this.acceptMsgData);
      this.screenMsg(this.acceptMsgData);
    },
    sendMsgData() {
      console.info("sendMessage");
      console.info(this.sendMsgData);
      this.screenMsg(this.sendMsgData);
    },
    dialogTableVisible() {
      console.info("dialogTableVisible");
      console.info(this.dialogTableVisible);
      if (this.dialogTableVisible) {
        this.processUnSignMsg();
      }
      this.$store.commit("websocket/SET_ISON_PAGE", {
        code: this.dialogTableVisible,
        onPageMerchantId: null,
        onPageUserId: null
      });
    }
  },

  methods: {
    addTextMsg(msg) {
      this.msgList.push(msg);
    },
    screenMsg(msg) {
      //从长连接处转发给这个方法，进行筛选处理

      switch (msg.msgCate) {
        case "IM_CATE_TEXT":
          this.addTextMsg(msg);
          break;
        case "voice":
          this.addVoiceMsg(msg);
          break;
        case "img":
          this.addImgMsg(msg);
          break;
      }
      //滚动到底部
      this.$nextTick(function() {
        let msg = document.getElementById("chatRecord"); // 获取对象
        msg.scrollTop = msg.scrollHeight; // 滚动高度
      });
    },
    sendText() {
      let content = this.replaceEmoji(this.msgContent);
      let msg = { content: content, text: this.msgContent };

      this.sendMsg(msg, "IM_CATE_TEXT");
      this.msgContent = "";
    },
    replaceEmoji(str) {
      let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g);
      return (
        '<div style="display: flex;align-items: center;">' +
        replacedStr +
        "</div>"
      );
    },
    async sendMsg(content, type) {
      let params = {
        acceptUserId: this.chooseSendUserId,
        message: content,
        merchantId: this.chooseMerchantId,
        merchantName: this.merchantData.merchantName,
        msgCate: type,
        merServiceName: this.merchantData.merServiceName
      };
      this.$store.dispatch("websocket/_SendMessage", params);

      this.textMsg = "";
    },
    _formatDate(date) {
      return this.$moment(date).format("MM-DD HH:mm");
    },
    processUnSignMsg() {
      //将缓存数据加载到页面上来
      let value = localStorage.getItem("MsgStorage");
      this.unSignMsgMap = {};
      this.msgMenuList = [];
      if (value) {
        this.unSignMsgMap = JSON.parse(value);
        for (let key in this.unSignMsgMap) {
          let sendUserList = [];
          for (let key2 in this.unSignMsgMap[key].userMap) {
            sendUserList.push(this.unSignMsgMap[key].userMap[key2]);
          }
          this.unSignMsgMap[key].sendUserList = sendUserList;
          this.msgMenuList.push(this.unSignMsgMap[key]);
        }
      }
      console.info(this.unSignMsgMap);
      console.info(this.msgMenuList);
    },
    handleOpen(key, keyPath) {
      console.log("handleOpen");
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log("handleClose");
      console.log(key, keyPath);
    },
    async handleSelect(key, keyPath) {
      console.log("handleSelect");
      console.log(keyPath);
      let sendUserId = keyPath[1].substring(keyPath[0].length);
      this._clearUnsignMsg(keyPath[0], sendUserId);

      this.chooseMerchantId = keyPath[0];
      getMerchantById(this.chooseMerchantId).then(res => {
        this.merchantData = res.data;
      });
      this.chooseSendUserId = sendUserId;
      let params = {
        current: 1,
        size: 50,
        merchantId: this.chooseMerchantId,
        userId: this.chooseSendUserId
      };
      this.$store.commit("websocket/SET_ISON_PAGE", {
        code: this.dialogTableVisible,
        onPageMerchantId: this.chooseMerchantId,
        onPageUserId: this.chooseSendUserId
      });
      let list = [];
      await getMsgPageByAttributes(params).then(res => {
        console.info("getMsgPageByAttributes");

        list = res.data.records;
        for (let i = 0; i < list.length; i++) {
          list[i].msg = JSON.parse(list[i].msg);
        }
      });
      this.msgList = list;
      this.$nextTick(function() {
        let msg = document.getElementById("chatRecord"); // 获取对象
        msg.scrollTop = msg.scrollHeight; // 滚动高度
      });
      console.info(this.msgList);
    },
    _clearUnsignMsg(merchantId, sendUserId) {
      let value = localStorage.getItem("MsgStorage");
      let unSignIdList = [];
      if (value) {
        value = JSON.parse(value);
        //查看是否需要清缓存及store
        if (value[merchantId].userMap[sendUserId]) {
          unSignIdList = value[merchantId].userMap[sendUserId].unSignIdList;
        }
      }
      if (unSignIdList.length > 0) {
        //清除store未读消息信息
        for (let i = 0; i < unSignIdList.length; i++) {
          this.$store.commit("websocket/SUB_UNSIGN", unSignIdList[i]);
        }
        let signparams = JSON.stringify({
          action: "SIGNED",
          notSignedMsgIdsStr: unSignIdList.join(",")
        });
        this.$socket.send(signparams);
        //清除缓存
        this.$store
          .dispatch("websocket/_ProcessSubMsgStorage", {
            merchantId: merchantId,
            sendUserId: sendUserId
          })
          .then(res => {
            // this.processUnSignMsg();
          });
      }
    },
    clearAll() {
      // this.dialogTableVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.message-title {
  font-size: 16px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
.avatar {
  width: 30px;
  height: 30px;
}
.main-header {
  background-color: rgb(238, 241, 246);
  border-bottom: 1px solid #dcdfe6;
}
.main-main {
  background-color: rgb(238, 241, 246);
  border-bottom: 1px solid #dcdfe6;
  padding: 10px;
  .user {
    color: green;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .mine {
    color: blue;

    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .content {
    color: #606266;
    background-color: #dcdfe6;
    max-width: 40%;
    min-height: 50px;
    border-radius: 10px;
    padding: 15px 20px;
    display: flex;
    align-items: center;

    word-break: break-word;
  }
}
.main-footer {
  background-color: rgb(238, 241, 246);
  padding-top: 10px;
}
</style>
