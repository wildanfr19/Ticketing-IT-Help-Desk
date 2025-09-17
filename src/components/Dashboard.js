import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'tickets', label: 'My Tickets', icon: '🎫' },
    { id: 'create', label: 'Create Ticket', icon: '➕' }
  ];

  // Add All Tickets for staff roles
  if (['admin', 'manager', 'technician'].includes(user.role)) {
    menuItems.push({ id: 'all-tickets', label: 'All Tickets', icon: '📋' });
  }

  // Add Users menu for admin/manager only  
  if (['admin', 'manager'].includes(user.role)) {
    menuItems.push({ id: 'users', label: 'Users', icon: '👥' });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        background: 'linear-gradient(180deg, #343a40 0%, #495057 100%)',
        color: 'white',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              🎫
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '700' }}>IT HELPDESK</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Support System</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            {user.fullName}
          </div>
          <div style={{ 
            fontSize: '12px', 
            opacity: 0.8,
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 8px',
            borderRadius: '12px',
            display: 'inline-block'
          }}>
            {user.role.replace('_', ' ').toUpperCase()}
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '20px 0' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                width: '100%',
                padding: '12px 24px',
                background: activeMenu === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                if (activeMenu !== item.id) {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '24px', 
          right: '24px' 
        }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        marginLeft: '260px', 
        flex: 1, 
        padding: '24px',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '20px 24px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            margin: '0 0 8px', 
            fontSize: '28px', 
            fontWeight: '700',
            color: '#333'
          }}>
            {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#666',
            fontSize: '16px'
          }}>
            Welcome back, {user.fullName}!
          </p>
        </div>

        {/* Content Area */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          minHeight: '400px'
        }}>
          <DashboardContent 
            activeMenu={activeMenu}
            user={user}
            selectedTicketId={selectedTicketId}
            setSelectedTicketId={setSelectedTicketId}
          />
        </div>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ activeMenu, user, selectedTicketId, setSelectedTicketId }) => {
 if (selectedTicketId) {
    return (
      <TicketDetail
        ticketId={selectedTicketId}
        onBack={() => setSelectedTicketId(null)}
      />
    );
  }
  switch (activeMenu) {
    case 'dashboard':
      return <DashboardHome user={user} />;
    case 'tickets':
      return <MyTickets setSelectedTicketId={setSelectedTicketId}/>;
    case 'create':
      return <CreateTicket />;
    case 'all-tickets':
        return <AllTickets setSelectedTicketId={setSelectedTicketId} />;
     case 'users':
      return <UserManagement />;
    
    default:
      return <div>Content for {activeMenu} - Coming Soon!</div>;
  }
};

