const { useState, Fragment } = React;


const App = () => {
	const [isPopupOpen, setPopupOpen] = useState(false);
	const openPopup = () => {setPopupOpen(true)};
	const closePopup = () => {setPopupOpen(false)};

	const [products, setProducts] = useState([
		{name: 'Изюм',
		price: 39.90,
		amount: 200,
		unit: 'gram'},
		{name: 'Изюм 2',
		price: 25.90,
		amount: 150,
		unit: 'gram'},
	]);
	const addProduct = (newProduct) => {
		setProducts((prevProducts) => [...prevProducts, newProduct]);
	};

	return (
		<Fragment>
			<Popup
				isOpen={isPopupOpen}
				addProduct={addProduct}
				closePopup={closePopup}
			/>
			<h2>Сравнить товары</h2>
			<button className="action-btn" onClick={openPopup}>Добавить</button>
			<ProductList products={products}/>
		</Fragment>
	);
}

const Popup = ({ isOpen, addProduct, closePopup }) => {
	const defaultFormValues = {
		name: '',
		price: '',
		amount: '',
		unit: 'things'
	}
	const [formValues, setFormValues] = useState(defaultFormValues);
	const {name, price, amount, unit} = formValues;

	const handleClose = () => {
		setFormValues(defaultFormValues)
		closePopup()
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormValues((prev) => {
			return {...prev, [name]: value}
		});
	};

	const handleAddProduct = () => {
		if (name && price && amount && unit) {
			const newProduct = {
				name: name,
				price: price,
				amount: amount,
				unit: unit
			};
			addProduct(newProduct);
			handleClose()
		} else {
			alert('Заполните все поля!');
		}
	};

	return (
		<div className="popup" open={isOpen}>
			<div className="popup-content">
				<i className="fa-solid fa-circle-xmark close" onClick={handleClose}></i>

				<h3>Добавить товар</h3>
				<div className="row">
					<input
						type="text"
						name="name" 
						placeholder="Название"
						value={name}
						onChange={handleChange}
					/>
				</div>
				<div className="row">
					<input
						type="number"
						min="0" step="0.01"
						name="price"
						placeholder="Цена"
						value={price}
						onChange={handleChange}
					/>
					<span>₴</span>
				</div>
				<div className="row">
					<input
						type="number"
						min="1" step="1"
						name="amount"
						placeholder="Количество"
						value={amount}
						onChange={handleChange}
					/>
					<select name="unit" value={unit} onChange={handleChange}>
						<option value="things">штук</option>
						<option value="gram">грам</option>
					</select>
				</div>
				<button className="simple-btn" onClick={handleAddProduct}>Добавить</button>
			</div>
		</div>
	);
}

const Product = ({values}) => {
	const {name, price, amount, unit} = values;

	return (
		<div className="product-item">
			<div className="title">{name}</div>
			<div className="info">
				<div className="price">{price}₴</div>
				<div className="amount">{amount}{unit}</div>
			</div>
		</div>
	)
}

const ProductList = ({products}) => {
	return (
		<Fragment>
			{products.length === 0 ? (
				<div>Нет товаров для отображения</div>
			) : (
				<div className="product-list">
					{products.map((value, index) => (
						<Product values={value} key={index}/>
					))}
				</div>
			)}
		</Fragment>
	);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
