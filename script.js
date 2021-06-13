const budgetCount = document.getElementById('budget-count');
const expensesCount = document.getElementById('expenses-count');
const balanceCount = document.getElementById('balance-count');
const form1 = document.getElementById('form1');
const form2 = document.getElementById('form2');
const budgeting = document.getElementById('budgeting');
const expense = document.getElementById('expense');
const amount = document.getElementById('amount');
const list1 = document.getElementById('list1');
const list2 = document.getElementById('list2');
const list3 = document.getElementById('list3');
const formContainer = document.getElementById('form-container');
const expensePopup = document.getElementById('expense-popup');
const amountPopup = document.getElementById('amount-popup');
const clear = document.getElementById('clear');
let itemID = 0

const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);

let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function calculate(e) {
    e.preventDefault();
    if (budgeting.value.trim() === '') {
        alert('Please enter budget');
      } else {

        let sum = 0
        transactions.forEach(function(transaction) {
          sum = sum + +transaction.amount
        })

        budgetCount.innerText = +budgeting.value
        balanceCount.innerText = +budgetCount.innerText - sum
        expensesCount.innerText = sum
        updateLocalStorage();

        budgeting.value = ''
      }
}

function addExpenses(e) {
    e.preventDefault();
    if (expense.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add expense or enter amount');
      } else {

        const transaction = {
          id: generateID(),
          text: expense.value,
          amount: +amount.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);
        let sum = 0
        transactions.forEach(function(transaction) {
          sum = sum + +transaction.amount
        })

        expensesCount.innerText = sum
        balanceCount.innerText = +budgetCount.innerText - sum
        updateLocalStorage();

        expense.value = '';
        amount.value = ''
      }
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
  const item1 = document.createElement('li');
  const item2 = document.createElement('li');
  const item3 = document.createElement('li');

  // Add class based on value
  item1.classList.add('addExpenseTitle');
  item2.classList.add('addExpenseValue');
  item3.classList.add('editDelete');


  item1.innerHTML = `<span id="edit-title${transaction.id}">${transaction.text}</span>`;
  item2.innerHTML = `<span id="edit-value${transaction.id}">$${Math.abs(transaction.amount)}</span>`;
  item3.innerHTML = `<i class="fas fa-edit" onclick="editTransaction(${
    transaction.id
  })"></i>
  <i class="fas fa-trash" onclick="removeTransaction(${
    transaction.id
  })"></i>`;
  list1.appendChild(item1);
  list2.appendChild(item2);
  list3.appendChild(item3);
}

function updateLocalStorage() {
    localStorage.setItem('budget', budgetCount.innerText);
    localStorage.setItem('expenses', expensesCount.innerText);
    localStorage.setItem('balance', balanceCount.innerText);
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

function populateUI () {
    const budget = localStorage.getItem('budget');
    const expenses = localStorage.getItem('expenses');
    const balance = localStorage.getItem('balance');

    budgetCount.innerText = budget;
    expensesCount.innerText = expenses;
    balanceCount.innerText = balance;
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function editTransaction(id) {

  itemID = id

  transactions.forEach(function(transaction) {
    if (transaction.id === id) {
      console.log(transaction.amount);
    }
  })

  openForm();
  updateLocalStorage();
  init();
}

function removeTransaction(id) {
  
  transactions.forEach(function(transaction) {
    if (transaction.id === id) {
      
      expensesCount.innerText = +expensesCount.innerText - +transaction.amount;
      balanceCount.innerText = +balanceCount.innerText + +transaction.amount;
      console.log(transaction.amount);
    }
    transactions = transactions.filter(transaction => transaction.id !== id);
  })

  updateLocalStorage();
  init();
}

function init() {
  list1.innerHTML = '';
  list2.innerHTML = '';
  list3.innerHTML = '';
  transactions.forEach(addTransactionDOM);
}

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

function accept(e) {
  e.preventDefault();

  let sum = 0
  transactions.forEach(function(transaction) {
    if (transaction.id === itemID) {
      transaction.text = expensePopup.value;
      transaction.amount = amountPopup.value;
      
    }
    sum = sum + +transaction.amount
  })

  expensesCount.innerText = sum
  balanceCount.innerText = +budgetCount.innerText - sum

  const editTitle = document.getElementById(`edit-title${itemID}`);
  let editValue = document.getElementById(`edit-value${itemID}`);
  editTitle.innerHTML = expensePopup.value
  editValue.innerHTML = `$${amountPopup.value}`

  updateLocalStorage();
  init();

  expensePopup.value = '';
  amountPopup.value = '';
}

function clearList(e) {
  e.preventDefault();
  console.log('dddd');
  transactions = [];

  expensesCount.innerText = 0
  balanceCount.innerText = +budgetCount.innerText

  updateLocalStorage();
  init();
}

init();
populateUI();

form1.addEventListener('submit', calculate);
form2.addEventListener('submit', addExpenses);
formContainer.addEventListener('submit', accept);
clear.addEventListener('click', clearList);
