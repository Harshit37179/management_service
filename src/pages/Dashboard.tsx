import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  Wrench, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  XCircle,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { appliances, serviceProviders, issues } = useData();

  const stats = [
    {
      name: 'Total Appliances',
      value: appliances.length,
      icon: Wrench,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Service Providers',
      value: serviceProviders.length,
      icon: Users,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Active Issues',
      value: issues.filter(i => i.status !== 'resolved').length,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Resolved Issues',
      value: issues.filter(i => i.status === 'resolved').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const recentIssues = issues.slice(0, 5);
  const workingAppliances = appliances.filter(a => a.status === 'working').length;
  const faultyAppliances = appliances.filter(a => a.status === 'faulty').length;
  const maintenanceAppliances = appliances.filter(a => a.status === 'maintenance').length;

  const quickActions = [
    {
      name: 'Add Appliance',
      description: 'Register a new appliance',
      icon: Wrench,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/appliances'
    },
    {
      name: 'Add Service Provider',
      description: 'Register a new service provider',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/service-providers'
    },
    {
      name: 'Report Issue',
      description: 'Report a problem with an appliance',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/report-issue'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:text-4xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Welcome to your Smart Management Portal
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className={`text-2xl font-bold ${stat.textColor}`}>
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appliance Status Chart */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Appliance Status Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Working</span>
                </div>
                <span className="text-lg font-bold text-green-600">{workingAppliances}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Faulty</span>
                </div>
                <span className="text-lg font-bold text-red-600">{faultyAppliances}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Maintenance</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{maintenanceAppliances}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
              Recent Issues
            </h3>
            <Link 
              to="/issues" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentIssues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-400 mb-3" />
                  <p className="text-sm text-gray-500">No issues reported yet</p>
                  <p className="text-xs text-gray-400 mt-1">Great job maintaining your appliances!</p>
                </div>
              ) : (
                recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded-full ${
                        issue.status === 'resolved' ? 'bg-green-100' :
                        issue.status === 'in-progress' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        {issue.status === 'resolved' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : issue.status === 'in-progress' ? (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{issue.applianceName}</p>
                        <p className="text-xs text-gray-500">Room {issue.room}, Floor {issue.floor}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Plus className="h-5 w-5 mr-2 text-blue-600" />
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className={`p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200 hover:border-gray-300 group ${action.bgColor} hover:bg-opacity-80`}
              >
                <action.icon className={`h-8 w-8 ${action.color} mb-3 group-hover:scale-110 transition-transform`} />
                <p className="text-sm font-semibold text-gray-900 mb-1">{action.name}</p>
                <p className="text-xs text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;