import React, { useEffect, useState } from "react";
import axios from "axios";
import './Tables.css';

function RestaurantTables({ restaurant, restaurantId, role }) {
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (role === "customer") {
      // Fetch table data for the specified restaurant
      axios
        .get(`http://localhost:30005/api/restaurants/${restaurantId}/tables`)
        .then((response) => {
          setTables(response.data);
        })
        .catch((error) => {
          console.error("Error fetching tables:", error);
        });
    }
  }, [restaurantId, role]);

  useEffect(() => {
    // Update the local state when reservations change
    setTables((prevTables) =>
      prevTables.map((prevTable) => {
        const reservation = reservations.find((r) => r.tableNumber === prevTable.tableNumber);
        return reservation ? { ...prevTable, isAvailable: reservation.status === 'available' } : prevTable;
      })
    );
  }, [reservations]);

const reserveTable = async (tableNumber) => {
  const tableToReserve = tables.find((table) => table.tableNumber === tableNumber);

  if (tableToReserve) {
    if (tableToReserve.isAvailable) {
      // Send a request to reserve the table if the role is customer
      if (role === "customer") {
        try {
          const response = await axios.post(
            `http://localhost:30005/api/restaurants/${restaurantId}/tables/reserve`,
            { tableNumber }
          );
          console.log(response)
          // Update the local state to mark the table as reserved
          setTables((prevTables) =>
            prevTables.map((prevTable) =>
              prevTable.tableNumber === tableNumber
                ? { ...prevTable, isAvailable: false }
                : prevTable
            )
          );

          // Update selectedTables state
          setSelectedTables((prevSelected) => [...prevSelected, tableNumber]);
          // Display a notification
          window.alert("Reservation successful!");
        } catch (error) {
          console.error("Error reserving table:", error);
        }
      } else {
        // Handle case when the user's role is not customer
        console.error("You are not authorized to reserve tables.");
      }
    } else {
      // Unreserve the table if it is already reserved by the user
      try {
        console.log('ok')
        const response = await axios.post(
          `http://localhost:30005/api/restaurants/${restaurantId}/tables/unreserve`,
          { tableNumber }
        );
        console.log(response);
        console.log(tableToReserve);
        // Update the local state to mark the table as available
        setTables((prevTables) =>
          prevTables.map((prevTable) =>
            prevTable.tableNumber === tableNumber
              ? { ...prevTable, isAvailable: true }
              : prevTable
          )
        );

        // Update selectedTables state
        setSelectedTables((prevSelected) =>
          prevSelected.filter((selectedTable) => selectedTable !== tableNumber)
        );
        // Display a notification
        window.alert("Reservation cancelled successfully!");
      } catch (error) {
        console.error("Error cancelling reservation", error);
      }
    }
  }
  setSelectedTables((prevSelectedTables) => [...prevSelectedTables, tableNumber]);
};


  const isTableReserved = (tableNumber) => {
    // Check if the table is reserved based on your logic
    return selectedTables.includes(tableNumber);
  };

  const acceptReservation = async (restaurant, isAccepted, tableNumber) => {
    try {
      const response = await axios.post(
        `http://localhost:30005/api/restaurants/${restaurantId}/reservations/accept`,
        { restaurant, isAccepted, tableNumber }
      );
        
      console.log(tableNumber)
      if (response.status === 200) {
        // Update the local state to reflect the change in reservation status
        setReservations((prevReservations) =>
          prevReservations.map((prevReservation) =>
            prevReservation._id === restaurant.reservation._id
              ? { ...prevReservation, status: isAccepted ? 'accepted' : 'declined' }
              : prevReservation
          )
        );
        // Display a notification
        window.alert("Reservation status updated successfully!");
      } else {
        console.error("Failed to update reservation status");
      }
    } catch (error) {
      console.error("Error accepting/declining reservation:", error);
    }
  };

  const getReservedTables = () => {
    console.log(restaurant);
  
    // Assuming you already have restaurant data available
    // If not, fetch it or pass it as a parameter to this function
  
    const reserved = restaurant.tables.filter((table) => {
      const reservationsForTable = restaurant.reservations.filter((reservation) => {
        return reservation.status === 'pending' && reservation.tableNumber === table.tableNumber;
      });
    
      return reservationsForTable.length > 0;
    });
    
    console.log(reserved);
    return reserved || [];
  }    
  
  
  return (
    <div className="restaurant-tables">
      <div className="instructions">
        {role === 'customer'
          ? 'Click on a table to reserve'
          : ''}
      </div>
      {role === 'customer' ? (
        <div className="grid-container">
          {tables.map((table) => (
            <div
              key={table._id}
              className={`table ${table.tableType} ${
                table.isAvailable === false? 'reserved' : table.tableType === 2? 'table-for-2' : 'table-for-4'
              }`}
              onClick={() => {
                if (table.isAvailable || isTableReserved(table.tableNumber)) {
                  reserveTable(table.tableNumber);
                }
              }}
            ></div>
          ))}
        </div>
      ) : (
      <div className="reservations-list">
        <h3>Pending Reservations for Approval</h3>
        {getReservedTables().length > 0 ? (
          <>
            <ul>
              {getReservedTables().map((table) => (
                <li key={table._id}>
                  Table {table.tableNumber} - Pending Approval
                  <button onClick={() => acceptReservation(restaurant, true, table.tableNumber)}>
                    Accept
                  </button>
                  <button onClick={() => acceptReservation(restaurant, false, table.tableNumber)}>
                    Decline
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No pending reservations for approval.</p>
        )}
      </div>
      )}
      <div className="legend">
        {role === 'customer' && (
          <>
            <div className="legend-item reserved">
              <span>Reserved</span>
            </div>
            <div className="legend-item two">
              <span>Table for 2</span>
            </div>
            <div className="legend-item four">
              <span>Table for 4</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export default RestaurantTables;
