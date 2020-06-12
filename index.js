const crypto = require('crypto')
const { split, join } = require('shamir')
const nodemailer = require('nodemailer')
const config = require('./config.json')

async function sendmail(email, content) {
    let transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: false,
        auth: {
            user: config.from,
            pass: config.password
        }
    });

    let info = await transporter.sendMail({
        from: config.fromtext,
        to: email,
        subject: "Private Key Share",
        text: "Your share(s): "+content,
        html: "<h2>Your share(s): "+content+"</h2>"
    });
}

function generateKeys() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
}

function shamirSplit(secret, parts) {
    const utf8Encoder = new TextEncoder();
    const secretBytes = utf8Encoder.encode(secret);
    return split(crypto.randomBytes, parts, parts, secretBytes);
}

function main() {
    const { privateKey, publicKey } = generateKeys();
    console.log(publicKey);
    let parts = shamirSplit(privateKey, config.emails.length);
    var count = 0;
    for (sharenumber in parts) {
        var share = {"id":sharenumber, "share":Buffer.from(parts[sharenumber]).toString('hex')}
        console.log(share);
        //sendmail(config.emails[count++], JSON.stringify(share);
    }
}

main()
