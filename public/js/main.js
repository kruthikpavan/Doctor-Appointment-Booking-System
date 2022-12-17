
const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")

let doctors = undefined

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  doctors.forEach(doc => {
    const visible= doc.name.toLowerCase().includes(value) || doc.category.toLowerCase().includes(value)
    doc.element.classList.toggle('hide',!visible) 
    
  });

//   users.forEach(user => {
//     console.log(user.firstname);
//     const isVisible =
//       user.name.toLowerCase().includes(value) ||
//       user.email.toLowerCase().includes(value)
//     user.element.classList.toggle("hide", !isVisible)})
  })

const getData = async () => {
    const response = await fetch("http://localhost:3000/doctordetails", {
      method: "GET",
    });
    const data = await response.json();
    doctors= data.map(doc=>{
        const card = userCardTemplate.content.cloneNode(true).children[0]
      const header = card.querySelector("[data-header]")
      const body = card.querySelector("[data-body]")
      const btn = card.querySelector("[data-appointment]")
      const hidden=card.querySelector("[hidden]")
      const reviewHidden=card.querySelector("[review-hidden]")
      const review = card.querySelector("[data-reviews]")

      header.textContent = doc.name
      hidden.value = doc.name
      body.textContent = doc.category
      btn.textContent = 'Book Appointment'
      review.textContent= 'View Reviews'
      reviewHidden.value=doc.name
    //   btn.addEventListener('click',event=>{
    // //  const bookAppointment= async()=>{
    // //    fetch("http://localhost:3000/users/book-appointments", {
    // //         method: "GET",
    // //       }).then(response=>response.json()).then(data=>console.log(data));
    // //     //   console.log('hellooo');
    // //       window.location.href='http://localhost:3000/users/book-appointment'
    // //     //   const data2 = await response2.json();
    // //     //   console.log(data2);

    // //  }

    // //     bookAppointment()
    //   })
      review.textContent = 'Reviews'



      userCardContainer.append(card)
      return { name: doc.name, category: doc.category, element: card }
    })

    return
  };
  
  window.onload= ()=>{
    getData();}

    