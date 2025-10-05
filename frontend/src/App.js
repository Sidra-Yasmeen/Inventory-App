import React, { useEffect, useState } from 'react';
import API from './api';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbar({ onLogout, user }){
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">InventoryApp</a>
        <div className="d-flex align-items-center">
          {user ? <>
            <span className="me-3 text-white">Hello, {user.name}</span>
            <button className="btn btn-sm btn-light" onClick={onLogout}>Logout</button>
          </> : null}
        </div>
      </div>
    </nav>
  );
}

function Sidebar({ onNav }){
  return (
    <div className="list-group sidebar">
      <button className="list-group-item list-group-item-action" onClick={()=>onNav('dashboard')}>Dashboard</button>
      <button className="list-group-item list-group-item-action" onClick={()=>onNav('products')}>Products</button>
      <button className="list-group-item list-group-item-action" onClick={()=>onNav('purchases')}>Purchases</button>
      <button className="list-group-item list-group-item-action" onClick={()=>onNav('sales')}>Sales</button>
      <button className="list-group-item list-group-item-action" onClick={()=>onNav('reports')}>Reports</button>
    </div>
  );
}

function Login({ onLogin }){
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [err, setErr] = useState('');
  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      onLogin(user);
    } catch (err) {
      console.error(err); setErr(err?.response?.data?.error || 'Login failed');
    }
  };
  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card p-3">
          <h5 className="mb-3">Login</h5>
          {err && <div className="alert alert-danger">{err}</div>}
          <form onSubmit={submit}>
            <div className="mb-2"><input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /></div>
            <div className="mb-2"><input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" /></div>
            <button className="btn btn-primary w-100" type="submit">Login</button>
          </form>
          <div className="mt-3 text-muted small">Use register endpoint to create users (for dev).</div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ name: payload.email, role: payload.role });
    } catch(e){}
  }, []);

  const handleLogout = () => { localStorage.removeItem('token'); setUser(null); };
  if (!localStorage.getItem('token') || !user) return <Login onLogin={(u)=> setUser(u)} />;

  return (
    <div>
      <Navbar onLogout={handleLogout} user={user} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2"><Sidebar onNav={setView} /></div>
          <div className="col-md-10">
            {view === 'dashboard' && <Dashboard />}
            {view === 'products' && <Products />}
            {view === 'purchases' && <Purchases />}
            {view === 'sales' && <Sales />}
            {view === 'reports' && <Reports />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Dashboard(){
  const [summary, setSummary] = useState({ total_value:0, monthly_sales:[] });
  useEffect(()=>{ API.get('/reports/summary').then(r=>setSummary(r.data)).catch(()=>{}); }, []);
  return (
    <div>
      <h3>Dashboard</h3>
      <div className="row">
        <div className="col-md-4"><div className="card p-3"><h6>Total Stock Value</h6><h4>₹{Number(summary.total_value||0).toFixed(2)}</h4></div></div>
        <div className="col-md-8"><div className="card p-3"><h6>Monthly Sales (last 12)</h6><pre className="small">{JSON.stringify(summary.monthly_sales,null,2)}</pre></div></div>
      </div>
    </div>
  );
}

function Products(){
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const fetch = ()=>API.get('/products',{ params:{ q } }).then(r=>setProducts(r.data)).catch(()=>{});
  useEffect(()=>{ fetch(); },[]);
  return (
    <div>
      <h3>Products <button className="btn btn-sm btn-outline-secondary ms-2" onClick={()=>fetch()}>Refresh</button></h3>
      <div className="row">
        <div className="col-md-4">
          <ProductForm onSaved={()=>fetch()} />
          <div className="card mt-3 p-3"><h6>Export</h6><button className="btn btn-sm btn-outline-primary" onClick={()=>{ window.location = '/api/products/export/csv'; }}>Download CSV</button></div>
        </div>
        <div className="col-md-8">
          <div className="card p-3 card-scroll">
            <div className="mb-2 d-flex">
              <input className="form-control me-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." />
              <button className="btn btn-primary" onClick={fetch}>Search</button>
            </div>
            <table className="table table-sm">
              <thead><tr><th>SKU</th><th>Name</th><th>Qty</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map(p=> <tr key={p.id}><td>{p.sku}</td><td>{p.name}</td><td>{p.quantity}</td><td>₹{Number(p.price).toFixed(2)}</td><td><button className="btn btn-sm btn-outline-danger" onClick={async ()=>{ await API.delete('/products/'+p.id); fetch(); }}>Delete</button></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ onSaved }){
  const [form, setForm] = useState({ name:'', sku:'', category:'', price:0, quantity:0, supplier:'', min_stock:5 });
  const submit = async (e)=>{ e.preventDefault(); await API.post('/products', form); setForm({ name:'', sku:'', category:'', price:0, quantity:0, supplier:'', min_stock:5 }); onSaved(); };
  return (
    <div className="card p-3">
      <h6>Add Product</h6>
      <form onSubmit={submit}>
        <input className="form-control mb-2" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" />
        <input className="form-control mb-2" value={form.sku} onChange={e=>setForm({...form,sku:e.target.value})} placeholder="SKU" />
        <input className="form-control mb-2" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} placeholder="Category" />
        <input className="form-control mb-2" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="Price" type="number" step="0.01" />
        <input className="form-control mb-2" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} placeholder="Quantity" type="number" />
        <input className="form-control mb-2" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} placeholder="Supplier" />
        <input className="form-control mb-2" value={form.min_stock} onChange={e=>setForm({...form,min_stock:e.target.value})} placeholder="Minimum stock alert" type="number" />
        <button className="btn btn-success w-100" type="submit">Save Product</button>
      </form>
    </div>
  );
}

