var isDom = obj => {
    return typeof obj === 'object' && (obj instanceof window.Node || isWindow(obj));
}
var isWindow = obj => {
    return typeof obj === 'object' && obj.window === obj;
}