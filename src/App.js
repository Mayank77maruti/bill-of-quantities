import './App.css';

function Card({ title, price, details }) {
  return (
    <div className="card">
      <div className="image-container">
        <img src="https://placehold.co/120x120" alt={title} className="image" />
        <div>
          <h3>{title}</h3>
          <div className="details">
            <span className="price">{price}</span>
            <div>
              <button className="edit">Edit</button>
              <button className="see-more">See More</button>
            </div>
          </div>
        </div>
      </div>

      <div className="add-on-container">
        <button className="add-on">ADD ON +</button>
        <div className="add-on-details">
          <span>{details}</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const furniture = [
    { title: 'Table', price: '₹4500', details: '4 legs, 5 tops' },
    { title: 'L Shaped Cabin', price: '₹25000', details: '4 legs, 5 tops' },
    { title: 'Office Chair', price: '₹12000', details: 'Adjustable, ergonomic' },
    { title: 'Bookshelf', price: '₹8000', details: '5 shelves, wooden' }
  ];

  const chairs = [
    { title: 'Executive Chair', price: '₹7000', details: 'High back, leather' },
    { title: 'Gaming Chair', price: '₹15000', details: 'Reclining, ergonomic' },
    { title: 'Visitor Chair', price: '₹3000', details: 'Stackable, lightweight' }
  ];

  const partitions = [
    { title: 'Glass Partition', price: '₹10000', details: 'Tempered glass, frameless' },
    { title: 'Wooden Partition', price: '₹8000', details: 'Oak wood, customizable' },
    { title: 'Fabric Partition', price: '₹6000', details: 'Soundproof, various colors' }
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
          <Card key={index} title={product.title} price={product.price} details={product.details} />
        ))}
      </div>

      <h2 className="furniture-header">CHAIRS</h2>
      <div className="container">
        {chairs.map((product, index) => (
          <Card key={index} title={product.title} price={product.price} details={product.details} />
        ))}
      </div>

      <h2 className="furniture-header">PARTITIONS</h2>
      <div className="container">
        {partitions.map((product, index) => (
          <Card key={index} title={product.title} price={product.price} details={product.details} />
        ))}
      </div>

      <div className="center-button-container">
        <button className="explore-more">EXPLORE MORE</button>
      </div>
    </>
  );
}


export default App;
