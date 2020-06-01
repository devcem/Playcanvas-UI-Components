var Fetcher = pc.createScript('fetcher');

Fetcher.attributes.add('URL', { type : 'string' });
Fetcher.attributes.add('data', { type : 'string' });
Fetcher.attributes.add('success', { type : 'string' });
Fetcher.attributes.add('error', { type : 'string' });
Fetcher.attributes.add('success', { type : 'string' });

Fetcher.prototype.initialize = function() {
    this.onFetch();
    this.app.on('Fetcher:' + this.entity.name, this.onFetch, this);
};

Fetcher.prototype.onResult = function(data) {
    if(data){
        if(data.success === true){
            this.onSuccess(data.result);
        }else{
            this.onError(data.message);
        }
    }else{
        this.onError('An error occured!');
    }
};

Fetcher.prototype.onSuccess = function(data) {
    if(this.success){
        this.app.fire(this.success, data);
    }
};

Fetcher.prototype.onError = function(data) {
    if(this.error){
        this.app.fire(this.error, data);
    }
};

Fetcher.prototype.onFetch = function() {
    this.fetch(this.URL, this.data, this.onResult.bind(this));
};

Fetcher.prototype.fetch = function(URL, data, success) {
    var params = typeof data == 'string' ? data : Object.keys(data).map(
        function(k){ 
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
        }
    ).join('&');

    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xhr.open('POST', URL);
    xhr.onreadystatechange = function() {
        if (xhr.readyState>3 && xhr.status==200) { success(JSON.parse(xhr.responseText)); }
    };
    //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.withCredentials = true;

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
};