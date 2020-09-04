var Container = pc.createScript('container');

Container.attributes.add('id', { type : 'string' });
Container.attributes.add('onInit', { type : 'string' });
Container.attributes.add('onInitTrigger', { type : 'string' });
Container.attributes.add('innerHTML', { type : 'string' });
Container.attributes.add('onDestroy', { type : 'string' });
Container.attributes.add('autoResize', { type : 'boolean', default : true });
Container.attributes.add('fullyRemove', { type : 'boolean' });
Container.attributes.add('showOnly', { 
    type: 'string',
    enum: [
        { 'Both'    : 'Both' },
        { 'Desktop' : 'Desktop' },
        { 'Mobile'  : 'Mobile' }
    ],
    default: 'Both'
});

Container.prototype.initialize = function() {
    if(Utils.isMobile()){
        if(this.showOnly == 'Desktop'){
            this.entity.destroy();
            return false;
        }
    }else{
        if(this.showOnly == 'Mobile'){
            this.entity.destroy();
            return false;
        }
    }
    
    this.isDestroyed = false;
    this.lastUpdate  = Date.now();
    
    this.triggerOnInit();
    this.on('state', function(self){
        if(this.entity.enabled){
            this.triggerOnInit();
            this.element.style.display = 'block'; 
        }else{
            if(this.fullyRemove){
                this.element.remove();
            }else{
                this.element.style.display = 'none';
            }
        }
    }, this);
    
    this.app.on('DOM:Clear', this.onDOMClear, this);
    this.app.on('DOM:Update', this.onDomUpdate, this);
    this.on('destroy', this._onDestroy, this);
};

Container.prototype.onDOMClear = function(){
    this.entity.enabled = false;
};

Container.prototype._onDestroy = function(){
    this.isDestroyed = true;
    
    if(this.onDestroy !== 'undefined'){
        try{
            eval(this.onDestroy);   
        }catch(e){
            //console.log(e);
        }
        
        try{
            if(this.fullyRemove){
                this.element.remove();
            }
        }catch(e){
            
        }
    }
};

Container.prototype.onDomUpdate = function(){
    this.updateStyle();
};

Container.prototype.triggerOnInit = function() {
    //if there is already a div with same id set it as an element
    var element = document.getElementById(this.id);
    
    if(element){
        this.element = element;
        this.element.style.width  = this.entity.element.width + 'px';
        this.element.style.height = this.entity.element.height + 'px';
    }else{
        this.element = document.createElement('div');
        this.element.style.width  = this.entity.element.width + 'px';
        this.element.style.height = this.entity.element.height + 'px';
        this.element.id = this.id;

        if(this.innerHTML){
            this.element.innerHTML = this.innerHTML;
        }

        this.element.style.position = 'absolute';

        document.body.appendChild(this.element);
    }
    
    this.element.style.overflow = 'hidden';
    this.updateStyle();
    this._onInit();
};

Container.prototype._onInit = function() {
    if(this.onInit !== 'undefined'){
        try{
            eval(this.onInit);   
        }catch(e){
            //console.log(e);
        }
    }
    
    if(this.onInitTrigger){
        this.app.fire(this.onInitTrigger, true);
    }
};

Container.prototype.updateStyle = function() { 
    if(this.isDestroyed){
        return false;
    }
    
    if(
        this.entity &&
        this.entity.enabled && 
        this.entity.element && 
        this.entity.element.screenCorners
    ){
        var position = this.entity.element.screenCorners;
        var ratio = 1 / this.app.graphicsDevice.maxPixelRatio;
    
        this.element.style.left = position[0].x * ratio + 'px';
        this.element.style.bottom = position[0].y * ratio + 'px';
        
        this.element.style.position = 'absolute';
        this.element.style.display = 'block';
        this.element.style.zIndex  = 1000;
        
        var scaleX = ((position[2].x - position[0].x) * ratio) / this.entity.element.width;
        var scaleY = ((position[2].y - position[0].y) * ratio) / this.entity.element.height;
        
        if(this.autoResize){
            this.element.style.transform = 'scale(' + scaleX + ', ' + scaleY + ')';
            this.element.style.transformOrigin = 'left bottom';
        }
    }
};
