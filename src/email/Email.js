class Email {
    constructor({from, to, subject, text, html}) {
        this.from = from || "no-replay@teste.com"
        this.to = to
        this.subject = subject
        this.text = text
        this.html = html
    }
}

module.exports = Email