var Visibility = pc.createScript('visibility');

Visibility.attributes.add('query', { type : 'string', default : 'success == true'});
Visibility.prototype.trigger = function(data) {
    if(this.query){
        var query = eval('data.' + this.query);
        
        if(query){
            this.entity.enabled = true;
        }else{
            this.entity.enabled = false;
        }
    }
};