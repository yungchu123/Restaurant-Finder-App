// RestaurantActions.js
import axios from 'axios';

const handleAcceptReservation = async (restaurantId, reservationId, isAccepted) => {
  try {
    await axios.post(`http://localhost:30005/api/restaurants/${restaurantId}/reservations/accept`, {
      reservationId,
      isAccepted,
    });
    // Update the local state or trigger a refresh
  } catch (error) {
    console.error('Error accepting reservation:', error);
  }
};

// Other restaurant-related actions can be added here

export { handleAcceptReservation };
