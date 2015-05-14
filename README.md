# imgupload.js

图片上传组件

### 使用方法

```
//引入样式文件
<link rel="stylesheet" href="/appadmin/css/in/imgupload.css">
```

```
<script>
//使用router调用模块或者在模块中require
seajs.use('/appadmin/js/router', function(router) {
    router.load('in/imgupload');
});
</script>
```

配置图片上传接口：
```
<input type="hidden" id="j-imguploadUrl" value="/imgupload/upload.php">
```

自动实例化：
```
//元素name请以`data-name='*'`的方式设置，带上class="j-imgupload"会自动实例化上传组件
<input type="file" data-name="upload1" class="j-imgupload">
```

获得图片地址：
```
//上传组件将会自动生成一个隐藏域用来放置已经上传的图片地址，多个地址用英文逗号隔开
<input type="hidden" name="upload1" value="/imgupload/uploads/1.jpg,/imgupload/uploads/2.jpg,/imgupload/uploads/3.jpg">
```

### 暴露的接口：
```
var ele=document.querySelector("#inputfile");
var imgupload=new ImgUpload(ele);
```