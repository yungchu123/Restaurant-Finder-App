import React, { useEffect, useState } from "react";
import axios from "axios";
import './Tables.css'

function RestaurantTables({ restaurantId }) {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    // Fetch table data for the specified restaurant
    axios
      .get(`http://localhost:30005/api/restaurants/${restaurantId}/tables`)
      .then((response) => {
        setTables(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error fetching tables:", error);
      });
  }, [restaurantId, tables]);

  // eslint-disable-next-line
  const reserveTable = (tableNumber) => {
    // Find the table to reserve
    const tableToReserve = tables.find((table) => table.tableNumber === tableNumber);

    if (tableToReserve) {
      if (tableToReserve.isAvailable) {
        // Send a request to reserve the table
        axios
          .post(`http://localhost:30005/api/restaurants/${restaurantId}/tables/reserve`, { tableNumber })
          .then(() => {
            // Update the local state to mark the table as reserved
            setTables((prevTables) =>
              prevTables.map((table) =>
                table.tableNumber === tableNumber
                  ? { ...table, isAvailable: false }
                  : table
              )
            );
          })
          .catch((error) => {
            console.error("Error reserving table:", error);
          });
      } else {
        // Handle case when the table is already reserved
        console.error("Table is already reserved");
      }
    }
  };

    // eslint-disable-next-line
  const unreserveTable = (tableNumber) => {
    // Find the table to unreserve
    const tableToUnreserve = tables.find((table) => table.tableNumber === tableNumber);

    if (tableToUnreserve) {
      if (!tableToUnreserve.isAvailable) {
        // Send a request to unreserve the table
        axios
          .post(`http://localhost:30005/api/restaurants/${restaurantId}/tables/unreserve`, { tableNumber })
          .then(() => {
            // Update the local state to mark the table as available
            setTables((prevTables) =>
              prevTables.map((table) =>
                table.tableNumber === tableNumber
                  ? { ...table, isAvailable: true }
                  : table
              )
            );
          })
          .catch((error) => {
            console.error("Error unreserving table:", error);
          });
      } else {
        // Handle case when the table is already available
        console.error("Table is already available");
      }
    }
  };

  const toggleReservation = (tableNumber) => {
    // Find the table to toggle reservation
    const updatedTables = tables.map((table) => {
      if (table.tableNumber === tableNumber) {
        return {
          ...table,
          isAvailable: !table.isAvailable, // Toggle the availability
        };
      }
      return table;
    });

    setTables(updatedTables);
  };

  return (
    <div className="restaurant-tables">
      <div className="grid-container">
        {tables.map((table) => (
          <div
            key={table._id}
            className={`table table-for-${table.tableType} ${table.isAvailable ? 'available' : 'reserved'}`}
            onClick={() => toggleReservation(table.tableNumber)}>
          </div>
        ))}
      </div>
    </div>
  );
}  

export default RestaurantTables;

