import BSON from 'bson'
import Vue from 'vue'
import store from '@/store/index'
import publicText from '@/assets/js/publicText.service'
let v = new Vue();
class WebSocketClass {
    constructor(name) {
        this.connect(name);
        this.status= '';
        this.receiveMSG= ''
    }
    decodeNetData (data){
        if (data instanceof  ArrayBuffer) {
            var dv = new DataView(data);
            var uint8array = new Uint8Array(data, 0, dv.byteLength);
            var obj = BSON.deserialize(uint8array);
            return obj;
        }
    }
    encodeNetData (obj){
        // 把Body编码成msgpack格式
        var mpack = BSON.serialize(obj);
        
        var buffer = new ArrayBuffer(mpack.length);
        var view = new DataView(buffer);

        // 打包Body消息体
        for (var j = 0; j < mpack.length; j++) {
            view.setUint8(j, mpack[j]);
        }
        return buffer;
    }
    connect(name) {
        this.ws = new WebSocket(name);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = e => {
            this.status = 'open';
            console.log(`${name}连接成功`, e);
            setInterval(()=>{
                this.heartBeat()
            }, 30000)
        };
        this.ws.onmessage= (e)=>{
            let msg= this.decodeNetData(e.data)
            this.receiveMSG= msg
            this.msgHandle(msg)
        }
    }
    msgHandle(msg){
        console.log(msg, '接收到的')
        //登录
        if(msg.code == "SUCCESS"){
            if(msg.type == 'login'){
                v.$bus.$emit('login', msg)
                // store.dispatch('setLogin', msg)
                store.dispatch('setLoginStatus', true)
                v.$bus.$emit(publicText.LOGIN, true)
            }
            //注册
            if(msg.type == 'register'){ 
                v.$alert(msg.desc, '提示', {
                    confirmButtonText: '确定',
                });
            }
            //获取用户个人信息
            if(msg.type == publicText.GET_USER_BASIC_INFO){
                v.$bus.$emit(publicText.GET_USER_BASIC_INFO, msg.data)
            }
            //获取朋友圈
            if(msg.type == publicText.GET_TALK_LIST){
                v.$bus.$emit(publicText.GET_TALK_LIST, msg.data)
            }
            //获取好友列表
            if(msg.type == publicText.GET_FRIEND_LIST){
                v.$bus.$emit( publicText.GET_FRIEND_LIST, msg.data)
            }
            //发送/接收消息(聊天)
            if(msg.type == publicText.SEND_MSG){
                if(msg.data){ //收到消息
                    v.$bus.$emit( publicText.GET_CHAT, msg.data)
                }else{ //发送消息
                    v.$bus.$emit( publicText.SEND_MSG, msg.desc)
                }
                
            }
            //获取服务器列表
            if(msg.type == publicText.GET_SERVER_LIST){
                v.$bus.$emit( publicText.GET_SERVER_LIST, msg.data)
            }
            //搜索添加好友的列表
            if(msg.type == publicText.SEARCH_USER){
                v.$bus.$emit( publicText.SEARCH_USER, msg.data)
            }
            //获取所有房间
            if(msg.type == publicText.GET_ROOM_LIST){
                v.$bus.$emit( publicText.GET_ROOM_LIST, msg.data)
            }
            //更新个人信息
            if(msg.type == publicText.UPDATE_USER_BASIC_INFO){
                v.$bus.$emit( publicText.UPDATE_USER_BASIC_INFO, msg)
            }
            //全局搜索房间
            if(msg.type == publicText.SEARCH_ROOM_COPY){
                console.log(msg.data)
                v.$bus.$emit( publicText.SEARCH_ROOM_COPY, msg.data)
            }
            //注册
            if(msg.type == publicText.REGISTER){
                v.$bus.$emit( publicText.REGISTER, msg)
            }
            //重置密码
            if(msg.type == publicText.RESETPWD){
                v.$bus.$emit( publicText.RESETPWD, msg)
            }
            //获取好友详情信息
            if(msg.type == publicText.GET_FRIEND_BASIC_INFO){
                v.$bus.$emit( publicText.GET_FRIEND_BASIC_INFO, msg.data)
            }
            //进入房间密码验证
            if(msg.type == publicText.CHECK_IN_ROOM){
                v.$bus.$emit( publicText.CHECK_IN_ROOM, msg.data)
            }
            //进入房间密码验证
            if(msg.type == publicText.GET_APPLY_FRIEND_LIST){
                v.$bus.$emit( publicText.GET_APPLY_FRIEND_LIST, msg)
            }
            //删除好友后的返回消息
            // if(msg.type == publicText.DELETE_FRIEND){
            //     v.$bus.$emit( publicText.GET_ROOM_LIST, msg.data)
            // }
            
        }else{
            if(msg.type != 'tick'){
                v.$message({
                    message: msg.desc,
                    type: 'warning'
                });      
    
            }
            // v.$alert(msg.desc, '提示', {
            //     confirmButtonText: '确定',
            // });

        }
    }
    heartBeat(){
        let msg= `{type:"tick"}`
        //console.log('保活')
        this.sendMsg(msg)
    }
    sendMsg(msg){
        console.log(msg, '发送前')
        this.ws.send(this.encodeNetData(eval('('+msg+')')))
    }
    close() {
        this.ws.send('close');
        this.ws.close();
        console.log('close');
    }
}

export default WebSocketClass;
