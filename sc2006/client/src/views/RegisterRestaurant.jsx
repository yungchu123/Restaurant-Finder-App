import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const RegisterRestaurant = ({ user, role , username}) => {
  // eslint-disable-next-line
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [dietaryOptions, setDietaryOptions] = useState([]);
  const [priceRange, setPriceRange] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [placeId, setPlaceId] = useState('');
  const navigate = useNavigate();

  const handleRestaurantAddressChange = (e) => {
    setRestaurantAddress(e.target.value);
  };

  useEffect(() => {
    if (role !== 'restaurateur') {
      alert('You are not authorized to register a restaurant.');
    }
  }, [role]);

  const handleRestaurantAddressSelect = (place) => {
    const addressComponents = place.address_components;
    if (addressComponents) {
      // Set the restaurant address and place ID
      const address = addressComponents
        .map((component) => component.long_name)
        .join(', ');
  
      setRestaurantAddress(address);
      setPlaceId(place.place_id); // Set the place ID
    }
  };

  const handleCuisineChange = (e) => {
    const selectedCuisine = e.target.value;
    if (isCuisineValid(selectedCuisine)) {
      setCuisine(selectedCuisine);
    } else {
      alert('Please select a valid cuisine option.');
    }
  };

  const isCuisineValid = (cuisine) => {
    const validCuisines = [
      'Chinese', 'Malay', 'Indian', 'Western', 'Japanese', 'Korean', 'Vietnamese',
    ];
    return validCuisines.includes(cuisine);
  };

  const handleDietaryOptionChange = (e) => {
    const selectedOption = e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setDietaryOptions([...dietaryOptions, selectedOption]);
    } else {
      setDietaryOptions(dietaryOptions.filter((option) => option !== selectedOption));
    }
  };

  const handleRegisterClick = async () => {
    const inputRefValue = inputRef.current.value;
    setRestaurantName(inputRefValue);
    console.log(inputRefValue)
    const restaurantData = {
      inputRefValue,
      cuisine,
      dietaryOptions,
      priceRange,
      restaurantAddress,
      placeId,
      username
    };
  
    try {
      const response = await fetch('http://localhost:30005/api/restaurants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData),
      });
  
      if (response.ok) {
        alert('Restaurant registered successfully!');
        setRestaurantName('');
        setCuisine('');
        setDietaryOptions([]);
        setPriceRange('');
        setRestaurantAddress('');
  
        // Redirect to the '/registered-restaurants' route
        navigate('../registered-restaurants');
      } else {
        alert('Failed to register the restaurant. Please try again.');
      }
    } catch (error) {
      console.error('Error registering the restaurant:', error);
      alert('An error occurred while registering the restaurant. Please try again.');
    }
  };  
      
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const initializeAutoComplete = () => {
      const options = {
        componentRestrictions: { country: 'SG' },
        fields: ['address_components', 'geometry', 'icon', 'name'],
        types: ['establishment'],
      };

      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );

      autoCompleteRef.current.addListener('place_changed', async function () {
        const place = await autoCompleteRef.current.getPlace();
        handleRestaurantAddressSelect(place);
      });

      inputRef.current.addEventListener('input', () => {
        const query = inputRef.current.value;
        if (query && query.length > 2) {
          // Perform your own suggestion fetching logic here
        } else {
          setSuggestions([]);
        }
      });
    };

    initializeAutoComplete();
  }, []);

  const handleSuggestionClick = (suggestion) => {
    const suggestionDescription = suggestion.description;
    const name = suggestionDescription.split(',')[0].trim();
    inputRef.current.value = name;
    setSuggestions([]);
    handleRestaurantAddressSelect({ address_components: suggestion.address_components });
  };


  return (
    <div className="container">
      <h1 className="my-4">Register a Restaurant</h1>
      <form>
      <div className="mb-3" style={{ position: 'relative' }}>
      <label htmlFor="restaurantName" className="form-label">
        Restaurant Name
      </label>
      <input
        ref={inputRef}
        placeholder="Enter name"
        className="long-input"
        id="restaurantName"
      />
      <ul style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1, background: '#fff', padding: '10px' }}>
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.place_id}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion.description}
          </li>
        ))}
      </ul>
    </div>
        <div className="mb-3">
          <label htmlFor="restaurantAddress" className="form-label">
            Restaurant Address
          </label>
          <input
            type="text"
            className="form-control"
            id="restaurantAddress"
            value={restaurantAddress}
            onChange={handleRestaurantAddressChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cuisine" className="form-label">
            Cuisine
          </label>
          <select
            className="form-select"
            id="cuisine"
            value={cuisine}
            onChange={handleCuisineChange}
            required
          >
            <option value="">Select a cuisine</option>
            <option value="Chinese">Chinese</option>
            <option value="Malay">Malay</option>
            <option value="Indian">Indian</option>
            <option value="Western">Western</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
            <option value="Vietnamese">Vietnamese</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Dietary Options</label>
          {['Halal', 'Vegetarian', 'Dairy-free', 'Gluten-free'].map((option) => (
            <div key={option}>
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={dietaryOptions.includes(option)}
                  onChange={handleDietaryOptionChange}
                />{' '}
                {option}
              </label>
            </div>
          ))}
        </div>
        <div className="mb-3">
          <label htmlFor="priceRange" className="form-label">
            Price Range
          </label>
          <select
            className="form-select"
            id="priceRange"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            required
          >
            <option value="">Select a price range</option>
            <option value="$">$</option>
            <option value="$$">$$</option>
            <option value="$$$">$$$</option>
            <option value="$$$$">$$$$</option>
          </select>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleRegisterClick}>
          Register Restaurant
        </button>
      </form>
    </div>
  );
};

export default RegisterRestaurant;
