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
	} else if (!new RegExp(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).test(inputs.date.value)) {
		errors.push('Date must be in correct format');
	}

	// city validation
	if (inputs.city.value === '') {
		errors.push('City is required');
	} else if (inputs.city.value.length !== 2 || (+inputs.city.value) < 41 || (+inputs.city.value) > 49) {
		errors.push('City must be a valid Macedonian city');
	}

	// order validation
	if (inputs.order.value === '') {
		errors.push('Order is required');
	}

	// sex validation
	if (inputs.sex.value === '') {
		errors.push('Sex is required');
	} else if (!['male', 'female'].includes(inputs.sex.value)) {
		errors.push('Sex must be either male or female');
	}

	return errors;
}

const SELECTORS = {
	DATE: '#date',
	CITY: '#city',
	ORDER: '#order',
	CHECKED_SEX: 'input[name="sex"]:checked',
	SEX_FEMALE: '#sex-female',
	SEX_MALE: '#sex-male',
	ERROR_CONTAINER: '#error-cards',
	ERROR_CONTAINER_EMBG: '#error-cards-embg',
}

const newErrorCard = (message) => {
	const card = document.createElement('div');
	card.classList.add('card', 'variant-danger');
	card.innerText = message;

	return card;
}


let errorsTimeot = -1;

const setErrors = (errors, _errorContainer) => {
	const errorContainer = _errorContainer || document.querySelector(SELECTORS.ERROR_CONTAINER);
	console.log({ errorContainer, _errorContainer });
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
		date: document.querySelector(SELECTORS.DATE),
		city: document.querySelector(SELECTORS.CITY),
		order: document.querySelector(SELECTORS.ORDER),
		sex: document.querySelector(SELECTORS.CHECKED_SEX),
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

const embgNumberForm = document.querySelector('#embg-number-form');

const validateEmbg = (embg) => {
	const errors = [];

	if (embg.length !== 13) {
		errors.push('EMBG must be 13 characters long');
	} else if (!new RegExp(/^[0-9]{13}$/).test(embg)) {
		errors.push('EMBG must contain only numbers');
	}

	return errors;
}

const getDataFromEmbg = (embg) => {
	const dateArr = embg.substring(0, 7).split('');
	const date = [dateArr[4] + dateArr[5] + dateArr[6], dateArr[2] + dateArr[3], dateArr[0] + dateArr[1]];
	if (+date[0] < 30) {
		date[0] = '2' + date[0];
	} else {
		date[0] = '1' + date[0];
	}

	const city = embg.substring(7, 9);

	const order = embg.substring(9, 12);
	const sex = +order < 500 ? 'male' : 'female';

	return {
		date: date.join('-'),
		city,
		order: (+order) % 500,
		sex,
	};
}

embgNumberForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	setErrors([], document.querySelector(SELECTORS.ERROR_CONTAINER_EMBG));

	const embg = document.querySelector('#embg-number').value;

	const errors = validateEmbg(embg);

	if (errors.length > 0) {
		setErrors(errors, document.querySelector(SELECTORS.ERROR_CONTAINER_EMBG));
		return;
	}

	const res = getDataFromEmbg(embg);

	document.querySelector(SELECTORS.DATE).value = res.date;
	document.querySelector(SELECTORS.CITY).value = res.city;
	document.querySelector(SELECTORS.ORDER).value = res.order;

	if (res.sex === 'male') {
		document.querySelector(SELECTORS.SEX_MALE).checked = true;
	} else {
		document.querySelector(SELECTORS.SEX_FEMALE).checked = true;
	}
});