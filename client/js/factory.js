app.factory('idFactory', function(){
    var globId;
    return {
        getId : function () {

            return id; 
            
        },
        setData:function(val){
            var id = val;
        }
    }               
});