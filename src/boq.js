import React, { useState, useMemo, useEffect, useCallback } from 'react';
import './boq.css';
import { Slider, Skeleton } from '@mui/material';
import { supabase } from './supabase';

const Card = React.memo(({ title, price, image, details, addOns, initialMinimized = false, roomData }) => {
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const basePrice = price;

  const handleAddOnChange = useCallback((addOn, isChecked) => {
    setSelectedAddOns((prevSelectedAddOns) => ({
      ...prevSelectedAddOns,
      [addOn.name]: isChecked ? addOn.price : 0,
    }));
  }, []);

  const calculateTotalPrice = useMemo(() => {
    return Object.values(selectedAddOns).reduce((total, addOnPrice) => total + addOnPrice, basePrice);
  }, [selectedAddOns, basePrice]);

  const toggleMinimize = useCallback(() => setIsMinimized((prev) => !prev), []);

  if (isMinimized) {
    return (
      <div className="minimized-card" onClick={toggleMinimize}>
        <span>{title}</span>
        <div className="info">
          <p>Base Price: ₹{basePrice}</p>
          <p>Total Price: ₹{calculateTotalPrice}</p>
        </div>
        <button className="start-button">Start</button>
      </div>
    );
  }

  return (
    <div className="card-container">
      <CardSection className="card-image">
        <img src={image} alt={title} className="image" loading="lazy" />
      </CardSection>

      <CardSection className="card-features">
        <h3>{title}</h3>
        <p>{details}</p>
        {roomData && (
          <div className="room-info">
            <p>Room Data:</p>
            <ul>
              {Object.entries(roomData).map(([key, value]) => (
                <li key={key}>{`${key}: ${value}`}</li>
              ))}
            </ul>
          </div>
        )}
      </CardSection>

      <CardSection className="card-add-ons">
        <h3>ADD ON</h3>
        <ul>
          {addOns.map((addOn) => (
            <li key={addOn.id}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handleAddOnChange(addOn, e.target.checked)}
                />
                {addOn.name} (+₹{addOn.price})
              </label>
            </li>
          ))}
        </ul>
      </CardSection>

      <CardSection className="card-summary">
        <h4>Summary</h4>
        <p>Base Price: ₹{basePrice}</p>
        <p>Add-Ons: ₹{Object.values(selectedAddOns).reduce((total, price) => total + price, 0)}</p>
        <p>Total Price: ₹{calculateTotalPrice}</p>
        <button className="done-button" onClick={toggleMinimize}>Done</button>
      </CardSection>
    </div>
  );
});

const CardSection = React.memo(({ className, children }) => {
  return <div className={`card ${className}`}>{children}</div>;
});

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([1000, 5000]);
  const [productsData, setProductData] = useState([]);
  const categories = useMemo(() => [
    'Furniture', 
    'Civil / Plumbing', 
    'Lighting', 
    'Electrical', 
    'Partitions- door / windows / ceilings',
    'Paint', 
    'HVAC', 
    'Smart Solutions', 
    'Flooring', 
    'Accessories'
  ], []);
  const [loading, setLoading] = useState(true);
  const [roomNumbers, setRoomNumbers] = useState([]);

  const fetchRoomData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select()
        .order('created_at', { ascending: false })
        .limit(1);
  
      if (error) throw error;
  
      if (data && data.length > 0) {
        const latestRoomData = data[0];
        const roomsArray = Object.fromEntries(
          Object.entries(latestRoomData).filter(([key]) => 
            ['linear', 'ltype', 'md', 'manager', 'small', 'ups', 'bms', 'server', 'reception', 'lounge', 'sales', 'phonebooth', 'discussionroom', 'interviewroom', 'conferenceroom', 'boardroom', 'meetingroom', 'meetingroomlarge', 'hrroom', 'financeroom'].includes(key)
          )
        );
        setRoomNumbers([roomsArray]);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  }, []);

  const fetchProductsData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          addons (*)
        `);

      if (error) throw error;

      const allImages = data.flatMap(product => [product.image, ...product.addons.map(addon => addon.image)]);
      const uniqueImages = [...new Set(allImages)];

      const { data: signedUrls, error: signedUrlError } = await supabase.storage
        .from("addon")
        .createSignedUrls(uniqueImages, 3600);

      if (signedUrlError) throw signedUrlError;

      const urlMap = new Map(signedUrls.map(item => [item.path, item.signedUrl]));

      const processedData = data.map(product => ({
        ...product,
        image: urlMap.get(product.image) || '',
        addons: product.addons.map(addon => ({
          ...addon,
          image: urlMap.get(addon.image) || ''
        }))
      }));

      setProductData(processedData);
    } catch (error) {
      console.error('Error fetching products data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchRoomData(), fetchProductsData()]);
  }, [fetchRoomData, fetchProductsData]);

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value.toLowerCase());
  }, []);

  const handleSliderChange = useCallback((event, newValue) => {
    setPriceRange(newValue);
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => 
      product.title.toLowerCase().includes(searchQuery) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    );
  }, [productsData, searchQuery, priceRange]);

  const categorizedProducts = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = filteredProducts.filter(product => product.category === category);
      return acc;
    }, {});
  }, [categories, filteredProducts]);

  return (
    <div className="App">
      <div className="search-filter">
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={40} width="80%" className="skeleton-bar" />
            <Skeleton variant="rectangular" height={40} width="80%" className="skeleton-slider" />
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-bar"
            />
            <Slider
              value={priceRange}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={1000}
              max={5000}
              className="price-slider"
            />
          </>
        )}
      </div>

      <div className="products-grid">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card-skeleton-container">
              <Skeleton variant="rectangular" height={150} width="100%" className="skeleton-card-image" />
              <Skeleton variant="text" width="60%" height={20} style={{ margin: '10px 0' }} />
              <Skeleton variant="text" width="80%" height={20} style={{ margin: '5px 0' }} />
              <Skeleton variant="text" width="50%" height={20} style={{ margin: '5px 0' }} />
            </div>
          ))
        ) : (
          categories.map((category) => (
            <div key={category} className="category-section">
              <h2>{category}</h2>
              {categorizedProducts[category].map((product) => (
                <Card
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  details={product.details}
                  addOns={product.addons}
                  image={product.image}
                  initialMinimized={product.initialMinimized}
                  // roomData={roomNumbers[0]}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;