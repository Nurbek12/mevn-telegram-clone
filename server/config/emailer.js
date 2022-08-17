const nodemailer = require('nodemailer');

const mailtransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAILUSER,
        pass: process.env.EMAILPASSWORD
    }
});

module.exports = {
    sendEmail: (email, txt) => {
        const details = {
            from: process.env.EMAILUSER,
            to: email,
            subject: 'Код для подключить наш телеграм',
            text: txt
        }

        mailtransport.sendMail(details, (err) => {
            if(err){
                return 'Error not send'
            }else{
                return 'Sending successfully'
            }
        })
    },
    
    GenerateCode: () => {
        let code = '';
        for(let i=0;i<5;i++){
            code += Math.floor(Math.random()*10).toString();
        }
        return code;
    },
}