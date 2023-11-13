import React from 'react'
import GuestPage from './GuestPage';
import CustomerDashboard from './CustomerDashboard';
import RestaurantOwnerDashboard from './RestaurantOwnerDashboard';

const HomePage = ({ isAuthenticated, userRole }) => {
    return (
        <>
        {isAuthenticated && userRole.toLowerCase() === "customer" ? (
            <CustomerDashboard />
        ) : isAuthenticated && userRole.toLowerCase() === "restaurateur"? (
            <RestaurantOwnerDashboard />
        ) : (
            <GuestPage />
        )}
        </>
      );
}

export default HomePage