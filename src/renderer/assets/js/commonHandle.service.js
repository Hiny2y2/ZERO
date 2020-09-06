const commonHandle= { //存放通用方法
    imageToBase64 (file) {
        let imgSrc= ''
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            console.log('file 转 base64结果：' + reader.result)
            imgSrc = reader.result;
            return imgSrc
        }
        reader.onerror = function (error) {
            console.log('Error: ', error)
        }
        
    },

}
export default commonHandle