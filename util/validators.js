module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'Username must not be empty';
    }
    if(email.trim() === ''){
        errors.email = 'Email must not be empty';
    } else {
        const regExEmail = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regExEmail)){
            errors.email = 'Email must be a valid email address';
        }
        
    }
    const regExPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    if(!password.match(regExPassword)){
        errors.password = 'Password must have minimum eight characters, at least one uppercase letter, one lowercase letter and one number';
    } 
    else if(password !== confirmPassword){
        errors.confirmPassword = 'Passwords must match';
    }

    return{
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'Username must not be empty';
    }
    if(password.trim() === ''){
        errors.password = 'Password must not be empty';
    }
    return{
        errors,
        valid: Object.keys(errors).length < 1
    }
}