import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: '#f1f5f9' }}>
      <div style={{ position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 50 }}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>
      <div style={{ marginLeft: collapsed ? '60px' : '220px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: '#f1f5f9' }}>
          <Topbar />
        </div>
        <main style={{ padding: '20px 24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
