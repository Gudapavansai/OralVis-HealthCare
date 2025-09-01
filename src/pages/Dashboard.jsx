import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import TechnicianDashboard from '@/components/TechnicianDashboard';
import DentistDashboard from '@/components/DentistDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {user?.role === 'technician' ? (
        <TechnicianDashboard />
      ) : (
        <DentistDashboard />
      )}
    </Layout>
  );
};

export default Dashboard;