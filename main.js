let transactions = [];

function generateId() {
    return Number(new Date());
};

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID').format(angka);
}

const formTransaction = document.getElementById('transactionForm');

const incomeList = document.getElementById('incomeList');
const expenseList = document.getElementById('expenseList');
const nominalPemasukan = document.querySelector('.tracker-summary__stat-amount--income');
const nominalPengeluaran = document.querySelector('.tracker-summary__stat-amount--expense');
const totalSaldo = document.querySelector('.tracker-summary__balance-amount');
const formPencarian = document.getElementById('searchTransactionForm');
const inputPencarian = document.getElementById('searchTransactionFormTitleInput');

function transactionDisplay(data = transactions) {
    incomeList.innerHTML = '';
    expenseList.innerHTML = '';

    data.forEach(function(transaction) {

        const elementTransaction = document.createElement('div');

        elementTransaction.classList.add('transaction-card');

        elementTransaction.setAttribute(
            'data-testid',
            'transactionItem'
        );

        elementTransaction.innerHTML = `
            <h3 data-testid="transactionItemTitle">
                ${transaction.keterangan}
            </h3>

            <p data-testid="transactionItemAmount">
                Nominal: Rp${formatRupiah(transaction.nominal)}
            </p>

            <p data-testid="transactionItemDate">
                Tanggal: ${transaction.tanggal}
            </p>

            <p data-testid="transactionItemType">
                Tipe: ${transaction.klasifikasi}
            </p>

            <div>
                <button
                    type="button"
                    class="edit-type-button"
                    data-testid="transactionItemEditTypeButton">
                    Ubah Tipe
                </button>

                <button
                    type="button"
                    class="delete-button"
                    data-testid="transactionItemDeleteButton">
                    Hapus
                </button>
            </div>
        `;

        const hapusButton = elementTransaction.querySelector(
            '[data-testid="transactionItemDeleteButton"]'
        );

        hapusButton.addEventListener('click', function() {
            hapusTransactions(transaction.id);
            simpanTransactions();
            transactionDisplay();
            incomeUpdate();
            expenseUpdate();
            balanceUpdate();
        });

        const ubahTypeButton = elementTransaction.querySelector(
            '[data-testid="transactionItemEditTypeButton"]'
        );

        ubahTypeButton.addEventListener('click', function() {
            ubahTransaction(transaction.id);
        });

        if (transaction.klasifikasi === 'income') {
            incomeList.appendChild(elementTransaction);
        } else {
            expenseList.appendChild(elementTransaction);
        };
    });
};

function incomeCalculate() {
    let totalPemasukan = 0;

    transactions.forEach(function(transaction) {
        if(transaction.klasifikasi === 'income') {
            totalPemasukan += transaction.nominal;
        }
    });
    return totalPemasukan;
};

function expenseCalculate() {
    let totalPengeluaran = 0;

    transactions.forEach(function(transaction) {
        if(transaction.klasifikasi === 'expense') {
            totalPengeluaran += transaction.nominal;
        }
    });
    return totalPengeluaran;
};

function incomeUpdate() {
    nominalPemasukan.textContent = `Rp ${formatRupiah(incomeCalculate())}`;
};

function expenseUpdate() {
    nominalPengeluaran.textContent = `Rp ${formatRupiah(expenseCalculate())}`;
};

function balanceCalculate() {
    return incomeCalculate() - expenseCalculate();
};

function balanceUpdate() {
    totalSaldo.textContent = `Rp ${formatRupiah(balanceCalculate())}`;
};

function searchTransaction(keyword) {
    const keywordLower = keyword.toLowerCase();

    return transactions.filter(function(transaction) {
        return transaction.keterangan
            .toLowerCase()
            .includes(keywordLower);
    });
};

function simpanTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
};

function transactionsLoad() {
    const data = localStorage.getItem('transactions');

    if(data) {
        transactions = JSON.parse(data);
    };
};

function hapusTransactions(id) {
    transactions = transactions.filter(function(transaction) {
        return transaction.id !== id;
    });
};

function ubahTransaction(id) {
    const transaction = transactions.find(function(transaction) {
        return transaction.id === id;
    });

    if (!transaction) {
        return;
    };

    if (transaction.klasifikasi === 'income') {
        transaction.klasifikasi = 'expense';
    } else {
        transaction.klasifikasi = 'income';
    };

    simpanTransactions();
    transactionDisplay();
    incomeUpdate();
    expenseUpdate();
    balanceUpdate();
};

inputPencarian.addEventListener('input', function(event) {
    const keyword = event.target.value;

    const result = searchTransaction(keyword);

    transactionDisplay(result);
});

formTransaction.addEventListener('submit', function(event) {
    event.preventDefault();

    const keterangan = document.getElementById('transactionFormTitleInput').value;
    const nominal = Number(document.getElementById('transactionFormAmountInput').value);
    const tanggal = document.getElementById('transactionFormDateInput').value;
    const klasifikasi = document.getElementById('transactionFormTypeSelect').value;

    const transaction = {
        id: generateId(),
        keterangan: keterangan,
        nominal: nominal,
        tanggal: tanggal,
        klasifikasi: klasifikasi
    };

    transactions.push(transaction);

    transactionDisplay();
    incomeUpdate();
    expenseUpdate();
    balanceUpdate();
    simpanTransactions();

    formTransaction.reset();
});

    transactionsLoad();
    transactionDisplay();
    incomeUpdate();
    expenseUpdate();
    balanceUpdate();
    simpanTransactions();
