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

tshirtDesignField.addEventListener('change', () => {
    const colorOptions = tshirtColorField.children
    const chosenDesign = tshirtDesignField.value
    
    tshirtColorField.disabled = false
    tshirtColorField.value = ''
    
    // display only available colors matching the chosenDesign
    for (let i = 0; i < colorOptions.length; i++) {
        const color = colorOptions[i]
        
        color.dataset.theme === chosenDesign ? color.hidden = false : color.hidden = true
    }
})

activitiesFieldSet.addEventListener('change', (event) => {
    const updateThe = {
        total: () => {
            // 1. extract the Total Activities Cost
            const txtTotalActivitiesCost = activitiesCost.textContent
            const regexNumPortion = /\d+/ // extract only the number portion of 'Total: $0'
            let numTotalActivitiesCost = Number(txtTotalActivitiesCost.match(regexNumPortion))
            
            // 2. extract the Selected Activity Cost
            const selectedActivityCost = Number(event.target.dataset.cost)

            // 3. if selected then add the selectedActivityCost, and if deselected then subtract
            if (event.target.checked) {
                activitiesCost.textContent = `Total: $${numTotalActivitiesCost + selectedActivityCost}`
            }
            else {
                activitiesCost.textContent = `Total: $${numTotalActivitiesCost - selectedActivityCost}`
            }
        },
        conflictingEvent: () => {
            // update here
        }
    }

    updateThe.total()

    // #######################################
    // lanjut disini. tambah function untuk disable, kalau ada event yang conflict

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

    function validate(element, prop, regex) {
        const toBeTested = element[prop]
        const isValid = regex.test(toBeTested)

        !isValid ? showHint(element) : hideHint(element)
        return isValid
    }

    function showHint(element) {
        const parentEl = element.parentNode

        if (element.id === 'activities-cost') {
            parentEl.className = 'activities not-valid'
            element.nextElementSibling.style.display = 'inherit'
        }
        else {
            parentEl.className = 'not-valid'
            parentEl.lastElementChild.style.display = 'inherit'
        }
    }

    function hideHint(element) {
        const parentEl = element.parentNode

        if (element.id === 'activities-cost') {
            parentEl.className = 'activities valid'
            element.nextElementSibling.style.display = 'none'
        }
        else {
            parentEl.className = 'valid'
            parentEl.lastElementChild.style.display = 'none'
        }
    }

    // The "Name" field cannot be blank or empty.
    // ex: Andy Hartono, Andy H., Andy the 2nd
    const isNameValid = validate(nameField, 'value', /^[^\s]+[a-z0-9 .]+$/gi)
    
    // The "Email Address" field must contain a validly formatted email address
    // ex: 12andy@sol.com, andy12@sol.co.id, a.hartono@sol.id, andy-h@sol.net, andy_h@satu.kaj.or.id, andy_h@1.kaj.or.id
    const isEmailValid = validate(emailField, 'value', /^[\w.-]+@[\w.]+$/gi)

    // The "Register for Activities" section must have at least one activity selected
    const isActivitySelected = validate(activitiesCost, 'textContent', /^total: \$[1-9]\d+$/gmi)

    // Validate cc, zip & cvv if credit card is the selected payment method
    let isPaymentMethodValid = false

    if (paymentMethodField.value === 'credit-card') {
        
        // The "Card number" field must contain a 13 - 16 digit credit card number with no dashes or spaces
        const isCcNumValid = validate(ccNumField, 'value', /^\d{13,16}$/gi)

        // The "Zip code" field must contain a 5 digit number
        const isZipCodeValid = validate(zipCodeField, 'value', /^\d{5}$/gi)
        
        // The "CVV" field must contain a 3 digit number
        const isCvvValid = validate(cvvField, 'value', /^\d{3}$/gim)

        isPaymentMethodValid = isCcNumValid &&
                               isZipCodeValid &&
                               isCvvValid
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

document.addEventListener('focusin', (event) => {
    if (event.target.type === 'checkbox') {
        const checkboxLabel = event.target.parentNode
        checkboxLabel.className = 'focus'
    }
})

document.addEventListener('focusout', (event) => {
    if (event.target.type === 'checkbox') {
        const checkboxLabel = event.target.parentNode
        checkboxLabel.className = ''
    }
})