const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(price);
}

const toDate = date => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date));
}

document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent);
});

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent);
});

const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', e => {
        if (e.target.classList.contains('js-remove')) {
            const id = e.target.dataset.id;
            const csurf = event.target.dataset.csrf;

            fetch('/card/remove/' + id, {
                    method: 'delete',
                    headers: {
                        'X-XSRF-TOKEN': csurf
                    }
                }).then(res => res.json())
                .then(card => {
                    console.log(card);
                    if (card.courses.length) {
                        const html = card.courses.map(c => {
                            return `
                            <tr>
                            <td>${c.title}</td>
                            <td>${c.count}</td>
                            <td>
                            <button class="btn btn-small js-remove" data-id="${c.id}">Delete</button>
                            </td>
                            </tr>
                            `;
                        }).join('');
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = toCurrency(card.price);
                    } else {
                        $card.innerHTML = '<p>Order is empty</p>';
                    }
                });
        }
    });
}

M.Tabs.init(document.querySelectorAll('.tabs'));