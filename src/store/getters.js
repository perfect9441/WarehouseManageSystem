const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  dict:state => state.user.dict,
  userInfo:state => state.user.userInfo,

  unSignMsgList:state => state.websocket.unSignMsgList,
  unSignCount:state => state.websocket.unSignCount,
  sendMsgData:state => state.websocket.sendMsgData,
  isOnPage:state => state.websocket.isOnPage,
  acceptMsgData:state => state.websocket.acceptMsgData,
 
  
}
export default getters
