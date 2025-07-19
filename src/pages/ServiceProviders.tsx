import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import { Plus, Edit2, Trash2, Search, Users, Mail, Phone, MapPin, Calendar, Tag } from 'lucide-react';

const ServiceProviders: React.FC = () => {
  const { serviceProviders, addServiceProvider, updateServiceProvider, deleteServiceProvider } = useData();
  const { addNotification } = useNotification();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    applianceTypes: [] as string[]
  });

  const applianceTypes = [
    'Computer', 'Printer', 'Projector', 'Air Conditioner', 'Refrigerator', 
    'Microwave', 'Television', 'Phone', 'Scanner', 'Copier', 'Other'
  ];

  const filteredProviders = serviceProviders.filter(provider => {
    const searchLower = searchTerm.toLowerCase();
    return provider.name.toLowerCase().includes(searchLower) ||
           provider.email.toLowerCase().includes(searchLower) ||
           provider.phone.toLowerCase().includes(searchLower) ||
           provider.applianceTypes.some(type => type.toLowerCase().includes(searchLower));
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.applianceTypes.length === 0) {
      addNotification({
        type: 'error',
        message: 'Please select at least one appliance type'
      });
      return;
    }
    
    if (editingProvider) {
      updateServiceProvider(editingProvider, formData);
      addNotification({
        type: 'success',
        message: 'Service provider updated successfully!'
      });
      setEditingProvider(null);
    } else {
      addServiceProvider(formData);
      addNotification({
        type: 'success',
        message: 'Service provider added successfully!'
      });
      setShowAddForm(false);
    }
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      applianceTypes: []
    });
  };

  const handleEdit = (provider: any) => {
    setFormData({
      name: provider.name,
      email: provider.email,
      phone: provider.phone,
      address: provider.address,
      applianceTypes: provider.applianceTypes
    });
    setEditingProvider(provider.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this service provider?')) {
      deleteServiceProvider(id);
      addNotification({
        type: 'success',
        message: 'Service provider deleted successfully!'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      applianceTypes: []
    });
    setEditingProvider(null);
    setShowAddForm(false);
  };

  const handleApplianceTypeChange = (type: string) => {
    const isSelected = formData.applianceTypes.includes(type);
    if (isSelected) {
      setFormData({
        ...formData,
        applianceTypes: formData.applianceTypes.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        applianceTypes: [...formData.applianceTypes, type]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Service Providers
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage service providers for maintenance and repairs
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search service providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingProvider ? 'Edit Service Provider' : 'Add New Service Provider'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="e.g., TechFix Solutions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="contact@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="123 Main St, City, State 12345"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Appliance Types Serviced</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {applianceTypes.map(type => (
                  <label key={type} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.applianceTypes.includes(type)}
                      onChange={() => handleApplianceTypeChange(type)}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all"
              >
                {editingProvider ? 'Update' : 'Add'} Provider
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Service Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500 mb-2">No service providers found</p>
            <p className="text-sm text-gray-400">Add your first service provider to get started</p>
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{provider.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(provider)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(provider.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{provider.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{provider.phone}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span className="break-words">{provider.address}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Tag className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Specializes in:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {provider.applianceTypes.map(type => (
                      <span
                        key={type}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                  <Calendar className="h-3 w-3 mr-1" />
                  Added {new Date(provider.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceProviders;