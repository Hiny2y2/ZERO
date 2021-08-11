import Vue from 'vue'
import moment from 'moment'
Vue.prototype.$moment= moment
let v = new Vue();
const transGender= gender=>{
    gender= gender+''
    switch(gender){
        case '3':
            return '保密';
        case '0':
            return '男';
        case '1':
            return '女'
    }
}
const transDate= date=>{
    let ddd= v.$moment(date).format('YYYY年MM月DD日')
    return ddd
}
export {
    transGender,
    transDate
}