app.service('canvasS', function () {
    var self = this;

    //使用遮色片
    self.toMask = function (maskPic, pic, callback) {
        this.resizePic2ToPic1EqualRate(maskPic, pic, function(c1, c2) {

        	$("#test1").append(c1);
        	$("#test2").append(c2);
        	c1.getContext("2d").getImageData(0, 0, c1.width, c1.height).data;
        	return;
		HTMLCanvasElement.prototype.getDrawRange = function() {
            var data = this.getContext("2d").getImageData(0, 0, this.width, this.height).data;
            var x = 1, y = 1;
            var maxX = 0, maxY = 0, minX = this.width, minY = this.height;
            for(var i=0;i<data.length;i++) {
                //x座標
                if(i != 0 && i%4 == 0) {
                    x++;
                }
                //y座標(x座標歸0)
                if(i != 0 && i%(this.width*4) == 0) {
                    y++;
                    x = 1;
                }
                //當pixed值不等於0
                if(data[i] != 0) {
                    if(x > maxX) { maxX = x; }
                    if(y > maxY) { maxY = y; }
                    if(x < minX) { minX = x; }
                    if(y < minY) { minY = y; }
                }
            }
            this.drawMaxX = maxX;
            this.drawMaxY = maxY;
            this.drawMinX = minX;
            this.drawMinY = minY;

            this.drawWidth = maxX - minX;
            this.drawHeight = maxY - minY;
        }

        });
    };

    /**
     * 將圖片轉為pic1相同比例, 不足處補白邊
     * @params pic1 imagePath
     * @params pic2 imagePath
     * @return base64
     */
    self.resizePic2ToPic1EqualRate = function(pic1, pic2, callback) {
    	this.loadImage([pic1, pic2], function(r) {
	    	var c1 = document.createElement("CANVAS");
	    	var c2 = document.createElement("CANVAS");
	    	var image1 = r["0"]['image'];
	    	var image1Rate = image1.width/image1.height;
	    	var image2 = r["1"]['image'];
            c1.width = image1.width;
            c1.height = image1.height;
            c1.getContext("2d").drawImage(image1, 0, 0, image1.width, image1.height);
	    	var image2Rate = image2.width/image2.height;
            if(image2Rate > image1Rate) {
                if(image2.width < image1.width) {
                    x = (image1.width - image2.width)/2;
                    y = (image1.height - image2.height)/2;
                } else {
                    image1.height = image2.width * (image1.height/image1.width);
                    image1.width = image2.width;
                    y = (image1.height - cutHeight)/2;
                }
            } else {
                if(image2.height < image1.height) {
                    x = (image1.width - image2.width)/2;
                    y = (image1.height - image2.height)/2;
                } else {
                    image1.width = image2.height * (image1.width/image1.height);
                    image1.height = image2.height;
                    x = (image1.width - cutWidth)/2;
                }
            }
            c2.width = image1.width;
            c2.height = image1.height;
            c2.backgroundColor = 'rgba(255, 255, 255, 0)';
            c2.getContext("2d").drawImage(image2, x, y, image2.width, image2.height);

            callback(c1, c2);
    	});
    }

    self.loadImage = function(imgPathList, callback) {
    	var list = {
    		finish: 0
    	};
    	for(var i=0;i<imgPathList.length;i++) {
    		list[i] = {};
    		list[i]['image'] = new Image();
    		list[i]['image'].onload = function() {
    			list['finish']++;
    			if(list['finish'] == imgPathList.length) {
    				callback(list);
    			}
    		}
    		list[i]['image'].src = imgPathList[i];
    	}
    }
});