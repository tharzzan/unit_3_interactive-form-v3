const form = document.querySelector('form')
const nameField = document.querySelector('#name')
const emailField = document.querySelector('#email')
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
const ccNumField = document.querySelector('#cc-num')
const zipCodeField = document.querySelector('#zip')
const cvvField = document.querySelector('#cvv')

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
emailField.value = ''
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

ccNumField.value = ''
zipCodeField.value = ''
cvvField.value = ''

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

    // 1. The "Name" field cannot be blank or empty.
    const name = nameField.value
    const regexName = /^[^\s]+[a-z0-9 .]+$/gi // Andy Hartono, Andy H., Andy the 2nd
    const isNameValid = regexName.test(name)
    
    // 2. The "Email Address" field must contain a validly formatted email address
    const email = emailField.value
    const regexEmail = /^[\w.-]+@[\w.]+$/gi // 12andy@sol.com, andy12@sol.co.id, a.hartono@sol.id, andy-h@sol.net, andy_h@satu.kaj.or.id, andy_h@1.kaj.or.id
    const isEmailValid = regexEmail.test(email)
    
    // 3. The "Register for Activities" section must have at least one activity selected
    const isActivitySelected = activitiesCost.textContent !== 'Total: $0'

    // 4. If and only if credit card is the selected payment method
    let isPaymentMethodValid = false

    if (paymentMethodField.value === 'credit-card') {
        const ccNum = ccNumField.value
        const regexCcNum = /^\d{13,16}$/gi

        const zipCode = zipCodeField.value
        const regexZipCode = /^\d{5}$/gi

        const cvv = cvvField.value
        const regexCvv = /^\d{3}$/gim

        isPaymentMethodValid = regexCcNum.test(ccNum) &&
                               regexZipCode.test(zipCode) &&
                               regexCvv.test(cvv)
    }
    else {
        isPaymentMethodValid = true
    }
    
    if (isNameValid && isEmailValid && isActivitySelected && isPaymentMethodValid) {
        alert('Congratulations, you are registered!!')
    }
    else {
        event.preventDefault()
        alert('Oops... at least one of the required fields are not filled correctly. Please check the above fields before trying to submit the data')
    }

})