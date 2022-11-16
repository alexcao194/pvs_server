module.exports = class Valid {
    static validPassword(pass = '') {
        return (pass.length >= 6);
    }

    static validPhoneNumber(phoneNumber = '') {
        for(let i = 1; i < 10; i++) {
            if(phoneNumber[i] <= '0' && phoneNumber[i] >= '9') return false;
        }
        return phoneNumber.length == 10 && phoneNumber[0] == '0';
    }
    
    static validAccount(accounts = '') {
        return (
            accounts.length == 10
            && accounts[0] >= 'A' && accounts[0] <= 'Z'
            && accounts[1] >= '0' && accounts[1] <= '9'
            && accounts[2] >= '0' && accounts[2] <= '9'
            && accounts[3] >= 'A' && accounts[3] <= 'Z'
            && accounts[4] >= 'A' && accounts[4] <= 'Z'
            && accounts[5] >= 'A' && accounts[5] <= 'Z'
            && accounts[6] >= 'A' && accounts[6] <= 'Z'
            && accounts[7] >= '0' && accounts[7] <= '9'
            && accounts[8] >= '0' && accounts[8] <= '9'
            && accounts[9] >= '0' && accounts[9] <= '9'
        );
    }
    
    static validEmail(email = '') {
        var x = email;
        var atposition = x.indexOf("@");
        var dotposition = x.lastIndexOf(".");
        if (atposition < 1 || dotposition < (atposition + 2)
                || (dotposition + 2) >= x.length) {
            return false;
        } else return true;
    }    
}