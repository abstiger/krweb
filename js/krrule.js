/*!
 * jQuery KRRule Plugin v1.0.0
 * 
 * Copyright (c) 2014 Tiger (http://absolutetiger.com)
 * Released under the MIT license
 * 
 **/
;(function($) {
    
    var NEW_ELE = {'kind': 5, 'value': null};
    var NEW_ARITH = {'op': 1, 'child': [NEW_ELE, NEW_ELE]};
    var NEW_LOGIC = {'op': 10, 'child': [NEW_ELE, NEW_ELE]};
    var NEW_RELATION = {'op': 16, 'child': [NEW_LOGIC]};

    function RuleBuilder(element, options) {
        this.element = element;
        
        this.defaults = {
            /*default variables*/
            E_KRCalcKind: {
                0   : {type:'Exp', name:'add-exp', desc:'表达式', options:null},
                3   : {type:'Int', name:'integer',  desc:'整型常量', options:null},
                4   : {type:'Float', name:'float',  desc:'浮点型常量', options:null},
                5   : {type:'String', name:'string',  desc:'字符串常量', options:null},
                6   : {type:'String', name:'multi-int', desc:'整型多值', options:null},
                7   : {type:'String', name:'multi-float', desc:'浮点型多值', options:null},
                8   : {type:'String', name:'multi-string', desc:'字符串型多值', options:null},
                9   : {type:'String', name:'regex', desc:'正则表达式', options:null}
            },
            
            E_KRCalcOp: {
                 0    : {type:'arith', name:'d ', desc:'删'},
                 1    : {type:'arith', name:'+ ', desc:'加'},
                 2    : {type:'arith', name:'- ', desc:'减'},
                 3    : {type:'arith', name:'* ', desc:'乘'},
                 4    : {type:'arith', name:'/ ', desc:'除'},
                 5    : {type:'arith', name:'% ', desc:'模'},
            
                 6    : {type:'logic', name:'< ', desc:'小于'},
                 7    : {type:'logic', name:'<=', desc:'小于等于'},
                 8    : {type:'logic', name:'> ', desc:'大于'},
                 9    : {type:'logic', name:'>=', desc:'大于等于'},
                10    : {type:'logic', name:'==', desc:'等于'},
                11    : {type:'logic', name:'!=', desc:'不等于'},
                12    : {type:'logic', name:'@@', desc:'属于'},
                13    : {type:'logic', name:'!@', desc:'不属于'},
                14    : {type:'logic', name:'##', desc:'正则匹配'},
            
                15    : {type:'relation', name:'! ', desc:'非'},
                16    : {type:'relation', name:'&&', desc:'并且'},
                17    : {type:'relation', name:'||', desc:'或者'}
            },
            
            /*default functions*/
            onEleMouseOver: function(element) {
                element.css('background-color', 'Gray');
            },
            
            onEleMouseOut: function(element) {
                element.css('background-color', '');
            },
            
            onBracketMouseOver: function(element, other) {
                element.css('background-color', 'Green');
                other.css('background-color', 'Green');
            },
            
            onBracketMouseOut:function(element, other) {
                element.css('background-color', '');
                other.css('background-color', '');
            },
            
            onArithSelectMouseOver: function(element, arith) {
                //element.css('background-color', 'LightBlue');
                arith.css('background-color', 'Blue');
            },
            
            onArithSelectMouseOut: function(element, arith) {
                //element.css('background-color', '');
                arith.css('background-color', '');
            },
            
            onLogicSelectMouseOver: function(element, logic) {
                //element.css('background-color', 'Red');
                logic.css('background-color', 'Orange');
            },
            
            onLogicSelectMouseOut: function(element, logic) {
                //element.css('background-color', '');
                logic.css('background-color', '');
            },
        }
        
        this.settings = $.extend(true, {}, this.defaults, options);
    };

    RuleBuilder.prototype = {
        
        load: function(ruleStr) {
            var $table = $('<table>', {'class': 'krrule'});
            $table.append(this.buildRule(JSON.parse(ruleStr)));
            $(this.element).html($table);
            return this;
        },
        
        dump: function() {
            var ruleData = this.collectData($(this.element).find('.exp').first(), null);
            return JSON.stringify(ruleData);
        },
        
        
        collectData: function(node, parent) {
            var _this = this;
            if (node.is('.exp')) {
                var _exp = {op:null, child:[]};
                _exp.op = parseInt(node.find('.op').val());
                node.children().each(function() {
                    var val = _this.collectData($(this), _exp);
                    if (val != null) _exp.child.push(val);
                });
                //console.log('exp:'+JSON.stringify(_exp));
                return _exp;
            } else if (node.is('.ele')) {
                var _ele = {kind: null, value: null};
                _ele.kind = parseInt(node.find('.kind').val());
                if (this.settings.E_KRCalcKind[_ele.kind].type == 'Int') {
                    _ele.value = parseInt(node.find('.value').val());
                } else if (this.settings.E_KRCalcKind[_ele.kind].type == 'Float') {
                    _ele.value = parseFloat(node.find('.value').val());
                } else {
                    _ele.value = node.find('.value').val();
                }
                //console.log('ele:'+JSON.stringify(_ele));
                return _ele;
            } else {
                node.children().each(function() {
                    var val = _this.collectData($(this), parent);
                    if (val != null) parent.child.push(val);
                });
                return null;
            }
        },

        buildRule: function(ruleData) {
            if (ruleData.op) {
                return this.buildExp(ruleData);
            } else if (ruleData.kind) {
                return this.buildEle(ruleData);
            } else {
                throw 'ruleData error:'+JSON.stringify(ruleData);
            }
        },

        buildExp: function(ruleData) {
            var op = this.settings.E_KRCalcOp[ruleData.op];
            if (op == null) {
                throw 'unsupported op:'+ruleData.op;
            }
            
            if (op.type == 'relation') {
                return this.buildRel(ruleData);
            } else if (op.type == 'logic') {
                return this.buildLogic(ruleData);
            } else if (op.type == 'arith') {
                return this.buildArith(ruleData);
            } else {
                throw 'unsupported op type:'+op.type;
            }
        },

        buildRel: function(ruleData) {
            var _this = this;
            var tr = $('<tr>', {'class': 'exp relation'});

            //删除按钮
            var tdRemove = $('<td>');
            var removeLink = $('<a>', {'href': '#'}).append($('<div>', {'class': 'krrule-remove'}));
            removeLink.click(function(e) {
                e.preventDefault();
                tr.remove();
            });
            tdRemove.append(removeLink);
            tr.prepend(tdRemove);

            //关系操作符
            var tdOther = $('<td>');
            var table = $('<table>');
            var trInner = $('<tr>');
            var tdRelOp = $('<td>');
            var relSelect = $('<select>', {'class': 'op rel'});
            for (var op in this.settings.E_KRCalcOp) {
                if (this.settings.E_KRCalcOp[op].type == 'relation') {
                    relSelect.append($('<option>', {'value': op,
                    'text': this.settings.E_KRCalcOp[op].desc, 'selected': ruleData.op == op}));
                }
            }
            tdRelOp.append(relSelect);
            trInner.append(tdRelOp);

            //竖线
            var tdLine = $('<td>', {'class': 'krrule-line'});
            trInner.append(tdLine);

            //表达式
            var tdExpression = $('<td>');
            var tdExpTable = $('<table>');
            for(var i=0; i<ruleData.child.length; i++) {
                tdExpTable.append(this.buildRule(ruleData.child[i]));
            }

            //增加行
            var trAdd = $('<tr>');
            var tdAddExp = $('<td>');
            var addLink = $('<a>', {'href': '#'}).append($('<div>', {'class': 'krrule-add-logic'}));
            addLink.click(function(e) {
                e.preventDefault();
                trAdd.before(_this.buildLogic(NEW_LOGIC));
            });
            tdAddExp.append(addLink);
            trAdd.append(tdAddExp);

            var tdAddRel = $('<td>');
            var addRelButton = $('<input>', {'class': 'krrule-add-rel', 'type': 'button', 'value': '+{}'});
            addRelButton.click(function(e) {
                e.preventDefault();
                trAdd.before(_this.buildRel(NEW_RELATION));
            });
            tdAddRel.append(addRelButton);
            trAdd.append(tdAddRel);

            tdExpTable.append(trAdd);
            tdExpression.append(tdExpTable);

            trInner.append(tdExpression);
            table.append(trInner);
            tdOther.append(table);
            tr.append(tdOther);

            return tr;
        },

        buildLogic: function(ruleData) {
            var _this = this;
            var tr = $('<tr>', {'class': 'exp logic'});

            //删除按钮
            var tdRemove = $('<td>');
            var removeLink = $('<a>', {'href': '#'}).append($('<div>', {'class': 'krrule-remove'}));
            removeLink.click(function(e) {
                e.preventDefault();
                tr.remove();
            });
            tdRemove.append(removeLink);
            tr.append(tdRemove);

            //表达式
            var tdExpression = $('<td>');
            var tdExpTable = $('<table>');
            var trInner = $('<tr>');

            //左运算式
            var tdLeftExp = $('<td>');
            tdLeftExp.append(_this.buildRule(ruleData.child[0]));
            trInner.append(tdLeftExp);

            //逻辑操作符
            var tdLogicOp = $('<td>');
            var logicSelect = $('<select>', {'class': 'op logic'});
            for (var op in this.settings.E_KRCalcOp) {
                if (this.settings.E_KRCalcOp[op].type == 'logic') {
                    logicSelect.append($('<option>', {'value': op,
                    'text': this.settings.E_KRCalcOp[op].desc, 'selected': ruleData.op == op}));
                }
            }
            logicSelect.mouseover(function(e) {
                _this.settings.onLogicSelectMouseOver($(this), tdExpTable);
            });
            logicSelect.mouseout(function(e) {
                _this.settings.onLogicSelectMouseOut($(this), tdExpTable);
            });
            tdLogicOp.append(logicSelect);
            trInner.append(tdLogicOp);

            //右运算式
            var tdRightExp = $('<td>');
            tdRightExp.append(_this.buildRule(ruleData.child[1]));
            trInner.append(tdRightExp);

            tdExpTable.append(trInner);
            tdExpression.append(tdExpTable);
            tr.append(tdExpression);

            return tr;
        },

        buildArith: function(ruleData) {
            var _this = this;
            var tr = $('<tr>', {'class': 'exp arith'});

            //表达式
            var tdExpression = $('<td>');
            var tdExpTable = $('<table>');
            var trInner = $('<tr>');

            //左运算式
            var tdLeftExp = $('<td>');
            var tdLeftBracket = $('<td>').append('(');
            tdLeftBracket.mouseover( function(e) {
                _this.settings.onBracketMouseOver($(this), tdRightBracket);
            });
            tdLeftBracket.mouseout( function(e) {
                _this.settings.onBracketMouseOut($(this), tdRightBracket);
            });
            trInner.append(tdLeftBracket);
            tdLeftExp.append(_this.buildRule(ruleData.child[0]));
            trInner.append(tdLeftExp);

            //算术操作符
            var tdArithOp = $('<td>');
            var arithSelect = $('<select>', {'class': 'op arith'});
            for (var op in this.settings.E_KRCalcOp) {
                if (this.settings.E_KRCalcOp[op].type == 'arith') {
                    arithSelect.append($('<option>', {'value': op,
                    'text': this.settings.E_KRCalcOp[op].desc, 'selected': ruleData.op == op}));
                }
            }
            arithSelect.change(onArithSelectChange.call(this, tr));
            arithSelect.mouseover(function(e) {
                _this.settings.onArithSelectMouseOver($(this), tdExpTable);
            });
            arithSelect.mouseout(function(e) {
                _this.settings.onArithSelectMouseOut($(this), tdExpTable);
            });
            tdArithOp.append(arithSelect);
            trInner.append(tdArithOp);

            //右运算式
            var tdRightExp = $('<td>');
            var tdRightBracket = $('<td>').append(')');
            tdRightBracket.mouseover(function(e) {
                _this.settings.onBracketMouseOver($(this), tdLeftBracket);
            });
            tdRightBracket.mouseout(function(e) {
                _this.settings.onBracketMouseOut($(this), tdLeftBracket);
            });
            tdRightExp.append(_this.buildRule(ruleData.child[1]));
            trInner.append(tdRightExp);
            trInner.append(tdRightBracket);

            tdExpTable.append(trInner);
            tdExpression.append(tdExpTable);
            tr.append(tdExpression);

            return tr;
        },

        buildEle: function(ruleData) {
            var _this = this;
            var table = $('<table>', {'class': 'ele'});
            table.mouseover(function(e) {
                _this.settings.onEleMouseOver($(this));
            });
            table.mouseout(function(e) {
                _this.settings.onEleMouseOut($(this));
            });

            var tdElement = $('<td>');
            var kindSelect = $('<select>', {'class': 'kind'});
            for (var kd in this.settings.E_KRCalcKind) {
                kindSelect.append($('<option>', {'value': kd,
                'text': this.settings.E_KRCalcKind[kd].desc, 'selected': ruleData.kind == kd}));
            }
            kindSelect.change(onKindSelectChange.call(this, ruleData));
            tdElement.append(kindSelect);
            table.append(tdElement);

            kindSelect.change();
            return table;
        }
    };

    function onArithSelectChange(tr) {
        var _this = this;
        return function(e) {
            var op = parseInt($(this).find('> :selected').val());
            if (op == 0) { //删除表达式
                e.preventDefault();
                tr.after(_this.buildEle(NEW_ELE));
                tr.remove();
            }
        }
    }

    function onKindSelectChange(ruleData) {
        var _this = this;
        return function(e) {
            var kind = parseInt($(this).find('> :selected').val());
            var container = $(this).parent();
            var kindSelect = container.find('.kind');
            var currentValue = container.find('.value');
            var options = _this.settings.E_KRCalcKind[kind].options;

            //增加表达式
            if (kind == 0) {
                e.preventDefault();
                container.parent().after(_this.buildArith(NEW_ARITH));
                container.parent().remove();
                return;
            }
            
            if(options && options != 'undefined') {
                var select = $('<select>', {'class': 'value'});
                for(var i=0; i < options.length; i++) {
                    select.append($('<option>', {'text': options[i].desc,
                    'value': options[i].value, selected: options[i].value==ruleData.value}));
                }
                $(this).after(select);
            } else {
                var text = $('<input>', {'type':'text', 'class':'value', 'value':ruleData.value});
                $(this).after(text);
            }
            currentValue.remove();
        }
    }
    
    $.fn.KRRule = function(options) {
        
        var builder = new RuleBuilder(this, options);
        this.each(function() {
            if (!$(this).data('KRRule')) {
                $(this).data('KRRule', builder);
            }
        });
        return builder;
    };

})(jQuery);
