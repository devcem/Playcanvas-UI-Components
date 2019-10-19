var Slider = pc.createScript('slider');

Slider.attributes.add('min', { type : 'number', default : 0 });
Slider.attributes.add('max', { type : 'number', default : 100 });
Slider.attributes.add('step', { type : 'number', default : 1 });

Slider.prototype.initialize = function() {
    this.element = document.createElement('input');
    this.element.type = 'range';
    
    this.element.style.position = 'absolute';
    this.element.style.fontFamily = this.fontFamily;
    
    this.element.style.border = '0px';
    this.element.style.margin = '0px';
    this.element.style.padding = '0px';
    this.element.style.background = 'transparent';

    this.element.style.boxSizing = 'border-box';
    
    this.element.style.outline = 'none';
    document.body.appendChild(this.element);
    
    this.updateStyle();
    
    this.on('state', function(self){
        if(this.entity.enabled){
            this.element.style.display = 'block'; 
        }else{
            this.element.style.display = 'none'; 
        }
    }, this);
};

Slider.prototype.onFocus = function() {
    this.focusEntity.enabled = true;
};

Slider.prototype.onBlur = function() {
    this.focusEntity.enabled = false;
};

Slider.prototype.updateStyle = function() {
    if(this.entity.element.screenCorners){
        var position = this.entity.element.screenCorners;
    
        this.element.style.left = position[0].x + 'px';
        this.element.style.bottom = position[0].y + 'px';

        this.element.style.width = (position[2].x - position[0].x) + 'px';
        this.element.style.height = (position[2].y - position[0].y) + 'px';
    }
};

Slider.prototype.update = function(dt) {
    this.updateStyle();
};

Slider.prototype.getValue = function() {
    return this.element.value;
};