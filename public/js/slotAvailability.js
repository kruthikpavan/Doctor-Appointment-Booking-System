
const results= document.getElementById('results')
const form= document.getElementsByClassName('date-form')[0]
const input= document.getElementById('date')
const slotsDiv= document.getElementById('available-slots')
    form.addEventListener('submit',(event)=>{
        event.preventDefault()
        const availableTimes= [9,10,11,12,1,2,3]
        availableTimes.forEach(slot=>{
            let element= document.createElement('div')
            element.innerText =    `${slot}`
            element.className= 'box'
            element.addEventListener('click',event=>{
                if(element.classList.contains('active')){
                    element.className='box'

                }
                else{
                element.className='box active'

                }
            })
            slotsDiv.appendChild(element)
            
        })


        

    })
