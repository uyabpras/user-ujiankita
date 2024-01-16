exports.regextest = (email, password, name, nomer_induk) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    const onlyLettersRegex = /^[a-zA-Z\s]*$/;
    const nomerIndukRegex = /^\d{8}$/;
  
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    };
  
    if (!passwordRegex.test(password)) {
      return "Password must contain at least one lowercase, one uppercase, one digit, and be at least 8 characters long";
    };
  
    if (nomer_induk == null) {
      null;
    }else if(!nomerIndukRegex.test(nomer_induk.toString())){
      return "nomer induk must be 8 numbers";
    };
  
    if(name == null){
      null;
    } else if (!onlyLettersRegex.test(name)) {
      return 'Name must only contain letters and spaces';
    }
  
    return null;
  };
  