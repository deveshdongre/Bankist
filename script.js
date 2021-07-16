'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Devesh Dongre',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Karan Bhasne',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Divyash Batham',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Sharma',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {

  containerMovements.innerHTML = '';

  //sort functionality and slice is used to create copy of array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {


    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">  
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}




const createUserName = function (accs) {
  accs.forEach(function (acc) {

    acc.username = acc.owner.toLowerCase().split(' ').map(function (word) {
      return word[0];
    }).join('');
  });
}

const calcdisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance} $`;
};


const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(function (income) {
    return income > 0
  }).reduce(function (sum, income) {
    return sum + income
  });
  labelSumIn.textContent = `${incomes}$`;

  const outcomes = acc.movements.filter(income => income < 0).reduce((sum, income) => sum + income);
  labelSumOut.textContent = `${Math.abs(outcomes)}$`;


  //interset is 1.2% when we deposit in account 
  const interest = acc.movements.filter(amt => amt > 0).map(amt => amt * acc.interestRate / 100).filter(int => int > 1).reduce((sum, int) => sum + int);
  // console.log(interest);
  labelSumInterest.textContent = `${interest}$`;

}

createUserName(accounts);

const updateUI = function (acc) {
  //Display Movements
  //Display Balance
  //Display Summary
  displayMovements(acc.movements);
  calcdisplayBalance(acc);
  calcDisplaySummary(acc);

}

//Event handlers
let currentAccount;


btnLogin.addEventListener('click', function (e) {
  //prevent default function of reloading the page as it was a from
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('Login');

    //clear the input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    //Display UI message
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = '100';
    //Display Movements
    //Display Balance
    //Display Summary
    updateUI(currentAccount);



  }
});


//trasfer amount 

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  if (amount > 0 && receiverAcc && amount <= currentAccount.balance && receiverAcc?.username !== currentAccount.username) {
    //transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = ''
});
//button loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => amount <= mov / 10)) {
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
    //Loan UI empty
    inputLoanAmount.value = '';
  }
  else {
    alert('Not Eligible for a Loan');
  }
});



//closing account 
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(index);
    //delete account 
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = '0';
  }
});


//sorted variable state
let sortedState = false
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortedState);
  sortedState = !sortedState;
});