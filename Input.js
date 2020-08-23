var Input = pc.createScript('input');

Input.attributes.add('placeholder', { type : 'string' });
Input.attributes.add('type', {
    type: 'string',
    enum: [
        { 'Text': 'text' },
        { 'Email': 'email' },
        { 'Password': 'password' }
    ],
    default : 'text'
});
Input.attributes.add('maxLength', { type : 'number', default : 64 });
Input.attributes.add('fontSize', { type : 'number', default : 1 });
Input.attributes.add('padding', { type : 'number', default : 1 });
Input.attributes.add('scaleUnit', {
    type: 'string',
    enum: [
        { 'Viewport Width': 'vw' },
        { 'Viewport Height': 'vh' },
        { 'Pixel': 'px' }
    ],
    default : 'vw'
});
Input.attributes.add('color', { type : 'rgb' });
Input.attributes.add('whitePlaceholder', { type : 'boolean' });
Input.attributes.add('fontFamily', { type : 'string', default : 'Arial, sans-serif' });
Input.attributes.add('storeValue', { type : 'boolean' });

Input.attributes.add('focusEntity', { type : 'entity' });
Input.attributes.add('sleepValue', { type : 'string' });
Input.attributes.add('blurFunction', { type : 'string' });

Input.prototype.initialize = function() {
    this.timeout = false;
    this.isDestroyed = false;
    
    this.currentWidth = 0;
    this.currentHeight = 0;
    
    this.element = document.createElement('input');
    this.element.placeholder = this.placeholder;
    
    this.element.type = this.type;
    
    this.element.style.position = 'absolute';
    this.element.style.fontFamily = this.fontFamily;
    
    this.element.style.border = '0px';
    this.element.style.background = 'transparent';
    
    this.element.style.fontSize = this.fontSize + this.scaleUnit;
    this.element.style.padding = this.padding + this.scaleUnit;
    this.element.style.boxSizing = 'border-box';
    
    if(this.maxLength > 0){
        this.element.maxLength = this.maxLength;
    }
    
    var color = 'rgb(' + (this.color.r * 255) + ', ' + (this.color.g * 255) + ', ' + (this.color.b * 255) + ')';
    this.element.style.color = color;
    
    this.element.style.outline = 'none';
    
    if(this.whitePlaceholder){
        this.element.className = 'white-placeholder';
    }
    
    document.body.appendChild(this.element);
    
    //disable focus entity
    if(this.focusEntity){
        this.focusEntity.enabled = false;   
        
        this.element.onfocus = this.onFocus.bind(this);
        this.element.onblur = this.onBlur.bind(this);
    }
    
    if(this.blurFunction){
        this.element.onblur = this.onBlurFunction.bind(this);
    }
    
    this.element.onchange = this.onChange.bind(this);
    
    //if(this.storeValue){
        var value = window.localStorage.getItem(this.entity._guid);
        
        if(value){
            this.setValue(window.localStorage.getItem(this.entity._guid));   
        }
    //}
    
    this.updateStyle();
    
    this.app.on('DOM:Clear', this.onDOMClear, this);
    this.app.on('DOM:Update', this.onDomUpdate, this);
    this.app.on('Input:' + this.entity.name, this.setResultValue, this);
    
    if(this.sleepValue){
        this.setValue(this.sleepValue);
    }
    
    this.on('state', function(self){
        if(this.entity.enabled){
            this.element.style.display = 'block';
        }else{
            this.element.style.display = 'none'; 
        }
    }, this);
    
    this.on('destroy', function(self){
        this.onDestroy();
    }, this);
};

Input.prototype.onBlurFunction = function(){
    var blurFunctions = this.blurFunction.split(', ');

    if(blurFunctions.length > 0){
        for(var blurIndex in blurFunctions){
            var blurFunction = blurFunctions[blurIndex];
            var parts = blurFunction.split('\@');
            var key   = parts[0];

            if(parts.length > 1){
                var value = parts[1];

                this.app.fire(key, value);
            }else{
                this.app.fire(key);
            }
        }
    }
};

Input.prototype.onDOMClear = function(){
    this.entity.destroy();  
};

Input.prototype.onDestroy = function(){
    this.isDestroyed = true;
    this.element.remove();
};

Input.prototype.store = function() {
    this.storeValue = true;
    this.onChange();
};

Input.prototype.onFocus = function() {
    this.focusEntity.enabled = true;
};

Input.prototype.onBlur = function() {
    this.focusEntity.enabled = false;
};

Input.prototype.onChange = function() {
    if(this.storeValue){
        window.localStorage.setItem(this.entity._guid, this.getValue());
    }
};

Input.prototype.onDomUpdate = function(){
    this._updateStyle();
};

Input.prototype.updateStyle = function() {
    if(
        this.currentWidth == window.innerWidth &&
        this.currentHeight == window.innerHeight
    ){
        return false;
    }
    
    this._updateStyle();
    
    this.currentWidth = window.innerWidth;
    this.currentHeight = window.innerHeight;
};

Input.prototype._updateStyle = function() {
    if(this.isDestroyed){
        return false;
    }
    
    var self = this;
    
    if(self.entity && self.entity.element && self.entity.element.screenCorners){
        var position = self.entity.element.screenCorners;
        var ratio = 1 / self.app.graphicsDevice.maxPixelRatio;

        self.element.style.left = position[0].x * ratio + 'px';
        self.element.style.bottom = position[0].y * ratio + 'px';

        self.element.style.width = (position[2].x - position[0].x) * ratio + 'px';
        self.element.style.height = (position[2].y - position[0].y) * ratio + 'px';
    }
};

Input.prototype.setResultValue = function(data) {
    if(!data){
        return false;
    }
    
    var value = data.result;
    
    if(!this.element){
        this.sleepValue = value;
    }else{
        this.element.value = value;
        this.sleepValue = false;
    }
};

Input.prototype.setValue = function(value) {
    if(!this.element){
        this.sleepValue = value;
    }else{
        this.element.value = value;
        this.sleepValue = false;
    }
};

Input.prototype.getValue = function() {
    if(this.element){
        return this.element.value;   
    }
};

Input.prototype.focus = function() {
    if(this.element){
        this.element.focus();
    }
};

Input.prototype.blur = function() {
    if(this.element){
        this.element.blur();
    }
};