class Email {
    constructor({from, to, subject, text, html}) {
        this.from = from
        this.to = to
        this.subject = subject
        this.text = text
        this.html = html
    }
}

module.exports = Email