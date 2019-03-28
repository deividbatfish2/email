const request = require('supertest')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, `../src/profile/${process.env.ENVIRONMENT}.env`)})
const app = require('../src/app/app')
jest.mock('../src/publisher/publisher');
const publisher = require('../src/publisher/publisher')

describe('POST /email', () => {
    
    beforeEach(() => {
        publisher.mockImplementation((email) => email)
    })

    it('O sistema deve enviar o email', done => {
        const email = {
            from: 'deivid@teste.com',
            to: 'cliente@email.com',
            subject: 'Assunto',
            text: 'Texto a ser enviado',
            html: '<b>Texto a ser enviado</b>'
        }
        request(app)
            .post('/email')
            .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
            .send(email)
            .then(response => {
                expect(response.statusCode).toBe(200)
                done()
            })
    }, 10000)

    it('O cliente deve informar um tonken valido', () => {
        const email = {
            from: 'deivid@teste.com',
            to: 'cliente@email.com',
            subject: 'Assunto',
            text: 'Texto a ser enviado',
            html: '<b>Texto a ser enviado</b>'
        }
        return request(app)
            .post('/email')
            .set('Authorization', 'Bearer a' + process.env.TOKEN_AUTHORIZATION)
            .send(email)
            .then(response => {
                expect(response.statusCode).toBe(401);
            })
    })

    it('Em caso de exceção o app deve retornar um erro para o cliente', () => {
        publisher.mockImplementation((email) => { throw new Error('Problema ao publicar na fila')})

        const email = {
            from: 'deivid@teste.com',
            to: 'cliente@email.com',
            subject: 'Assunto',
            text: 'Texto a ser enviado',
            html: '<b>Texto a ser enviado</b>'
        }

        return request(app)
        .post('/email')
        .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
        .send(email)
        .then(response => {
            expect(response.statusCode).toBe(500)
        })
    })

    describe('O sistema deve validar campos obrigatorios e valores indevidos', () => {
        it('O campo TO é obrigatorio', () => {
            const email = {
                from: 'deivid@teste.com',
                subject: 'Assunto',
                text: 'Texto a ser enviado',
                html: '<b>Texto a ser enviado</b>'
            }

            return request(app)
                .post('/email')
                .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
                .send(email)
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body).toHaveProperty('errors')
                    const errors = response.body.errors
                    expect(errors).toEqual(expect.arrayContaining([{location:'body', msg: "Invalid value", param: "to"}]))
                })
        })

        it('O campo TO deve conter um email válido', () => {
            let email = {
                from: 'deivid@teste.com',
                to: 'email.com',
                subject: 'Assunto',
                text: 'Texto a ser enviado',
                html: '<b>Texto a ser enviado</b>'
            }

            return request(app)
                .post('/email')
                .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
                .send(email)
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body).toHaveProperty('errors')
                    const errors = response.body.errors
                    expect(errors).toEqual(expect.arrayContaining([{location:'body', msg: "Invalid value", param: "to", value: 'email.com'}]))
                })
        })

        it('O campo subject é obrigatório', () => {
            let email = {
                from: 'deivid@teste.com',
                to: 'email@teste.com',
                text: 'Texto a ser enviado',
                html: '<b>Texto a ser enviado</b>'
            }

            return request(app)
                .post('/email')
                .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
                .send(email)
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body).toHaveProperty('errors')
                    const errors = response.body.errors
                    expect(errors).toEqual(expect.arrayContaining([{location:'body', msg: "Invalid value", param: "subject"}]))
                })
        })

        it('O campo TEXT é obrigatório', () => {
            let email = {
                from: 'deivid@teste.com',
                to: 'email@teste.com',
                subject: 'Assunto',
                html: '<b>Texto a ser enviado</b>'
            }

            return request(app)
                .post('/email')
                .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
                .send(email)
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body).toHaveProperty('errors')
                    const errors = response.body.errors
                    expect(errors).toEqual(expect.arrayContaining([{location:'body', msg: "Invalid value", param: "text"}]))
                })
        })

        it('O campo TEXT não deve conter mais de 500 caracteres', () => {
            let email = {
                from: 'deivid@teste.com',
                to: 'email@test.com',
                subject: 'Assunto',
                text: 'Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado',
                html: '<b>Texto a ser enviado</b>'
            }

            return request(app)
                .post('/email')
                .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
                .send(email)
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body).toHaveProperty('errors')
                    const errors = response.body.errors
                    expect(errors).toEqual(expect.arrayContaining([{location:'body', msg: "Invalid value", param: "text", 
                        value: 'Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado Texto a ser enviado'
                    }]
                    ))
                })
        })

        it('O campo HTML é obrigatório', () => {
            let email = {
                from: 'deivid@teste.com',
                to: 'email@teste.com',
                subject: 'Assunto',
                text: 'Texto a ser enviado'
            }

            return request(app)
                .post('/email')
                .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
                .send(email)
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body).toHaveProperty('errors')
                    const errors = response.body.errors
                    expect(errors).toEqual(expect.arrayContaining([{location:'body', msg: "Invalid value", param: "html"}]))
                })
        })

        it('O campo HTML não deve conter mais de 500 caracteres', () => {
            let email = {
                from: 'deivid@teste.com',
                to: 'email@teste.com',
                subject: 'Assunto',
                text: 'Texto a ser enviado',
                html: '<b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b>'
            }

            return request(app)
                .post('/email')
                .set('Authorization', 'Bearer ' + process.env.TOKEN_AUTHORIZATION)
                .send(email)
                .then(response => {
                    expect(response.statusCode).toBe(422);
                    expect(response.body).toHaveProperty('errors')
                    const errors = response.body.errors
                    expect(errors).toEqual(expect.arrayContaining([{location:'body', msg: "Invalid value", param: "html",
                        value: '<b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b> <b>Texto a ser enviado</b>'
                    }]
                    ))
                })
        })
    })
    
})