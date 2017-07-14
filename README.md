# bind-event.js
为`object/element(dom)`绑定事件，提供友好的API，支持事件的绑定、卸载、触发，还支持命名空间以方便卸载和触发；
>为`object`绑定事件时，不限制JavaScript Runtime（浏览器/Node/其他）；为`element`绑定事件时，仅支持浏览器端。


安装
------
```
npm i bind-event-js -S
```

使用
------
```javascript
import E from 'bind-event-js';
E('#btn').on('click', e => { alert(e.type); });

/*为element绑定事件*/
//1.类jQuery式绑定，支持传入选择器/原生element对象
var btn = document.getElementById('btn');
(E('#btn') || E(btn)).on('click', function(e){
    var dom = this;
    console.log(dom === document.getElementById('btn'));//true
    console.log(dom === e.target);//true
    console.log(e.type);//click
});

//2.
```

API
------
### - E(obj).on(type, handler) | E.on (obj, type, handler)
为`obj`绑定事件

示例

```javascript
var handler = e => console.log(e);

E('#btn').on('click', handler);
E.on('#btn', 'click', handler)

var btn = document.getElementById('btn');
E(btn).on('click', handler);
E.on(btn, 'click', handler);

var obj = { name: "小明" };
E(obj).on('change', handler);
E.on(obj, 'change', handler);

//添加命名空间
E('#btn').on('click.namespace1', handler);
E.on(obj, 'change.namespace1', handler);
```


### - E(obj).off(type, handler) | E.off (obj, type, handler)
卸载`obj`上指定类型的事件

示例

```javascript
E('#btn').off('click');//卸载所有click类型的事件
E.off('#btn', 'click.change');//卸载click类型中命名空间是change的事件
```


### - E(obj).trigger(type) | E.trigger (obj, type)
触发`obj`上指定类型的事件

示例

```javascript
E('#btn').trigger('click');//触发click类型的事件
E.trigger('#btn', 'click.change');//触发click类型中命名空间是change的事件
E(obj).trigger('change');//触发click类型的事件
```