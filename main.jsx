const { useState, Fragment } = React;

const App = () => {
	const [isPopupOpen, setPopupOpen] = useState(false);
	const openPopup = () => {setPopupOpen(true)};
	const closePopup = () => {setPopupOpen(false)};

	const [products, setProducts] = useState([]);
	const addProduct = (newProduct) => {
		setProducts((prevProducts) => [...prevProducts, newProduct]);
	};
	const removeProduct = (indexToRemove) => {
		setProducts((prevProducts) => prevProducts.filter((_, index) => index !== indexToRemove));
	};

	const [displayType, setDisplayType] = useState("none");
	const displayTypeChange = (e) => {setDisplayType(e.target.value)};

	return (
		<Fragment>
			<Popup
				isOpen={isPopupOpen}
				addProduct={addProduct}
				closePopup={closePopup}
			/>
			<h2>{LANG("compareProducts")}</h2>
			<button className="action-btn" onClick={openPopup}>{LANG("addItem")}</button>
			<p>
				<span>{LANG("calculate")}:</span>
				<select value={displayType} onChange={displayTypeChange} style={{marginLeft: "10px"}}>
					<option value="none">{LANG("none")}</option>
					<option value="perUnit">{LANG("perUnit")}</option>
					<option value="per100g">{LANG("per100g")}</option>
				</select>
			</p>
			<ProductList
				products={products}
				displayType={displayType}
				removeProduct={removeProduct}
			/>
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

				<h3>{LANG("addProduct")}</h3>
				<div className="row">
					<input
						type="text"
						name="name" 
						placeholder={LANG("name")}
						value={name}
						onChange={handleChange}
					/>
				</div>
				<div className="row">
					<input
						type="number"
						min="0" step="0.01"
						name="price"
						placeholder={LANG("price")}
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
						placeholder={LANG("amount")}
						value={amount}
						onChange={handleChange}
					/>
					<select name="unit" value={unit} onChange={handleChange}>
						<option value="things">{LANG("pieces")}</option>
						<option value="gram">{LANG("grams")}</option>
					</select>
				</div>
				<button className="simple-btn" onClick={handleAddProduct}>{LANG("addItem")}</button>
			</div>
		</div>
	);
}

const Product = ({values, displayType, onRemove}) => {
	const {name, price, amount, unit} = values;

	function round(x){return Math.trunc(x*100)/100}
	const unitNames = {
		"things": LANG("pieces_short"),
		"gram": LANG("grams_short"),
	}

	const displayTypes = {
		none: {
			price: price,
			amountValue: amount,
			amountText: unitNames[unit],
		},
		perUnit: {
			price: round(price / amount),
			amountValue: 1,
			amountText: unitNames[unit],
		},
		per100g: {
			price: round((price * 100) / amount),
			amountValue: 100,
			amountText: unitNames[unit],
		},
	}

	const { price: pricePerUnit, amountValue, amountText } = displayTypes[displayType] || displayTypes.perUnit;

	return (
		<div className="product-item">
			<i className="fa-solid fa-circle-xmark delete" onClick={onRemove}></i>
			<div className="title">{name}</div>
			<div className="info">
				<div className="price">
					<span className="value">{pricePerUnit}</span>
					<span className="currency">₴</span>
				</div>
				<div className="amount">
					<span className="value">{amountValue}</span>
					<span className="currency">{amountText}</span>
				</div>
			</div>
		</div>
	)
}

const ProductList = ({products, displayType, removeProduct}) => {
	return (
		<Fragment>
			{products.length === 0 ? (
				<div className="no-products">
					<span>{LANG("noProducts")}</span>
					<span>¯\_(ツ)_/¯</span>
				</div>
			) : (
				<div className="product-list">
					{products.map((value, index) => (
						<Product
							values={value}
							displayType={displayType}
							key={index}
							onRemove={() => removeProduct(index)}
						/>
					))}
				</div>
			)}
		</Fragment>
	);
};


if (window.location.hash){
	if (window.location.hash === "#dark") {
		document.documentElement.setAttribute('theme', 'dark')
	}
}
else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
	document.documentElement.setAttribute('theme', 'dark')
}


const locales = {
	"en": {
		"compareProducts": "Compare products",
		"noProducts": "No products to display",
		"addItem": "Add item",
		"addProduct": "Add Product",
		"name": "Name",
		"price": "Price",
		"amount": "Amount",
		"pieces": "pieces",
		"grams": "grams",
		"pieces_short": "pcs",
		"grams_short": "g",
		"calculate": "Calculate",
		"none": "None",
		"perUnit": "Per unit",
		"per100g": "Per 100g",
	},
	"ru": {
		"compareProducts": "Сравнить товары",
		"noProducts": "Нет товаров для отображения",
		"addItem": "Добавить",
		"addProduct": "Добавить товар",
		"name": "Название",
		"price": "Цена",
		"amount": "Количество",
		"pieces": "штук",
		"grams": "грамм",
		"pieces_short": "шт",
		"grams_short": "г",
		"calculate": "Рассчитать",
		"none": "Нет",
		"perUnit": "За штуку",
		"per100g": "За 100 грамм",
	},
	"uk": {
		"compareProducts": "Порівняти товари",
		"noProducts": "Немає товарів для відображення",
		"addItem": "Додати",
		"addProduct": "Додати товар",
		"name": "Назва",
		"price": "Ціна",
		"amount": "Кількість",
		"pieces": "штук",
		"grams": "грам",
		"pieces_short": "шт",
		"grams_short": "г",
		"calculate": "Розрахувати",
		"none": "Ні",
		"perUnit": "За штуку",
		"per100g": "За 100 грам",
	}
}
function detectLanguage(){
	if (window.location.search){
		const params = new URLSearchParams(window.location.search)
		let lang = params.get('lang')
		if (lang && Object.keys(locales).includes(lang)){
			return lang
		}
	}
	let user_lang = navigator.language.substring(0,2)
	if (user_lang && Object.keys(locales).includes(user_lang)){
		return user_lang
	}
	return 'en'
}
const userLanguage = detectLanguage()
const LANG = (key) => locales[userLanguage][key]


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
