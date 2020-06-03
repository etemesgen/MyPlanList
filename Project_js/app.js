// Plan Class: Represents a plan
class Plan{
    constructor(activity, subject, date){
        this.activity = activity;
        this.subject = subject;
        this.date = date;
    }
}
// UI Class: Handle UI Tasks
class UI{
    static displayPlans(){
        const plans = Store.getPlans();

        plans.forEach((plan) => UI.addPlanToList(plan));
    }
   static addPlanToList(plan){
     const list = document.querySelector('#plan-list');

     const row = document.createElement('tr');

     row.innerHTML = `
          <td>${plan.activity}</td>
          <td>${plan.subject}</td>
          <td>${plan.date}</td>
          <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
     `;
     
     list.appendChild(row);
   } 

   static deletePlan(el){
     if(el.classList.contains('delete')){
        el.parentElement.parentElement.remove();
     }
   }
  
   static alertMessage(message, className){
     const div = document.createElement('div'); 
     div.className = `alert alert-${className}`;
     div.appendChild(document.createTextNode(message));
     const container = document.querySelector('.container');
     const form = document.querySelector('#plan-form');
     container.insertBefore(div, form);
     // Vanish in 3 seconds 
     setTimeout(() => document.querySelector('.alert').remove(), 
     3000); 
   }

   static clearFields(){
       document.querySelector('#activity').value = '';
       document.querySelector('#subject').value = '';
       document.querySelector('#date').value = '';
   }
}

//Store Class: Handles Storage
class Store{
   static getPlans(){
        let plans;
        if(localStorage.getItem('plans') === null) {
            plans = [];
        }
        else{
          plans = JSON.parse(localStorage.getItem('plans'));
        }

        return plans;
     }

   static addPlan(plan){
       const plans = Store.getPlans();
       plans.push(plan);
       localStorage.setItem('plans', JSON.stringify(plans));
     }

   static removePlans(date){
        const plans = Store.getPlans();
        plans.forEach((plan, index) => {
           if(plan.date === date){
              plans.splice(index, 1);
           } 
        });

        localStorage.setItem('plans' , JSON.stringify(plans));
     }
}



//Event: Display Plans
document.addEventListener('DOMContentLoaded', UI.displayPlans);

//Event: Add a plan
document.querySelector('#plan-form').addEventListener('submit', (e) => {
  //Prevent actual submit        
  e.preventDefault();
    
  //Get from values
  const activity = document.querySelector('#activity').value;
  const subject = document.querySelector('#subject').value;
  const date = document.querySelector('#date').value;          
            
  //Validate
  if(activity === '' || subject === '' || date === ''){
     UI.alertMessage('Fill in all the fields Edo !', 'danger');
    }
    else{
        //Instatiate plan
        const plan = new Plan(activity, subject, date);

        // Add Plan to UI
        UI.addPlanToList(plan);

        // Add plan to store
        Store.addPlan(plan);
        
        // Show success message
        UI.alertMessage('Plan added' , 'success');

        // Clear fields
        UI.clearFields();
    }
});

//Event: Remove a plan
document.querySelector('#plan-list').addEventListener('click', (e) => {
    // Remove book from UI
    UI.deletePlan(e.target);

    // Remove book from store
    Store.removePlans(e.target.parentElement.previousElementSibling.textContent);
    
    // Show success message
    UI.alertMessage('Plan removed' , 'success');
});