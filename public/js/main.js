
const userCardTemplate = document.querySelector("[data-user-template]")
const userCardContainer = document.querySelector("[data-user-cards-container]")
const searchInput = document.querySelector("[data-search]")

let doctors = undefined

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase()
  console.log(doctors);
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
      header.textContent = doc.name
      body.textContent = doc.category
      userCardContainer.append(card)
      return { name: doc.name, category: doc.category, element: card }
    })

    return
  };
  
  window.onload= ()=>{
    getData();}
