const embgDataForm = document.querySelector('#embg-data-form');

const generateEmbg = (embgData) => {
	const orderPrefix = embgData.sex === 'male' ? 0 : 500;
	const order = orderPrefix + +embgData.order;

	const arr = ['0', '0', '0', ...order.toString().split('')];
	const orderStr = arr.slice(-3).join('');

	const str = `${embgData.date[0]}${embgData.date[1]}${embgData.date[2]}${embgData.city}${orderStr}`;

	const ctrl = str.split('').reduce((acc, curr, i) => acc + (+curr) * [4, 5, 6, 7, 8, 9][(i) % 6], 0) % 11;

	return `${str}${ctrl.toString().slice(-1)}`;
};

const validate = (inputs) => {
	const errors = [];

	// date validation
	if (inputs.date.value === '') {
		errors.push('Date is required');
	}

	if (!new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).test(inputs.date.value)) {
		errors.push('Date must be in correct format');
	}

	// city validation
	if (inputs.city.value === '') {
		errors.push('City is required');
	}

	if (inputs.city.value.length !== 2 || (+inputs.city.value) < 41 || (+inputs.city.value) > 49) {
		errors.push('City must be a valid Macedonian city');
	}

	// order validation
	if (inputs.order.value === '') {
		errors.push('Order is required');
	}

	if (inputs.order.value.length !== 3 || isNaN(+inputs.order.value)) {
		errors.push('Order must be a 3 digit number');
	}

	// sex validation
	if (inputs.sex.value === '') {
		errors.push('Sex is required');
	}

	if (!['male', 'female'].includes(inputs.sex.value)) {
		errors.push('Sex must be either male or female');
	}

	return errors;
}

const newErrorCard = (message) => {
	const card = document.createElement('div');
	card.classList.add('card', 'variant-danger');
	card.innerText = message;

	return card;
}

let errorsTimeot = -1;

const setErrors = (errors) => {
	const errorContainer = document.querySelector('#error-cards');
	errorContainer.innerHTML = '';

	if (errors.length > 0) {
		errorContainer.classList.replace('hidden', 'flex');
	} else {
		errorContainer.classList.replace('flex', 'hidden');
	}

	if (errorsTimeot !== -1) {
		clearTimeout(errorsTimeot);
	}

	errorsTimeot = setTimeout(() => {
		errorContainer.classList.replace('flex', 'hidden');
	}, 5000);

	errors.forEach(error => {
		const newChild = newErrorCard(error);
		setTimeout(() => {
			newChild.remove();
		}, 5000);
		errorContainer.appendChild(newChild);
	});
}

embgDataForm.addEventListener('submit', async (e) => {
	// console.log('Form submitted');

	e.preventDefault();

	setErrors([]);

	const inputs = {
		date: document.querySelector('#date'),
		city: document.querySelector('#city'),
		order: document.querySelector('#order'),
		sex: document.querySelector('input[name="sex"]:checked'),
	};

	const errors = validate(inputs);

	if (errors.length > 0) {
		setErrors(errors);
		return;
	}

	const fullDate = inputs.date.value.split('-');
	const year = fullDate[0].substring(1, 4);

	const embgData = {
		date: [fullDate[2], fullDate[1], year],
		city: inputs.city.value,
		order: inputs.order.value,
		sex: inputs.sex.value,
	};

	const res = generateEmbg(embgData);

	const embgOutput = document.querySelector('#embg-output');
	embgOutput.value = res;

	// console.log({ res, embgData });
});