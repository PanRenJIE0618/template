//创建一个广播通讯对象
const channel = new BroadcastChannel('communication')
/**
 * @function 发送信息
 * @param type 事件类型
 * @param content 事件内容
 */
export function sendMsg(type, content) {
  channel.postMessage({
    type,
    content
  })
}

/**
 * @function 接收发送的事件
 * @param callback 回调
 * @returns {(function(): void)|*}
 */
export function listenMsg(callback) {
  const handler = (e) => {
    callback && callback(e.data)
  }
  channel.addEventListener('message', handler)
  //页面销毁取消监听防止内存泄露
  return () => {
    channel.removeEventListener('message',handler)
  }
}