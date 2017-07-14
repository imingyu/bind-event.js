# bind-event.js
为`dom/object`绑定事件，提供友好的API，支持事件的绑定、卸载、触发，还支持命名空间以方便卸载和触发；


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

//为dom绑定事件
var btn = document.getdomById('btn');
//传入选择器/dom对象都可以，选择器支持由document.querySelector实现
(E('#btn') || E(btn)).on('click', function(e){
    var dom = this;
    console.log(dom === document.getdomById('btn'));//true
    console.log(dom === e.target);//true
    console.log(e.type);//click
});

//卸载事件
E(btn).off('click');

//触发事件
E(btn).trigger('click');
```

注意事项
------
- 使用`trigger`方法触发`dom`的事件时，会触发本库绑定的对应类型的事件，同时也会触发其他库绑定的对应类型的事件；
- 使用`off`卸载`dom`事件时，只会卸载本类库绑定的对应类型的事件；
- 为`object`绑定事件时，不限制JavaScript Runtime（浏览器/Node/其他）；为`dom`绑定事件时，仅支持浏览器端；
- 使用`选择器`方式绑定事件时，请注意浏览器是否支持`document.querySelector`；
- 为`dom`绑定事件时，底层实现优先使用`addEventListener`，不支持的情况下使用 `attachEvent`；

API
------
### - E(obj).on(type, handler) | E.on (obj, type, handler)
为`obj`绑定事件

示例

```javascript
var handler = e => console.log(e);

E('#btn').on('click', handler);
E.on('#btn', 'click', handler)

var btn = document.getdomById('btn');
E(btn).on('click', handler);
E.on(btn, 'click', handler);

//添加命名空间
E('#btn').on('click.namespace1', handler);
E.on(obj, 'change.namespace1', handler);

//事件代理
E('#btn').on('click','span.icon',e=>{
    e.target;//#btn span.icon
});
E.on('#btn','click','span.icon',e=>{
    e.target;//#bt
});

//为object绑定事件
var obj = { name: "小明" };
E(obj).on('change', handler);
E.on(obj, 'change', handler);
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
E(obj).trigger('change');//触发change类型的事件
```