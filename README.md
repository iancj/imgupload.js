# imgupload.js

图片异步上传组件


## 使用方法

#### 引入文件

```js
<link rel="stylesheet" href="imgupload.css">
<script src="imgupload.js"></script>
```

#### 自动实例化

`input[type=file]` 需要设置 `data-name` `class="j-imgupload"` ，将上传接口地址写入input[type=file]，id需要设置为 `id="j-imguploadUrl"` ，限制图片类型、限制图片尺寸请以`data-*=""`的形式传入

```html
<section>
	<input type="file" data-name="upload2" data-fileTypeExts="*.png|*.jpg" data-imgSizeExts="320*640" class="j-imgupload"> 
	<p>请上传320*640的图片</p>
	<input type="hidden" id="j-imguploadUrl" value="/imgupload/upload.php"><!-- 上传接口埋点 -->
</section>
```

#### 手动实例化

```html
<section class="pdt20">
	<input type="file" data-name="upload1" multiple id="j-upload1">
	<p>请上传宽度超过100px的图片</p>
	<button id="btn-get1">获取方法二已上传图片路径</button>
	<p></p>
</section>
```

```js
<script>
var upload1=new ImgUpload({
	el:document.querySelector("#j-upload1"),
	uploadUrl:"/imgupload/upload.php",
	fileTypeExts:"*.png|*.jpg|*.jpeg|*.gif",
	imgSizeExts:"100*"
});

document.querySelector("#btn-get1").addEventListener("click",function(){
	this.nextElementSibling.innerHTML=upload1.getURLs().join(",");
},false);
</script>
```

### 配置插件

每一个实例化的ImgUpload都可以单独配置参数，参数列表如下：

#### options.el 

当前需要实例化的input[type=file]

```js
<script>
var upload1=new ImgUpload({
	el:document.querySelector("#j-upload1")
});
</script>
```

#### options.uploadUrl

上传接口地址

```js
<script>
var upload1=new ImgUpload({
	uploadUrl:"/imgupload/upload.php"
});
</script>
```

#### options.fileTypeExts`

限制上传文件类型

```js
<script>
var upload1=new ImgUpload({
	fileTypeExts:"*.png|*.jpg|*.jpeg|*.gif"
});
</script>
```

#### options.imgSizeExts

限制上传文件尺寸，默认不限制。`100*` 代表限制宽度大于等于100px不限制高度，`*100` 代表限制高度大于等于100px不限制宽度，`100*100` 代表同时限制高度宽度为100px

```js
<script>
var upload1=new ImgUpload({
	imgSizeExts:"100*"
});
</script>
```

#### options.uploadLimit

限制上传文件数量，默认为999。

```js
<script>
var upload1=new ImgUpload({
	uploadLimit:1
});
</script>
```

### 提供的方法

#### getURLs()

获取所有已上传图片路径

```js
<script>
upload1.getURLs()
</script>
```

#### 设置已存在的图片资源

或许你会需要在编辑页面对已上传的一些图片进行管理，那么你可以通过dom埋点方式进行预加载处理。请注意，你的 `data-origin`值需要与input的name值相同，这样它们才会自动匹配在一起并完成预加载处理。

```html
<div class="j-uploadimg-preload" data-origin="upload1">
	<img src="/imgupload/uploads/hoek.png" data-fullpath="/fullpath/imgupload/uploads/hoek.png">
	<img src="/imgupload/uploads/abc.png" data-fullpath="/fullpath/imgupload/uploads/abc.png">
</div>
```

### 你需要知道的
每当图片自动上传完成后，页面中始终会有一个隐藏域来保存你当前实例化上传组件的所有已上传成功的图片路径，例如：
<img src="exmaple1.png" alt="">
这时你可以直接通过form表单提交或者通过getURLs()方法获取路径，进行数据的提交或者处理。