import React, { useState } from 'react';
import Sidebar from './layouts/Sidebar.jsx';
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
import ClauseManagement from './pages/ClauseManagement.jsx';
import TemplateDetail from './pages/TemplateDetail.jsx';
import PurchaseOrders from './pages/PurchaseOrders.jsx';
import PRDetailDraft from './pages/PRDetailDraft.jsx';

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
  'Clause Management': 'clausemanagement',
  'Template Detail': 'templatedetail',
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
  'prdetailfresh': 'Dashboard',
  'prdetailrfp': 'Dashboard',
  'prdetaildraft': 'Dashboard',
  'login': null,
  'templates': 'Templates',
  'clausemanagement': 'Clause Management',
  'templatedetail': 'Templates',
  'agentmanagement': 'Agent Management',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userRole, setUserRole] = useState('analyst');
  const [navState, setNavState] = useState(null);

  function handleNavigate(nameOrKey, state = null) {
    const mapped = NAV_MAP[nameOrKey];
    setCurrentPage(mapped || nameOrKey);
    setNavState(state);
  }

  const activeNav = PAGE_TO_NAV[currentPage] || '';
  const pageProps = { setCurrentPage, onNavigate: handleNavigate, activeNav, userRole, navState };

  return (
    <>
      {currentPage === 'login' ? (
        <Login onNavigate={handleNavigate} onLogin={(role) => setUserRole(role)} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden', fontFamily: 'var(--typography-font-family-primary), Inter, sans-serif', background: 'var(--bg-default)' }}>
          <Sidebar activeNav={activeNav} onNavigate={handleNavigate} userRole={userRole} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-default)' }}>
            {currentPage === 'dashboard' && <Dashboard {...pageProps} />}
            {currentPage === 'chathistory' && <ChatHistory {...pageProps} />}
            {currentPage === 'newchat' && <NewChat {...pageProps} />}
            {currentPage === 'chatdetail' && <ChatDetail {...pageProps} />}
            {currentPage === 'newrequest' && <NewRequest {...pageProps} />}
            {currentPage === 'prdetail' && <PRDetail {...pageProps} />}
            {currentPage === 'prdetailfresh' && <PRDetailFresh {...pageProps} />}
            {currentPage === 'templates' && <Templates {...pageProps} />}
            {currentPage === 'clausemanagement' && <ClauseManagement {...pageProps} />}
            {currentPage === 'templatedetail' && <TemplateDetail {...pageProps} />}
            {currentPage === 'agentmanagement' && <AgentManagement {...pageProps} />}
            {currentPage === 'prdetailrfp' && <PRDetailRFP {...pageProps} />}
            {currentPage === 'prdetaildraft' && <PRDetailDraft {...pageProps} />}
            {currentPage === 'purchaseorders' && <PurchaseOrders {...pageProps} />}
          </div>
        </div>
      )}
    </>
  );
}