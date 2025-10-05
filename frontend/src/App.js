import React, { useEffect, useState, useRef } from 'react';
import API from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBox, FaShoppingCart, FaChartLine, FaFileInvoice, FaSignOutAlt, FaSearch, FaPlus, FaEdit, FaTrash, FaDownload, FaBell, FaUser, FaCog, FaHome } from 'react-icons/fa';

// Professional color scheme
const colors = {
  primary: '#2c3e50',      // Deep blue
  secondary: '#3498db',    // Bright blue
  success: '#2ecc71',      // Green
  danger: '#e74c3c',       // Red
  warning: '#f39c12',      // Orange
  light: '#ecf0f1',        // Light gray
  dark: '#34495e',         // Dark gray
  info: '#9b59b6',         // Purple
  background: '#f8f9fa',   // Light background
  sidebar: '#34495e'       // Sidebar color
};

// Notification Component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
};

// Loading Spinner
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center my-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Enhanced Navbar
function Navbar({ onLogout, user, notifications }) {
  const [showNotifications, setShowNotifications] = useState(false);
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: colors.primary }}>
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <FaBox className="me-2" /> InventoryApp
        </a>
        <div className="d-flex align-items-center">
          <div className="position-relative me-3">
            <button 
              className="btn btn-sm position-relative p-1" 
              style={{ color: colors.light }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell size={20} />
              {notifications.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {notifications.length}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="position-absolute end-0 mt-2 p-3 bg-white text-dark rounded shadow" style={{ width: '300px', zIndex: 1000 }}>
                <h6>Notifications</h6>
                {notifications.length > 0 ? (
                  notifications.map((note, index) => (
                    <div key={index} className="mb-2 p-2 border-bottom">
                      <div className="fw-bold">{note.title}</div>
                      <div className="small">{note.message}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small">No new notifications</p>
                )}
              </div>
            )}
          </div>
          {user ? (
            <div className="dropdown">
              <button className="btn btn-sm dropdown-toggle d-flex align-items-center" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: colors.light }}>
                <FaUser className="me-1" /> {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><a className="dropdown-item" href="#"><FaCog className="me-2" /> Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item" onClick={onLogout}><FaSignOutAlt className="me-2" /> Logout</button></li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

// Enhanced Sidebar
function Sidebar({ onNav, activeView }) {
  const menuItems = [
    { id: 'dashboard', icon: <FaHome />, label: 'Dashboard' },
    { id: 'products', icon: <FaBox />, label: 'Products' },
    { id: 'purchases', icon: <FaShoppingCart />, label: 'Purchases' },
    { id: 'sales', icon: <FaFileInvoice />, label: 'Sales' },
    { id: 'reports', icon: <FaChartLine />, label: 'Reports' }
  ];

  return (
    <div className="sidebar bg-dark text-light d-flex flex-column" style={{ minHeight: 'calc(100vh - 56px)', backgroundColor: colors.sidebar }}>
      <div className="p-3">
        <h6 className="text-uppercase fw-bold">Navigation</h6>
      </div>
      <div className="flex-grow-1">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`list-group-item list-group-item-action d-flex align-items-center ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onNav(item.id)}
            style={{
              backgroundColor: activeView === item.id ? colors.primary : 'transparent',
              border: 'none',
              color: colors.light,
              transition: 'all 0.3s ease'
            }}
          >
            <span className="me-2">{item.icon}</span> {item.label}
          </button>
        ))}
      </div>
      <div className="p-3 mt-auto">
        <div className="text-center small text-muted">
          InventoryApp v1.0
        </div>
      </div>
    </div>
  );
}

// Enhanced Login Component
function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      onLogin(user);
    } catch (err) {
      console.error(err);
      setErr(err?.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: colors.background }}>
      <div className="col-md-5">
        <div className="card shadow-lg border-0">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <div className="d-flex justify-content-center align-items-center mb-3">
                <FaBox className="me-2" style={{ color: colors.primary, fontSize: '2rem' }} />
                <h1 className="fw-bold" style={{ color: colors.primary }}>InventoryApp</h1>
              </div>
              <p className="text-muted">Sign in to your account</p>
            </div>
            
            {err && <div className="alert alert-danger">{err}</div>}
            
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <div className="input-group">
                  <span className="input-group-text"><FaUser /></span>
                  <input 
                    className="form-control" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="Email" 
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><FaCog /></span>
                  <input 
                    className="form-control" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Password" 
                    type="password" 
                    required
                  />
                </div>
              </div>
              
              <button 
                className="btn btn-primary w-100 py-2" 
                type="submit" 
                disabled={isLoading}
                style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-4 text-center text-muted small">
              Use register endpoint to create users (for dev purposes).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ name: payload.email, role: payload.role });
    } catch(e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => { 
    localStorage.removeItem('token'); 
    setUser(null); 
  };
  
  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      title: type.charAt(0).toUpperCase() + type.slice(1),
      message,
      type
    };
    setNotifications(prev => [...prev, newNotification]);
  };
  
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(note => note.id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: colors.background }}>
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!localStorage.getItem('token') || !user) {
    return <Login onLogin={(u) => setUser(u)} />;
  }

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: colors.background }}>
      <Navbar 
        onLogout={handleLogout} 
        user={user} 
        notifications={notifications}
      />
      
      <div className="d-flex flex-grow-1">
        <Sidebar onNav={setView} activeView={view} />
        
        <div className="flex-grow-1 p-4 overflow-auto">
          {notifications.map(note => (
            <Notification 
              key={note.id} 
              message={note.message} 
              type={note.type} 
              onClose={() => removeNotification(note.id)} 
            />
          ))}
          
          {view === 'dashboard' && <Dashboard addNotification={addNotification} />}
          {view === 'products' && <Products addNotification={addNotification} />}
          {view === 'purchases' && <Purchases addNotification={addNotification} />}
          {view === 'sales' && <Sales addNotification={addNotification} />}
          {view === 'reports' && <Reports addNotification={addNotification} />}
        </div>
      </div>
    </div>
  );
}

// Enhanced Dashboard
function Dashboard({ addNotification }) {
  const [summary, setSummary] = useState({ total_value: 0, monthly_sales: [], low_stock_products: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/reports/summary');
        setSummary(res.data);
        
        // Check for low stock notifications
        if (res.data.low_stock_products && res.data.low_stock_products.length > 0) {
          addNotification(
            `${res.data.low_stock_products.length} products are low in stock!`,
            'warning'
          );
        }
      } catch (err) {
        addNotification('Failed to load dashboard data', 'danger');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [addNotification]);

  // Simple bar chart component
  const BarChart = ({ data }) => {
    if (!data || data.length === 0) return <p>No data available</p>;
    
    const maxValue = Math.max(...data.map(item => item.amount));
    
    return (
      <div className="d-flex align-items-end" style={{ height: '150px' }}>
        {data.map((item, index) => (
          <div key={index} className="d-flex flex-column align-items-center me-2" style={{ flex: 1 }}>
            <div 
              className="w-100 rounded-top" 
              style={{ 
                height: `${(item.amount / maxValue) * 100}%`, 
                backgroundColor: colors.primary,
                transition: 'height 0.5s ease'
              }}
            ></div>
            <div className="small mt-1">{item.month}</div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Dashboard</h2>
        <div className="text-muted">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>
      
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-primary bg-opacity-10 me-3">
                  <FaBox style={{ color: colors.primary }} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Total Products</h6>
                  <h4 className="fw-bold">{summary.total_products || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-success bg-opacity-10 me-3">
                  <FaChartLine style={{ color: colors.success }} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Stock Value</h6>
                  <h4 className="fw-bold">pkr{Number(summary.total_value || 0).toFixed(2)}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-warning bg-opacity-10 me-3">
                  <FaShoppingCart style={{ color: colors.warning }} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Low Stock</h6>
                  <h4 className="fw-bold">{summary.low_stock_products?.length || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="p-3 rounded-circle bg-info bg-opacity-10 me-3">
                  <FaFileInvoice style={{ color: colors.info }} />
                </div>
                <div>
                  <h6 className="text-muted mb-1">Recent Sales</h6>
                  <h4 className="fw-bold">{summary.recent_sales || 0}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Monthly Sales Trend</h5>
              <BarChart data={summary.monthly_sales} />
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Low Stock Alerts</h5>
              {summary.low_stock_products && summary.low_stock_products.length > 0 ? (
                <div className="list-group">
                  {summary.low_stock_products.map((product, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{product.name}</div>
                        <small className="text-muted">SKU: {product.sku}</small>
                      </div>
                      <span className="badge bg-danger rounded-pill">{product.quantity} left</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-success mb-2">
                    <FaBox size={24} />
                  </div>
                  <p>All products are well stocked</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Products Component
function Products({ addNotification }) {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/products', { params: { q } });
      setProducts(res.data);
    } catch (err) {
      addNotification('Failed to load products', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete('/products/' + id);
        addNotification('Product deleted successfully', 'success');
        fetch();
      } catch (err) {
        addNotification('Failed to delete product', 'danger');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleFormSaved = () => {
    fetch();
    setShowAddForm(false);
    setEditingProduct(null);
    addNotification('Product saved successfully', 'success');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Products</h2>
        <button 
          className="btn btn-primary d-flex align-items-center" 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ backgroundColor: colors.primary }}
        >
          <FaPlus className="me-2" /> {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>
      
      {showAddForm && (
        <ProductForm 
          onSaved={handleFormSaved} 
          product={editingProduct}
          onCancel={() => {
            setShowAddForm(false);
            setEditingProduct(null);
          }}
        />
      )}
      
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex mb-3">
            <div className="input-group me-2" style={{ maxWidth: '300px' }}>
              <span className="input-group-text"><FaSearch /></span>
              <input 
                className="form-control" 
                value={q} 
                onChange={e => setQ(e.target.value)} 
                placeholder="Search products..." 
              />
            </div>
            <button className="btn btn-outline-primary" onClick={fetch}>
              <FaSearch />
            </button>
          </div>
          
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>SKU</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Supplier</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map(p => (
                      <tr key={p.id}>
                        <td>{p.sku}</td>
                        <td className="fw-bold">{p.name}</td>
                        <td>{p.category}</td>
                        <td>
                          <span className={`badge ${p.quantity < p.min_stock ? 'bg-danger' : 'bg-success'}`}>
                            {p.quantity}
                          </span>
                        </td>
                        <td>pkr{Number(p.price).toFixed(2)}</td>
                        <td>{p.supplier}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-1" 
                            onClick={() => handleEdit(p)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDelete(p.id)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
              Showing {products.length} products
            </div>
            <button className="btn btn-outline-primary" onClick={() => { window.location = '/api/products/export/csv'; }}>
              <FaDownload className="me-2" /> Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Product Form
function ProductForm({ onSaved, product, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    quantity: 0,
    supplier: '',
    min_stock: 5
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (product) {
        await API.put('/products/' + product.id, form);
      } else {
        await API.post('/products', form);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title mb-4">{product ? 'Edit Product' : 'Add New Product'}</h5>
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Product Name</label>
              <input 
                className="form-control" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                placeholder="Enter product name" 
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">SKU</label>
              <input 
                className="form-control" 
                value={form.sku} 
                onChange={e => setForm({...form, sku: e.target.value})} 
                placeholder="Enter SKU" 
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <input 
                className="form-control" 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
                placeholder="Enter category" 
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Supplier</label>
              <input 
                className="form-control" 
                value={form.supplier} 
                onChange={e => setForm({...form, supplier: e.target.value})} 
                placeholder="Enter supplier" 
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Price (pkr)</label>
              <input 
                className="form-control" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
                placeholder="0.00" 
                type="number" 
                step="0.01" 
                min="0"
                required
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Quantity</label>
              <input 
                className="form-control" 
                value={form.quantity} 
                onChange={e => setForm({...form, quantity: e.target.value})} 
                placeholder="0" 
                type="number" 
                min="0"
                required
              />
            </div>
            
            <div className="col-md-4">
              <label className="form-label">Min Stock Alert</label>
              <input 
                className="form-control" 
                value={form.min_stock} 
                onChange={e => setForm({...form, min_stock: e.target.value})} 
                placeholder="5" 
                type="number" 
                min="0"
              />
            </div>
            
            <div className="col-12 d-flex justify-content-end">
              <button type="button" className="btn btn-outline-secondary me-2" onClick={onCancel}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                type="submit" 
                disabled={isLoading}
                style={{ backgroundColor: colors.primary }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (product ? 'Update Product' : 'Add Product')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Enhanced Purchases Component
function Purchases({ addNotification }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id: '', qty: 1, total_cost: 0, supplier: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetch = async () => {
    setIsFetching(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      addNotification('Failed to load products', 'danger');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await API.post('/purchases', form);
      addNotification('Purchase recorded successfully', 'success');
      setForm({ product_id: '', qty: 1, total_cost: 0, supplier: '' });
      fetch();
    } catch (err) {
      addNotification('Failed to record purchase', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">Record Purchase</h2>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {isFetching ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Select Product</label>
                  <select 
                    className="form-select" 
                    value={form.product_id} 
                    onChange={e => setForm({...form, product_id: e.target.value})}
                    required
                  >
                    <option value="">Choose a product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (SKU: {p.sku}) - Current Stock: {p.quantity}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Supplier</label>
                  <input 
                    className="form-control" 
                    value={form.supplier} 
                    onChange={e => setForm({...form, supplier: e.target.value})} 
                    placeholder="Enter supplier name" 
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Quantity</label>
                  <input 
                    className="form-control" 
                    type="number" 
                    value={form.qty} 
                    onChange={e => setForm({...form, qty: e.target.value})} 
                    placeholder="1" 
                    min="1"
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Total Cost (pkr)</label>
                  <input 
                    className="form-control" 
                    type="number" 
                    value={form.total_cost} 
                    onChange={e => setForm({...form, total_cost: e.target.value})} 
                    placeholder="0.00" 
                    step="0.01" 
                    min="0"
                    required
                  />
                </div>
                
                <div className="col-12">
                  <button 
                    className="btn btn-primary" 
                    type="submit" 
                    disabled={isLoading}
                    style={{ backgroundColor: colors.primary }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : 'Record Purchase'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced Sales Component
function Sales({ addNotification }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id: '', qty: 1, total_price: 0, customer: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetch = async () => {
    setIsFetching(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (err) {
      addNotification('Failed to load products', 'danger');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await API.post('/sales', form);
      addNotification('Sale recorded successfully', 'success');
      setForm({ product_id: '', qty: 1, total_price: 0, customer: '' });
      fetch();
    } catch (err) {
      addNotification(err?.response?.data?.error || 'Failed to record sale', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="fw-bold mb-4">Record Sale</h2>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {isFetching ? (
            <LoadingSpinner />
          ) : (
            <form onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Select Product</label>
                  <select 
                    className="form-select" 
                    value={form.product_id} 
                    onChange={e => setForm({...form, product_id: e.target.value})}
                    required
                  >
                    <option value="">Choose a product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} (SKU: {p.sku}) - Available: {p.quantity}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Customer</label>
                  <input 
                    className="form-control" 
                    value={form.customer} 
                    onChange={e => setForm({...form, customer: e.target.value})} 
                    placeholder="Enter customer name" 
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Quantity</label>
                  <input 
                    className="form-control" 
                    type="number" 
                    value={form.qty} 
                    onChange={e => setForm({...form, qty: e.target.value})} 
                    placeholder="1" 
                    min="1"
                    required
                  />
                </div>
                
                <div className="col-md-6">
                  <label className="form-label">Total Price (pkr)</label>
                  <input 
                    className="form-control" 
                    type="number" 
                    value={form.total_price} 
                    onChange={e => setForm({...form, total_price: e.target.value})} 
                    placeholder="0.00" 
                    step="0.01" 
                    min="0"
                    required
                  />
                </div>
                
                <div className="col-12">
                  <button 
                    className="btn btn-primary" 
                    type="submit" 
                    disabled={isLoading}
                    style={{ backgroundColor: colors.primary }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : 'Record Sale'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced Reports Component
function Reports({ addNotification }) {
  const [data, setData] = useState({ total_value: 0, monthly_sales: [], top_products: [], sales_by_category: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/reports/summary');
        setData(res.data);
      } catch (err) {
        addNotification('Failed to load reports', 'danger');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [addNotification]);

  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <h2 className="fw-bold mb-4">Inventory Reports</h2>
      
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Stock Value Summary</h5>
              <div className="d-flex align-items-center mb-3">
                <div className="fs-1 fw-bold text-primary me-3">pkr{Number(data.total_value || 0).toFixed(2)}</div>
                <div className="text-muted">Total inventory value</div>
              </div>
              <div className="progress" style={{ height: '10px' }}>
                <div 
                  className="progress-bar" 
                  role="progressbar" 
                  style={{ width: '75%', backgroundColor: colors.primary }}
                  aria-valuenow="75" 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="small text-muted mt-2">75% of target inventory value</div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title mb-4">Monthly Sales</h5>
              {data.monthly_sales && data.monthly_sales.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Sales (pkr)</th>
                        <th>Units Sold</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.monthly_sales.map((sale, index) => (
                        <tr key={index}>
                          <td>{sale.month}</td>
                          <td>pkr{Number(sale.amount).toFixed(2)}</td>
                          <td>{sale.units}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No monthly sales data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Top Selling Products</h5>
              {data.top_products && data.top_products.length > 0 ? (
                <div className="list-group">
                  {data.top_products.map((product, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{product.name}</div>
                        <small className="text-muted">{product.category}</small>
                      </div>
                      <div>
                        <span className="badge bg-primary rounded-pill me-2">{product.units_sold} units</span>
                        <span className="text-muted">pkr{Number(product.revenue).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No top products data available</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Sales by Category</h5>
              {data.sales_by_category && data.sales_by_category.length > 0 ? (
                <div>
                  {data.sales_by_category.map((category, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{category.name}</span>
                        <span>pkr{Number(category.total).toFixed(2)}</span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ 
                            width: `${category.percentage}%`, 
                            backgroundColor: colors.primary 
                          }}
                          aria-valuenow={category.percentage} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No category sales data available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}