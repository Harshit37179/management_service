import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  applianceTypes: string[];
  createdAt: Date;
}

export interface Appliance {
  id: string;
  name: string;
  type: string;
  room: string;
  floor: string;
  status: 'working' | 'faulty' | 'maintenance';
  createdAt: Date;
}

export interface Issue {
  id: string;
  applianceId: string;
  applianceName: string;
  room: string;
  floor: string;
  description: string;
  status: 'reported' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  reportedBy: string;
  serviceProvider?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DataContextType {
  serviceProviders: ServiceProvider[];
  appliances: Appliance[];
  issues: Issue[];
  addServiceProvider: (provider: Omit<ServiceProvider, 'id' | 'createdAt'>) => void;
  updateServiceProvider: (id: string, provider: Partial<ServiceProvider>) => void;
  deleteServiceProvider: (id: string) => void;
  addAppliance: (appliance: Omit<Appliance, 'id' | 'createdAt'>) => void;
  updateAppliance: (id: string, appliance: Partial<Appliance>) => void;
  deleteAppliance: (id: string) => void;
  addIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIssue: (id: string, issue: Partial<Issue>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    // Load data from API or fallback to localStorage
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Try to load from API
      const [providersData, appliancesData, issuesData] = await Promise.all([
        apiService.getServiceProviders(),
        apiService.getAppliances(),
        apiService.getIssues()
      ]);
      
      setServiceProviders(providersData);
      setAppliances(appliancesData);
      setIssues(issuesData);
    } catch (error) {
      // Fallback to localStorage or mock data
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    const savedProviders = localStorage.getItem('serviceProviders');
    const savedAppliances = localStorage.getItem('appliances');
    const savedIssues = localStorage.getItem('issues');

    if (savedProviders) {
      setServiceProviders(JSON.parse(savedProviders));
    } else {
      // Initialize with mock data
      const mockProviders: ServiceProvider[] = [
        {
          id: '1',
          name: 'TechFix Solutions',
          email: 'contact@techfix.com',
          phone: '+1 (555) 123-4567',
          address: '123 Tech Street, City, State 12345',
          applianceTypes: ['Computer', 'Printer', 'Projector'],
          createdAt: new Date('2024-01-15')
        },
        {
          id: '2',
          name: 'ElectroRepair Pro',
          email: 'service@electrorepair.com',
          phone: '+1 (555) 987-6543',
          address: '456 Electric Ave, City, State 12345',
          applianceTypes: ['Air Conditioner', 'Refrigerator', 'Microwave'],
          createdAt: new Date('2024-01-20')
        }
      ];
      setServiceProviders(mockProviders);
      localStorage.setItem('serviceProviders', JSON.stringify(mockProviders));
    }

    if (savedAppliances) {
      setAppliances(JSON.parse(savedAppliances));
    } else {
      const mockAppliances: Appliance[] = [
        {
          id: '1',
          name: 'Conference Room Computer',
          type: 'Computer',
          room: '101',
          floor: '1',
          status: 'working',
          createdAt: new Date('2024-01-25')
        },
        {
          id: '2',
          name: 'Break Room Microwave',
          type: 'Microwave',
          room: '105',
          floor: '1',
          status: 'faulty',
          createdAt: new Date('2024-01-26')
        },
        {
          id: '3',
          name: 'Office Printer',
          type: 'Printer',
          room: '201',
          floor: '2',
          status: 'working',
          createdAt: new Date('2024-01-27')
        }
      ];
      setAppliances(mockAppliances);
      localStorage.setItem('appliances', JSON.stringify(mockAppliances));
    }

    if (savedIssues) {
      setIssues(JSON.parse(savedIssues));
    } else {
      const mockIssues: Issue[] = [
        {
          id: '1',
          applianceId: '2',
          applianceName: 'Break Room Microwave',
          room: '105',
          floor: '1',
          description: 'Microwave is not heating food properly. The turntable also makes strange noises when rotating.',
          status: 'reported',
          priority: 'medium',
          reportedBy: 'John Doe',
          serviceProvider: 'ElectroRepair Pro',
          createdAt: new Date('2024-01-28'),
          updatedAt: new Date('2024-01-28')
        }
      ];
      setIssues(mockIssues);
      localStorage.setItem('issues', JSON.stringify(mockIssues));
    }
  };

  const addServiceProvider = (provider: Omit<ServiceProvider, 'id' | 'createdAt'>) => {
    try {
      // Try API first
      apiService.createServiceProvider(provider).then((newProvider) => {
        const updatedProviders = [...serviceProviders, newProvider];
        setServiceProviders(updatedProviders);
      });
    } catch (error) {
      // Fallback to localStorage
      const newProvider: ServiceProvider = {
        ...provider,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      const updatedProviders = [...serviceProviders, newProvider];
      setServiceProviders(updatedProviders);
      localStorage.setItem('serviceProviders', JSON.stringify(updatedProviders));
    }
  };

  const updateServiceProvider = (id: string, provider: Partial<ServiceProvider>) => {
    try {
      apiService.updateServiceProvider(id, provider).then(() => {
        const updatedProviders = serviceProviders.map(p => p.id === id ? { ...p, ...provider } : p);
        setServiceProviders(updatedProviders);
      });
    } catch (error) {
      const updatedProviders = serviceProviders.map(p => p.id === id ? { ...p, ...provider } : p);
      setServiceProviders(updatedProviders);
      localStorage.setItem('serviceProviders', JSON.stringify(updatedProviders));
    }
  };

  const deleteServiceProvider = (id: string) => {
    try {
      apiService.deleteServiceProvider(id).then(() => {
        const updatedProviders = serviceProviders.filter(p => p.id !== id);
        setServiceProviders(updatedProviders);
      });
    } catch (error) {
      const updatedProviders = serviceProviders.filter(p => p.id !== id);
      setServiceProviders(updatedProviders);
      localStorage.setItem('serviceProviders', JSON.stringify(updatedProviders));
    }
  };

  const addAppliance = (appliance: Omit<Appliance, 'id' | 'createdAt'>) => {
    try {
      apiService.createAppliance(appliance).then((newAppliance) => {
        const updatedAppliances = [...appliances, newAppliance];
        setAppliances(updatedAppliances);
      });
    } catch (error) {
      const newAppliance: Appliance = {
        ...appliance,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      const updatedAppliances = [...appliances, newAppliance];
      setAppliances(updatedAppliances);
      localStorage.setItem('appliances', JSON.stringify(updatedAppliances));
    }
  };

  const updateAppliance = (id: string, appliance: Partial<Appliance>) => {
    try {
      apiService.updateAppliance(id, appliance).then(() => {
        const updatedAppliances = appliances.map(a => a.id === id ? { ...a, ...appliance } : a);
        setAppliances(updatedAppliances);
      });
    } catch (error) {
      const updatedAppliances = appliances.map(a => a.id === id ? { ...a, ...appliance } : a);
      setAppliances(updatedAppliances);
      localStorage.setItem('appliances', JSON.stringify(updatedAppliances));
    }
  };

  const deleteAppliance = (id: string) => {
    try {
      apiService.deleteAppliance(id).then(() => {
        const updatedAppliances = appliances.filter(a => a.id !== id);
        setAppliances(updatedAppliances);
      });
    } catch (error) {
      const updatedAppliances = appliances.filter(a => a.id !== id);
      setAppliances(updatedAppliances);
      localStorage.setItem('appliances', JSON.stringify(updatedAppliances));
    }
  };

  const addIssue = (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      apiService.createIssue(issue).then((newIssue) => {
        const updatedIssues = [...issues, newIssue];
        setIssues(updatedIssues);
        // Send email notification
        apiService.sendIssueNotification(newIssue.id);
      });
    } catch (error) {
      const newIssue: Issue = {
        ...issue,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const updatedIssues = [...issues, newIssue];
      setIssues(updatedIssues);
      localStorage.setItem('issues', JSON.stringify(updatedIssues));
    }
  };

  const updateIssue = (id: string, issue: Partial<Issue>) => {
    try {
      apiService.updateIssue(id, issue).then(() => {
        const updatedIssues = issues.map(i => i.id === id ? { ...i, ...issue, updatedAt: new Date() } : i);
        setIssues(updatedIssues);
      });
    } catch (error) {
      const updatedIssues = issues.map(i => i.id === id ? { ...i, ...issue, updatedAt: new Date() } : i);
      setIssues(updatedIssues);
      localStorage.setItem('issues', JSON.stringify(updatedIssues));
    }
  };

  return (
    <DataContext.Provider value={{
      serviceProviders,
      appliances,
      issues,
      addServiceProvider,
      updateServiceProvider,
      deleteServiceProvider,
      addAppliance,
      updateAppliance,
      deleteAppliance,
      addIssue,
      updateIssue
    }}>
      {children}
    </DataContext.Provider>
  );
};