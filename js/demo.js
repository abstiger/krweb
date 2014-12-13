var krbuilder, krtext, krrule, krload, krdump;
var mybuilder, mytext, myrule, myload, mydump;
(function($) {
    function onReady() {
        krtext = $("#krtext");
        krrule = $("#krrule");
        krload = $("#krload");
        krdump = $("#krdump");
        
        mytext = $("#mytext");
        myflow = $("#myflow");
        myload = $("#myload");
        mydump = $("#mydump");
        
        initializeRule();
        
        initializeFlow();
    }
    
    function initializeRule() {
        var ruleOptions = {
            E_KRCalcKind : {
                10: {name:"set", desc:"集合", color:"red", options:[
                        {value:1, name: "A1", desc: "集一"},
                    ]},
                11: {name:"current",  desc:"当笔字段", color:"red", options:[
                        {value:1, name: "Name", desc: "姓名"},
                        {value:2, name: "Age", desc: "年龄"},
                        {value:3, name: "Gender", desc: "性别"}
                    ]},
                12: {name:"field",  desc:"遍历字段", color:"red", options:[
                        {value:1, name: "Name", desc: "姓名"},
                        {value:2, name: "Age", desc: "年龄"},
                        {value:3, name: "Gender", desc: "性别"}
                    ]},
                13: {name:"static", desc:"静态数据项", color:"red", options:[
                        {value:1, name: "S1", desc: "静一"},
                        {value:2, name: "S2", desc: "静二"},
                        {value:3, name: "S3", desc: "静三"}
                    ]},
                14: {name:"dynamic",  desc:"动态统计量", color:"red", options:[
                        {value:1, name: "D1", desc: "动一"},
                        {value:2, name: "D2", desc: "动二"}
                    ]},
                15: {name:"historic", desc:"历史统计量", color:"red", options:[
                        {value:1, name: "H1", desc: "历一"}
                    ]},
            },
            
        };

        var ruleData = {"op":16,"child":[{"op":12,"child":[{"kind":12,"value":2},{"kind":6,"value":"24,25,26"}]},
                                         {"op":9,"child":[{"kind":14,"value":1},{"op":3,"child":[{"kind":13,"value":2},{"kind":15,"value":1}]}]},
                                         {"op":17,"child":[{"op":11,"child":[{"kind":12,"value":1},{"kind":5,"value":"Tiger"}]},
                                                           {"op":8,"child":[{"kind":11,"value":2},{"op":1,"child":[{"kind":12,"value":2},{"kind":3,"value":1}]}]}]}]};
        
        /*init krrule builder*/            
        krbuilder = krrule.KRRule(ruleOptions);
        
        /*load rule data string*/
        krbuilder.load(JSON.stringify(ruleData));
        
        
        /*load button click event*/
        krload.click(function(e) {
            e.preventDefault();
            krbuilder.load(krtext.val());
        });
        
        /*dump button click event*/
        krdump.click(function(e) {
            e.preventDefault();
            krtext.val(krbuilder.dump());
        });
    };
    
    function initializeFlow() {
        
        var flowData = {"class": "go.GraphLinksModel",
                        "linkFromPortIdProperty": "fromPort",
                        "linkToPortIdProperty": "toPort",
                        "nodeDataArray": [
                            {"category":"Comment", "loc":"360 -10", "text":"Kookie Brittle", "key":-13},
                            {"key":-1, "category":"Start", "loc":"175 0", "text":"Start"},
                            {"key":0, "loc":"0 77", "text":"Preheat oven to 375 F"},
                            {"key":1, "loc":"175 100", "text":"In a bowl, blend: 1 cup margarine, 1.5 teaspoon vanilla, 1 teaspoon salt"},
                            {"key":2, "loc":"175 190", "text":"Gradually beat in 1 cup sugar and 2 cups sifted flour"},
                            {"key":3, "loc":"175 270", "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"},
                            {"key":4, "loc":"175 370", "text":"Press evenly into ungreased 15x10x1 pan"},
                            {"key":5, "loc":"352 85", "text":"Finely chop 1/2 cup of your choice of nuts"},
                            {"key":6, "loc":"175 440", "text":"Sprinkle nuts on top"},
                            {"key":7, "loc":"175 500", "text":"Bake for 25 minutes and let cool"},
                            {"key":8, "loc":"175 570", "text":"Cut into rectangular grid"},
                            {"key":-2, "category":"End", "loc":"175 640", "text":"Enjoy!"}
                         ],
                        "linkDataArray": [
                            {"from":1, "to":2, "fromPort":"B", "toPort":"T"},
                            {"from":2, "to":3, "fromPort":"B", "toPort":"T"},
                            {"from":3, "to":4, "fromPort":"B", "toPort":"T"},
                            {"from":4, "to":6, "fromPort":"B", "toPort":"T"},
                            {"from":6, "to":7, "fromPort":"B", "toPort":"T"},
                            {"from":7, "to":8, "fromPort":"B", "toPort":"T"},
                            {"from":8, "to":-2, "fromPort":"B", "toPort":"T"},
                            {"from":-1, "to":0, "fromPort":"B", "toPort":"T"},
                            {"from":-1, "to":1, "fromPort":"B", "toPort":"T"},
                            {"from":-1, "to":5, "fromPort":"B", "toPort":"T"},
                            {"from":5, "to":4, "fromPort":"B", "toPort":"T"},
                            {"from":0, "to":4, "fromPort":"B", "toPort":"T"}
                         ]};
 
        /*init krflow builder*/            
        mybuilder = myflow.KRFlow();
        
        /*load rule data string*/
        mybuilder.load(JSON.stringify(flowData));
        
        /*load button click event*/
        myload.click(function(e) {
            e.preventDefault();
            mybuilder.load(mytext.val());
        });
        
        /*dump button click event*/
        mydump.click(function(e) {
            e.preventDefault();
            mytext.val(mybuilder.dump());
        });
    }
      
    $(onReady);
})(jQuery);
