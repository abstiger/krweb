var mybuilder, mytext, myrule, myload, mydump;
(function($) {
    function onReady() {

        mytext = $("#mytext");
        myflow = $("#myflow");
        myload = $("#myload");
        mydump = $("#mydump");
       
        initializeFlow();
    }
    
    function initializeFlow() {
        
        var flowData = {"class": "go.GraphLinksModel",
                        "linkFromPortIdProperty": "fromPort",
                        "linkToPortIdProperty": "toPort",
                        "nodeDataArray": [ 
                            {"category":"Comment", "loc":"360 -10", "text":"Kookie Brittle", "key":-13},
                            {"key":-1, "category":"Start", "loc":"175 0", "text":"Start"},
                            {"key":0, "category":"Step", "loc":"-79 228", "text":"Preheat oven to 375 F"},
                            {"key":3, "category":"Step", "loc":"174.99999999999997 232", "text":"Mix in 6 oz (1 cup) Nestle's Semi-Sweet Chocolate Morsels"},
                            {"key":4, "category":"Step", "loc":"175 370", "text":"Press evenly into ungreased 15x10x1 pan"},
                            {"key":5, "category":"Step", "loc":"414.00000000000006 249.00000000000003", "text":"Finely chop 1/2 cup of your choice of nuts"},
                            {"key":-2, "category":"End", "loc":"174.99999999999997 480.0000000000001", "text":"Enjoy!"},
                            {"key":-3, "category":"Judge", "loc":"175.046875 124.125", "text":"Judge", "figure":"Diamond", }
                        ],
                        "linkDataArray": [ 
                            {"from":3, "to":4, "fromPort":"B", "toPort":"T", "points":[175,263.9,175,273.9,175,301,175,301,175,328.1,175,338.1]},
                            {"from":-3, "to":0, "fromPort":"L", "toPort":"T", "points":[115.546875,124.125,105.546875,124.125,-79,124.125,-79,162.9125,-79,201.7,-79,211.7], "visible":true},
                            {"from":-3, "to":5, "fromPort":"R", "toPort":"T", "points":[234.546875,124.125,244.546875,124.125,414,124.125,414,169.5125,414,214.9,414,224.9], "visible":true},
                            {"from":5, "to":4, "fromPort":"B", "toPort":"T", "points":[414,273.1,414,283.1,414,305.6,175,305.6,175,328.1,175,338.1]},
                            {"from":0, "to":4, "fromPort":"B", "toPort":"T", "points":[-79,244.29999999999998,-79,254.29999999999998,-79,252,-79,252,-79,308,175,308,175,328.1,175,338.1]},
                            {"from":-1, "to":-3, "fromPort":"B", "toPort":"T", "points":[175,32.47674418604652,175,42.47674418604652,175,62.25087209302326,175.046875,62.25087209302326,175.046875,82.025,175.046875,92.025]},
                            {"from":-3, "to":3, "fromPort":"B", "toPort":"T", "visible":true, "points":[175.046875,156.22500000000002,175.046875,166.22500000000002,175.046875,178.16250000000002,175,178.16250000000002,175,190.1,175,200.1]},
                            {"from":4, "to":-2, "fromPort":"B", "toPort":"T", "points":[175,401.90000000000003,175,411.90000000000003,175,425.95000000000005,175,425.95000000000005,175,440,175,450]}
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
