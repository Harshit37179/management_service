import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Issues: React.FC = () => {
  const { issues, updateIssue } = useData();
  const { addNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.applianceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.floor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || issue.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = (issueId: string, newStatus: string) => {
    updateIssue(issueId, { status: newStatus as any });
    addNotification({
      type: 'success',
      message: `Issue status updated to ${newStatus.replace('-', ' ')}`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'reported':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reported':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusActions = (issue: any) => {
    const actions = [];
    
    if (issue.status === 'reported') {
      actions.push({
        label: 'Mark In Progress',
        action: () => handleStatusChange(issue.id, 'in-progress'),
        color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
      });
    }
    
    if (issue.status === 'in-progress') {
      actions.push({
        label: 'Mark Resolved',
        action: () => handleStatusChange(issue.id, 'resolved'),
        color: 'bg-green-100 text-green-800 hover:bg-green-200'
      });
    }
    
    if (issue.status === 'resolved') {
      actions.push({
        label: 'Reopen',
        action: () => handleStatusChange(issue.id, 'reported'),
        color: 'bg-red-100 text-red-800 hover:bg-red-200'
      });
    }
    
    return actions;
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Issues
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage reported issues
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
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
              <option value="reported">Reported</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className="relative">
            <AlertTriangle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            All Issues ({filteredIssues.length})
          </h3>
        </div>
        
        {filteredIssues.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500 mb-2">No issues found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 pt-1">
                      {getStatusIcon(issue.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">{issue.applianceName}</h4>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(issue.priority)}`}>
                          {issue.priority} priority
                        </span>
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Room {issue.room}, Floor {issue.floor}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {issue.reportedBy}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {issue.description}
                      </p>
                      
                      {issue.serviceProvider && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            Service Provider: {issue.serviceProvider}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {getStatusActions(issue).map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${action.color}`}
                      >
                        {action.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedIssue === issue.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                {expandedIssue === issue.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-3">Full Description</h5>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap mb-4">{issue.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Reported:</span>
                        <p className="text-gray-600">{new Date(issue.createdAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Updated:</span>
                        <p className="text-gray-600">{new Date(issue.updatedAt).toLocaleString()}</p>
                      </div>
                      {issue.serviceProvider && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-gray-700">Assigned Service Provider:</span>
                          <p className="text-gray-600">{issue.serviceProvider}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Issues;