// Dashboard Home Component
// Ganti DashboardHome component di Dashboard.js
const DashboardHome = ({ user }) => {
  const [stats, setStats] = useState({
    summary: { total: 0, open: 0, resolved: 0, closed: 0 },
    ticketsByStatus: {},
    ticketsByPriority: [],
    ticketsByCategory: [],
    recentTickets: [],
    userStats: null
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/stats/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading statistics...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 8px', color: '#333' }}>Dashboard Overview</h2>
          <p style={{ margin: 0, color: '#666' }}>
            Welcome back, {user.fullName}! Here's your ticket summary.
          </p>
        </div>
        <button
          onClick={fetchStats}
          style={{
            padding: '8px 16px',
            background: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔄 Refresh
        </button>
      </div>
      
      {/* Summary Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
            {stats.summary.total}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Total Tickets</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
            {stats.summary.open}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Open Tickets</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
            {stats.summary.resolved}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Resolved</div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '8px' }}>
            {stats.summary.closed}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>Closed</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '30px' }}>
        {/* Priority Distribution */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#333', fontSize: '18px' }}>By Priority</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.ticketsByPriority.map(item => (
              <div key={item.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: `${item.color}15`,
                borderRadius: '6px',
                border: `1px solid ${item.color}30`
              }}>
                <span style={{ color: item.color, fontWeight: '500' }}>{item.name}</span>
                <span style={{ color: item.color, fontWeight: '600' }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#333', fontSize: '18px' }}>By Category</h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            {stats.ticketsByCategory.slice(0, 5).map((item, index) => (
              <div key={item.name} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: '#f8f9fa',
                borderRadius: '6px'
              }}>
                <span style={{ color: '#333' }}>{item.name}</span>
                <span style={{ 
                  background: '#667eea', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px',
                  fontSize: '12px'
                }}>
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ margin: '0 0 16px', color: '#333', fontSize: '18px' }}>Recent Tickets</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {stats.recentTickets.slice(0, 5).map(ticket => (
            <div key={ticket.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              background: '#f8f9fa',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              <div>
                <div style={{ fontWeight: '500', color: '#333', marginBottom: '4px' }}>
                  {ticket.ticketNumber} - {ticket.title}
                </div>
                <div style={{ color: '#666', fontSize: '12px' }}>
                  by {ticket.requester?.fullName} • {ticket.category?.name}
                </div>
              </div>
              <div style={{ textAlign: 'right', color: '#888', fontSize: '12px' }}>
                {formatDate(ticket.created_at)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Stats for Admin */}
      {stats.userStats && user.role === 'admin' && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          marginTop: '24px'
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#333', fontSize: '18px' }}>User Statistics</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            {Object.entries(stats.userStats).map(([role, count]) => (
              <div key={role} style={{
                background: '#f8f9fa',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'center',
                minWidth: '100px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>{count}</div>
                <div style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>
                  {role.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder components
// Ganti MyTickets component di Dashboard.js
const MyTickets = ({ setSelectedTicketId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
    // console.log('Ticket detail:', ticket);
  // Load tickets when component mounts
  React.useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        console.log('Tickets data:', data.data.tickets); // Debug log
        console.log('First ticket priority:', data.data.tickets[0]?.priority); 
        setTickets(data.data.tickets);
      } else {
        setError(data.message || 'Failed to fetch tickets');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const getStatusColor = (status) => {
    const colors = {
      'new': '#007bff',
      'assigned': '#6c757d', 
      'in_progress': '#ffc107',
      'pending': '#fd7e14',
      'resolved': '#28a745',
      'closed': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getPriorityColor = (level) => {
    const colors = {
      1: '#28a745', // Low - Green
      2: '#ffc107', // Medium - Yellow  
      3: '#fd7e14', // High - Orange
      4: '#dc3545'  // Critical - Red
    };
    return colors[level] || '#6c757d';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        color: '#721c24'
      }}>
        <strong>Error:</strong> {error}
        <button 
          onClick={fetchTickets}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>My Tickets</h2>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '8px 16px', 
          borderRadius: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          Total: {tickets.length} tickets
        </div>
      </div>

      {tickets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: '12px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎫</div>
          <h3 style={{ color: '#666', marginBottom: '8px' }}>No Tickets Yet</h3>
          <p style={{ color: '#999', margin: 0 }}>
            You haven't created any tickets yet. Click "Create Ticket" to get started.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                transition: 'all 0.3s',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              onClick={() => setSelectedTicketId(ticket.id)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              {/* Ticket Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      background: '#f0f0f0',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#666'
                    }}>
                      {ticket.ticketNumber}
                    </span>
                    <span style={{
                      background: getStatusColor(ticket.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span style={{
                      background: getPriorityColor(ticket.priority?.level),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}>
                        
                      {ticket.priority?.name}
                    </span>
                  </div>
                  <h3 style={{
                    margin: '0 0 8px',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#333',
                    lineHeight: '1.3'
                  }}>
                    {ticket.title}
                  </h3>
                  <p style={{
                    margin: '0 0 12px',
                    color: '#666',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    {ticket.description.length > 100 
                      ? ticket.description.substring(0, 100) + '...' 
                      : ticket.description
                    }
                  </p>
                </div>
              </div>

              {/* Ticket Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid #f0f0f0',
                fontSize: '13px',
                color: '#888'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span>📂 {ticket.category?.name}</span>
                  {ticket.assignee && (
                    <span>👤 Assigned to: {ticket.assignee.fullName } </span>
                  )}
                </div>
                <div>
                  <span>📅 {formatDate(ticket.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          onClick={fetchTickets}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          🔄 Refresh Tickets
        </button>
      </div>
    </div>
  );
};

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priorityId: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  React.useEffect(() => {
    fetchFormData();
  }, []);

   const fetchFormData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch categories
      const categoriesResponse = await fetch('http://localhost:5050/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const categoriesData = await categoriesResponse.json();
      
      // Fetch priorities
      const prioritiesResponse = await fetch('http://localhost:5050/api/priorities', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const prioritiesData = await prioritiesResponse.json();

      if (categoriesData.success) {
        setCategories(categoriesData.data.categories);
      }
      
      if (prioritiesData.success) {
        setPriorities(prioritiesData.data.priorities);
      }

    } catch (error) {
      console.error('Error fetching form data:', error);
      setMessage({ text: 'Failed to load form data', type: 'error' });
    } finally {
      setDataLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message.text) setMessage({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:5050/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          categoryId: parseInt(formData.categoryId),
          priorityId: parseInt(formData.priorityId)
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          text: `Ticket created successfully! Ticket Number: ${data.data.ticket.ticketNumber}`, 
          type: 'success' 
        });
        setFormData({ title: '', description: '', categoryId: '', priorityId: '' });
      } else {
        setMessage({ text: data.message || 'Failed to create ticket', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    }

    setLoading(false);
  };
   if (dataLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading form data...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>Create New Ticket</h2>

      {/* Message */}
      {message.text && (
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
          color: message.type === 'success' ? '#155724' : '#721c24'
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: '#333',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Judul Ticket *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Contoh: Komputer tidak bisa nyala"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        {/* Category */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: '#333',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Kategori *
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s',
              boxSizing: 'border-box',
              background: 'white'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          >
            <option value="">Pilih Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: '#333',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Prioritas *
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            {priorities.map(priority => (
              <label key={priority.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: `2px solid ${formData.priorityId === priority.id.toString() ? priority.color : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: formData.priorityId === priority.id.toString() ? `${priority.color}15` : 'white'
              }}>
                <input
                  type="radio"
                  name="priorityId"
                  value={priority.id}
                  checked={formData.priorityId === priority.id.toString()}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: '500',
                  color: formData.priorityId === priority.id.toString() ? priority.color : '#333'
                }}>
                  {priority.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            color: '#333',
            fontWeight: '500',
            fontSize: '14px'
          }}>
            Deskripsi Detail *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Jelaskan masalah Anda secara detail..."
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.3s',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }
          }}
        >
          {loading ? 'Creating...' : '🎫 Create Ticket'}
        </button>
      </form>
    </div>
  );
};

// Tambahkan AllTickets component di Dashboard.js (sebelum export default Dashboard)

const AllTickets = ({ setSelectedTicketId }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  // const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [assigningTicket, setAssigningTicket] = useState(null);

    const handleAssignClick = (ticket, e) => {
      e.stopPropagation(); // Prevent ticket detail from opening
      setAssigningTicket(ticket);
    };

  const handleAssignComplete = (updatedTicket) => {
    setTickets(tickets.map(ticket => 
      ticket.id === updatedTicket.id ? updatedTicket : ticket
    ));
  };

  React.useEffect(() => {
    fetchAllTickets();
  }, []);

  const fetchAllTickets = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setTickets(data.data.tickets);
      } else {
        setError(data.message || 'Failed to fetch tickets');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5050/api/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setTickets(tickets.map(ticket => 
          ticket.id === ticketId ? data.data.ticket : ticket
        ));
      } else {
        alert('Failed to update ticket: ' + data.message);
      }
    } catch (error) {
      alert('Error updating ticket');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': '#007bff',
      'assigned': '#6c757d', 
      'in_progress': '#ffc107',
      'pending': '#fd7e14',
      'resolved': '#28a745',
      'closed': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getPriorityColor = (level) => {
    const colors = {
      1: '#28a745', // Low
      2: '#ffc107', // Medium
      3: '#fd7e14', // High
      4: '#dc3545'  // Critical
    };
    return colors[level] || '#6c757d';
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading all tickets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        color: '#721c24'
      }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>All Tickets</h2>
        
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'new', 'in_progress', 'pending', 'resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '6px 12px',
                background: filter === status ? '#667eea' : '#f8f9fa',
                color: filter === status ? 'white' : '#666',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
            >
              {status.replace('_', ' ')} ({tickets.filter(t => status === 'all' || t.status === status).length})
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredTickets.map(ticket => (
          <div
            key={ticket.id}
            style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              padding: '20px'
            }}
            onClick={() => setSelectedTicketId(ticket.id)}
          >
            {/* Ticket Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    background: '#f0f0f0',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#666'
                  }}>
                    {ticket.ticketNumber}
                  </span>
                  <span style={{
                    background: getStatusColor(ticket.status),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <span style={{
                    background: getPriorityColor(ticket.priority?.level),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {ticket.priority?.name}
                  </span>
                </div>
                
                <h3 style={{
                  margin: '0 0 8px',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333'
                }}>
                  {ticket.title}
                </h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '13px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  <span>👤 {ticket.requester?.fullName}</span>
                  <span>📂 {ticket.category?.name}</span>
                  <span>📅 {formatDate(ticket.created_at)}</span>
                </div>
              </div>
                
              {/* Status Update Buttons */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap',paddingTop: '12px',
              borderTop: '1px solid #f0f0f0' }}>
                <button
                onClick={(e) => handleAssignClick(ticket, e)}
                style={{
                  padding: '4px 8px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {ticket.assignee ? 'Reassign' : 'Assign'}
              </button>
                 {ticket.status === 'new' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTicketStatus(ticket.id, 'assigned');
                  }}
                  style={{
                    padding: '4px 8px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                 >
                  Mark Assigned
                </button>
                )}
                
                {['assigned', 'in_progress'].includes(ticket.status) && (
                  <>
                    <button
                      onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                      style={{
                        padding: '4px 8px',
                        background: '#ffc107',
                        color: 'black',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateTicketStatus(ticket.id, 'resolved')}
                      style={{
                        padding: '4px 8px',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Resolve
                    </button>
                  </>
                )}
                
                {ticket.status === 'resolved' && (
                  <button
                    onClick={() => updateTicketStatus(ticket.id, 'closed')}
                    style={{
                      padding: '4px 8px',
                      background: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {assigningTicket && (
        <AssignmentModal
          ticket={assigningTicket}
          onClose={() => setAssigningTicket(null)}
          onAssign={handleAssignComplete}
        />
      )}

      {filteredTickets.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          No tickets found for filter: {filter}
        </div>
      )}
    </div>
  );
};

// Tambahkan UserManagement component di Dashboard.js

// Ganti UserManagement component di Dashboard.js
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`http://localhost:5050/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive })
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map(user => 
          user.id === userId ? data.data.user : user
        ));
        alert('User status updated successfully');
      } else {
        alert('Failed to update user: ' + data.message);
      }
    } catch (error) {
      alert('Error updating user');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5050/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map(user => 
          user.id === userId ? data.data.user : user
        ));
      } else {
        alert('Failed to update user role: ' + data.message);
      }
    } catch (error) {
      alert('Error updating user role');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5050/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        alert('Failed to delete user: ' + data.message);
      }
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'admin': '#dc3545',
      'manager': '#fd7e14',
      'technician': '#28a745',
      'end_user': '#6c757d'
    };
    return colors[role] || '#6c757d';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '8px',
        color: '#721c24'
      }}>
        <strong>Error:</strong> {error}
        <button 
          onClick={fetchUsers}
          style={{
            marginLeft: '10px',
            padding: '5px 10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>User Management</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            background: '#f8f9fa',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#666'
          }}>
            Total: {users.length} users
          </div>
          <button
            onClick={fetchUsers}
            style={{
              padding: '8px 16px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>
            {users.filter(u => u.is_active).length}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Active Users</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Admins</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>
            {users.filter(u => u.role === 'technician').length}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Technicians</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600' }}>
            {users.filter(u => u.role === 'end_user').length}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>End Users</div>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr 1.5fr',
          gap: '16px',
          padding: '16px 20px',
          background: '#f8f9fa',
          fontWeight: '600',
          fontSize: '14px',
          color: '#333',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Department</div>
          <div>Status</div>
          <div>Joined</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        {users.map(user => (
          <div
            key={user.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr 1.5fr',
              gap: '16px',
              padding: '16px 20px',
              borderBottom: '1px solid #f0f0f0',
              alignItems: 'center',
              fontSize: '14px'
            }}
          >
            <div>
              <div style={{ fontWeight: '500', color: '#333' }}>{user.full_name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>@{user.username}</div>
            </div>
            <div style={{ color: '#666' }}>{user.email}</div>
            <div>
              <select
                value={user.role}
                onChange={(e) => updateUserRole(user.id, e.target.value)}
                style={{
                  background: getRoleBadgeColor(user.role),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="end_user">End User</option>
                <option value="technician">Technician</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ color: '#666' }}>{user.department || '-'}</div>
            <div>
              <span style={{
                background: user.is_active ? '#d4edda' : '#f8d7da',
                color: user.is_active ? '#155724' : '#721c24',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: '500'
              }}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div style={{ color: '#666' }}>{formatDate(user.created_at)}</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => updateUserStatus(user.id, !user.is_active)}
                style={{
                  padding: '4px 8px',
                  background: user.is_active ? '#dc3545' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                {user.is_active ? 'Disable' : 'Enable'}
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                style={{
                  padding: '4px 8px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          No users found
        </div>
      )}
    </div>
  );
};


const TicketDetail = ({ ticketId, onBack }) => {
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    if (ticketId) {
      fetchTicketDetail();
      fetchComments();
    }
  }, [ticketId]);

  const fetchTicketDetail = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/tickets/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setTicket(data.data.ticket);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5050/api/comments/ticket/${ticketId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setComments(data.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5050/api/comments/ticket/${ticketId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          commentText: newComment,
          isInternal
        })
      });

      const data = await response.json();
      if (data.success) {
        setComments([...comments, data.data.comment]);
        setNewComment('');
        setIsInternal(false);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'new': '#007bff',
      'assigned': '#6c757d',
      'in_progress': '#ffc107',
      'pending': '#fd7e14',
      'resolved': '#28a745',
      'closed': '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading || !ticket) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading ticket details...</div>
      </div>
    );
  }

  const isStaff = ['technician', 'manager', 'admin'].includes(user.role);

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            background: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '16px'
          }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, color: '#333' }}>
          Ticket #{ticket.ticketNumber}
        </h2>
      </div>

      {/* Ticket Info */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '24px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <span style={{
                background: getStatusColor(ticket.status),
                color: 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span style={{
                background: ticket.priority?.colorCode || '#666',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {ticket.priority?.name}
              </span>
            </div>
            <h3 style={{
              margin: '0 0 12px',
              fontSize: '24px',
              fontWeight: '600',
              color: '#333'
            }}>
              {ticket.title}
            </h3>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>REQUESTER</div>
            <div style={{ fontSize: '14px', color: '#333' }}>{ticket.requester?.fullName}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>CATEGORY</div>
            <div style={{ fontSize: '14px', color: '#333' }}>{ticket.category?.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>ASSIGNED TO</div>
            <div style={{ fontSize: '14px', color: '#333' }}>
              {ticket.assignee?.fullName || 'Unassigned'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: '500' }}>CREATED</div>
            <div style={{ fontSize: '14px', color: '#333' }}>{formatDate(ticket.created_at)}</div>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#333' }}>
            Description
          </div>
          <p style={{
            margin: 0,
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#666',
            background: 'white',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #e0e0e0'
          }}>
            {ticket.description}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e0e0e0'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e0e0e0'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>
            Comments ({comments.length})
          </h3>
        </div>

        {/* Comments List */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {comments.map(comment => (
            <div
              key={comment.id}
              style={{
                padding: '16px 24px',
                borderBottom: '1px solid #f0f0f0',
                background: comment.isInternal ? '#fff3cd' : 'white'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontWeight: '500', color: '#333' }}>
                    {comment.author?.fullName}
                  </span>
                  <span style={{
                    background: comment.author?.role === 'admin' ? '#dc3545' : 
                               comment.author?.role === 'technician' ? '#28a745' : '#6c757d',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {comment.author?.role?.replace('_', ' ')}
                  </span>
                  {comment.isInternal && (
                    <span style={{
                      background: '#856404',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      INTERNAL
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#333'
              }}>
                {comment.commentText}
              </p>
            </div>
          ))}
        </div>

        {/* Add Comment Form */}
        <div style={{ padding: '20px 24px' }}>
          <form onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                marginBottom: '12px',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                {isStaff && (
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                    />
                    Internal comment (only visible to staff)
                  </label>
                )}
              </div>
              
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                style={{
                  padding: '8px 16px',
                  background: submitting || !newComment.trim() ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: submitting || !newComment.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {submitting ? 'Adding...' : 'Add Comment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
const AssignmentModal = ({ ticket, onClose, onAssign }) => {
  const [staffUsers, setStaffUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  React.useEffect(() => {
    fetchStaffUsers();
  }, []);

  const fetchStaffUsers = async () => {
    try {
      const response = await fetch('http://localhost:5050/api/users/staff', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStaffUsers(data.data.users);
        // Pre-select current assignee if exists
        if (ticket.assignedTo) {
          setSelectedUser(ticket.assignedTo.toString());
        }
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setAssigning(true);

    try {
      const response = await fetch(`http://localhost:5050/api/tickets/${ticket.id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ assignedTo: parseInt(selectedUser) })
      });

      const data = await response.json();

      if (data.success) {
        onAssign(data.data.ticket);
        onClose();
      } else {
        alert('Failed to assign ticket: ' + data.message);
      }
    } catch (error) {
      alert('Error assigning ticket');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        margin: '20px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>Assign Ticket</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Ticket:</strong> {ticket.ticket_number} - {ticket.title}
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Currently assigned to: {ticket.assignee?.full_name || 'Unassigned'}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            Loading staff members...
          </div>
        ) : (
          <form onSubmit={handleAssign}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333'
              }}>
                Assign to:
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Select staff member</option>
                {staffUsers.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.full_name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#f8f9fa',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={assigning || !selectedUser}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: assigning || !selectedUser ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: assigning || !selectedUser ? 'not-allowed' : 'pointer'
                }}
              >
                {assigning ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default Dashboard;