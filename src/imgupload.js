define(function(require, exports, module) {
    function ImgUpload($el) {
        this.$el = $el;
        this.$preview = null;
        this.$dataset = null;
        this.$btn=null;
        this.uploaded = [];
        this.init();
    }

    ImgUpload.prototype.init = function() {
        var self = this;

        //绑定上传事件
        self.$el.addEventListener("change", function() {
            sendFile(this.files[0], _callback);
        }, false);

        //生成表单元素
        if (!self.$dataset) {
            var $ip = Cele("input");
            $ip.type = "hidden";
            $ip.name = self.$el.dataset.name;
            self.$dataset = $ip;
            insertAfter(self.$dataset, self.$el);
        }

        //生成上传按钮
        if(!self.$btn){
        	var $btn=Cele("div");
        	$btn.className="imgupload-btn";
        	$btn.innerHTML="上传图片";
        	self.$btn=$btn;
        	insertAfter(self.$btn,self.$el);
        	self.$el.style.display="none";
        }

        //上传按钮触发上传事件
        self.$btn.addEventListener("click",function(e){
        	self.$el.click();
        	e.preventDefault();
        },false);

        //上传完成后的回调
        function _callback(msg) {
            var msg;
            typeof msg == "string" ? msg = JSON.parse(msg) : msg = msg;

            if (msg.succ) self.addPreview(msg.data.path);
        }
    }

    //增加一个缩略图
    ImgUpload.prototype.addPreview = function(imgurl) {
        var self = this;

        //如果是第一张缩略图增创建container panel
        if (!self.$preview) {
            var $ul = Cele("ul");
            $ul.className = "imgupload-preview";
            self.$preview = $ul;

            $ul.addEventListener("click",function(e){
            	var nodeListArr=Array.prototype.slice.call(S("li",$ul),0),
            		targetEle=e.target;

            	nodeListArr.forEach(function(item,index){
            		if(targetEle==item){
            			$ul.removeChild(item);
            			self.uploaded.splice(index,1);
            			self.updateDataset();
            		}
            	});
            },false)

            insertAfter(self.$preview, self.$el.nextSibling)
        }

        //增加预览图
        var $img = Cele("img"),
            $li = Cele("li");

        $img.src = imgurl;
        $li.appendChild($img);

        self.$preview.appendChild($li);

        //增加图片url到需要上传的表单元素中
        self.uploaded.push(imgurl);
		//更新需要上传的表单元素的url值
        self.updateDataset();
    }

    //更新需要上传的表单元素的url值
    ImgUpload.prototype.updateDataset=function(){
        this.$dataset.value = this.uploaded.join(",")
    }

    //simple selector
    function S(selector, parentsNode) {
        parentsNode ? parentsNode = parentsNode : parentsNode = document;
        var ele = parentsNode.querySelectorAll(selector);
        return ele;
    }

    //create element
    function Cele(nodename) {
        return document.createElement(nodename);
    }

    function insertAfter(newEl, targetEl) {
        var parentEl = targetEl.parentNode;

        if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
        } else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
        }
    }

    //发送文件至服务器
    function sendFile(file, callback) {
        var uri = S("#j-imguploadUrl")[0].value || "";
        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        xhr.open("POST", uri, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200 && callback) {
                callback(xhr.responseText);
            }
        };
        fd.append('myFile', file);
        xhr.send(fd);
    }

    var $uploads = S(".j-imgupload");

    for (var i = 0, len = $uploads.length; i < len; i++) {
        new ImgUpload($uploads[i]);
    }
});
