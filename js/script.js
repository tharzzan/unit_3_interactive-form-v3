const form = document.querySelector('form')
const nameField = document.querySelector('#name')
const jobRoleField = document.querySelector('#title')
const otherJobRoleField = jobRoleField.nextElementSibling
const tshirtDesignField = document.querySelector('#design')
const tshirtColorField = document.querySelector('#color')
const activitiesFieldSet = document.querySelector('#activities')
const activitiesCheckboxes = activitiesFieldSet.querySelectorAll('input')
const activitiesCost = document.querySelector('#activities-cost')
// const paymentFieldset = document.querySelector('fieldset.payment-methods')
const paymentTypes = document.querySelectorAll('fieldset.payment-methods > div')
const paymentMethodField = document.querySelector('#payment')

// ###############################################
// bikin function untuk ubah2 display value-nya
// ###############################################


/**
 * ****************************************
 * perform the following when the page load
 * reset fields and setting default values
 * ****************************************
 */

nameField.value = ''
nameField.focus()
jobRoleField.value = ''
otherJobRoleField.value = ''
otherJobRoleField.style.display = 'none'
tshirtDesignField.value = ''
tshirtColorField.disabled = true

for (let i = 0; i < activitiesCheckboxes.length; i++) {
    activitiesCheckboxes[i].checked = false
}

paymentMethodField.value = 'credit-card'

// start from index 1 b'coz we're skipping the payment-method-box div
for (let i = 1; i < paymentTypes.length; i++) {
    const paymentDiv = paymentTypes[i]

    if (paymentDiv.id === 'credit-card') {
        paymentDiv.style.display = 'inherit'
    }
    else {
        paymentDiv.style.display = 'none'
    }
}

/**
 * ****************************************
 * Event Listeners
 * ****************************************
 */

jobRoleField.addEventListener('change', (event) => {
    // show otherJobRoleField if user choose Job Role = 'Other'
    event.target.value === 'other' ? otherJobRoleField.style.display = 'inherit' : otherJobRoleField.style.display = 'none'
})

tshirtDesignField.addEventListener('change', (event) => {
    const colorOptions = tshirtColorField.children
    const chosenDesign = tshirtDesignField.value
    
    tshirtColorField.disabled = false
    tshirtColorField.value = ''
    
    // display only available colors matching the chosenDesign
    for (let i = 0; i < colorOptions.length; i++) {
        const color = colorOptions[i]
        
        if (color.dataset.theme === chosenDesign) {
            color.hidden = false
        }
        else {
            color.hidden = true
        }
    }
})

activitiesFieldSet.addEventListener('change', (event) => {
    // 1. extract the Total Activities Cost
    const txtTotalActivitiesCost = activitiesCost.textContent
    const numPortionRegex = /\d+/ // extract only the number portion of 'Total: $0'
    let numTotalActivitiesCost = Number(txtTotalActivitiesCost.match(numPortionRegex))
    
    // 2. extract the Selected Activity Cost
    const selectedActivityCost = Number(event.target.dataset.cost)

    // 3. if selected add the selectedActivityCost, and if deselected then subtract
    if (event.target.checked) {
        activitiesCost.textContent = `Total: $ ${numTotalActivitiesCost + selectedActivityCost}`
    }
    else {
        activitiesCost.textContent = `Total: $ ${numTotalActivitiesCost - selectedActivityCost}`
    }
})

paymentMethodField.addEventListener('change', (event) => {
    const selectedPaymentMethod = event.target.value

    // start from index 1 b'coz we're skipping the payment-method-box div
    for (let i = 1; i < paymentTypes.length; i++) {
        const paymentDiv = paymentTypes[i]

        if (paymentDiv.id === selectedPaymentMethod) {
            paymentDiv.style.display = 'inherit'
        }
        else {
            paymentDiv.style.display = 'none'
        }
    }
})

form.addEventListener('submit', (event) => {
    const name = nameField.value 
    const regexNameField = /[a-z]+/gi

    // 1. The "Name" field cannot be blank or empty.
    // nameField.value
    alert(regexNameField.test(name))

})