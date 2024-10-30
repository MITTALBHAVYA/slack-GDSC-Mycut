// App.jsx
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './app/store.js';
import AuthPage from './pages/AuthPage.jsx';
import WorkspacePage from './pages/WorkspacePage.jsx'
import PrivateRoute from './components/auth/PrivateRoute.jsx';
// import ChannelList from './components/chat/ChannelList.jsx';
import ChatPage from './pages/ChatPage.jsx';
const App = () => {
  return (
    <Provider store={store}>
    <Router>
      <Routes>
        <Route path='/auth/*' element={<AuthPage/>}/>
        <Route path='/workspace' element={<PrivateRoute><WorkspacePage/></PrivateRoute>}/>
        {/* <Route path="/workspace/:workspaceId" element={<PrivateRoute><ChannelList/></PrivateRoute>} /> */}
        <Route path='/workspace/:workspaceId/:channelId' element={<PrivateRoute><ChatPage/></PrivateRoute>}></Route>
      </Routes>
    </Router>
    </Provider>
  );
};
export default App;