function Purchases(){
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id:'', qty:1, total_cost:0, supplier:'' });
  const fetch = ()=>API.get('/products').then(r=>setProducts(r.data)).catch(()=>{});
  useEffect(()=>{ fetch(); },[]);
  const submit = async (e)=>{ e.preventDefault(); await API.post('/purchases', form); alert('Purchase recorded'); setForm({ product_id:'', qty:1, total_cost:0, supplier:'' }); };
  return (
    <div>
      <h3>Record Purchase</h3>
      <div className="card p-3">
        <form onSubmit={submit}>
          <select className="form-select mb-2" value={form.product_id} onChange={e=>setForm({...form,product_id:e.target.value})}>
            <option value="">Select product</option>
            {products.map(p=> <option key={p.id} value={p.id}>{p.name} (SKU:{p.sku})</option>)}
          </select>
          <input className="form-control mb-2" type="number" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})} placeholder="Quantity" />
          <input className="form-control mb-2" type="number" value={form.total_cost} onChange={e=>setForm({...form,total_cost:e.target.value})} placeholder="Total cost" />
          <input className="form-control mb-2" value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} placeholder="Supplier" />
          <button className="btn btn-primary">Save Purchase</button>
        </form>
      </div>
    </div>
  );
}

function Sales(){
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ product_id:'', qty:1, total_price:0, customer:'' });
  const fetch = ()=>API.get('/products').then(r=>setProducts(r.data)).catch(()=>{});
  useEffect(()=>{ fetch(); },[]);
  const submit = async (e)=>{ e.preventDefault(); try { await API.post('/sales', form); alert('Sale recorded'); setForm({ product_id:'', qty:1, total_price:0, customer:'' }); } catch (err){ alert(err?.response?.data?.error || 'Failed'); } };
  return (
    <div>
      <h3>Record Sale</h3>
      <div className="card p-3">
        <form onSubmit={submit}>
          <select className="form-select mb-2" value={form.product_id} onChange={e=>setForm({...form,product_id:e.target.value})}>
            <option value="">Select product</option>
            {products.map(p=> <option key={p.id} value={p.id}>{p.name} (Qty:{p.quantity})</option>)}
          </select>
          <input className="form-control mb-2" type="number" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})} placeholder="Quantity" />
          <input className="form-control mb-2" type="number" value={form.total_price} onChange={e=>setForm({...form,total_price:e.target.value})} placeholder="Total price" />
          <input className="form-control mb-2" value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})} placeholder="Customer" />
          <button className="btn btn-primary">Save Sale</button>
        </form>
      </div>
    </div>
  );
}

function Reports(){
  const [data, setData] = useState({ total_value:0, monthly_sales:[] });
  useEffect(()=>{ API.get('/reports/summary').then(r=>setData(r.data)).catch(()=>{}); }, []);
  return (
    <div>
      <h3>Reports</h3>
      <div className="card p-3">
        <h6>Total stock value</h6>
        <p>₹{Number(data.total_value||0).toFixed(2)}</p>
        <h6>Monthly sales</h6>
        <pre className="small">{JSON.stringify(data.monthly_sales,null,2)}</pre>
      </div>
    </div>
  );
}
