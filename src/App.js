import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function Card({ title, price, details, addOns }) {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const dropdownRef = useRef(null);
  const basePrice = parseInt(price.replace('₹', ''), 10); // Convert price to a number

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleAddOnChange = (addOn, isChecked) => {
    setSelectedAddOns({
      ...selectedAddOns,
      [addOn.name]: isChecked ? addOn.price : 0,
    });
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedAddOns).reduce((total, addOnPrice) => total + addOnPrice, basePrice);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="card">
      <div className="image-container">
        <img src="https://placehold.co/120x120" alt={title} className="image" />
        <div>
          <h3>{title}</h3>
          <div className="details">
            <span className="price text-red">₹{calculateTotalPrice()}</span>
            <div>
              <button className="edit">Edit</button>
              <button className="see-more">See More</button>
            </div>
          </div>
        </div>
      </div>

      <div className="add-on-container" ref={dropdownRef}>
        <button className="add-on" onClick={toggleDropdown}>ADD ON +</button>
        {isDropdownVisible && (
          <div className="dropdown-menu">
            <ul>
              {addOns.map((addOn, index) => (
                <li key={index}>
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
          </div>
        )}
        <div className="add-on-details">
          <span>{details}</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const furniture = [
    {
      title: 'Table',
      price: '₹4500',
      details: '4 legs, 5 tops',
      addOns: [
        { name: 'Storage', price: 1000 },
        { name: 'Leg Guard', price: 500 }
      ]
    },
    {
      title: 'L Shaped Cabin',
      price: '₹25000',
      details: '4 legs, 5 tops',
      addOns: [
        { name: 'Custom Shelves', price: 2000 },
        { name: 'Drawer Lock', price: 300 }
      ]
    },
    {
      title: 'Office Chair',
      price: '₹12000',
      details: 'Adjustable, ergonomic',
      addOns: [
        { name: 'Headrest', price: 800 },
        { name: 'Lumbar Support', price: 500 }
      ]
    },
    {
      title: 'Bookshelf',
      price: '₹8000',
      details: '5 shelves, wooden',
      addOns: [
        { name: 'Glass Doors', price: 1500 },
        { name: 'LED Lighting', price: 1200 }
      ]
    }
  ];

  const chairs = [
    {
      title: 'Executive Chair',
      price: '₹7000',
      details: 'High back, leather',
      addOns: [
        { name: 'Cushion', price: 500 },
        { name: 'Armrest Pads', price: 300 }
      ]
    },
    {
      title: 'Gaming Chair',
      price: '₹15000',
      details: 'Reclining, ergonomic',
      addOns: [
        { name: 'Footrest', price: 1000 },
        { name: 'Cooling Gel', price: 700 }
      ]
    },
    {
      title: 'Visitor Chair',
      price: '₹3000',
      details: 'Stackable, lightweight',
      addOns: [
        { name: 'Extra Padding', price: 200 },
        { name: 'Anti-Slip Pads', price: 100 }
      ]
    }
  ];

  const partitions = [
    {
      title: 'Glass Partition',
      price: '₹10000',
      details: 'Tempered glass, frameless',
      addOns: [
        { name: 'Frosted Glass', price: 2000 },
        { name: 'Custom Tint', price: 1500 }
      ]
    },
    {
      title: 'Wooden Partition',
      price: '₹8000',
      details: 'Oak wood, customizable',
      addOns: [
        { name: 'Varnish', price: 500 },
        { name: 'Custom Carving', price: 1200 }
      ]
    },
    {
      title: 'Fabric Partition',
      price: '₹6000',
      details: 'Soundproof, various colors',
      addOns: [
        { name: 'Custom Color', price: 800 },
        { name: 'Extra Padding', price: 600 }
      ]
    }
  ];

  return (
    <>
      <header>
        <h1>Work Better, Together</h1>
        <p>Be surrounded by inspiration</p>
      </header>

      <h2 className="furniture-header">FURNITURE</h2>
      <div className="container">
        {furniture.map((product, index) => (
          <Card
            key={index}
            title={product.title}
            price={product.price}
            details={product.details}
            addOns={product.addOns}
          />
        ))}
      </div>

      <h2 className="furniture-header">CHAIRS</h2>
      <div className="container">
        {chairs.map((product, index) => (
          <Card
            key={index}
            title={product.title}
            price={product.price}
            details={product.details}
            addOns={product.addOns}
          />
        ))}
      </div>

      <h2 className="furniture-header">PARTITIONS</h2>
      <div className="container">
        {partitions.map((product, index) => (
          <Card
            key={index}
            title={product.title}
            price={product.price}
            details={product.details}
            addOns={product.addOns}
          />
        ))}
      </div>

      <div className="center-button-container">
        <button className="explore-more">EXPLORE MORE</button>
      </div>
    </>
  );
}

export default App;
