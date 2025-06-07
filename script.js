document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let balance = 0.00;
    let transactions = [];

    // --- DOM ELEMENT SELECTORS ---
    // Dashboard
    const balanceDisplay = document.getElementById('current-balance');
    const addMoneyBtn = document.getElementById('add-money-btn');
    const withdrawMoneyBtn = document.getElementById('withdraw-money-btn');
    const historyBtn = document.getElementById('history-btn');

    // Modals & Overlays
    const addMoneyModal = document.getElementById('add-money-modal');
    const withdrawMoneyModal = document.getElementById('withdraw-money-modal');
    const historyOverlay = document.getElementById('history-overlay');
    const closeButtons = document.querySelectorAll('.close-modal-btn');

    // Forms & Inputs
    const addMoneyForm = document.getElementById('add-money-form');
    const addAmountInput = document.getElementById('add-amount-input');
    const addErrorMsg = document.getElementById('add-error-msg');

    const withdrawMoneyForm = document.getElementById('withdraw-money-form');
    const withdrawAmountInput = document.getElementById('withdraw-amount-input');
    const withdrawErrorMsg = document.getElementById('withdraw-error-msg');

    // Transaction List
    const transactionList = document.getElementById('transaction-list');

    // --- HELPER FUNCTIONS ---
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
    
    const showModal = (modal) => modal.classList.remove('hidden');
    const hideModal = (modal) => {
        modal.classList.add('hidden');
        // Clear any previous error messages and input values
        addErrorMsg.textContent = '';
        withdrawErrorMsg.textContent = '';
        addAmountInput.value = '';
        withdrawAmountInput.value = '';
    };

    // --- UI UPDATE FUNCTIONS ---
    const updateUI = () => {
        // Update balance display
        balanceDisplay.textContent = formatCurrency(balance);
        
        // Update transaction history
        renderTransactions();
    };

    const renderTransactions = () => {
        // Clear existing list
        transactionList.innerHTML = '';

        if (transactions.length === 0) {
            transactionList.innerHTML = `
                <tr class="text-center">
                    <td colspan="4" class="p-8 text-gray-500">No transactions yet.</td>
                </tr>
            `;
            return;
        }

        // Create a copy and reverse it to show newest first
        const reversedTransactions = [...transactions].reverse();
        
        reversedTransactions.forEach(tx => {
            const txRow = document.createElement('tr');
            txRow.className = 'border-b border-gray-200 last:border-b-0';

            const typeClass = tx.type === 'Add' ? 'text-green-600' : 'text-red-600';

            txRow.innerHTML = `
                <td class="p-3">${new Date(tx.date).toLocaleString()}</td>
                <td class="p-3 font-semibold ${typeClass}">${tx.type}</td>
                <td class="p-3 text-right">${formatCurrency(tx.amount)}</td>
                <td class="p-3 text-right font-medium">${formatCurrency(tx.newBalance)}</td>
            `;
            transactionList.appendChild(txRow);
        });
    };
    
    // --- EVENT LISTENERS ---

    // Modal Triggers
    addMoneyBtn.addEventListener('click', () => showModal(addMoneyModal));
    withdrawMoneyBtn.addEventListener('click', () => showModal(withdrawMoneyModal));
    historyBtn.addEventListener('click', () => showModal(historyOverlay));

    // Close Modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            hideModal(addMoneyModal);
            hideModal(withdrawMoneyModal);
            hideModal(historyOverlay);
        });
    });

    // --- FORM SUBMISSION LOGIC ---

    // Add Money Form
    addMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(addAmountInput.value);

        // Validation
        if (isNaN(amount) || amount <= 0) {
            addErrorMsg.textContent = 'Please enter a valid positive number.';
            return;
        }
        addErrorMsg.textContent = '';

        // Update state
        balance += amount;
        transactions.push({
            date: new Date(),
            type: 'Add',
            amount: amount,
            newBalance: balance
        });

        // Update UI, hide modal, and clear form
        updateUI();
        hideModal(addMoneyModal);
    });

    // Withdraw Money Form
    withdrawMoneyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(withdrawAmountInput.value);

        // Validation
        if (isNaN(amount) || amount <= 0) {
            withdrawErrorMsg.textContent = 'Please enter a valid positive number.';
            return;
        }
        if (amount > balance) {
            withdrawErrorMsg.textContent = 'Insufficient funds for this withdrawal.';
            return;
        }
        withdrawErrorMsg.textContent = '';
        
        // Update state
        balance -= amount;
        transactions.push({
            date: new Date(),
            type: 'Withdraw',
            amount: amount,
            newBalance: balance
        });

        // Update UI, hide modal, and clear form
        updateUI();
        hideModal(withdrawMoneyModal);
    });

    // --- INITIAL RENDER ---
    updateUI();
});