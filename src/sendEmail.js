import nodemailer from "nodemailer";
// const nodemailer = require("nodemailer");
import smtp from "./smtp.js";
import SMTP_CONFIG from "./smtp.js";
// const SMTP_CONFIG = require("./smtp.js");

//console.log(SMTP_CONFIG);

const transporter = nodemailer.createTransport({
    host: SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    auth: {
        user:SMTP_CONFIG.user,
        pass: SMTP_CONFIG.pass,
    },
    tls:{
        rejectUnauthorized: false,
    },
});

// //var MSG_HTML = "senhadousuário123"
// //var email = "eletromarlon@gmail.com"

// //console.log(MSG_HTML);

class SendMail {
    async run(msg, email){ //nao tinha msg e email

        //console.log("Em msg", msg, "em email", email);
        const mailSent = await transporter.sendMail({
            text: "Olá,\nParece que você esqueceu a sua senha ou tem alguém tentando usar seu e-mail para cadastrar na LocaCar. Caso tenha sido você, segue a sua senha: \n\n\t\tSENHA: " + msg +"\n\nDo contrário, recomendamos urgentemente que altere sua senha para uma nova e mais segura, de preferência, alguma que possua maiúsculas, minúsculas, dígitos e caracteres especiais como: '#', '$', '%' por exemplo.",
            subject: "ATENÇAO - Recuperação de Senha",
            from: "LocaCar <testeufcweb@gmail.com>",
            to: [email, email],
        });
        console.log(mailSent);
    }
}

export const sendMail = new SendMail();