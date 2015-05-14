# imgupload.js

图片上传插件

### 使用方法

```
//引入样式文件
<link rel="stylesheet" href="/appadmin/css/in/imgupload.css">

//use
<script>
seajs.use('src/imgupload.js')
</script>
```

### 配置上传图片接口：

以页面埋点的形式配置：
```
<input type="hidden" id="j-imguploadUrl" value="/imgupload/upload.php">
```

### 实例化：

```
<input type="file" data-name="upload1" class="j-imgupload">
```

表单元素name将以`data-name='*'`的形式设置，并且带上class="j-imgupload",插件会自动实例化