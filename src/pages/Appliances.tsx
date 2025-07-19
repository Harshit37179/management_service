import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import { Plus, Edit2, Trash2, Search, Filter, Wrench, MapPin, Calendar } from 'lucide-react';

const Appliances: React.FC = () => {
  const { appliances, addAppliance, updateAppliance, deleteAppliance } = useData();
  const { addNotification } = useNotification();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    room: '',
    floor: '',
    status: 'working' as 'working' | 'faulty' | 'maintenance'
  });

  const applianceTypes = [
    'Computer', 'Printer', 'Projector', 'Air Conditioner', 'Refrigerator', 
    'Microwave', 'Television', 'Phone', 'Scanner', 'Copier', 'Other'
  ];

  const filteredAppliances = appliances.filter(appliance => {
    const matchesSearch = appliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appliance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appliance.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appliance.floor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || appliance.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAppliance) {
      updateAppliance(editingAppliance, formData);
      addNotification({
        type: 'success',
        message: 'Appliance updated successfully!'
      });
      setEditingAppliance(null);
    } else {
      addAppliance(formData);
      addNotification({
        type: 'success',
        message: 'Appliance added successfully!'
      });
      setShowAddForm(false);
    }
    
    setFormData({
      name: '',
      type: '',
      room: '',
      floor: '',
      status: 'working'
    });
  };

  const handleEdit = (appliance: any) => {
    setFormData({
      name: appliance.name,
      type: appliance.type,
      room: appliance.room,
      floor: appliance.floor,
      status: appliance.status
    });
    setEditingAppliance(appliance.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appliance?')) {
      deleteAppliance(id);
      addNotification({
        type: 'success',
        message: 'Appliance deleted successfully!'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      room: '',
      floor: '',
      status: 'working'
    });
    setEditingAppliance(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'faulty':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Appliances
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage appliances across your facilities
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Appliance
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search appliances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="working">Working</option>
              <option value="faulty">Faulty</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingAppliance ? 'Edit Appliance' : 'Add New Appliance'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Conference Room Computer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select type</option>
                  {applianceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                <input
                  type="text"
                  required
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                <input
                  type="text"
                  required
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., 1"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="working">Working</option>
                  <option value="faulty">Faulty</option>
                  <option value="maintenance">Maintenance</option>
                </select>
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
                className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                {editingAppliance ? 'Update' : 'Add'} Appliance
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appliances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppliances.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Wrench className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500 mb-2">No appliances found</p>
            <p className="text-sm text-gray-400">Add your first appliance to get started</p>
          </div>
        ) : (
          filteredAppliances.map((appliance) => (
            <div key={appliance.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{appliance.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{appliance.type}</p>
                    <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(appliance.status)}`}>
                      {appliance.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(appliance)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(appliance.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Room {appliance.room}, Floor {appliance.floor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Added {new Date(appliance.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appliances;