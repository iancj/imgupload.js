;(function(window, document) {
        var defaultConf = {
            el: null, //input[type=file] dom
            uploadUrl: "/", //上传接口
            fileTypeExts: "image.*", //限制上传类型
            imgSizeExts: "", //限制上传尺寸
            uploadLimit:999 //限制上传文件数量
        }

        function ImgUpload(options) {
            //合并配置文件
            this.config = extend(defaultConf, options);

            this.$el = this.config.el; //当前实例化的input[type=file] dom
            this.$preview = null; //预览容器dom
            this.$dataset = null; //已上传图片路径input[type=hidden] dom
            this.$btn = null; //上传按钮
            this.uploaded = []; //已上传图片路径

            //实例化后执行初始化
            this.init();
        }

        //实例初始化
        ImgUpload.prototype.init = function() {
            var self = this,
                errorStackTip = self.config.fileTypeExts.replace(/\|/g, ","); //错误类型提示

            //创建regexp对象
            self.config.fileTypeExtsRegExp = self.config.fileTypeExts.toLowerCase().replace(/\*\./g, "");

            // console.log(self.config)

            //绑定上传事件
            self.$el.addEventListener("change", function() {
                if (!this.files.length) return;

                var imageType = new RegExp(self.config.fileTypeExtsRegExp), //限定上传类型
                    errorStack = [], //类型检测错误栈
                    fileList = Array.prototype.slice.call(this.files, 0); //获取当前选择的图片

                fileList=fileList.splice(0,self.config.uploadLimit);//限制上传数量

                //上传操作
                fileList.forEach(function(item) {
                    var itename = item.name;

                    //检测图片类型
                    if (!item.type.match(imageType)) {
                        errorStack.push(itename + "不是有效的类型文件！\n");
                        return false;
                    }

                    //检测图片类型
                    self.checkSize(item, function(result) {
                        if (result) {
                            sendFile(item, self.config.uploadUrl, _callback);
                        } else {
                            alert(itename + "图片尺寸不匹配\n");
                        }
                    });

                });

                if (errorStack.length) {
                    errorStack.push("请上传类型为" + errorStackTip + "的文件");
                    alert(errorStack.join(""));
                }

                self.$el.value = ""; //读取完所有file文件后清空，防止input自动cache
            }, false);

            //生成表单元素
            if (!self.$dataset) {
                var $ip = Cele("input");
                $ip.type = "hidden";
                $ip.name = self.$el.dataset.name;
                if(self.$el.dataset.origin){
                    $ip.dataset.origin = self.$el.dataset.origin;
                }
                console.log
                self.$dataset = $ip;
                insertAfter(self.$dataset, self.$el);
            }

            //生成上传按钮
            if (!self.$btn) {
                var $btn = Cele("div");
                $btn.className = "imgupload-btn";
                $btn.innerHTML = "上传图片";
                self.$btn = $btn;
                insertAfter(self.$btn, self.$el);
                self.$el.style.display = "none";
            }

            //上传按钮触发上传事件
            self.$btn.addEventListener("click", function(e) {
                self.$el.click();
                e.preventDefault();
            }, false);

            //上传完成后的回调
            function _callback(res) {
                var msg;
                typeof res == "string" ? msg = JSON.parse(res) : msg = res;

                //上传成功添加缩略图
                if (msg.succ) {
                    self.addPreview(msg.data.path,msg.data.fullpath)
                } else {
                    alert(msg.data.msg)
                }
            }

            self.preload();//预加载
        }

        //预先加载页面上已存在的图片
        ImgUpload.prototype.preload=function(){
            var self=this,
                $preloads=S(".j-uploadimg-preload"),
                originName=self.$dataset.dataset.origin || self.$dataset.name;

            if(!$preloads.length) return;
            
            Array.prototype.slice.call($preloads).forEach(function($pl){
                if($pl.dataset.origin==originName){
                    Array.prototype.slice.call(S("img",$pl)).forEach(function($img){
                        var path=$img.src,
                            fullpath=$img.dataset.fullpath;

                        self.addPreview(path,fullpath);
                    });
                    $pl.style.display="none";
                }
            });
        }

        // 检测图片大小
        ImgUpload.prototype.checkSize = function(file, callback) {
            var self = this;

            if (self.config.imgSizeExts == "" && callback) {
                callback(true);
                return;
            }

            //设置图片文件
            var $imgcheck = Cele("img");
            $imgcheck.file = file;

            //渲染图片
            var reader = new FileReader();
            reader.onload = (function(aImg) {
                return function(e) {
                    aImg.src = e.target.result;
                };
            })($imgcheck);
            reader.readAsDataURL(file);

            //获取图片大小
            $imgcheck.onload = function() {
                var result = true,
                    w = $imgcheck.width, //选择的图片高宽
                    h = $imgcheck.height,
                    imgSizeExts = self.config.imgSizeExts,
                    ptnW = parseInt(imgSizeExts.split("*")[0]), //配置参数中的高宽
                    ptnH = parseInt(imgSizeExts.split("*")[1]);

                if (typeof ptnW == "number" && isNaN(ptnH)) {
                    if (w < ptnW) result = false;
                } else if (isNaN(ptnW) && typeof ptnH == "number") {
                    if (h < ptnH) result = false;
                } else if (typeof ptnW == "number" && typeof ptnH == "number") {
                    if (w < ptnW || h < ptnH) result = false;
                }

                if (callback) callback(result);
            }
        }

        /*
         * 添加缩略图
         * @param path 缩略图显示的路径
         * @param fullpath 后端保存的路径
         */
        ImgUpload.prototype.addPreview = function(path,fullpath) {
            var self = this;

            //如果是第一张缩略图增创建container panel
            if (!self.$preview) {
                var $ul = Cele("ul");
                $ul.className = "imgupload-preview";
                self.$preview = $ul;

                //删除操作
                $ul.addEventListener("click", function(e) {
                    var nodeListArr = Array.prototype.slice.call(S("li", $ul), 0),
                        targetEle = e.target;

                    nodeListArr.forEach(function(item, index) {
                        if (targetEle == item) {
                            $ul.removeChild(item);
                            self.uploaded.splice(index, 1);
                            self.updateDataset();
                        }
                    });
                }, false)

                insertAfter(self.$preview, self.$el.nextSibling)
            }

            //如果限制1张执行替换操作
            if(self.config.uploadLimit==1){
                if(!S("li",self.$preview).length){
                    // 增加预览图
                    var $img = Cele("img"),
                        $li = Cele("li");

                    $img.src = path;
                    $li.appendChild($img);

                    self.$preview.appendChild($li);
                }

                S("li img",self.$preview)[0].src=path;

                //只保存一张图片
                self.uploaded[0]=fullpath;
            }
            else if(self.config.uploadLimit>1 && self.uploaded.length>=self.config.uploadLimit){
                alert("您最多可以上传"+self.config.uploadLimit+"张图片!");
            }
            else{
                //增加预览图
                var $img = Cele("img"),
                    $li = Cele("li");

                $img.src = path;
                $li.appendChild($img);

                self.$preview.appendChild($li);

                //增加图片url到需要上传的表单元素中
                self.uploaded.push(fullpath);
            }

            //更新需要上传的表单元素的url值
            self.updateDataset();
        }

        //更新需要上传的表单元素的url值
        ImgUpload.prototype.updateDataset = function() {
            this.$dataset.value = this.uploaded.join(",")
        }

        //获取已上传图片路径
        ImgUpload.prototype.getURLs = function() {
            return this.uploaded;
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

        //插入到某个元素之后
        function insertAfter(newEl, targetEl) {
            var parentEl = targetEl.parentNode;

            if (parentEl.lastChild == targetEl) {
                parentEl.appendChild(newEl);
            } else {
                parentEl.insertBefore(newEl, targetEl.nextSibling);
            }
        }

        //深度合并对象
        function extend() {
            var _extend = function(dest, source) {
                for (var name in dest) {
                    if (dest.hasOwnProperty(name)) {
                        //当前属性是否为对象,如果为对象，则进行递归
                        if ((dest[name] instanceof Object) && (source[name] instanceof Object)) {
                            arguments.callee(dest[name], source[name]);
                        }
                        //检测该属性是否存在
                        if (source.hasOwnProperty(name)) {
                            continue;
                        } else {
                            source[name] = dest[name];
                        }
                    }
                }
            }
            var _result = {},
                arr = arguments;
            //遍历属性，至后向前
            if (!arr.length) return {};
            for (var i = arr.length - 1; i >= 0; i--) {
                _extend(arr[i], _result);
            }
            arr[0] = _result;
            return _result;
        }

        //发送文件至服务器
        function sendFile(file, uri, callback) {
            var xhr = new XMLHttpRequest();
            var fd = new FormData();

            xhr.open("POST", uri, true);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 && callback) {
                    callback(xhr.responseText);
                }
            };

            fd.append('Filedata', file);
            xhr.send(fd);
        }

        window.addEventListener("load",function(){
            //自动实例化
            var $uploads = S(".j-imgupload"),
                $uploadUrl = S("#j-imguploadUrl");

            if(!$uploads.length){
                return console.error("can not found dom of image upload input elements");
            }

            if(!$uploadUrl.length){
                return console.error("can not found dom of upload uri input element");
            }

            var uploadUrl = S("#j-imguploadUrl")[0].value || "/";

            for (var i = 0, len = $uploads.length; i < len; i++) {
                var $ip = $uploads[i],
                    dataset = $ip.dataset;

                new ImgUpload({
                    el: $ip,
                    uploadUrl: uploadUrl,
                    fileTypeExts: dataset.filetypeexts || "image.*",
                    imgSizeExts: dataset.imgsizeexts || "",
                    uploadLimit: dataset.uploadlimit || 999
                });
            }
        },false);

        // CommonJS
        if (typeof module === "object" && typeof module.exports === "object") {
            module.exports = ImgUpload;
        } else {
            window.ImgUpload = ImgUpload;
        }
    })(window, document);