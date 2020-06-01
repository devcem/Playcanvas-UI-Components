var Template = pc.createScript('template');

Template.prototype.initialize = function() {
    this.app.on('Template:' + this.entity.name, this.onUpdate, this);
};

Template.prototype.render = function(data, text) {
    var regex = /\{\{(.*?)\}\}/gm;
    var str   = text;
    var m;

    while ((m = regex.exec(text)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        var value = eval('data.' + m[1]);

        if(value){
            str = str.replace(m[0], value);   
        }else{
            str = str.replace(m[0], '');
        }
    }
    
    return str;
};

Template.prototype.getAsset = function(data, name) {
    var key   = data[name];
    var asset = this.app.assets.find(key);
    
    if(typeof key !== 'undefined' && asset){
        return asset;
    }
};

Template.prototype.onUpdate = function(data) {
    var entities = this.entity.findByTag('Dynamic');
    var i = entities.length;
    
    while(i--){
        var entity = entities[i];
        
        if(entity && entity.enabled){
            if(entity.element.type == pc.ELEMENTTYPE_TEXT){
                var source = entity.element.text;
                
                //clear
                if(!entity.element.source){
                    entity.element.source = source;
                }else{
                    entity.element.text = entity.element.source + '';
                }
                
                entity.element.text   = this.render(data, entity.element.text);
            }
            
            if(entity.element.type == pc.ELEMENTTYPE_IMAGE){
                var sourceImage = entity.element.textureAsset;
                var asset       = this.getAsset(data, entity.name);
                
                entity.element.sourceImage = sourceImage;
                
                if(!entity.element.sourceImage){
                    entity.element.sourceImage = sourceImage;
                }else{
                    var sourceImageCopied = entity.element.sourceImage;
                    entity.element.textureAsset = sourceImageCopied;
                }
                
                if(asset){
                    entity.element.textureAsset = asset;   
                }
            }
        }
        
        //aditional scripts
        if(entity && entity.script && entity.script.visibility){
            entity.script.visibility.trigger(data);
        }
    }
};