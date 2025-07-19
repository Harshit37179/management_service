import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { AlertTriangle, Send, CheckCircle, MapPin, Wrench, User, Mail } from 'lucide-react';

const ReportIssue: React.FC = () => {
  const { appliances, serviceProviders, addIssue } = useData();
  const { addNotification } = useNotification();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    applianceId: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedAppliance = appliances.find(a => a.id === formData.applianceId);
  const selectedServiceProvider = selectedAppliance ? 
    serviceProviders.find(sp => sp.applianceTypes.includes(selectedAppliance.type)) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appliance = appliances.find(a => a.id === formData.applianceId);
      if (!appliance) {
        throw new Error('Appliance not found');
      }

      // Find service provider for this appliance type
      const serviceProvider = serviceProviders.find(sp => 
        sp.applianceTypes.includes(appliance.type)
      );

      const issueData = {
        applianceId: formData.applianceId,
        applianceName: appliance.name,
        room: appliance.room,
        floor: appliance.floor,
        description: formData.description,
        status: 'reported' as const,
        priority: formData.priority,
        reportedBy: user?.name || 'Unknown',
        serviceProvider: serviceProvider?.name
      };

      addIssue(issueData);

      // Simulate email notification delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (serviceProvider) {
        addNotification({
          type: 'success',
          message: `Issue reported successfully! Email sent to ${serviceProvider.name}`
        });
      } else {
        addNotification({
          type: 'warning',
          message: 'Issue reported successfully! No service provider found for this appliance type.'
        });
      }

      setSubmitted(true);
      setFormData({
        applianceId: '',
        description: '',
        priority: 'medium'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        message: 'Failed to report issue. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      applianceId: '',
      description: '',
      priority: 'medium'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-xl p-8 text-center border border-gray-100">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Issue Reported Successfully!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Your issue has been reported and the relevant service provider has been notified via email.
            You'll receive updates on the progress through the Issues page.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetForm}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Report Another Issue
            </button>
            <button
              onClick={() => window.location.href = '/issues'}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              View All Issues
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Report an Issue</h2>
        <p className="text-gray-600 leading-relaxed">
          Report a problem with any appliance and we'll automatically notify the appropriate service provider
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="appliance" className="block text-sm font-medium text-gray-700 mb-2">
              Select Appliance *
            </label>
            <select
              id="appliance"
              required
              value={formData.applianceId}
              onChange={(e) => setFormData({ ...formData, applianceId: e.target.value })}
              className="block w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            >
              <option value="">Choose an appliance...</option>
              {appliances.map(appliance => (
                <option key={appliance.id} value={appliance.id}>
                  {appliance.name} - Room {appliance.room}, Floor {appliance.floor}
                </option>
              ))}
            </select>
          </div>

          {selectedAppliance && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Wrench className="h-4 w-4 mr-2" />
                Appliance Details
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <p className="text-gray-900">{selectedAppliance.type}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedAppliance.status === 'working' ? 'bg-green-100 text-green-800' :
                    selectedAppliance.status === 'faulty' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedAppliance.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Location:</span>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    Room {selectedAppliance.room}, Floor {selectedAppliance.floor}
                  </p>
                </div>
                {selectedServiceProvider && (
                  <div>
                    <span className="font-medium text-gray-600">Service Provider:</span>
                    <p className="text-gray-900 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {selectedServiceProvider.name}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedServiceProvider && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-700 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    Email notification will be sent to: {selectedServiceProvider.email}
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level *
            </label>
            <div className="space-y-3">
              {[
                { value: 'low', label: 'Low Priority', desc: 'Can wait a few days' },
                { value: 'medium', label: 'Medium Priority', desc: 'Should be fixed within 1-2 days' },
                { value: 'high', label: 'High Priority', desc: 'Urgent, needs immediate attention' }
              ].map((option) => (
                <label key={option.value} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.priority === option.value ? getPriorityColor(option.value) : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={formData.priority === option.value}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-600">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Problem Description *
            </label>
            <textarea
              id="description"
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Please describe the issue in detail. Include any error messages, strange noises, or symptoms you've observed..."
              className="block w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              Be as specific as possible to help the service provider understand the issue
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Report...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Report Issue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportIssue;