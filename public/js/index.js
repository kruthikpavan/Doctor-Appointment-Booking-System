const submitReview = (e) => {
    e.preventDefault();
    const review = document.getElementById('review').value;
    const options = {
    method: 'POST',
    body: JSON.stringify({ review }),
    headers: new Headers({ 'Content-Type': 'application/json' })
    }

    const emojiSection = document.getElementById('emojiSection');
    const title = document.getElementById('title');
    const outline = document.querySelector(':focus');

    fetch('/api/nlp/s-analyzer', options)
        .then(res => res.json())
        .then (({ analysis }) => {
            if (analysis < 0) {
            emojiSection.innerHTML = '<img src="https://img.icons8.com/emoji/96/000000/angry-face.png">';
            title.style.color = 'red';
            outline.style.borderColor = 'red';
            };
            if (analysis === 0) {
            emojiSection.innerHTML = '<img src="https://img.icons8.com/officel/80/000000/neutral-emoticon.png">';
            title.style.color = '#00367c';
            outline.style.borderColor = '#00367c';
            }
            if (analysis > 0) {
            emojiSection.innerHTML = '<img src="https://img.icons8.com/color/96/000000/happy.png">';
            title.style.color = 'green';
            outline.style.borderColor = 'green'
            }
        })
        .catch(err => {
            emojiSection.innerHTML = 'There was an error processing your request!'
        })
    }
    
    document.getElementById('review').addEventListener('keyup', submitReview);
    document.getElementById('reviewForm').addEventListener('submit', submitReview);

    const userCardTemplate = document.querySelector("[data-user-template]")
    const userCardContainer = document.querySelector("[doctor-user-cards-container]")
    const searchInput = document.querySelector("[data-search]")

    let users = []

    searchInput.addEventListener("input", e => {
        const value = e.target.value.toLowerCase()
        users.forEach(user => {
            const isVisible =
            user.name.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value)
        user.element.classList.toggle("hide", !isVisible)
        })
    })

    fetch("/search")
    .then(res => res.json())
    .then(data => {
    users = data.map(user => {
        const card = userCardTemplate.content.cloneNode(true).children[0]
        const header = card.querySelector("[data-header]")
        const body = card.querySelector("[data-body]")
        header.textContent = user.name
        body.textContent = user.email
        userCardContainer.append(card)
        return { name: user.name, email: user.email, element: card }
    })
})


