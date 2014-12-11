var krbuilder, krtext, krrule, krload, krdump;
(function($) {
    function onReady() {
        krtext = $("#krtext");
        krrule = $("#krrule");
        krload = $("#krload");
        krdump = $("#krdump");
        
        initializeRule();
        initializeForm();
    }
    
    function initializeRule() {
        var options = {
            E_KRCalcKind : {
                10: {name:"set", desc:"集合", options:[
                        {value:1, name: "A1", desc: "集一"},
                    ]},
                11: {name:"current",  desc:"当笔字段", options:[
                        {value:1, name: "Name", desc: "姓名"},
                        {value:2, name: "Age", desc: "年龄"},
                        {value:3, name: "Gender", desc: "性别"}
                    ]},
                12: {name:"field",  desc:"遍历字段", options:[
                        {value:1, name: "Name", desc: "姓名"},
                        {value:2, name: "Age", desc: "年龄"},
                        {value:3, name: "Gender", desc: "性别"}
                    ]},
                13: {name:"static", desc:"静态数据项", options:[
                        {value:1, name: "S1", desc: "静一"},
                        {value:2, name: "S2", desc: "静二"},
                        {value:3, name: "S3", desc: "静三"}
                    ]},
                14: {name:"dynamic",  desc:"动态统计量", options:[
                        {value:1, name: "D1", desc: "动一"},
                        {value:2, name: "D2", desc: "动二"}
                    ]},
                15: {name:"historic", desc:"历史统计量", options:[
                        {value:1, name: "H1", desc: "历一"}
                    ]},
            },
            
        };

        krbuilder = krrule.KRRule(options);
                
        var ruleData = {"op":16,"child":[{"op":12,"child":[{"kind":12,"value":2},{"kind":6,"value":"24,25,26"}]},
                                         {"op":9,"child":[{"kind":14,"value":1},{"op":3,"child":[{"kind":13,"value":2},{"kind":15,"value":1}]}]},
                                         {"op":17,"child":[{"op":11,"child":[{"kind":12,"value":1},{"kind":5,"value":"Tiger"}]},
                                                           {"op":8,"child":[{"kind":11,"value":2},{"op":1,"child":[{"kind":12,"value":2},{"kind":3,"value":1}]}]}]}]};
        
                    
        krbuilder.load(JSON.stringify(ruleData));
    };
    
    function initializeForm() {
        krload.click(function(e) {
            e.preventDefault();
            krbuilder.load(krtext.val());
        });
        
        krdump.click(function(e) {
            e.preventDefault();
            krtext.val(krbuilder.dump());
        });
    };
      
    $(onReady);
})(jQuery);
