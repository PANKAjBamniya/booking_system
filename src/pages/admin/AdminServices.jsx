import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServices, createService, updateService, deleteService } from '../../redux/slices/servicesSlice';
import { Plus, Pencil, Trash2, X, Loader2, ImagePlus } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', category: 'Makeup', price: '', duration: '', description: '', image: null };

const AdminServices = () => {
  const dispatch = useDispatch();
  const { services, loading } = useSelector((state) => state.services);

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => { dispatch(fetchServices()); }, [dispatch]);

  const openAdd = () => { setEditingService(null); setForm(EMPTY_FORM); setImagePreview(''); setShowModal(true); };
  const openEdit = (svc) => {
    setEditingService(svc);
    setForm({ name: svc.name, category: svc.category, price: svc.price, duration: svc.duration, description: svc.description, image: null });
    setImagePreview(svc.image || '');
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setForm(f => ({ ...f, image: file })); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name); fd.append('category', form.category);
    fd.append('price', form.price); fd.append('duration', form.duration);
    fd.append('description', form.description);
    if (form.image) fd.append('image', form.image);
    const action = editingService
      ? await dispatch(updateService({ id: editingService._id, formData: fd }))
      : await dispatch(createService(fd));
    if (createService.fulfilled.match(action) || updateService.fulfilled.match(action)) {
      toast.success(editingService ? 'Service updated!' : 'Service created!');
      setShowModal(false);
    }
  };

  const handleDelete = async (id) => {
    const action = await dispatch(deleteService(id));
    if (deleteService.fulfilled.match(action)) { toast.success('Service deleted.'); setDeleteConfirmId(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-serif text-2xl font-bold text-textColor">Services Catalog</h1>
          <p className="text-xs text-textColor/55 mt-1">Manage your makeup and hairstyle service offerings.</p></div>
        <button onClick={openAdd} className="luxury-btn-accent flex items-center gap-2 text-sm"><Plus className="h-4 w-4" /> Add Service</button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{[1,2,3].map(n => <div key={n} className="h-72 rounded-3xl bg-white border border-borderColor animate-pulse" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(svc => (
            <div key={svc._id} className="luxury-card bg-white p-4 flex flex-col gap-3">
              <div className="h-44 w-full overflow-hidden rounded-2xl border border-borderColor">
                <img src={svc.image} alt={svc.name} className="h-full w-full object-cover" />
              </div>
              <div className="text-left flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-textColor">{svc.name}</h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-accent border border-accent/20 bg-secondary px-1.5 py-0.5 rounded">{svc.category}</span>
                </div>
                <p className="text-xs text-textColor/60 line-clamp-2">{svc.description}</p>
                <div className="flex gap-4 text-xs font-bold pt-1"><span className="text-accent">₹{svc.price}</span><span className="text-textColor/50">{svc.duration} Min</span></div>
              </div>
              <div className="flex gap-2 pt-1 border-t border-borderColor/30">
                <button onClick={() => openEdit(svc)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl border border-borderColor bg-bgColor hover:bg-secondary hover:text-accent transition-colors"><Pencil className="h-3.5 w-3.5" /> Edit</button>
                <button onClick={() => setDeleteConfirmId(svc._id)} className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textColor/30 backdrop-blur-sm">
          <div className="bg-white border border-borderColor rounded-3xl p-6 w-full max-w-md space-y-4 shadow-premium max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-textColor">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl hover:bg-bgColor text-textColor/50"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-textColor/70 uppercase tracking-wider mb-1.5">Service Image</label>
                <div className="relative h-36 w-full overflow-hidden rounded-2xl border-2 border-dashed border-borderColor bg-bgColor flex items-center justify-center cursor-pointer hover:border-accent transition-colors">
                  {imagePreview ? <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" /> : <div className="flex flex-col items-center gap-2 text-textColor/40"><ImagePlus className="h-8 w-8" /><span className="text-xs">Click to upload image</span></div>}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-textColor/70 uppercase tracking-wider mb-1.5">Service Name *</label><input type="text" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="luxury-input" placeholder="e.g. Bridal HD Makeup" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-textColor/70 uppercase tracking-wider mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="luxury-input">
                    <option value="Makeup">Makeup</option><option value="Hairstyle">Hairstyle</option>
                  </select></div>
                <div><label className="block text-xs font-semibold text-textColor/70 uppercase tracking-wider mb-1.5">Price (₹) *</label><input type="number" required min="0" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} className="luxury-input" placeholder="2500" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-textColor/70 uppercase tracking-wider mb-1.5">Duration (Minutes) *</label><input type="number" required min="15" value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))} className="luxury-input" placeholder="90" /></div>
              <div><label className="block text-xs font-semibold text-textColor/70 uppercase tracking-wider mb-1.5">Description</label><textarea rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} className="luxury-input resize-none" placeholder="Describe the service..." /></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 luxury-btn-outline">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 luxury-btn-accent flex items-center justify-center gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingService ? 'Update' : 'Create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-textColor/30 backdrop-blur-sm">
          <div className="bg-white border border-borderColor rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-premium">
            <Trash2 className="h-10 w-10 text-red-400 mx-auto" />
            <div><h3 className="font-semibold text-textColor">Delete Service?</h3><p className="text-xs text-textColor/60 mt-1">This action cannot be undone.</p></div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 luxury-btn-outline py-2.5">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-2xl text-xs font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
