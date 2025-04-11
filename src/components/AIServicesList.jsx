import React, { useState, useEffect } from 'react';
import { getServices, deleteService, deleteInstance, updateInstanceStatus, addInstance } from '../api/apiServices';
import ConfirmationDialog from './ConfirmationDialog';
import './AIServicesList.css';

const AIServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  // Status options for instances
  const statusOptions = ['Running', 'Stopped', 'Error'];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
      setError('');
    } catch (err) {
      setError('Failed to load services. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = (serviceId, serviceName) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Service',
      message: `Are you sure you want to delete the entire service "${serviceName}" and all its instances?`,
      onConfirm: async () => {
        try {
          await deleteService(serviceId);
          setServices(services.filter(service => service._id !== serviceId));
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          setError(err.message);
        }
      }
    });
  };

  const handleDeleteInstance = (serviceId, instanceId, serviceName) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Instance',
      message: `Are you sure you want to delete this instance from the service "${serviceName}"?`,
      onConfirm: async () => {
        try {
          const updatedService = await deleteInstance(serviceId, instanceId);
          
          setServices(services.map(service => 
            service._id === serviceId ? updatedService : service
          ));
          
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          setError(err.message);
        }
      }
    });
  };

  const handleStatusChange = async (serviceId, instanceId, newStatus) => {
    try {
      const updatedService = await updateInstanceStatus(serviceId, instanceId, newStatus);
      
      setServices(services.map(service => 
        service._id === serviceId ? updatedService : service
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddInstance = async (serviceId) => {
    try {
      const updatedService = await addInstance(serviceId);
      
      setServices(services.map(service => 
        service._id === serviceId ? updatedService : service
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="services-container">
      <h2>AI Services</h2>
      {services.length === 0 ? (
        <p>No services found. Add some to get started.</p>
      ) : (
        services.map(service => (
          <div key={service._id} className="service-card">
            <div className="service-header">
              <div>
                <h3>{service.Sname}</h3>
                <p>Type: {service.type}</p>
                <p>Version: {service.version}</p>
                <p>Replicas: {service.replicas}</p>
              </div>
              <div className="service-actions">
                <button 
                  className="add-instance-button"
                  onClick={() => handleAddInstance(service._id)}
                >
                  Add Instance
                </button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteService(service._id, service.Sname)}
                >
                  Delete Service
                </button>
              </div>
            </div>
            
            <div className="instances-container">
              <h4>Instances</h4>
              <table className="instances-table">
                <thead>
                  <tr>
                    <th>Instance ID</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {service.instances.map(instance => (
                    <tr key={instance.instanceId}>
                      <td>{instance.instanceId.substring(0, 8)}...</td>
                      <td>
                        <select
                          value={instance.status}
                          onChange={(e) => handleStatusChange(service._id, instance.instanceId, e.target.value)}
                          className={`status-${instance.status.toLowerCase()}`}
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td>{new Date(instance.createdAt).toLocaleString()}</td>
                      <td>
                        <button 
                          className="delete-instance-button"
                          onClick={() => handleDeleteInstance(service._id, instance.instanceId, service.Sname)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
      
      <ConfirmationDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleCloseDialog}
      />
    </div>
  );
};

export default AIServicesList;