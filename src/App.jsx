import React, { useState } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import ChatHistory from './pages/ChatHistory.jsx';
import NewRequest from './pages/NewRequest.jsx';
import PRDetail from './pages/PRDetail.jsx';
import PRDetailFresh from './pages/PRDetailFresh.jsx';
import PRDetailRFP from './pages/PRDetailRFP.jsx';
import Login from './pages/Login.jsx';
import NewChat from './pages/NewChat.jsx';
import ChatDetail from './pages/ChatDetail.jsx';
import AgentManagement from './pages/AgentManagement.jsx';
import Templates from './pages/Templates.jsx';

const NAV_MAP = {
  'Dashboard': 'dashboard',
  'Chat History': 'chathistory',
  'Requests': 'requests',
  'Purchase Orders': 'purchaseorders',
  'New Chat': 'newchat',
  'New Request': 'newrequest',
  'Chat Detail': 'chatdetail',
  'PR Detail Fresh': 'prdetailfresh',
  'PR Detail RFP': 'prdetailrfp',
  'Login': 'login',
  'Templates': 'templates',
  'Agent Management': 'agentmanagement',
};

const PAGE_TO_NAV = {
  'dashboard': 'Dashboard',
  'chathistory': 'Chat History',
  'requests': 'Requests',
  'purchaseorders': 'Purchase Orders',
  'newrequest': null,
  'newchat': null,
  'chatdetail': null,
  'prdetail': null,
  'prdetailfresh': 'Requests',
  'prdetailrfp': 'Requests',
  'login': null,
  'templates': 'Templates',
  'agentmanagement': 'Agent Management',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userRole, setUserRole] = useState('analyst');

  function handleNavigate(nameOrKey) {
    const mapped = NAV_MAP[nameOrKey];
    setCurrentPage(mapped || nameOrKey);
  }

  const activeNav = PAGE_TO_NAV[currentPage] || '';
  const pageProps = { setCurrentPage, onNavigate: handleNavigate, activeNav, userRole };

  return (
    <>
      {currentPage === 'login' && <Login onNavigate={handleNavigate} onLogin={(role) => setUserRole(role)} />}
      {currentPage === 'dashboard' && <Dashboard {...pageProps} />}
      {currentPage === 'chathistory' && <ChatHistory {...pageProps} />}
      {currentPage === 'newchat' && <NewChat {...pageProps} />}
      {currentPage === 'chatdetail' && <ChatDetail {...pageProps} />}
      {currentPage === 'newrequest' && <NewRequest {...pageProps} />}
      {currentPage === 'prdetail' && <PRDetail {...pageProps} />}
      {currentPage === 'prdetailfresh' && <PRDetailFresh {...pageProps} />}
      {currentPage === 'templates' && <Templates {...pageProps} />}
      {currentPage === 'agentmanagement' && <AgentManagement {...pageProps} />}
      {currentPage === 'prdetailrfp' && <PRDetailRFP {...pageProps} />}
    </>
  );
}